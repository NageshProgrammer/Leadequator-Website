import "dotenv/config";
import express from "express";
import cors from "cors";
import { eq, and, lte } from "drizzle-orm";
import cron from "node-cron";

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
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("CORS blocked by policy"));
    },
    credentials: true,
  })
);

app.use(express.json());

/* ===============================
   HEALTH CHECK
================================ */
app.get("/", (_req, res) => {
  res.json({ status: "Backend running safely 🚀" });
});

/* ===============================
   MOUNT ROUTES
================================ */
// Lead Discovery ( /api/lead-discovery/... )
app.use("/api/lead-discovery", leadDiscoveryRoutes);


/* ===============================
   CRON JOBS (DAILY EXPIRATION CHECK)
================================ */
// Runs every day at midnight (00:00) server time
cron.schedule("0 0 * * *", async () => {
  console.log("⏳ Running daily subscription expiration check...");
  try {
    const now = new Date();
    
    // Find active subscriptions where the endDate has passed
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
   PAYPAL CONFIGURATION
================================ */
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
// ✅ Dynamically pull the API base URL from .env, with sandbox as a safe fallback
const PAYPAL_API_BASE = process.env.PAYPAL_API_BASE || "https://api-m.sandbox.paypal.com";

async function generatePayPalAccessToken() {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString("base64");
  
  const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: "POST",
    body: "grant_type=client_credentials",
    headers: {
      Authorization: `Basic ${auth}`,
    },
  });
  const data = await response.json();
  return data.access_token;
}

/* ===============================
   PAYMENT VERIFICATION ENDPOINT
================================ */
app.post("/api/verify-payment", async (req, res) => {
  const { orderID, userId, planName, billingCycle, currency } = req.body;

  try {
    const accessToken = await generatePayPalAccessToken();
    
    // Fetch order details from PayPal
    const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${orderID}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    
    const orderDetails = await response.json();

    if (orderDetails.status === "COMPLETED") {
      // Parse PayPal Data
      const purchaseUnit = orderDetails.purchase_units[0];
      const capture = purchaseUnit.payments.captures[0];
      
      const amountPaid = capture.amount.value;
      const captureId = capture.id;

      // Calculate End Date
      const startDate = new Date();
      const endDate = new Date(startDate);
      
      if (billingCycle === "MONTHLY") {
        endDate.setMonth(endDate.getMonth() + 1); // Add 1 month
      } else {
        endDate.setFullYear(endDate.getFullYear() + 1); // Add 1 year
      }

      // Insert into DB
      await db.insert(userSubscriptions).values({
        userId: userId,
        planName: planName,
        billingCycle: billingCycle,
        currency: currency,
        amountPaid: amountPaid,
        status: "ACTIVE",
        startDate: startDate,
        endDate: endDate,
        paypalOrderId: orderID,
        paypalCaptureId: captureId,
        paypalRawResponse: orderDetails, 
      });
      
      return res.status(200).json({ success: true, message: "Payment verified and subscription saved." });
    } else {
      return res.status(400).json({ success: false, message: "Payment not completed on PayPal's end." });
    }

  } catch (error: any) {
    console.error("Failed to verify payment:", error.message || error);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
});

/* ===============================
   PAYPAL WEBHOOKS (Refunds & Disputes)
================================ */
app.post("/api/webhooks/paypal", async (req, res) => {
  const webhookId = process.env.PAYPAL_WEBHOOK_ID; 
  
  try {
    const accessToken = await generatePayPalAccessToken(); 
    
    // 1. Verify the webhook signature with PayPal
    const verifyResponse = await fetch(`${PAYPAL_API_BASE}/v1/notifications/verify-webhook-signature`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        auth_algo: req.headers["paypal-auth-algo"],
        cert_url: req.headers["paypal-cert-url"],
        transmission_id: req.headers["paypal-transmission-id"],
        transmission_sig: req.headers["paypal-transmission-sig"],
        transmission_time: req.headers["paypal-transmission-time"],
        webhook_id: webhookId,
        webhook_event: req.body,
      }),
    });

    const verifyData = await verifyResponse.json();

    if (verifyData.verification_status !== "SUCCESS") {
      console.warn("⚠️ Invalid PayPal Webhook Signature Detected!");
      return res.status(400).send("Invalid signature");
    }

    // 2. Handle the specific event
    const event = req.body;
    console.log(`🔔 Received PayPal Webhook: ${event.event_type}`);

    // If the payment is refunded or reversed
    if (event.event_type === "PAYMENT.CAPTURE.REFUNDED" || event.event_type === "PAYMENT.CAPTURE.REVERSED") {
      const captureId = event.resource.id; 

      // Update the DB to CANCELLED
      await db.update(userSubscriptions)
        .set({ status: "CANCELLED" })
        .where(eq(userSubscriptions.paypalCaptureId, captureId)); 
        
      console.log(`🚫 Subscription cancelled due to refund/reversal for capture: ${captureId}`);
    }

    res.status(200).send("Webhook received");

  } catch (error) {
    console.error("❌ Webhook Error:", error);
    res.status(500).send("Server Error");
  }
});


