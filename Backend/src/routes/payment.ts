import { Router, Request, Response } from "express";
import { db } from "../db.js";
import { userSubscriptions, usersTable } from "../config/schema.js";
import { eq } from "drizzle-orm";

const router = Router();

router.post("/verify-payment", async (req: Request, res: Response) => {
  try {
    const {
      userId,
      planName,
      billingCycle,
      currency,
      orderID,
    } = req.body;

    if (!orderID || !userId) {
      return res.status(400).json({ success: false, message: "Missing required data" });
    }

    // 🔐 1. Get PayPal Access Token
    const auth = Buffer.from(
      `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
    ).toString("base64");

    const tokenRes = await fetch(
      "https://api-m.paypal.com/v1/oauth2/token",
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "grant_type=client_credentials",
      }
    );

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    // 🔐 2. Verify Order with PayPal
    const orderRes = await fetch(
      `https://api-m.paypal.com/v2/checkout/orders/${orderID}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const orderData = await orderRes.json();

    if (orderData.status !== "COMPLETED") {
      return res.status(400).json({
        success: false,
        message: "Payment not completed",
      });
    }

    const capture = orderData.purchase_units[0].payments.captures[0];
    const amountPaid = capture.amount.value;

    // 🗓 Expiry Logic
    const endDate = new Date();
    if (billingCycle === "MONTHLY") {
      endDate.setMonth(endDate.getMonth() + 1);
    } else {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }

    // 💾 3. Insert into User Subscriptions (Audit History)
    await db.insert(userSubscriptions).values({
      userId,
      planName,
      billingCycle,
      currency,
      amountPaid,
      status: "ACTIVE",
      startDate: new Date(),
      endDate,
      paypalOrderId: orderID,
      paypalCaptureId: capture.id,
      paypalRawResponse: orderData,
    });

    // ✅ 4. UPDATE USER'S CURRENT STATUS & CREDITS
    let creditBoost = 0;
    if (planName === "PILOT") creditBoost = 1000;
    if (planName === "SCALE") creditBoost = 5000;
    if (planName === "ENTERPRISE") creditBoost = 20000;

    await db
      .update(usersTable)
      .set({
        plan: planName,
        planCycle: billingCycle,
        // Override credits with new plan limit
        credits: creditBoost > 0 ? creditBoost : undefined, 
        updatedAt: new Date(),
      })
      .where(eq(usersTable.id, userId));

    console.log(`✅ User ${userId} upgraded to ${planName}. History logged.`);

    return res.json({ success: true });

  } catch (error) {
    console.error("Verification Error:", error);
    return res.status(500).json({ success: false });
  }
});

export default router;