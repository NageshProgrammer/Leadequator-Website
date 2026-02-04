import { Router, Request, Response } from "express";
import { db } from "../db.js";
import { buyerKeywords, redditPosts } from "../config/schema.js";
import { eq } from "drizzle-orm";

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

  res.json({ keywords: rows.map(r => r.keyword) });
});

/* ===============================
   RUN REDDIT SCRAPING (REAL)
================================ */
router.post("/reddit/run", async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }

    // 1️⃣ Get keywords
    const keywords = await db
      .select()
      .from(buyerKeywords)
      .where(eq(buyerKeywords.userId, userId));

    if (!keywords.length) {
      return res.status(400).json({ error: "No buyer keywords found" });
    }

    // 2️⃣ Scrape Reddit using public JSON (NO LOGIN)
    for (const kw of keywords) {
      const query = encodeURIComponent(kw.keyword);
      const url = `https://www.reddit.com/search.json?q=${query}&limit=5`;

      const response = await fetch(url, {
        headers: {
          "User-Agent": "LeadEquatorBot/1.0"
        }
      });

      const data = await response.json();

      if (!data?.data?.children) continue;

      for (const post of data.data.children) {
        const p = post.data;

        await db.insert(redditPosts).values({
          userId,
          platform: "reddit",
          text: p.title,
          url: `https://reddit.com${p.permalink}`,
          author: p.author
        });
      }
    }

    return res.json({
      success: true,
      message: "Reddit scraping completed & stored",
    });

  } catch (err) {
    console.error("REDDIT SCRAPE ERROR:", err);
    return res.status(500).json({ error: "Reddit scraping failed" });
  }
});

export default router;
