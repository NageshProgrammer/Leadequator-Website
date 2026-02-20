import { Router, Request, Response } from "express";
import { db } from "../db.js";
import { userSubscriptions, usersTable } from "../config/schema.js";
import { eq } from "drizzle-orm";

const router = Router();

// 🔧 API CONFIGURATION: Auto-switch between Sandbox and Live
// Ensure your Render environment variables have NODE_ENV set to "production"
const PAYPAL_API = process.env.NODE_ENV === "production" 
  ? "https://api-m.paypal.com" 
  : "https://api-m.sandbox.paypal.com";

router.post("/verify-payment", async (req: Request, res: Response): Promise<any> => {
  try {
    const {
      userId,
      planName,
      billingCycle,
      currency,
      orderID,
    } = req.body;

    if (!orderID || !userId) {
      console.error("❌ Verify Payment: Missing orderID or userId");
      return res.status(400).json({ success: false, message: "Missing required data (orderID or userId)" });
    }

    if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_SECRET) {
        console.error("❌ Verify Payment: Missing PayPal credentials in backend environment.");
        return res.status(500).json({ success: false, message: "Server configuration missing PayPal keys" });
    }

    console.log(`[Payment] Verifying Order: ${orderID} for User: ${userId} on ${PAYPAL_API}`);

    // 🔐 1. Get PayPal Access Token
    const auth = Buffer.from(
      `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
    ).toString("base64");

    const tokenRes = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });

    const tokenData = await tokenRes.json();
    
    if (!tokenRes.ok) {
        console.error("❌ PayPal Token Error:", tokenData);
        throw new Error("Failed to authenticate with PayPal");
    }

    const accessToken = tokenData.access_token;

    // 🔐 2. Verify Order with PayPal
    const orderRes = await fetch(`${PAYPAL_API}/v2/checkout/orders/${orderID}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const orderData = await orderRes.json();

    if (orderData.status !== "COMPLETED") {
      console.error("❌ Payment Not Completed. Status:", orderData.status);
      return res.status(400).json({
        success: false,
        message: "Payment not completed",
      });
    }

    // Fallback safely if array structure from PayPal is unexpected
    const capture = orderData.purchase_units?.[0]?.payments?.captures?.[0];
    if (!capture) {
        throw new Error("Could not locate capture details in PayPal response.");
    }
    const amountPaid = capture.amount.value;

    // 🗓 Expiry Logic
    const endDate = new Date();
    if (billingCycle === "MONTHLY") {
      endDate.setMonth(endDate.getMonth() + 1);
    } else {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }

    // 💾 3. Insert into User Subscriptions (History)
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

    // ✅ 4. UPDATE THE USER'S CURRENT PLAN & CREDITS
    let creditBoost = 0;
    if (planName === "PILOT") creditBoost = 1000;
    else if (planName === "SCALE") creditBoost = 5000;
    else if (planName === "ENTERPRISE") creditBoost = 20000;

    await db
      .update(usersTable)
      .set({
        plan: planName,
        planCycle: billingCycle,
        credits: creditBoost > 0 ? creditBoost : undefined, 
        updatedAt: new Date(),
      })
      .where(eq(usersTable.id, userId));

    console.log(`✅ User ${userId} upgraded to ${planName}.`);

    return res.json({ success: true });

  } catch (error: any) {
    console.error("🔥 Verification Server Error:", error.message || error);
    return res.status(500).json({ success: false, message: "Server error during verification" });
  }
});

export default router;