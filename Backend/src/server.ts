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
    const { userId } = req.query;
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
        keywordsData.keywords.map((k) => ({
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
   SETTINGS API (NEW ADDITION)
================================ */

// 1. GET SETTINGS
app.get("/api/settings", async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Run queries in parallel for performance
    const [user, company, platforms, keywords] = await Promise.all([
      db.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1),
      db.select().from(companyDetails).where(eq(companyDetails.userId, userId)).limit(1),
      db.select().from(platformsToMonitor).where(eq(platformsToMonitor.userId, userId)).limit(1),
      db.select().from(buyerKeywords).where(eq(buyerKeywords.userId, userId))
    ]);

    res.json({
      user: user[0] || null,
      company: company[0] || {},
      platforms: platforms[0] || {},
      keywords: keywords.map(k => k.keyword) || []
    });
  } catch (error) {
    console.error("Error fetching settings:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 2. SAVE SETTINGS
app.post("/api/settings", async (req, res) => {
  try {
    const { userId, name, companyName, website, phone, industry, description, platforms, keywords } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Use a transaction to ensure all updates succeed or fail together
    await db.transaction(async (tx) => {
      
      // A. Update User Name
      if (name) {
        await tx.update(usersTable)
          .set({ name })
          .where(eq(usersTable.id, userId));
      }

      // B. Update Company Details
      // We use onConflictDoUpdate to handle both insert (if new) and update
      await tx.insert(companyDetails)
        .values({
           userId,
           companyName: companyName || "My Company",
           websiteUrl: website,
           phoneNumber: phone,
           industry: industry,
           productDescription: description
        })
        .onConflictDoUpdate({
           target: companyDetails.userId,
           set: { 
             companyName, 
             websiteUrl: website, 
             phoneNumber: phone, 
             industry: industry, 
             productDescription: description 
           }
        });

      // C. Update Platforms
      await tx.insert(platformsToMonitor)
        .values({
          userId,
          quora: platforms?.quora || false,
          reddit: platforms?.reddit || false,
        })
        .onConflictDoUpdate({
           target: platformsToMonitor.userId,
           set: {
             quora: platforms?.quora || false,
             reddit: platforms?.reddit || false,
           }
        });

      // D. Update Keywords
      // Strategy: Delete all old keywords for this user, then insert the new list
      await tx.delete(buyerKeywords).where(eq(buyerKeywords.userId, userId));
      
      if (keywords && Array.isArray(keywords) && keywords.length > 0) {
        // Drizzle insert accepts an array of objects
        await tx.insert(buyerKeywords).values(
          keywords.map((k) => ({ userId, keyword: k }))
        );
      }
    });

    res.json({ success: true, message: "Profile updated successfully" });

  } catch (error) {
    console.error("Error updating settings:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/* ===============================
   START
================================ */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ API running on port ${PORT}`);
});