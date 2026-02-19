import "dotenv/config";
import express from "express";
import cors from "cors";
import { eq } from "drizzle-orm";

import { db } from "./db.js";
// ✅ Routes
import leadDiscoveryRoutes from "./routes/leadDiscovery.js";
import paymentRoutes from "./routes/payment.js"; 

// ✅ Schema Imports
import {
  onboardingProgress,
  companyDetails,
  targetMarket,
  buyerKeywords,
  platformsToMonitor,
  usersTable,
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

// 1. Payment Verification ( /api/verify-payment )
app.use("/api", paymentRoutes);

// 2. Lead Discovery ( /api/lead-discovery/... )
app.use("/api/lead-discovery", leadDiscoveryRoutes);

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
    // Using update instead of insert here since usersTable requires an email, which comes from the sync route
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