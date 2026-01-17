import "dotenv/config";
import express from "express";
import cors from "cors";
import { eq } from "drizzle-orm";

import { db } from "./db";
import {
  onboardingProgress,
  companyDetails,
  targetMarket,
  buyerKeywords,
  platformsToMonitor,
  usersTable,
} from "./config/schema";

const app = express();

/* =========================
   ✅ CORS CONFIG (FIXED)
   ========================= */
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://leadequator.live",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());

/* =========================
   HEALTH CHECK (OPTIONAL)
   ========================= */
app.get("/health", (_, res) => {
  res.json({ status: "ok" });
});

/* =========================
   LOAD ONBOARDING PROGRESS
   ========================= */
app.get("/api/onboarding/progress", async (req, res) => {
  try {
    const { userId } = req.query as { userId: string };

    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }

    const result = await db
      .select()
      .from(onboardingProgress)
      .where(eq(onboardingProgress.userId, userId))
      .limit(1);

    res.json(result[0] ?? {});
  } catch (err) {
    console.error("Load progress error:", err);
    res.status(500).json({ error: "Failed to load progress" });
  }
});

/* =========================
   UPDATE CURRENT STEP
   ========================= */
app.post("/api/onboarding/progress", async (req, res) => {
  try {
    const { userId, currentStep } = req.body;

    if (!userId || !currentStep) {
      return res.status(400).json({ error: "Missing data" });
    }

    await db
      .insert(onboardingProgress)
      .values({ userId, currentStep })
      .onConflictDoUpdate({
        target: onboardingProgress.userId,
        set: { currentStep },
      });

    res.json({ success: true });
  } catch (err) {
    console.error("Update progress error:", err);
    res.status(500).json({ error: "Failed to update progress" });
  }
});

/* =========================
   COMPLETE ONBOARDING
   ========================= */
app.post("/api/onboarding/complete", async (req, res) => {
  try {
    const {
      userId,
      companyData,
      industryData,
      targetData,
      keywords,
      platforms,
    } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }

    /* Company Details */
    await db
      .insert(companyDetails)
      .values({
        userId,
        companyName: companyData.companyName,
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
          companyName: companyData.companyName,
          websiteUrl: companyData.websiteUrl || null,
          businessEmail: companyData.businessEmail || null,
          phoneNumber: companyData.phoneNumber || null,
          industry: industryData.industry || null,
          industryOther: industryData.industryOther || null,
          productDescription: industryData.productDescription || null,
        },
      });

    /* Target Market */
    await db.insert(targetMarket).values({
      userId,
      targetAudience: targetData.targetAudience,
      targetCountry: targetData.targetCountry,
      targetStateCity: targetData.targetStateCity || null,
      businessType: targetData.businessType,
    });

    /* Keywords */
    await db.delete(buyerKeywords).where(eq(buyerKeywords.userId, userId));

    if (keywords?.length) {
      await db.insert(buyerKeywords).values(
        keywords.map((k: string) => ({
          userId,
          keyword: k,
        }))
      );
    }

    /* Platforms */
    await db
      .insert(platformsToMonitor)
      .values({ userId, ...platforms })
      .onConflictDoUpdate({
        target: platformsToMonitor.userId,
        set: platforms,
      });

    /* Mark onboarding complete */
    await db
      .insert(onboardingProgress)
      .values({ userId, completed: true, currentStep: 5 })
      .onConflictDoUpdate({
        target: onboardingProgress.userId,
        set: { completed: true, currentStep: 5 },
      });

    res.json({ success: true });
  } catch (err) {
    console.error("Onboarding complete error:", err);
    res.status(500).json({ error: "Onboarding failed" });
  }
});

/* =========================
   USER SYNC
   ========================= */
app.post("/api/users/sync", async (req, res) => {
  try {
    const { clerkId, email, name } = req.body;

    if (!clerkId || !email) {
      return res.status(400).json({ error: "Missing data" });
    }

    const existing = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, clerkId))
      .limit(1);

    if (existing.length === 0) {
      await db.insert(usersTable).values({
        id: clerkId,
        email,
        name,
        credits: 20,
      });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("User sync error:", err);
    res.status(500).json({ error: "User sync failed" });
  }
});

/* =========================
   START SERVER
   ========================= */
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
