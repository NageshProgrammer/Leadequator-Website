import "dotenv/config";
import express from "express";
import cors from "cors";

import leadDiscoveryRoutes from "./routes/leadDiscovery.js";

const app = express();

/* ===============================
   CORS
================================ */
const allowedOrigins = [
  "http://localhost:5173",
  "https://leadequator.live",
  "https://www.leadequator.live",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, origin);
      return callback(new Error("CORS blocked"));
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
   HEALTH
================================ */
app.get("/", (_req, res) => {
  res.json({ status: "Backend running" });
});

/* ===============================
   START
================================ */
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`✅ API running on port ${PORT}`);
});
