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
   CORS
================================ */
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:8080",
  "https://leadequator.live",
  "https://www.leadequator.live",
];

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      if (allowedOrigins.includes(origin)) return cb(null, origin);
      return cb(new Error("CORS blocked"));
    },
    credentials: true,
  })
);

app.use(express.json());

/* ===============================
   ROUTES
================================ */
app.use("/api/lead-discovery", leadDiscoveryRoutes);

/* ===============================
   USERS SYNC
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
