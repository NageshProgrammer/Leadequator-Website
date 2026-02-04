import { Router, Request, Response } from "express";
import { db } from "../db.js";
import { buyerKeywords } from "../config/schema.js";
import { eq } from "drizzle-orm";

const router = Router();

/* ===============================
   GET BUYER KEYWORDS
================================ */
router.get("/keywords", async (req: Request, res: Response) => {
  const { userId } = req.query as { userId?: string };

  if (!userId) {
    return res.status(400).json({ error: "Missing userId" });
  }

  const rows = await db
    .select()
    .from(buyerKeywords)
    .where(eq(buyerKeywords.userId, userId));

  res.json({ keywords: rows.map(r => r.keyword) });
});

/* ===============================
   RUN REDDIT SCRAPING (PRODUCTION)
================================ */
router.post("/reddit/run", async (_req: Request, res: Response) => {
  try {
    const aiRes = await fetch(
      `${process.env.AI_SERVICE_URL}/reddit/run`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      }
    );

    const text = await aiRes.text();

    if (!aiRes.ok) {
      console.error("AI ERROR RESPONSE:", text);
      return res.status(500).json({
        error: "Reddit scraping failed",
        detail: text
      });
    }

    const data = JSON.parse(text);

    res.json({
      success: true,
      message: "Reddit scraping completed",
      data
    });

  } catch (err) {
    console.error("BACKEND REDDIT ERROR:", err);
    res.status(500).json({ error: "Reddit scraping failed" });
  }
});

export default router;
