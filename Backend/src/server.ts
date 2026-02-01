import "dotenv/config";
import express from "express";
import cors from "cors";
import { eq } from "drizzle-orm";

import { db } from "./db";
import leadDiscoveryRoutes from "./routes/leadDiscovery";

import {
  onboardingProgress,
  companyDetails,
  targetMarket,
  buyerKeywords,
  platformsToMonitor,
  usersTable,
} from "./config/schema";

const app = express();

/* ===============================
   CORS (LOCAL + PRODUCTION SAFE)
================================ */

// ✅ Explicitly allowed origins
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:8080",
  "https://leadequator.live",
  "https://www.leadequator.live",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server, curl, Postman, health checks
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
    ],
  })
);

app.use(express.json());

/* ===============================
   LEAD DISCOVERY ROUTES
================================ */
app.use("/api/lead-discovery", leadDiscoveryRoutes);

/* ===============================
   ONBOARDING ROUTES
================================ */
app.get("/api/onboarding/progress", async (req, res) => {
  try {
    const { userId } = req.query as { userId: string };

    const result = await db
      .select()
      .from(onboardingProgress)
      .where(eq(onboardingProgress.userId, userId))
      .limit(1);

    res.json(result[0] ?? {});
  } catch (err) {
    console.error("Onboarding progress error:", err);
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

    await db
      .insert(targetMarket)
      .values({
        userId,
        targetAudience: targetData.targetAudience,
        targetCountry: targetData.targetCountry,
        targetStateCity: targetData.targetStateCity || null,
        businessType: targetData.businessType,
      })
      .onConflictDoUpdate({
        target: targetMarket.userId,
        set: targetData,
      });

    await db.delete(buyerKeywords).where(eq(buyerKeywords.userId, userId));

    if (keywordsData?.keywords?.length) {
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
    console.error("Onboarding submit error:", err);
    res.status(500).json({ error: "Onboarding failed" });
  }
});

app.post("/api/users/sync", async (req, res) => {
  const { clerkId, email, name } = req.body;

  if (!clerkId || !email) {
    return res.status(400).json({ error: "Missing data" });
  }

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
   SERVER START
================================ */
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`✅ API running on port ${PORT}`);
});
