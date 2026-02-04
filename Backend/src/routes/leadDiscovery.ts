import { Router, Request, Response } from "express";
import { db } from "../db.js";
import { buyerKeywords } from "../config/schema.js";
import { eq } from "drizzle-orm";

const router = Router();

/* =====================================
   GET BUYER KEYWORDS (DB)
===================================== */
router.get("/keywords", async (req: Request, res: Response) => {
  try {
    const { userId } = req.query as { userId: string };

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
  } catch (err) {
    console.error("KEYWORD FETCH ERROR:", err);
    res.status(500).json({ error: "Failed to fetch keywords" });
  }
});

/* =====================================
   RUN REDDIT SCRAPING (STEP 1 ONLY)
===================================== */
router.post("/reddit/run", async (req: Request, res: Response) => {
  try {
    const { userId } = req.body as { userId: string };

    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }

    // 1️⃣ Fetch keywords from DB
    const rows = await db
      .select()
      .from(buyerKeywords)
      .where(eq(buyerKeywords.userId, userId));

    const keywords = rows.map((r) => r.keyword);

    if (!keywords.length) {
      return res.status(400).json({ error: "No keywords found" });
    }

    // 2️⃣ PLACEHOLDER: Reddit scraping logic
    // ------------------------------------
    // Here you will later plug:
    // - Reddit API
    // - Pushshift
    // - Manual scraper
    //
    // For now we simulate success

    console.log("🔎 Running Reddit scraping for keywords:", keywords);

    // 3️⃣ Return success
    res.json({
      success: true,
      message: "Reddit scraping triggered successfully",
      keywords,
    });
  } catch (err) {
    console.error("REDDIT SCRAPE ERROR:", err);
    res.status(500).json({ error: "Reddit scraping failed" });
  }
});

export default router;
