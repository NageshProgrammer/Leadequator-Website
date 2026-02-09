import { Router, Request, Response } from "express";
import { db } from "../db.js";
// Added 'usersTable' to imports for the email lookup logic
import { buyerKeywords, redditPosts, quoraPosts, usersTable } from "../config/schema.js";
import { eq, desc } from "drizzle-orm";

const router = Router();

/* ===============================
   GET BUYER KEYWORDS (MERGED LOGIC)
   Supports fetching by 'email' OR 'userId'
================================ */
router.get("/keywords", async (req: Request, res: Response) => {
  try {
    const { userId, email } = req.query as { userId?: string; email?: string };

    let targetUserId = userId;

    // 1. If email is provided but no userId, look up the userId from the DB
    if (email && !targetUserId) {
      const userRecord = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, email))
        .limit(1);

      if (userRecord.length > 0) {
        targetUserId = userRecord[0].id;
      } else {
        // Fallback: If user not found by email, return empty or error
        return res.status(404).json({ error: "User not found with this email" });
      }
    }

    if (!targetUserId) {
      return res.status(400).json({ error: "Missing userId or email" });
    }

    // 2. Fetch keywords using the resolved targetUserId
    const rows = await db
      .select()
      .from(buyerKeywords)
      .where(eq(buyerKeywords.userId, targetUserId));

    res.json({ keywords: rows.map(r => r.keyword) });
  } catch (err) {
    console.error("KEYWORDS ERROR:", err);
    res.status(500).json({ error: "Failed to fetch keywords" });
  }
});

/* ===============================
   RUN REDDIT SCRAPING (TRIGGER)
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

    const keywords = rows.map(r => r.keyword);

    if (!keywords.length) {
      return res.status(400).json({ error: "No buyer keywords found" });
    }

    // 🔥 Fire & forget AI service (BACKWARD SAFE)
    fetch(`${process.env.AI_SERVICE_URL}/reddit/run`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        keywords,
        force_login: !!forceLogin,
      }),
    }).catch(err => {
      console.error("AI SERVICE ERROR:", err);
    });

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
   FETCH REDDIT POSTS (FOR UI)
================================ */
router.get("/reddit/posts", async (req: Request, res: Response) => {
  const { userId } = req.query as { userId?: string };

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
});

/* ===============================
   RUN QUORA SCRAPING (TRIGGER)
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

    const keywords = rows.map(r => r.keyword);

    if (!keywords.length) {
      return res.status(400).json({ error: "No buyer keywords found" });
    }

    // 🔥 Fire & forget AI service (QUORA)
    fetch(`${process.env.AI_SERVICE_URL}/quora/run`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        keywords,
      }),
    }).catch(err => {
      console.error("AI SERVICE QUORA ERROR:", err);
    });

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
   FETCH QUORA POSTS (FOR UI)
================================ */
router.get("/quora/posts", async (req: Request, res: Response) => {
  const { userId } = req.query as { userId?: string };

  if (!userId) {
    return res.status(400).json({ error: "Missing userId" });
  }

  const posts = await db
    .select()
    .from(quoraPosts)
    .where(eq(quoraPosts.userId, userId))
    .orderBy(desc(quoraPosts.createdAt))
    .limit(20);

  res.json({ posts });
});

export default router;