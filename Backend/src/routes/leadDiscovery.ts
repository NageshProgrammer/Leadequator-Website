import { Router, Request, Response } from "express";
import { db } from "../db.js";
// Ensure these imports match your schema.ts exports exactly
import { buyerKeywords, redditPosts, quoraPosts } from "../config/schema.js"; 
import { eq, desc } from "drizzle-orm";

const router = Router();

/* ===============================
   GET BUYER KEYWORDS (Preserved Logic)
================================ */
router.get("/keywords", async (req: Request, res: Response) => {
  const { userId } = req.query as { userId?: string };

  if (!userId) {
    return res.status(400).json({ error: "Missing userId" });
  }

  try {
    const rows = await db
      .select()
      .from(buyerKeywords)
      .where(eq(buyerKeywords.userId, userId));

    res.json({ keywords: rows.map((r) => r.keyword) });
  } catch (error) {
    console.error("Error fetching keywords:", error);
    // Improvement: Send 500 instead of crashing
    res.status(500).json({ error: "Database error" }); 
  }
});

/* ===============================
   RUN REDDIT SCRAPING (Preserved Logic)
================================ */
router.post("/reddit/run", async (req: Request, res: Response) => {
  try {
    const { userId, forceLogin } = req.body as {
      userId?: string;
      forceLogin?: boolean;
    };

    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }

    const rows = await db
      .select()
      .from(buyerKeywords)
      .where(eq(buyerKeywords.userId, userId));

    const keywords = rows.map((r) => r.keyword);

    if (!keywords.length) {
      return res.status(400).json({ error: "No buyer keywords found" });
    }

    // Improvement: Check if URL exists before fetching
    if (process.env.AI_SERVICE_URL) {
      fetch(`${process.env.AI_SERVICE_URL}/reddit/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          keywords,
          force_login: !!forceLogin,
        }),
      }).catch((err) => {
        console.error("AI SERVICE ERROR:", err);
      });
    } else {
        console.warn("Skipping AI Trigger: AI_SERVICE_URL not set in .env");
    }

    return res.json({
      success: true,
      message: "Reddit scraping triggered successfully",
    });
  } catch (err) {
    console.error("REDDIT RUN ERROR:", err);
    res.status(500).json({ error: "Reddit scraping failed" });
  }
});

/* ===============================
   FETCH REDDIT POSTS (Preserved Logic)
================================ */
router.get("/reddit/posts", async (req: Request, res: Response) => {
  const { userId } = req.query as { userId?: string };

  if (!userId) {
    return res.status(400).json({ error: "Missing userId" });
  }

  try {
    const posts = await db
      .select()
      .from(redditPosts)
      .where(eq(redditPosts.userId, userId))
      .orderBy(desc(redditPosts.createdAt))
      .limit(20);

    res.json({ posts });
  } catch (err) {
    console.error("REDDIT POSTS ERROR:", err);
    res.status(500).json({ error: "Failed to load posts" });
  }
});

/* ===============================
   RUN QUORA SCRAPING (Preserved Logic)
================================ */
router.post("/quora/run", async (req: Request, res: Response) => {
  try {
    const { userId } = req.body as { userId?: string };

    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }

    const rows = await db
      .select()
      .from(buyerKeywords)
      .where(eq(buyerKeywords.userId, userId));

    const keywords = rows.map((r) => r.keyword);

    if (!keywords.length) {
      return res.status(400).json({ error: "No buyer keywords found" });
    }

    if (process.env.AI_SERVICE_URL) {
      fetch(`${process.env.AI_SERVICE_URL}/quora/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          keywords,
        }),
      }).catch((err) => {
        console.error("AI SERVICE QUORA ERROR:", err);
      });
    }

    return res.json({
      success: true,
      message: "Quora scraping triggered successfully",
    });
  } catch (err) {
    console.error("QUORA RUN ERROR:", err);
    res.status(500).json({ error: "Quora scraping failed" });
  }
});

/* ===============================
   FETCH QUORA POSTS (Preserved Logic)
================================ */
router.get("/quora/posts", async (req: Request, res: Response) => {
  const { userId } = req.query as { userId?: string };

  if (!userId) {
    return res.status(400).json({ error: "Missing userId" });
  }

  try {
    const posts = await db
      .select()
      .from(quoraPosts)
      .where(eq(quoraPosts.userId, userId))
      .orderBy(desc(quoraPosts.createdAt))
      .limit(20);

    res.json({ posts });
  } catch (err) {
    console.error("QUORA POSTS ERROR:", err);
    res.status(500).json({ error: "Failed to load posts" });
  }
});

export default router;