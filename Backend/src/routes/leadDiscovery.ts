import { Router, Request, Response } from "express";
import { db } from "../db.js";
import { buyerKeywords, redditPosts, quoraPosts } from "../config/schema.js";
import { eq, desc } from "drizzle-orm";

const router = Router();

/* ===============================
   GET BUYER KEYWORDS
================================ */
router.get("/keywords", async (req: Request, res: Response) => {
  try {
    const { userId } = req.query as { userId?: string };

    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }

    const rows = await db
      .select()
      .from(buyerKeywords)
      .where(eq(buyerKeywords.userId, userId));

    return res.json({
      success: true,
      keywords: rows.map((r) => r.keyword),
    });
  } catch (err) {
    console.error("KEYWORDS ERROR:", err);
    return res.status(500).json({ error: "Failed to fetch keywords" });
  }
});

/* ===============================
   RUN REDDIT SCRAPING (TRIGGER)
================================ */
router.post("/reddit/run", async (req: Request, res: Response) => {
  try {
    const { userId, forceLogin } = req.body as { userId?: string; forceLogin?: boolean };

    if (!userId) return res.status(400).json({ error: "Missing userId" });

    const rows = await db
      .select()
      .from(buyerKeywords)
      .where(eq(buyerKeywords.userId, userId));

    const keywords = rows.map((r) => r.keyword);

    if (!keywords.length) {
      return res.status(400).json({ error: "No buyer keywords found" });
    }

    // 🔥 Fire & forget AI service
    if (process.env.AI_SERVICE_URL) {
      fetch(`${process.env.AI_SERVICE_URL}/reddit/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, keywords, force_login: !!forceLogin }),
      }).catch((err) => console.error("AI SERVICE REDDIT ERROR:", err));
    }

    return res.json({ success: true, message: "Reddit scraping started" });
  } catch (err) {
    console.error("REDDIT RUN ERROR:", err);
    return res.status(500).json({ error: "Reddit scraping failed" });
  }
});

/* ===============================
   FETCH REDDIT POSTS
================================ */
router.get("/reddit/posts", async (req: Request, res: Response) => {
  try {
    const { userId } = req.query as { userId?: string };
    if (!userId) return res.status(400).json({ error: "Missing userId" });

    const posts = await db
      .select()
      .from(redditPosts)
      .where(eq(redditPosts.userId, userId))
      .orderBy(desc(redditPosts.createdAt))
      .limit(50);

    return res.json({ success: true, posts });
  } catch (err) {
    console.error("FETCH REDDIT ERROR:", err);
    return res.status(500).json({ error: "Failed to fetch reddit posts" });
  }
});

/* ===============================
   RUN QUORA SCRAPING (TRIGGER)
================================ */
router.post("/quora/run", async (req: Request, res: Response) => {
  try {
    const { userId } = req.body as { userId?: string };
    if (!userId) return res.status(400).json({ error: "Missing userId" });

    const rows = await db
      .select()
      .from(buyerKeywords)
      .where(eq(buyerKeywords.userId, userId));

    const keywords = rows.map((r) => r.keyword);

    if (!keywords.length) {
      return res.status(400).json({ error: "No buyer keywords found" });
    }

    // Fire & forget AI service
    if (process.env.AI_SERVICE_URL) {
      fetch(`${process.env.AI_SERVICE_URL}/quora/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, keywords }),
      }).catch((err) => console.error("AI SERVICE QUORA ERROR:", err));
    }

    return res.json({ success: true, message: "Quora scraping started" });
  } catch (err) {
    console.error("QUORA RUN ERROR:", err);
    return res.status(500).json({ error: "Quora scraping failed" });
  }
});

/* ===============================
   FETCH QUORA POSTS
================================ */
router.get("/quora/posts", async (req: Request, res: Response) => {
  try {
    const { userId } = req.query as { userId?: string };
    if (!userId) return res.status(400).json({ error: "Missing userId" });

    const posts = await db
      .select()
      .from(quoraPosts)
      .where(eq(quoraPosts.userId, userId))
      .orderBy(desc(quoraPosts.createdAt))
      .limit(50);

    return res.json({ success: true, posts });
  } catch (err) {
    console.error("FETCH QUORA ERROR:", err);
    return res.status(500).json({ error: "Failed to fetch quora posts" });
  }
});

export default router;