/* ===============================
   ONBOARDING ENDPOINTS
================================ */
app.get("/api/onboarding/progress", async (req, res) => {
  try {
    const { userId } = req.query as { userId?: string };
    if (!userId) return res.status(400).json({ error: "Missing userId" });

    const result = await db
      .select()
      .from(onboardingProgress)
      .where(eq(onboardingProgress.userId, userId))
      .limit(1);

    res.json(result[0] ?? {});
  } catch (err: any) {
    console.error("GET Onboarding Progress Error:", err.message || err);
    res.status(500).json({ error: "Failed to load progress" });
  }
});

app.post("/api/onboarding/progress", async (req, res) => {
  try {
    const { userId, currentStep } = req.body;
    if (!userId) return res.status(400).json({ error: "Missing userId" });

    await db
      .insert(onboardingProgress)
      .values({ userId, currentStep })
      .onConflictDoUpdate({
        target: onboardingProgress.userId,
        set: { currentStep },
      });

    res.json({ success: true });
  } catch (err: any) {
    console.error("POST Onboarding Progress Error:", err.message || err);
    res.status(500).json({ error: "Failed to save progress" });
  }
});

app.post("/api/onboarding", async (req, res) => {
  try {
    const {
      userId,
      companyData = {},
      industryData = {},
      targetData = {},
      keywordsData = { keywords: [] },
      platformsData = {},
    } = req.body;

    if (!userId) return res.status(400).json({ error: "Missing userId in payload" });

    console.log(`Processing onboarding for User: ${userId}`);

    // 1. Company Details
    await db
      .insert(companyDetails)
      .values({
        userId,
        companyName: companyData.companyName || "Unknown Company",
        websiteUrl: companyData.websiteUrl || null,
        businessEmail: companyData.businessEmail || null,
        phoneNumber: companyData.phoneNumber || null,
        industry: industryData.industry || null,
        industryOther: industryData.industryOther || null,
        productDescription: industryData.productDescription || null,
      })
      .onConflictDoUpdate({
        target: companyDetails.userId,
        set: { 
          companyName: companyData.companyName || "Unknown Company",
          websiteUrl: companyData.websiteUrl || null,
          businessEmail: companyData.businessEmail || null,
          phoneNumber: companyData.phoneNumber || null,
          industry: industryData.industry || null,
          industryOther: industryData.industryOther || null,
          productDescription: industryData.productDescription || null,
        },
      });

    // 2. Target Market
    if (Object.keys(targetData).length > 0) {
      await db
        .insert(targetMarket)
        .values({ userId, ...targetData })
        .onConflictDoUpdate({
          target: targetMarket.userId,
          set: targetData,
        });
    }

    // 3. Buyer Keywords
    await db.delete(buyerKeywords).where(eq(buyerKeywords.userId, userId));
    if (keywordsData?.keywords?.length > 0) {
      await db.insert(buyerKeywords).values(
        keywordsData.keywords.map((k: string) => ({
          userId,
          keyword: k,
        }))
      );
    }

    // 4. Platforms
    if (Object.keys(platformsData).length > 0) {
      await db
        .insert(platformsToMonitor)
        .values({ userId, ...platformsData })
        .onConflictDoUpdate({
          target: platformsToMonitor.userId,
          set: platformsData,
        });
    }

    // 5. Update Progress to Complete
    await db
      .insert(onboardingProgress)
      .values({ userId, completed: true, currentStep: 5 })
      .onConflictDoUpdate({
        target: onboardingProgress.userId,
        set: { completed: true, currentStep: 5 },
      });

    console.log(`✅ User ${userId} completed onboarding.`);
    res.json({ success: true });
  } catch (err: any) {
    console.error("🔥 Onboarding Error Details:", err.message || err);
    res.status(500).json({ error: "Onboarding failed on the server." });
  }
});

