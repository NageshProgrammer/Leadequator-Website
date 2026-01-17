"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.platformsToMonitor = exports.buyerKeywords = exports.targetMarket = exports.companyDetails = exports.onboardingProgress = exports.usersTable = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
/* =========================
   USERS
========================= */
exports.usersTable = (0, pg_core_1.pgTable)("users", {
    id: (0, pg_core_1.varchar)("id", { length: 255 }).primaryKey(),
    email: (0, pg_core_1.varchar)("email", { length: 255 }).notNull(),
    name: (0, pg_core_1.varchar)("name", { length: 255 }),
    credits: (0, pg_core_1.integer)("credits").default(0),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
/* =========================
   ONBOARDING PROGRESS
========================= */
exports.onboardingProgress = (0, pg_core_1.pgTable)("onboarding_progress", {
    userId: (0, pg_core_1.varchar)("user_id", { length: 255 }).primaryKey(),
    currentStep: (0, pg_core_1.integer)("current_step").default(1),
    completed: (0, pg_core_1.boolean)("completed").default(false),
});
/* =========================
   COMPANY DETAILS
========================= */
exports.companyDetails = (0, pg_core_1.pgTable)("company_details", {
    userId: (0, pg_core_1.varchar)("user_id", { length: 255 }).primaryKey(),
    companyName: (0, pg_core_1.varchar)("company_name", { length: 255 }).notNull(),
    websiteUrl: (0, pg_core_1.varchar)("website_url", { length: 255 }),
    businessEmail: (0, pg_core_1.varchar)("business_email", { length: 255 }),
    phoneNumber: (0, pg_core_1.varchar)("phone_number", { length: 50 }),
    industry: (0, pg_core_1.varchar)("industry", { length: 255 }),
    industryOther: (0, pg_core_1.varchar)("industry_other", { length: 255 }),
    productDescription: (0, pg_core_1.text)("product_description"),
});
/* =========================
   TARGET MARKET
========================= */
exports.targetMarket = (0, pg_core_1.pgTable)("target_market", {
    userId: (0, pg_core_1.varchar)("user_id", { length: 255 }).primaryKey(),
    targetAudience: (0, pg_core_1.varchar)("target_audience", { length: 255 }),
    targetCountry: (0, pg_core_1.varchar)("target_country", { length: 255 }),
    targetStateCity: (0, pg_core_1.varchar)("target_state_city", { length: 255 }),
    businessType: (0, pg_core_1.varchar)("business_type", { length: 255 }),
});
/* =========================
   BUYER KEYWORDS
========================= */
exports.buyerKeywords = (0, pg_core_1.pgTable)("buyer_keywords", {
    userId: (0, pg_core_1.varchar)("user_id", { length: 255 }).notNull(),
    keyword: (0, pg_core_1.varchar)("keyword", { length: 255 }).notNull(),
});
/* =========================
   PLATFORMS TO MONITOR
========================= */
exports.platformsToMonitor = (0, pg_core_1.pgTable)("platforms_to_monitor", {
    userId: (0, pg_core_1.varchar)("user_id", { length: 255 }).primaryKey(),
    linkedin: (0, pg_core_1.boolean)("linkedin").default(false),
    twitter: (0, pg_core_1.boolean)("twitter").default(false),
    reddit: (0, pg_core_1.boolean)("reddit").default(false),
    quora: (0, pg_core_1.boolean)("quora").default(false),
    facebook: (0, pg_core_1.boolean)("facebook").default(false),
});
