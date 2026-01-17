"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("./db");
const schema_1 = require("./config/schema"); // ✅ FIXED PATH
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// --------------------
// Load progress
// --------------------
app.get("/api/onboarding/progress", async (req, res) => {
    try {
        const { userId } = req.query;
        const result = await db_1.db
            .select()
            .from(schema_1.onboardingProgress)
            .where((0, drizzle_orm_1.eq)(schema_1.onboardingProgress.userId, userId))
            .limit(1);
        res.json(result[0] ?? {});
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to load progress" });
    }
});
// --------------------
// Update step
// --------------------
app.post("/api/onboarding/progress", async (req, res) => {
    try {
        const { userId, currentStep } = req.body;
        await db_1.db
            .insert(schema_1.onboardingProgress)
            .values({ userId, currentStep })
            .onConflictDoUpdate({
            target: schema_1.onboardingProgress.userId,
            set: { currentStep },
        });
        res.json({ success: true });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update progress" });
    }
});
// --------------------
// Finish onboarding
// --------------------
app.post("/api/onboarding", async (req, res) => {
    try {
        const { userId, companyData, industryData, targetData, keywordsData, platformsData, } = req.body;
        await db_1.db
            .insert(schema_1.companyDetails)
            .values({
            userId,
            companyName: companyData.companyName,
            websiteUrl: companyData.websiteUrl || null,
            businessEmail: companyData.businessEmail || null,
            phoneNumber: companyData.phoneNumber || null,
            industry: industryData.industry,
            industryOther: industryData.industryOther || null,
            productDescription: industryData.productDescription || null,
        })
            .onConflictDoUpdate({
            target: schema_1.companyDetails.userId,
            set: { companyName: companyData.companyName },
        });
        await db_1.db.insert(schema_1.targetMarket).values({
            userId,
            targetAudience: targetData.targetAudience,
            targetCountry: targetData.targetCountry,
            targetStateCity: targetData.targetStateCity || null,
            businessType: targetData.businessType,
        });
        // Reset keywords
        await db_1.db.delete(schema_1.buyerKeywords).where((0, drizzle_orm_1.eq)(schema_1.buyerKeywords.userId, userId));
        if (keywordsData?.keywords?.length) {
            await db_1.db.insert(schema_1.buyerKeywords).values(keywordsData.keywords.map((k) => ({
                userId,
                keyword: k,
            })));
        }
        await db_1.db
            .insert(schema_1.platformsToMonitor)
            .values({ userId, ...platformsData })
            .onConflictDoUpdate({
            target: schema_1.platformsToMonitor.userId,
            set: platformsData,
        });
        await db_1.db
            .insert(schema_1.onboardingProgress)
            .values({ userId, completed: true, currentStep: 5 })
            .onConflictDoUpdate({
            target: schema_1.onboardingProgress.userId,
            set: { completed: true, currentStep: 5 },
        });
        res.json({ success: true });
    }
    catch (err) {
        console.error("Onboarding error:", err);
        res.status(500).json({ error: "Onboarding failed" });
    }
});
// --------------------
// User sync
// --------------------
app.post("/api/users/sync", async (req, res) => {
    try {
        const { clerkId, email, name } = req.body;
        if (!clerkId || !email) {
            return res.status(400).json({ error: "Missing data" });
        }
        const existing = await db_1.db
            .select()
            .from(schema_1.usersTable)
            .where((0, drizzle_orm_1.eq)(schema_1.usersTable.id, clerkId))
            .limit(1);
        if (existing.length === 0) {
            await db_1.db.insert(schema_1.usersTable).values({
                id: clerkId,
                email,
                name,
                credits: 20,
            });
        }
        res.json({ success: true });
    }
    catch (err) {
        console.error("User sync error:", err);
        res.status(500).json({ error: "User sync failed" });
    }
});
// --------------------
app.listen(4000, () => {
    console.log("API running on http://localhost:4000");
});
