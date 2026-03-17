import "dotenv/config";
import express from "express";
import cors from "cors";
// ✅ sql imported for incrementing credits securely
import { eq, and, lte, sql } from "drizzle-orm";
import cron from "node-cron";
import crypto from "crypto";
import nodemailer from "nodemailer"; // ✅ Added for sending emails

import { db } from "./db.js";
// ✅ Routes
import leadDiscoveryRoutes from "./routes/leadDiscovery.js";

// ✅ Schema Imports
import {
  onboardingProgress,
  companyDetails,
  targetMarket,
  buyerKeywords,
  platformsToMonitor,
  usersTable,
  userSubscriptions,
  eventWaitlist,
  newsletterSubscribers, // ✅ Added this import
} from "./config/schema.js";

const app = express();

/* ===============================
   CORS (CLERK + PROD SAFE)
================================ */
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:8080",
  "https://leadequator.live",
  "https://www.leadequator.live",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());

/* ===============================
   EMAIL CONFIGURATION (NODEMAILER)
================================ */
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Helper function to send event confirmation email
async function sendEventEmail(userEmail: string, userName: string) {
  try {
    await transporter.sendMail({
      from: `"Leadequator Team" <${process.env.SMTP_FROM}>`,
      to: userEmail,
      subject: `You're In! AI Business Masterclass Waitlist ✅`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: #333;">Registration Confirmed! 🎉</h2>
          <p>Hi ${userName},</p>
          <p>Thank you for securing your spot on the <strong>Priority Waitlist</strong> for the 2-Day Intensive AI Business Masterclass.</p>
          <p>Since you've paid the registration fee, your spot is locked. We will email you as soon as the official dates are announced.</p>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;" />
          <p style="color: #666; font-size: 12px;">Payment Receipt: ₹10.00 (Paid via Cashfree)</p>
        </div>
      `,
    });
    console.log(`📧 Event email sent to ${userEmail}`);
  } catch (error) {
    console.error("❌ Error sending event email:", error);
  }
}

/* ===============================
   HEALTH CHECK
================================ */
app.get("/", (_req, res) => {
  res.json({ status: "Backend running safely 🚀" });
});

/* ===============================
   MOUNT ROUTES
================================ */
app.use("/api/lead-discovery", leadDiscoveryRoutes);

/* ===============================
   CRON JOBS
================================ */
cron.schedule("0 0 * * *", async () => {
  console.log("⏳ Running daily subscription expiration check...");
  try {
    const now = new Date();
    await db.update(userSubscriptions)
      .set({ status: "EXPIRED" })
      .where(
        and(
          eq(userSubscriptions.status, "ACTIVE"),
          lte(userSubscriptions.endDate, now)
        )
      );
    console.log("✅ Subscription expiration check complete.");
  } catch (error) {
    console.error("❌ Error running expiration cron job:", error);
  }
});

/* ===============================
   PAYPAL PAYMENT INTEGRATION (USD)
================================ */
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_SECRET = process.env.PAYPAL_SECRET;
const PAYPAL_API_BASE = process.env.PAYPAL_API_BASE || "https://api-m.paypal.com";

async function generatePayPalAccessToken() {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString("base64");
  const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: "POST",
    body: "grant_type=client_credentials",
    headers: { Authorization: `Basic ${auth}` },
  });
  const data = await response.json();
  return data.access_token;
}

app.post("/api/verify-paypal", async (req, res) => {
  const { orderID, userId, planName, billingCycle, currency } = req.body;

  try {
    const accessToken = await generatePayPalAccessToken();
    const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${orderID}`, {
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
    });

    const orderDetails = await response.json();

    if (orderDetails.status === "COMPLETED") {
      const purchaseUnit = orderDetails.purchase_units[0];
      const capture = purchaseUnit.payments.captures[0];
      const amountPaid = capture.amount.value;
      const captureId = capture.id;

      const startDate = new Date();
      const endDate = new Date(startDate);
      if (billingCycle === "MONTHLY") endDate.setMonth(endDate.getMonth() + 1);
      else endDate.setFullYear(endDate.getFullYear() + 1);

      await db.insert(userSubscriptions).values({
        userId: userId,
        planName: planName,
        billingCycle: billingCycle,
        currency: currency,
        amountPaid: amountPaid,
        status: "ACTIVE",
        startDate: startDate,
        endDate: endDate,
        paymentGateway: "PAYPAL",
        paypalOrderId: orderID,
        paypalCaptureId: captureId,
        rawResponse: orderDetails,
      });

      let creditBoost = 0;
      if (planName === "PILOT") creditBoost = 1000;
      else if (planName === "SCALE") creditBoost = 5000;
      else if (planName === "ENTERPRISE") creditBoost = 20000;

      await db.update(usersTable)
        .set({
          plan: planName,
          planCycle: billingCycle,
          credits: sql`${usersTable.credits} + ${creditBoost}`,
          updatedAt: new Date()
        })
        .where(eq(usersTable.id, userId));

      console.log(`✅ User ${userId} upgraded to ${planName} via PayPal.`);
      return res.status(200).json({ success: true, message: "Payment verified." });
    } else {
      return res.status(400).json({ success: false, message: "Payment not completed on PayPal's end." });
    }
  } catch (error: any) {
    console.error("PayPal Verification Error:", error.message || error);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
});

/* ===============================
   CASHFREE PAYMENT INTEGRATION (INR)
================================ */
const getCashfreeBaseUrl = () => {
  return process.env.CASHFREE_ENVIRONMENT === "PRODUCTION"
    ? "https://api.cashfree.com/pg"
    : "https://sandbox.cashfree.com/pg";
};

// 1. Create Subscription Order (For Plans)
app.post("/api/create-cashfree-order", async (req, res) => {
  try {
    const { userId, userEmail, userPhone, planName, amount, currency } = req.body;

    const orderId = `order_${userId.slice(-6)}_${crypto.randomBytes(4).toString("hex")}`;

    const response = await fetch(`${getCashfreeBaseUrl()}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-client-id": process.env.CASHFREE_APP_ID as string,
        "x-client-secret": process.env.CASHFREE_SECRET_KEY as string,
        "x-api-version": "2023-08-01",
      },
      body: JSON.stringify({
        order_id: orderId,
        order_amount: amount,
        order_currency: currency,
        customer_details: {
          customer_id: userId || "guest",
          customer_phone: userPhone || "9999999999",
          customer_email: userEmail || "guest@example.com",
        },
      }),
    });

    const data = await response.json();

    if (data.payment_session_id) {
      res.json({ payment_session_id: data.payment_session_id, order_id: orderId });
    } else {
      console.error("Cashfree Order Error:", data);
      res.status(400).json({ error: "Failed to create order", details: data });
    }
  } catch (error) {
    console.error("Server Error creating order:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 2. Verify Subscription Payment
app.post("/api/verify-cashfree", async (req, res) => {
  const { order_id, userId, planName, billingCycle, currency } = req.body;

  try {
    const response = await fetch(`${getCashfreeBaseUrl()}/orders/${order_id}`, {
      method: "GET",
      headers: {
        "x-client-id": process.env.CASHFREE_APP_ID as string,
        "x-client-secret": process.env.CASHFREE_SECRET_KEY as string,
        "x-api-version": "2023-08-01",
      },
    });

    const orderDetails = await response.json();

    if (orderDetails.order_status === "PAID") {
      const amountPaid = orderDetails.order_amount;

      const startDate = new Date();
      const endDate = new Date(startDate);

      if (billingCycle === "MONTHLY") {
        endDate.setMonth(endDate.getMonth() + 1);
      } else {
        endDate.setFullYear(endDate.getFullYear() + 1);
      }

      await db.insert(userSubscriptions).values({
        userId: userId,
        planName: planName,
        billingCycle: billingCycle,
        currency: currency,
        amountPaid: amountPaid.toString(),
        status: "ACTIVE",
        startDate: startDate,
        endDate: endDate,
        paymentGateway: "CASHFREE",
        cashfreeOrderId: order_id,
        rawResponse: orderDetails,
      });

      let creditBoost = 0;
      if (planName === "PILOT") creditBoost = 1000;
      else if (planName === "SCALE") creditBoost = 5000;
      else if (planName === "ENTERPRISE") creditBoost = 20000;

      await db
        .update(usersTable)
        .set({
          plan: planName,
          planCycle: billingCycle,
          credits: sql`${usersTable.credits} + ${creditBoost}`,
          updatedAt: new Date(),
        })
        .where(eq(usersTable.id, userId));

      console.log(`✅ User ${userId} successfully upgraded to ${planName} via Cashfree.`);
      return res.status(200).json({ success: true, message: "Payment verified and subscription saved." });
    } else {
      return res.status(400).json({ success: false, message: "Payment not completed." });
    }

  } catch (error: any) {
    console.error("Failed to verify payment:", error.message || error);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
});

/* ==============================================
   🚀 NEW: EVENT PAYMENT & REGISTRATION ROUTES
================================================= */

// 1. Create Event Payment Order (₹10)
app.post("/api/events/create-payment", async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    const orderId = `evt_${crypto.randomBytes(4).toString("hex")}`;
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    const finalPhone = cleanPhone.length === 10 ? cleanPhone : "9999999999";

    const response = await fetch(`${getCashfreeBaseUrl()}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-client-id": process.env.CASHFREE_APP_ID as string,
        "x-client-secret": process.env.CASHFREE_SECRET_KEY as string,
        "x-api-version": "2023-08-01",
      },
      body: JSON.stringify({
        order_id: orderId,
        order_amount: 10, // Fixed ₹10 Fee
        order_currency: "INR",
        customer_details: {
          customer_id: email.replace(/[^a-zA-Z0-9]/g, '_'),
          customer_name: name,
          customer_email: email,
          customer_phone: finalPhone,
        },
      }),
    });

    const data = await response.json();

    if (data.payment_session_id) {
      res.json({ payment_session_id: data.payment_session_id, order_id: orderId });
    } else {
      console.error("Event Order Error:", data);
      res.status(400).json({ error: "Failed to create payment session" });
    }
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 2. Verify Event Payment & Save Registration
app.post("/api/events/verify-registration", async (req, res) => {
  const { order_id, formData, eventId } = req.body;

  try {
    // A. Check Payment Status
    const response = await fetch(`${getCashfreeBaseUrl()}/orders/${order_id}`, {
      method: "GET",
      headers: {
        "x-client-id": process.env.CASHFREE_APP_ID as string,
        "x-client-secret": process.env.CASHFREE_SECRET_KEY as string,
        "x-api-version": "2023-08-01",
      },
    });

    const orderDetails = await response.json();

    // B. If Paid, Save Data
    if (orderDetails.order_status === "PAID") {

      await db.insert(eventWaitlist).values({
        id: crypto.randomUUID(),
        eventId: eventId,
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phone,
        company: formData.company,
        industry: formData.industry,
      });

      // Send Confirmation Email
      sendEventEmail(formData.email, formData.name);

      console.log(`✅ Event registration saved for: ${formData.email}`);
      return res.status(200).json({ success: true, message: "Registration successful!" });
    } else {
      return res.status(400).json({ success: false, message: "Payment not verified." });
    }

  } catch (error: any) {
    console.error("Registration Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
});

/* ===============================
   NEWSLETTER SUBSCRIPTION
================================ */
app.post("/api/newsletter/subscribe", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.includes("@")) {
      return res.status(400).json({ error: "Invalid email address" });
    }

    // Insert into DB. The 'onConflictDoNothing' prevents errors if they subscribe twice.
    await db.insert(newsletterSubscribers)
      .values({ email })
      .onConflictDoNothing({ target: newsletterSubscribers.email });

    console.log(`📩 New Newsletter Subscriber: ${email}`);

    // Optional: You could call your sendEmail function here to send a welcome email!

    res.json({ success: true, message: "Subscribed successfully" });

  } catch (error: any) {
    console.error("Newsletter Subscription Error:", error.message || error);
    res.status(500).json({ error: "Failed to subscribe" });
  }
});

/* ===============================
   ONBOARDING ENDPOINTS
================================ */
app.get("/api/onboarding/progress", async (req, res) => {
  try {
    const { userId } = req.query as { userId?: string };
    if (!userId) return res.status(400).json({ error: "Missing userId" });

    const result = await db.select().from(onboardingProgress).where(eq(onboardingProgress.userId, userId)).limit(1);
    res.json(result[0] ?? {});
  } catch (err: any) {
    res.status(500).json({ error: "Failed to load progress" });
  }
});

app.post("/api/onboarding/progress", async (req, res) => {
  try {
    const { userId, currentStep } = req.body;
    if (!userId) return res.status(400).json({ error: "Missing userId" });

    await db.insert(onboardingProgress).values({ userId, currentStep }).onConflictDoUpdate({ target: onboardingProgress.userId, set: { currentStep } });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to save progress" });
  }
});

app.post("/api/onboarding", async (req, res) => {
  try {
    const { userId, companyData = {}, industryData = {}, targetData = {}, keywordsData = { keywords: [] }, platformsData = {} } = req.body;
    if (!userId) return res.status(400).json({ error: "Missing userId in payload" });

    await db.insert(companyDetails).values({
      userId, companyName: companyData.companyName || "Unknown Company", websiteUrl: companyData.websiteUrl || null,
      businessEmail: companyData.businessEmail || null, phoneNumber: companyData.phoneNumber || null,
      industry: industryData.industry || null, industryOther: industryData.industryOther || null, productDescription: industryData.productDescription || null,
    }).onConflictDoUpdate({
      target: companyDetails.userId, set: {
        companyName: companyData.companyName || "Unknown Company", websiteUrl: companyData.websiteUrl || null,
        businessEmail: companyData.businessEmail || null, phoneNumber: companyData.phoneNumber || null,
        industry: industryData.industry || null, industryOther: industryData.industryOther || null, productDescription: industryData.productDescription || null,
      }
    });

    if (Object.keys(targetData).length > 0) {
      await db.insert(targetMarket).values({ userId, ...targetData }).onConflictDoUpdate({ target: targetMarket.userId, set: targetData });
    }

    await db.delete(buyerKeywords).where(eq(buyerKeywords.userId, userId));
    if (keywordsData?.keywords?.length > 0) {
      await db.insert(buyerKeywords).values(keywordsData.keywords.map((k: string) => ({ userId, keyword: k })));
    }

    if (Object.keys(platformsData).length > 0) {
      await db.insert(platformsToMonitor).values({ userId, ...platformsData }).onConflictDoUpdate({ target: platformsToMonitor.userId, set: platformsData });
    }

    await db.insert(onboardingProgress).values({ userId, completed: true, currentStep: 5 }).onConflictDoUpdate({ target: onboardingProgress.userId, set: { completed: true, currentStep: 5 } });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: "Onboarding failed on the server." });
  }
});