/* ===============================
   SETTINGS & PROFILE (Consolidated)
================================ */

// 1. GET Profile Data
app.get("/api/settings/profile", async (req, res) => {
  try {
    const { userId } = req.query as { userId?: string };

    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }

    // Run fetches in parallel for speed
    const [userData] = await db.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1);
    const [companyData] = await db.select().from(companyDetails).where(eq(companyDetails.userId, userId)).limit(1);
    const [targetMarketData] = await db.select().from(targetMarket).where(eq(targetMarket.userId, userId)).limit(1);
    const [platformsData] = await db.select().from(platformsToMonitor).where(eq(platformsToMonitor.userId, userId)).limit(1);
    const keywordsRaw = await db.select().from(buyerKeywords).where(eq(buyerKeywords.userId, userId));

    res.json({
      user: userData || {},
      company: companyData || {},
      targetMarket: targetMarketData || {},
      platforms: platformsData || {},
      keywords: keywordsRaw.map(k => k.keyword) || []
    });

  } catch (err: any) {
    console.error("Error fetching profile:", err.message || err);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

// 2. UPDATE Profile Data
app.put("/api/settings/profile", async (req, res) => {
  try {
    const { userId, userData, companyData, targetData, platformsData, keywords } = req.body;
    if (!userId) return res.status(400).json({ error: "Missing userId" });

    // 1. Update User Table (Name)
    if (userData && userData.name) {
      await db.update(usersTable)
        .set({ name: userData.name })
        .where(eq(usersTable.id, userId));
    }

    // 2. Update Company Details (Upsert)
    if (companyData && Object.keys(companyData).length > 0) {
      await db.insert(companyDetails)
        .values({ userId, ...companyData })
        .onConflictDoUpdate({
          target: companyDetails.userId,
          set: companyData,
        });
    }

    // 3. Update Target Market Data (Upsert)
    if (targetData && Object.keys(targetData).length > 0) {
      await db.insert(targetMarket)
        .values({ userId, ...targetData })
        .onConflictDoUpdate({
          target: targetMarket.userId,
          set: targetData,
        });
    }

    // 4. Update Platforms (Upsert)
    if (platformsData && Object.keys(platformsData).length > 0) {
      await db.insert(platformsToMonitor)
        .values({ userId, ...platformsData })
        .onConflictDoUpdate({
          target: platformsToMonitor.userId,
          set: platformsData,
        });
    }

    // 5. Update Keywords (Delete All -> Re-insert)
    if (Array.isArray(keywords)) {
      await db.delete(buyerKeywords).where(eq(buyerKeywords.userId, userId));
      if (keywords.length > 0) {
        await db.insert(buyerKeywords).values(
          keywords.map((k: string) => ({
            userId,
            keyword: k,
          }))
        );
      }
    }

    res.json({ success: true });
  } catch (err: any) {
    console.error("Error updating profile:", err.message || err);
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

    const existing = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, clerkId))
      .limit(1);

    if (!existing.length) {
      await db.insert(usersTable).values({
        id: clerkId,
        email,
        name: name || "New User",
        credits: 300,
      });
      console.log(`✅ Synced new user: ${email}`);
    }
    res.json({ success: true });
  } catch (err: any) {
    console.error("User Sync Error:", err.message || err);
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