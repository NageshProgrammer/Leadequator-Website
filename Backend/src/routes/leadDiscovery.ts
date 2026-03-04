import { Router, Request, Response } from "express";
import { db } from "../db.js";
import { 
  buyerKeywords, 
  redditPosts, 
  quoraPosts, 
  usersTable, 
  quoraAiReplies, 
  redditAiReplies 
} from "../config/schema.js";
import { eq, desc, and, gte, sql } from "drizzle-orm";

const router = Router();

/* ===============================
   HELPER: GET USER CREDITS
================================ */
async function getUserCredits(userId: string) {
  const user = await db
    .select({ credits: usersTable.credits })
    .from(usersTable)
    .where(eq(usersTable.id, userId))
    .limit(1);
  return user.length > 0 ? user[0].credits : 0;
}

/* ===============================
   GET USER CREDITS (ENDPOINT)
================================ */
router.get("/user/credits", async (req: Request, res: Response) => {
  try {
    const { userId } = req.query as { userId?: string };
    if (!userId || typeof userId !== "string") {
      return res.status(400).json({ error: "Missing userId" });
    }

    const currentCredits = await getUserCredits(userId);

    return res.json({
      success: true,
      credits: currentCredits,
    });
  } catch (err) {
    console.error("FETCH CREDITS ERROR:", err);
    return res.status(500).json({ error: "Failed to fetch credits" });
  }
});

/* ===============================
   GET BUYER KEYWORDS
================================ */
router.get("/keywords", async (req: Request, res: Response) => {
  try {
    const { userId } = req.query as { userId?: string };
    if (!userId || typeof userId !== "string") {
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
   RUN REDDIT SCRAPING
================================ */
router.post("/reddit/run", async (req: Request, res: Response) => {
  try {
    const { userId, forceLogin } = req.body;
    if (!userId) return res.status(400).json({ error: "Missing userId" });

    // 1. Check Credits
    const currentCredits = await getUserCredits(userId);
    if (currentCredits < 2) {
      return res.status(403).json({ error: "Insufficient credits" });
    }

    // 2. Fetch Keywords
    const rows = await db.select().from(buyerKeywords).where(eq(buyerKeywords.userId, userId));
    const keywords = rows.map((r) => r.keyword);
    if (!keywords.length) return res.status(400).json({ error: "No buyer keywords found" });

    // 3. Mark Start Time (Buffer: 10s ago)
    const startTime = new Date(Date.now() - 10000);

    // 4. Run AI Service (Wait for completion)
    const aiResponse = await fetch(`${process.env.AI_SERVICE_URL}/reddit/run`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, keywords, force_login: !!forceLogin }),
    });

    if (!aiResponse.ok) console.error("Reddit scraper service reported an issue.");

    // 5. Count New Posts & Deduct Credits
    const [countResult] = await db
      .select({ count: sql<number>`cast(count(*) as int)` })
      .from(redditPosts)
      .where(
        and(
          eq(redditPosts.userId, userId),
          gte(redditPosts.createdAt, startTime)
        )
      );

    const postsFound = countResult?.count || 0;
    const cost = postsFound * 2;

    if (cost > 0) {
      await db
        .update(usersTable)
        .set({ credits: sql`${usersTable.credits} - ${cost}` })
        .where(eq(usersTable.id, userId));
    }

    return res.json({
      success: true,
      message: "Reddit scraping completed",
      leadsFound: postsFound,
      creditsDeducted: cost,
    });

  } catch (err) {
    console.error("REDDIT RUN ERROR:", err);
    return res.status(500).json({ error: "Reddit scraping failed" });
  }
});

/* ===============================
   RUN QUORA SCRAPING
================================ */
router.post("/quora/run", async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: "Missing userId" });

    // 1. Check Credits
    const currentCredits = await getUserCredits(userId);
    if (currentCredits < 2) {
      return res.status(403).json({ error: "Insufficient credits" });
    }

    // 2. Fetch Keywords
    const rows = await db.select().from(buyerKeywords).where(eq(buyerKeywords.userId, userId));
    const keywords = rows.map((r) => r.keyword);
    if (!keywords.length) return res.status(400).json({ error: "No buyer keywords found" });

    // 3. Mark Start Time (Buffer: 10s ago)
    const startTime = new Date(Date.now() - 10000);

    // 4. Run AI Service
    const aiResponse = await fetch(`${process.env.AI_SERVICE_URL}/quora/run`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, keywords }),
    });

    if (!aiResponse.ok) console.error("Quora scraper service reported an issue.");

    // 5. Count New Posts & Deduct Credits
    const [countResult] = await db
      .select({ count: sql<number>`cast(count(*) as int)` })
      .from(quoraPosts)
      .where(
        and(
          eq(quoraPosts.userId, userId),
          gte(quoraPosts.createdAt, startTime)
        )
      );

    const postsFound = countResult?.count || 0;
    const cost = postsFound * 2;

    if (cost > 0) {
      await db
        .update(usersTable)
        .set({ credits: sql`${usersTable.credits} - ${cost}` })
        .where(eq(usersTable.id, userId));
    }

    return res.json({
      success: true,
      message: "Quora scraping completed",
      leadsFound: postsFound,
      creditsDeducted: cost,
    });

  } catch (err) {
    console.error("QUORA RUN ERROR:", err);
    return res.status(500).json({ error: "Quora scraping failed" });
  }
});

