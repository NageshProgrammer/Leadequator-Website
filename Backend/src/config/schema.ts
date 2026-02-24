import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  integer,
  timestamp,
  numeric,
  jsonb,
} from "drizzle-orm/pg-core";

/* =========================
   USERS
========================= */
export const usersTable = pgTable("users", {
  id: varchar("id", { length: 255 }).primaryKey(),
  email: varchar("email", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }),
  credits: integer("credits").default(300).notNull(),
  
  plan: varchar("plan", { length: 50 }),
  planCycle: varchar("plan_cycle", { length: 50 }),
  updatedAt: timestamp("updated_at").defaultNow(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/* =========================
   ONBOARDING PROGRESS
========================= */
export const onboardingProgress = pgTable("onboarding_progress", {
  userId: varchar("user_id", { length: 255 }).primaryKey(),
  currentStep: integer("current_step").default(1).notNull(),
  completed: boolean("completed").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
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
  createdAt: timestamp("created_at").defaultNow().notNull(),
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
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/* =========================
   BUYER KEYWORDS
========================= */
export const buyerKeywords = pgTable("buyer_keywords", {
  userId: varchar("user_id", { length: 255 }).notNull(),
  keyword: varchar("keyword", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/* =========================
   PLATFORMS TO MONITOR
========================= */
export const platformsToMonitor = pgTable("platforms_to_monitor", {
  userId: varchar("user_id", { length: 255 }).primaryKey(),
  linkedin: boolean("linkedin").default(false).notNull(),
  twitter: boolean("twitter").default(false).notNull(),
  reddit: boolean("reddit").default(false).notNull(),
  quora: boolean("quora").default(false).notNull(),
  facebook: boolean("facebook").default(false).notNull(),
  youtube: boolean("youtube").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/* =========================
   REDDIT POSTS & REPLIES
========================= */
export const redditPosts = pgTable("reddit_posts", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull(),
  platform: text("platform").default("reddit"),
  text: text("text").notNull(),
  url: text("url").notNull().unique(),
  author: text("author"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const redditAiReplies = pgTable("reddit_ai_replies", {
  id: uuid("id").defaultRandom().primaryKey(),
  redditPostId: uuid("reddit_post_id")
    .references(() => redditPosts.id, { onDelete: "cascade" }),
  intent: text("intent"),
  generatedReply: text("generated_reply"),
  createdAt: timestamp("created_at").defaultNow(),
});

/* =========================
   PYTHON AI COMPATIBILITY
========================= */
export const socialPosts = pgTable("social_posts", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id"),
  platform: text("platform").notNull(),
  text: text("text").notNull(),
  url: text("url").notNull().unique(),
  author: text("author"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const aiReplies = pgTable("ai_replies", {
  id: uuid("id").defaultRandom().primaryKey(),
  postId: uuid("post_id")
    .references(() => socialPosts.id, { onDelete: "cascade" }),
  platform: text("platform"),
  postUrl: text("post_url"),
  replyOption1: text("reply_option_1"),
  replyOption2: text("reply_option_2"),
  approved: boolean("approved").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

/* =========================
   QUORA POSTS & REPLIES
========================= */
export const quoraPosts = pgTable("quora_posts", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull(),
  platform: text("platform").default("quora").notNull(),
  question: text("question").notNull(),
  url: text("url").notNull().unique(),
  author: text("author"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const quoraAiReplies = pgTable("quora_ai_replies", {
  id: uuid("id").defaultRandom().primaryKey(),
  quoraPostId: uuid("quora_post_id")
    .references(() => quoraPosts.id, { onDelete: "cascade" })
    .notNull(),
  replyOption1: text("reply_option_1").notNull(),
  replyOption2: text("reply_option_2").notNull(),
  approved: boolean("approved").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/* =========================
   USER SUBSCRIPTIONS (UPDATED FOR CASHFREE)
========================= */
export const userSubscriptions = pgTable("user_subscriptions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  planName: varchar("plan_name", { length: 50 }).notNull(), 
  billingCycle: varchar("billing_cycle", { length: 20 }).notNull(), 
  currency: varchar("currency", { length: 10 }).notNull(),
  amountPaid: numeric("amount_paid", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status", { length: 20 }).notNull(), 
  startDate: timestamp("start_date").defaultNow().notNull(),
  endDate: timestamp("end_date").notNull(),
  
  // Cashfree Tracking Columns
  cashfreeOrderId: varchar("cashfree_order_id", { length: 255 }).notNull(),
  cashfreeSessionId: varchar("cashfree_session_id", { length: 255 }),
  cashfreeRawResponse: jsonb("cashfree_raw_response"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
});