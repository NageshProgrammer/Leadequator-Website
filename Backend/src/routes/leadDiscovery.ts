import { Router, Request, Response } from "express";
import { db } from "../db.js";
// 1. Ensure usersTable is imported
import { 
  buyerKeywords, 
  redditPosts, 
  quoraPosts, 
  usersTable, 
  quoraAiReplies, 
  redditAiReplies 
} from "../config/schema.js";
import { eq, desc } from "drizzle-orm";

const router = Router();

/* ===============================
   GET USER CREDITS (NEW ENDPOINT)
================================ */
router.get("/user/credits", async (req: Request, res: Response) => {
  try {
    const { userId } = req.query as { userId?: string };

    if (!userId || typeof userId !== "string") {
      return res.status(400).json({ error: "Missing userId" });
    }

    // Fetch user record
    const userRecord = await db
      .select({ credits: usersTable.credits })
      .from(usersTable)
      .where(eq(usersTable.id, userId))
      .limit(1);

    // If user doesn't exist in DB yet, return 0
    const currentCredits = userRecord.length > 0 ? userRecord[0].credits : 0;

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
   RUN REDDIT SCRAPING (TRIGGER)
================================ */
router.post("/reddit/run", async (req: Request, res: Response) => {
  try {
    const { userId, forceLogin } = req.body as {
      userId?: string;
      forceLogin?: boolean;
    };

    if (!userId || typeof userId !== "string") {
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

    // 🔥 Fire & forget AI service (no change)
    fetch(`${process.env.AI_SERVICE_URL}/reddit/run`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        keywords,
        force_login: !!forceLogin,
      }),
    }).catch((err) => {
      console.error("AI SERVICE REDDIT ERROR:", err);
    });

    return res.json({
      success: true,
      message: "Reddit scraping triggered successfully",
    });
  } catch (err) {
    console.error("REDDIT RUN ERROR:", err);
    return res.status(500).json({ error: "Reddit scraping failed" });
  }
});

/* ===============================
   FETCH REDDIT POSTS (WITH REPLIES)
================================ */
router.get("/reddit/posts", async (req: Request, res: Response) => {
  try {
    const { userId } = req.query as { userId?: string };

    if (!userId || typeof userId !== "string") {
      return res.status(400).json({ error: "Missing userId" });
    }

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
      .leftJoin(
        redditAiReplies,
        eq(redditPosts.id, redditAiReplies.redditPostId)
      )
      .where(eq(redditPosts.userId, userId))
      .orderBy(desc(redditPosts.createdAt));

    // 🔥 Group replies per post
    const grouped: Record<string, any> = {};

    for (const row of rows) {
      if (!grouped[row.id]) {
        grouped[row.id] = {
          id: row.id,
          userId: row.userId,
          platform: row.platform,
          text: row.text,
          url: row.url,
          author: row.author,
          createdAt: row.createdAt,
          replies: [],
        };
      }

      if (row.generatedReply) {
        grouped[row.id].replies.push(row.generatedReply);
      }
    }

    return res.json({
      success: true,
      posts: Object.values(grouped),
    });

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

    if (!userId || typeof userId !== "string") {
      return res.status(400).json({ error: "Missing userId" });
    }

    // 1️⃣ Fetch keywords for this user
    const rows = await db
      .select()
      .from(buyerKeywords)
      .where(eq(buyerKeywords.userId, userId));

    const keywords = rows.map((r) => r.keyword);

    if (!keywords.length) {
      return res.status(400).json({ error: "No buyer keywords found" });
    }

    // 2️⃣ WAIT for AI service (not fire & forget)
    const aiResponse = await fetch(
      `${process.env.AI_SERVICE_URL}/quora/run`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          keywords,
        }),
      }
    );

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("AI SERVICE ERROR:", errorText);
      return res.status(500).json({ error: errorText });
    }

    const aiData = await aiResponse.json();

    return res.json({
      success: true,
      aiResult: aiData,
    });

  } catch (err) {
    console.error("QUORA RUN ERROR:", err);
    return res.status(500).json({ error: "Quora scraping failed" });
  }
});

/* ===============================
   FETCH QUORA POSTS (USER SAFE)
================================ */
router.get("/quora/posts", async (req: Request, res: Response) => {
  try {
    const { userId } = req.query as { userId?: string };

    if (!userId || typeof userId !== "string") {
      return res.status(400).json({ error: "Missing userId" });
    }

    // Perform a Left Join to get AI replies along with the posts
    const postsWithReplies = await db
      .select({
        // Select all post fields
        id: quoraPosts.id,
        userId: quoraPosts.userId,
        author: quoraPosts.author,
        question: quoraPosts.question,
        url: quoraPosts.url,
        createdAt: quoraPosts.createdAt,
        // Select AI reply fields
        replyOption1: quoraAiReplies.replyOption1,
        replyOption2: quoraAiReplies.replyOption2,
      })
      .from(quoraPosts)
      .leftJoin(
        quoraAiReplies, 
        eq(quoraPosts.id, quoraAiReplies.quoraPostId)
      )
      .where(eq(quoraPosts.userId, userId))
      .orderBy(desc(quoraPosts.createdAt))
      .limit(50);

    return res.json({
      success: true,
      posts: postsWithReplies,
    });
  } catch (err) {
    console.error("FETCH QUORA ERROR:", err);
    return res.status(500).json({ error: "Failed to fetch quora posts" });
  }
});

/* ===============================
   RUN BOTH SCRAPERS
================================ */
router.post("/run", async (req: Request, res: Response) => {
  try {
    const { userId } = req.body as { userId?: string };

    if (!userId || typeof userId !== "string") {
      return res.status(400).json({ error: "Missing userId" });
    }

    // 1️⃣ Fetch keywords
    const rows = await db
      .select()
      .from(buyerKeywords)
      .where(eq(buyerKeywords.userId, userId));

    const keywords = rows.map((r) => r.keyword);

    if (!keywords.length) {
      return res.status(400).json({ error: "No buyer keywords found" });
    }

    // 2️⃣ Run Reddit scraper (WAIT)
    const redditResponse = await fetch(
      `${process.env.AI_SERVICE_URL}/reddit/run`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, keywords }),
      }
    );

    if (!redditResponse.ok) {
      console.error("Reddit scraper failed");
    }

    // 3️⃣ Run Quora scraper (WAIT)
    const quoraResponse = await fetch(
      `${process.env.AI_SERVICE_URL}/quora/run`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, keywords }),
      }
    );

    if (!quoraResponse.ok) {
      console.error("Quora scraper failed");
    }

    return res.json({
      success: true,
      message: "Reddit and Quora scraping completed",
    });

  } catch (err) {
    console.error("LEAD DISCOVERY RUN ERROR:", err);
    return res.status(500).json({ error: "Scraping failed" });
  }
});

export default router;