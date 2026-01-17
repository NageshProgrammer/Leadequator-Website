import {
  pgTable,
  varchar,
  text,
  boolean,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";

/* =========================
   USERS
========================= */
export const usersTable = pgTable("users", {
  id: varchar("id", { length: 255 }).primaryKey(),
  email: varchar("email", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }),
  credits: integer("credits").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

/* =========================
   ONBOARDING PROGRESS
========================= */
export const onboardingProgress = pgTable("onboarding_progress", {
  userId: varchar("user_id", { length: 255 }).primaryKey(),
  currentStep: integer("current_step").default(1),
  completed: boolean("completed").default(false),
});

/* =========================
   COMPANY DETAILS
========================= */
export const companyDetails = pgTable("company_details", {
  userId: varchar("user_id", { length: 255 }).primaryKey(),
  companyName: varchar("company_name", { length: 255 }).notNull(),
  websiteUrl: varchar("website_url", { length: 255 }),
  businessEmail: varchar("business_email", { length: 255 }),
  phoneNumber: varchar("phone_number", { length: 50 }),
  industry: varchar("industry", { length: 255 }),
  industryOther: varchar("industry_other", { length: 255 }),
  productDescription: text("product_description"),
});

/* =========================
   TARGET MARKET
========================= */
export const targetMarket = pgTable("target_market", {
  userId: varchar("user_id", { length: 255 }).primaryKey(),
  targetAudience: varchar("target_audience", { length: 255 }),
  targetCountry: varchar("target_country", { length: 255 }),
  targetStateCity: varchar("target_state_city", { length: 255 }),
  businessType: varchar("business_type", { length: 255 }),
});

/* =========================
   BUYER KEYWORDS
========================= */
export const buyerKeywords = pgTable("buyer_keywords", {
  userId: varchar("user_id", { length: 255 }).notNull(),
  keyword: varchar("keyword", { length: 255 }).notNull(),
});

/* =========================
   PLATFORMS TO MONITOR
========================= */
export const platformsToMonitor = pgTable("platforms_to_monitor", {
  userId: varchar("user_id", { length: 255 }).primaryKey(),
  linkedin: boolean("linkedin").default(false),
  twitter: boolean("twitter").default(false),
  reddit: boolean("reddit").default(false),
  quora: boolean("quora").default(false),
  facebook: boolean("facebook").default(false),
});
