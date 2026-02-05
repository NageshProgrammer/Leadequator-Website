import "dotenv/config";
import express from "express";
import cors from "cors";
import { eq } from "drizzle-orm";
// 1. Add Nodemailer Import
import nodemailer from "nodemailer";

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
   CORS (EXPRESS v5 SAFE)
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
      // allow server-to-server, curl, health checks
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, origin); // IMPORTANT
      }

      return callback(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

/* ===============================
   EMAIL TRANSPORTER (Added)
================================ */
// This configures the connection to Gmail using the secrets from your .env file
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false, 
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/* ===============================
   CONTACT ROUTE (Added)
================================ */
app.post("/api/contact", async (req, res) => {
  try {
    const { firstName, lastName, email, company, role, interest, message } = req.body;

    if (!email || !firstName) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const mailOptions = {
      from: `"${firstName} ${lastName}" <${process.env.SMTP_FROM}>`, 
      replyTo: email, 
      to: process.env.RECEIVER_EMAIL, 
      subject: `New Lead: ${firstName} ${lastName} from ${company}`,
      html: `
        <h2>New Contact Request</h2>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Company:</strong> ${company}</p>
        <p><strong>Role:</strong> ${role}</p>
        <p><strong>Interest:</strong> ${interest}</p>
        <hr />
        <h3>Message:</h3>
        <p>${message}</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully");
    res.status(200).json({ success: true, message: "Email sent" });
  } catch (error) {
    console.error("❌ Error sending email:", error);
    res.status(500).json({ success: false, message: "Failed to send email" });
  }
});

/* ===============================
   EXISTING ROUTES (Unchanged)
================================ */

app.use("/api/lead-discovery", leadDiscoveryRoutes);

/* ===============================
   ONBOARDING (Unchanged)
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
    console.error(err);
    res.status(500).json({ error: "Onboarding failed" });
  }
});

/* ===============================
   USER SYNC (Unchanged)
================================ */

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
   START SERVER
================================ */

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`✅ API running on port ${PORT}`);
});