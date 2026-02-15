import { Router } from "express";
import fetch from "node-fetch";
import { db } from "../db";
import { userSubscriptions } from "../db/schema";

const router = Router();

router.post("/verify-payment", async (req, res) => {
  try {
    const {
      userId,
      planName,
      billingCycle,
      currency,
      orderID,
    } = req.body;

    if (!orderID) {
      return res.status(400).json({ success: false, message: "Missing orderID" });
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

    // 🔐 2. Verify Order
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

    const capture =
      orderData.purchase_units[0].payments.captures[0];

    const amountPaid = capture.amount.value;

    // 🗓 Expiry Logic
    const endDate = new Date();
    if (billingCycle === "MONTHLY") {
      endDate.setMonth(endDate.getMonth() + 1);
    } else {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }

    // 💾 Insert into DB
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

    return res.json({ success: true });

  } catch (error) {
    console.error("Verification Error:", error);
    return res.status(500).json({ success: false });
  }
});

export default router;
