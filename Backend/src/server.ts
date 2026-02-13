import "dotenv/config";
import express from "express";
import cors from "cors";
import { eq } from "drizzle-orm";

import { db } from "./db.js";
import leadDiscoveryRoutes from "./routes/leadDiscovery.js";

import {
  onboardingProgress,
  companyDetails,
  targetMarket,
  buyerKeywords, // Ensure this is imported
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
      return callback(new Error("CORS blocked"));
    },
    credentials: true,
  })
);

app.use(express.json());

/* ===============================
   HEALTH
================================ */
app.get("/", (_req, res) => {
  res.json({ status: "Backend running" });
});

/* ===============================
   LEAD DISCOVERY
================================ */
app.use("/api/lead-discovery", leadDiscoveryRoutes);

/* ===============================
   ONBOARDING
================================ */
app.get("/api/onboarding/progress", async (req, res) => {
  try {
    const { userId } = req.query as { userId?: string };
    if (!userId) return res.status(400).json({});

    const result = await db
      .select()
      .from(onboardingProgress)
      .where(eq(onboardingProgress.userId, userId))
      .limit(1);

    res.json(result[0] ?? {});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load progress" });
  }
});

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

    // company
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

    // target
    await db
      .insert(targetMarket)
      .values({ userId, ...targetData })
      .onConflictDoUpdate({
        target: targetMarket.userId,
        set: targetData,
      });

    // keywords
    await db.delete(buyerKeywords).where(eq(buyerKeywords.userId, userId));
    if (keywordsData?.keywords?.length) {
      await db.insert(buyerKeywords).values(
        keywordsData.keywords.map((k: string) => ({
          userId,
          keyword: k,
        }))
      );
    }

    // platforms
    await db
      .insert(platformsToMonitor)
      .values({ userId, ...platformsData })
      .onConflictDoUpdate({
        target: platformsToMonitor.userId,
        set: platformsData,
      });

    // progress
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
    const [userData] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, userId))
      .limit(1);

    const [companyData] = await db
      .select()
      .from(companyDetails)
      .where(eq(companyDetails.userId, userId))
      .limit(1);

    const [platformsData] = await db
      .select()
      .from(platformsToMonitor)
      .where(eq(platformsToMonitor.userId, userId))
      .limit(1);

    // Fetch keywords
    const keywordsRaw = await db
      .select()
      .from(buyerKeywords)
      .where(eq(buyerKeywords.userId, userId));

    // Return combined object
    res.json({
      user: userData || {},
      company: companyData || {},
      platforms: platformsData || {},
      keywords: keywordsRaw.map(k => k.keyword) || []
    });

  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

// 2. UPDATE Profile Data
app.put("/api/settings/profile", async (req, res) => {
  try {
    const { userId, userData, companyData, platformsData, keywords } = req.body;
    if (!userId) return res.status(400).json({ error: "Missing userId" });

    // 1. Update User Table (Name)
    if (userData) {
      await db.update(usersTable)
        .set({ name: userData.name })
        .where(eq(usersTable.id, userId));
    }

    // 2. Update Company Details (Upsert)
    if (companyData) {
      await db.insert(companyDetails)
        .values({ 
          userId, 
          ...companyData 
        })
        .onConflictDoUpdate({
          target: companyDetails.userId,
          set: companyData,
        });
    }

    // 3. Update Platforms (Upsert)
    if (platformsData) {
      await db.insert(platformsToMonitor)
        .values({ userId, ...platformsData })
        .onConflictDoUpdate({
          target: platformsToMonitor.userId,
          set: platformsData,
        });
    }

    // 4. Update Keywords (Delete All -> Re-insert)
    if (keywords) {
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
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

/* ===============================
   USERS SYNC (CLERK)
================================ */
app.post("/api/users/sync", async (req, res) => {
  const { clerkId, email, name } = req.body;
  if (!clerkId || !email) return res.status(400).json({});

  const existing = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, clerkId))
    .limit(1);

  if (!existing.length) {
    await db.insert(usersTable).values({
      id: clerkId,
      email,
      name,
      credits: 20,
    });
  }

  res.json({ success: true });
});

/* ===============================
   START
================================ */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ API running on port ${PORT}`);
});