import {
  pgTable,
  varchar,
  integer,
  text,
  boolean,
  timestamp, // Added timestamp import
} from "drizzle-orm/pg-core";

/* =======================
   USERS (Clerk compatible)
======================= */
export const usersTable = pgTable("users", {
  id: varchar("id", { length: 255 }).primaryKey(), // Clerk userId
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  credits: integer("credits").default(300),
  
  // ✅ NEW FIELDS FOR SUBSCRIPTION
  plan: varchar("plan", { length: 50 }).default("FREE"), // e.g., "PILOT", "SCALE"
  planCycle: varchar("plan_cycle", { length: 20 }),      // e.g., "MONTHLY", "YEARLY"
  updatedAt: timestamp("updated_at").defaultNow(),       // To track when they subscribed
});

// ... rest of your schema (onboardingProgress, etc.) remains exactly the same
export const onboardingProgress = pgTable("onboarding_progress", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull().unique(),
  currentStep: integer("current_step").default(1),
  completed: boolean("completed").default(false),
});

export const companyDetails = pgTable("company_details", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull().unique(),
  companyName: varchar("company_name", { length: 255 }).notNull(),
  websiteUrl: varchar("website_url", { length: 255 }),
  businessEmail: varchar("business_email", { length: 255 }),
  phoneNumber: varchar("phone_number", { length: 50 }),
  industry: varchar("industry", { length: 100 }),
  industryOther: text("industry_other"),
  productDescription: text("product_description"),
});

export const targetMarket = pgTable("target_market", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull().unique(),
  targetAudience: text("target_audience"),
  targetCountry: varchar("target_country", { length: 100 }),
  targetStateCity: varchar("target_state_city", { length: 255 }),
  businessType: varchar("business_type", { length: 50 }),
});

export const buyerKeywords = pgTable("buyer_keywords", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  keyword: varchar("keyword", { length: 255 }).notNull(),
});

export const platformsToMonitor = pgTable("platforms_to_monitor", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull().unique(),
  linkedin: boolean("linkedin").default(false),
  twitter: boolean("twitter").default(false),
  reddit: boolean("reddit").default(false),
  facebook: boolean("facebook").default(false),
  quora: boolean("quora").default(false),
  youtube: boolean("youtube").default(false),
});