/* ===============================
   RUN BOTH SCRAPERS (Combined)
================================ */
router.post("/run", async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: "Missing userId" });

    // 1. Check Credits
    const currentCredits = await getUserCredits(userId);
    if (currentCredits < 2) {
      return res.status(403).json({ error: "Insufficient credits to start" });
    }

    // 2. Fetch Keywords
    const rows = await db.select().from(buyerKeywords).where(eq(buyerKeywords.userId, userId));
    const keywords = rows.map((r) => r.keyword);
    if (!keywords.length) return res.status(400).json({ error: "No buyer keywords found" });

    // 3. Mark Start Time (Buffer: 10s ago)
    const startTime = new Date(Date.now() - 10000);

    // 4. Run Both Services in Parallel (Wait for both)
    await Promise.allSettled([
      fetch(`${process.env.AI_SERVICE_URL}/reddit/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, keywords }),
      }),
      fetch(`${process.env.AI_SERVICE_URL}/quora/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, keywords }),
      })
    ]);

    // 5. Count ALL new posts (Reddit + Quora)
    const [newReddit] = await db
      .select({ count: sql<number>`cast(count(*) as int)` })
      .from(redditPosts)
      .where(and(eq(redditPosts.userId, userId), gte(redditPosts.createdAt, startTime)));

    const [newQuora] = await db
      .select({ count: sql<number>`cast(count(*) as int)` })
      .from(quoraPosts)
      .where(and(eq(quoraPosts.userId, userId), gte(quoraPosts.createdAt, startTime)));

    const totalLeads = (newReddit?.count || 0) + (newQuora?.count || 0);
    const totalCost = totalLeads * 2;

    // 6. Deduct Credits
    if (totalCost > 0) {
      await db
        .update(usersTable)
        .set({ credits: sql`${usersTable.credits} - ${totalCost}` })
        .where(eq(usersTable.id, userId));
    }

    return res.json({
      success: true,
      message: "Discovery completed",
      leadsFound: totalLeads,
      creditsDeducted: totalCost,
    });

  } catch (err) {
    console.error("LEAD DISCOVERY RUN ERROR:", err);
    return res.status(500).json({ error: "Scraping failed" });
  }
});

/* ===============================
   FETCH REDDIT POSTS
================================ */
router.get("/reddit/posts", async (req: Request, res: Response) => {
  try {
    const { userId } = req.query as { userId?: string };
    if (!userId) return res.status(400).json({ error: "Missing userId" });

    const rows = await db
      .select({
        id: redditPosts.id,
        userId: redditPosts.userId,
        platform: redditPosts.platform,
        text: redditPosts.text,
        url: redditPosts.url,
        author: redditPosts.author,
        createdAt: redditPosts.createdAt,
        generatedReply: redditAiReplies.generatedReply,
      })
      .from(redditPosts)
      .leftJoin(redditAiReplies, eq(redditPosts.id, redditAiReplies.redditPostId))
      .where(eq(redditPosts.userId, userId))
      .orderBy(desc(redditPosts.createdAt));

    const grouped: Record<string, any> = {};
    for (const row of rows) {
      if (!grouped[row.id]) {
        grouped[row.id] = { ...row, replies: [] };
      }
      if (row.generatedReply) {
        grouped[row.id].replies.push(row.generatedReply);
      }
    }

    return res.json({ success: true, posts: Object.values(grouped) });
  } catch (err) {
    console.error("FETCH REDDIT ERROR:", err);
    return res.status(500).json({ error: "Failed to fetch reddit posts" });
  }
});

/* ===============================
   FETCH QUORA POSTS
================================ */
router.get("/quora/posts", async (req: Request, res: Response) => {
  try {
    const { userId } = req.query as { userId?: string };
    if (!userId) return res.status(400).json({ error: "Missing userId" });

    const rows = await db
      .select({
        id: quoraPosts.id,
        userId: quoraPosts.userId,
        author: quoraPosts.author,
        question: quoraPosts.question,
        url: quoraPosts.url,
        createdAt: quoraPosts.createdAt,
        replyOption1: quoraAiReplies.replyOption1,
        replyOption2: quoraAiReplies.replyOption2,
      })
      .from(quoraPosts)
      .leftJoin(quoraAiReplies, eq(quoraPosts.id, quoraAiReplies.quoraPostId))
      .where(eq(quoraPosts.userId, userId))
      .orderBy(desc(quoraPosts.createdAt))
      .limit(50);

    return res.json({ success: true, posts: rows });
  } catch (err) {
    console.error("FETCH QUORA ERROR:", err);
    return res.status(500).json({ error: "Failed to fetch quora posts" });
  }
});

export default router;