import { Router, Request, Response } from "express";
import { eq } from "drizzle-orm";

import { db } from "../db.js";
import { buyerKeywords, redditPosts } from "../config/schema.js";

const router = Router();

/* ===============================
   GET BUYER KEYWORDS
================================ */
router.get("/keywords", async (req: Request, res: Response) => {
  const { userId } = req.query as { userId?: string };
  if (!userId) return res.status(400).json({});

  const rows = await db
    .select()
    .from(buyerKeywords)
    .where(eq(buyerKeywords.userId, userId));

  res.json({ keywords: rows.map((r) => r.keyword) });
});

/* ===============================
   RUN REDDIT SCRAPE (TRIGGER)
================================ */
router.post("/reddit/run", async (req: Request, res: Response) => {
  try {
    const { userId } = req.body as { userId?: string };
    if (!userId) return res.status(400).json({});

    const rows = await db
      .select()
      .from(buyerKeywords)
      .where(eq(buyerKeywords.userId, userId));

    const keywords = rows.map((r) => r.keyword);
    if (!keywords.length)
      return res.status(400).json({ error: "No keywords" });

    // fire & forget AI
    fetch(`${process.env.AI_SERVICE_URL}/reddit/run`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ keywords }),
    }).catch(console.error);

    // audit trail
    await db.insert(redditPosts).values(
      keywords.map((kw) => ({
        userId,
        platform: "reddit",
        text: kw,
        url: "pending",
        author: "system",
      }))
    );

    res.json({
      success: true,
      message: "Reddit scraping triggered successfully",
      keywords,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Reddit scraping failed" });
  }
});

export default router;
