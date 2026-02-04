import { Router, Request, Response } from "express";
import { db } from "../db.js";
import { buyerKeywords, redditPosts } from "../config/schema.js";
import { eq, desc } from "drizzle-orm";

const router = Router();

/* ===============================
   GET BUYER KEYWORDS
================================ */
router.get("/keywords", async (req, res) => {
  const { userId } = req.query as { userId: string };

  if (!userId) {
    return res.status(400).json({ error: "Missing userId" });
  }

  const rows = await db
    .select()
    .from(buyerKeywords)
    .where(eq(buyerKeywords.userId, userId));

  res.json({ keywords: rows.map((r) => r.keyword) });
});

/* ===============================
   RUN REDDIT SCRAPING
================================ */
router.post("/reddit/run", async (_req: Request, res: Response) => {
  try {
    const aiRes = await fetch(
      `${process.env.AI_SERVICE_URL}/reddit/run`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!aiRes.ok) {
      const text = await aiRes.text();
      throw new Error(text);
    }

    await aiRes.json();

    res.json({
      success: true,
      message: "Reddit scraping triggered successfully",
    });
  } catch (err) {
    console.error("REDDIT SCRAPE ERROR:", err);
    res.status(500).json({ error: "Reddit scraping failed" });
  }
});

/* ===============================
   FETCH REDDIT POSTS FROM DB 🔥
================================ */
router.get("/reddit/posts", async (req, res) => {
  try {
    const { userId } = req.query as { userId: string };

    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }

    const posts = await db
      .select()
      .from(redditPosts)
      .where(eq(redditPosts.userId, userId))
      .orderBy(desc(redditPosts.createdAt))
      .limit(20);

    res.json({ posts });
  } catch (err) {
    console.error("FETCH REDDIT POSTS ERROR:", err);
    res.status(500).json({ error: "Failed to fetch Reddit posts" });
  }
});

export default router;