/* ===============================
   SETTINGS & PROFILE
================================ */
app.get("/api/settings/profile", async (req, res) => {
  try {
    const { userId } = req.query as { userId?: string };
    if (!userId) return res.status(400).json({ error: "Missing userId" });

    const [userData] = await db.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1);
    const [companyData] = await db.select().from(companyDetails).where(eq(companyDetails.userId, userId)).limit(1);
    const [targetMarketData] = await db.select().from(targetMarket).where(eq(targetMarket.userId, userId)).limit(1);
    const [platformsData] = await db.select().from(platformsToMonitor).where(eq(platformsToMonitor.userId, userId)).limit(1);
    const keywordsRaw = await db.select().from(buyerKeywords).where(eq(buyerKeywords.userId, userId));

    res.json({
      user: userData || {}, company: companyData || {}, targetMarket: targetMarketData || {},
      platforms: platformsData || {}, keywords: keywordsRaw.map(k => k.keyword) || []
    });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

app.put("/api/settings/profile", async (req, res) => {
  try {
    const { userId, userData, companyData, targetData, platformsData, keywords } = req.body;
    if (!userId) return res.status(400).json({ error: "Missing userId" });

    if (userData && userData.name) {
      await db.update(usersTable).set({ name: userData.name }).where(eq(usersTable.id, userId));
    }
    if (companyData && Object.keys(companyData).length > 0) {
      await db.insert(companyDetails).values({ userId, ...companyData }).onConflictDoUpdate({ target: companyDetails.userId, set: companyData });
    }
    if (targetData && Object.keys(targetData).length > 0) {
      await db.insert(targetMarket).values({ userId, ...targetData }).onConflictDoUpdate({ target: targetMarket.userId, set: targetData });
    }
    if (platformsData && Object.keys(platformsData).length > 0) {
      await db.insert(platformsToMonitor).values({ userId, ...platformsData }).onConflictDoUpdate({ target: platformsToMonitor.userId, set: platformsData });
    }
    if (Array.isArray(keywords)) {
      await db.delete(buyerKeywords).where(eq(buyerKeywords.userId, userId));
      if (keywords.length > 0) {
        await db.insert(buyerKeywords).values(keywords.map((k: string) => ({ userId, keyword: k })));
      }
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to update profile" });
  }
});

/* ===============================
   USERS SYNC (CLERK WEBHOOK)
================================ */
app.post("/api/users/sync", async (req, res) => {
  try {
    const { clerkId, email, name } = req.body;
    if (!clerkId || !email) return res.status(400).json({ error: "Missing required sync data" });

    const existing = await db.select().from(usersTable).where(eq(usersTable.id, clerkId)).limit(1);

    if (!existing.length) {
      await db.insert(usersTable).values({ id: clerkId, email, name: name || "New User", credits: 300 });
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to sync user" });
  }
});

/* ===============================
   START SERVER
================================ */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ API running on port ${PORT}`);
});