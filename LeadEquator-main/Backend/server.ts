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
} from "../config/schema";

const app = express();
app.use(cors());
app.use(express.json());

// --------------------
// Load progress
// --------------------
app.get("/api/onboarding/progress", async (req, res) => {
  const { userId } = req.query as { userId: string };

  const result = await db
    .select()
    .from(onboardingProgress)
    .where(eq(onboardingProgress.userId, userId))
    .limit(1);

  res.json(result[0] ?? {});
});

// --------------------
// Update step
// --------------------
app.post("/api/onboarding/progress", async (req, res) => {
  const { userId, currentStep } = req.body;

  await db
    .insert(onboardingProgress)
    .values({ userId, currentStep })
    .onConflictDoUpdate({
      target: onboardingProgress.userId,
      set: { currentStep },
    });

  res.json({ success: true });
});

// --------------------
// Finish onboarding
// --------------------
app.post("/api/onboarding", async (req, res) => {
  try {
    const {
      userId,
      companyData,
      industryData,
      targetData,
      keywordsData,
      platformsData,
    } = req.body;

    await db
      .insert(companyDetails)
      .values({
        userId,
        companyName: companyData.companyName,
        websiteUrl: companyData.websiteUrl || null,
        businessEmail: companyData.businessEmail || null,
        phoneNumber: companyData.phoneNumber || null,
        industry: industryData.industry,
        industryOther: industryData.industryOther || null,
        productDescription: industryData.productDescription || null,
      })
      .onConflictDoUpdate({
        target: companyDetails.userId,
        set: { companyName: companyData.companyName },
      });

    await db.insert(targetMarket).values({
      userId,
      targetAudience: targetData.targetAudience,
      targetCountry: targetData.targetCountry,
      targetStateCity: targetData.targetStateCity || null,
      businessType: targetData.businessType,
    });

    await db.delete(buyerKeywords).where(eq(buyerKeywords.userId, userId));
    if (keywordsData.keywords.length) {
      await db.insert(buyerKeywords).values(
        keywordsData.keywords.map((k: string) => ({
          userId,
          keyword: k,
        }))
      );
    }

    await db
      .insert(platformsToMonitor)
      .values({ userId, ...platformsData })
      .onConflictDoUpdate({
        target: platformsToMonitor.userId,
        set: platformsData,
      });

    await db
      .insert(onboardingProgress)
      .values({ userId, completed: true, currentStep: 5 })
      .onConflictDoUpdate({
        target: onboardingProgress.userId,
        set: { completed: true, currentStep: 5 },
      });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Onboarding failed" });
  }
});

app.listen(4000, () => {
  console.log("API running on http://localhost:4000");
});

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