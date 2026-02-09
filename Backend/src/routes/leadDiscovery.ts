import { Router, Request, Response } from "express";
import { db } from "../db.js";
import { buyerKeywords, redditPosts, quoraPosts, usersTable } from "../config/schema.js";
import { eq, desc } from "drizzle-orm";

const router = Router();

/* GET KEYWORDS - Handles both Email (from onboarding) and ID */
router.get("/keywords", async (req: Request, res: Response) => {
  try {
    const { userId, email } = req.query as { userId?: string; email?: string };
    let targetUserId = userId;

    // Resolve Email to User ID if needed
    if (email && !targetUserId) {
      const userRecord = await db
        .select({ id: usersTable.id })
        .from(usersTable)
        .where(eq(usersTable.email, email.toLowerCase())) // Lowercase for safety
        .limit(1);

      if (userRecord.length > 0) {
        targetUserId = userRecord[0].id;
      } else {
        return res.status(404).json({ error: "No user found with this email" });
      }
    }

    if (!targetUserId) {
      return res.status(400).json({ error: "Missing identifying information" });
    }

    // Fetch the keywords
    const rows = await db
      .select({ keyword: buyerKeywords.keyword })
      .from(buyerKeywords)
      .where(eq(buyerKeywords.userId, targetUserId));

    return res.json({ keywords: rows.map(r => r.keyword) });

  } catch (err) {
    console.error("FETCH KEYWORDS ERROR:", err);
    res.status(500).json({ error: "Database error while fetching keywords" });
  }
});

/* TRIGGER REDDIT SCRAPER */
router.post("/reddit/run", async (req: Request, res: Response) => {
  try {
    const { userId, forceLogin } = req.body;
    if (!userId) return res.status(400).json({ error: "Missing userId" });

    const rows = await db.select().from(buyerKeywords).where(eq(buyerKeywords.userId, userId));
    const keywords = rows.map(r => r.keyword);

    if (!keywords.length) return res.status(400).json({ error: "Onboarding keywords missing" });

    // Fire to AI Microservice
    fetch(`${process.env.AI_SERVICE_URL}/reddit/run`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, keywords, force_login: !!forceLogin }),
    }).catch(e => console.error("Microservice Error:", e));

    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: "Internal Server Error" }); }
});

/* FETCH RESULTS */
router.get("/reddit/posts", async (req: Request, res: Response) => {
  const { userId } = req.query as { userId: string };
  if (!userId) return res.status(400).json({ error: "Missing userId" });

  const posts = await db
    .select()
    .from(redditPosts)
    .where(eq(redditPosts.userId, userId))
    .orderBy(desc(redditPosts.createdAt))
    .limit(20);

  res.json({ posts });
});

export default router;