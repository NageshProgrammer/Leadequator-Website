import { Router, Request, Response } from "express";
import { db } from "../db.js";
import { buyerKeywords } from "../config/schema.js";
import { eq } from "drizzle-orm";

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

    res.json({
      keywords: rows.map((r) => r.keyword),
    });
  } catch (err) {
    console.error("Fetch keywords error:", err);
    res.status(500).json({ error: "Failed to fetch keywords" });
  }
});

/* ===============================
   SCRAPE REDDIT (AI SERVICE)
================================ */
router.post("/scrape", async (req: Request, res: Response) => {
  try {
    const { keywords } = req.body;

    if (!Array.isArray(keywords) || keywords.length === 0) {
      return res.status(400).json({ error: "Invalid keywords" });
    }

    const aiRes = await fetch(`${process.env.AI_SERVICE_URL}/scrape-reddit/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(keywords),
    });

    if (!aiRes.ok) {
      const text = await aiRes.text();
      console.error("AI service response:", text);
      return res.status(500).json({ error: "AI service failed" });
    }

    const data = await aiRes.json();

    // ⏭️ NEXT STEP (later):
    // here we will insert Reddit posts into NeonDB

    res.json(data);
  } catch (err) {
    console.error("AI Service Error:", err);
    res.status(500).json({ error: "AI service failed" });
  }
});

export default router;
