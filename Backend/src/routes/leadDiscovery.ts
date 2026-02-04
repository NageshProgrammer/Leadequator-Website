import { Router, Request, Response } from "express";
import { db } from "../db.js";
import { buyerKeywords, redditPosts } from "../config/schema.js";
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

  res.json({
    keywords: rows.map((r) => r.keyword),
  });
});

/* ===============================
   RUN REDDIT SCRAPING (PRODUCTION SAFE)
================================ */
router.post("/reddit/run", async (req: Request, res: Response) => {
  try {
    const { userId } = req.body as { userId?: string };

    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }

    // 1️⃣ Get buyer keywords
    const rows = await db
      .select()
      .from(buyerKeywords)
      .where(eq(buyerKeywords.userId, userId));

    const keywords = rows.map((r) => r.keyword);

    if (!keywords.length) {
      return res.status(400).json({ error: "No buyer keywords found" });
    }

    // 2️⃣ Trigger AI Service (fire & forget)
    fetch(`${process.env.AI_SERVICE_URL}/reddit/run`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ keywords }),
    }).catch((err) => {
      console.error("AI SERVICE ERROR:", err);
    });

    // 3️⃣ Store trigger record in DB (IMPORTANT)
    await db.insert(redditPosts).values(
      keywords.map((kw) => ({
        userId,
        platform: "reddit",
        text: `Triggered scrape for keyword: ${kw}`,
        url: "pending",
        author: "system",
      }))
    );

    return res.json({
      success: true,
      message: "Reddit scraping triggered successfully",
      keywords,
    });
  } catch (err) {
    console.error("REDDIT RUN ERROR:", err);
    res.status(500).json({ error: "Reddit scraping failed" });
  }
});

export default router;
