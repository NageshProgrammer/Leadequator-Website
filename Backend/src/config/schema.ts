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
   USERS (Clerk compatible)
========================= */
export const usersTable = pgTable("users", {
  id: varchar("id", { length: 255 }).primaryKey(), // Clerk userId
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  credits: integer("credits").default(300),
  
  // ✅ SUBSCRIPTION FIELDS
  plan: varchar("plan", { length: 50 }).default("FREE"), // "PILOT", "SCALE"
  planCycle: varchar("plan_cycle", { length: 20 }),      // "MONTHLY", "YEARLY"
  updatedAt: timestamp("updated_at").defaultNow(),
});

/* =========================
   USER SUBSCRIPTIONS (History)
========================= */
export const userSubscriptions = pgTable("user_subscriptions", {
  id: uuid("id").defaultRandom().primaryKey(),

  // ⚠️ FIXED: Changed from uuid to varchar to match Clerk ID format
  userId: varchar("user_id", { length: 255 }).notNull(),

  // PLAN INFO
  planName: varchar("plan_name", { length: 50 }).notNull(), 
  billingCycle: varchar("billing_cycle", { length: 20 }).notNull(), 
  currency: varchar("currency", { length: 10 }).notNull(),
  amountPaid: numeric("amount_paid", { precision: 10, scale: 2 }).notNull(),

  // STATUS
  status: varchar("status", { length: 20 }).notNull(), 
  
  startDate: timestamp("start_date").defaultNow().notNull(),
  endDate: timestamp("end_date").notNull(),

  // PAYPAL INFO
  paypalOrderId: varchar("paypal_order_id", { length: 255 }).notNull(),
  paypalCaptureId: varchar("paypal_capture_id", { length: 255 }),
  paypalRawResponse: jsonb("paypal_raw_response"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/* =========================
   REMAINING TABLES (Keep as is)
========================= */
export const onboardingProgress = pgTable("onboarding_progress", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull().unique(),
  currentStep: integer("current_step").default(1).notNull(),
  completed: boolean("completed").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const companyDetails = pgTable("company_details", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull().unique(),
  companyName: varchar("company_name", { length: 255 }).notNull(),
  websiteUrl: varchar("website_url", { length: 255 }),
  businessEmail: varchar("business_email", { length: 255 }),
  phoneNumber: varchar("phone_number", { length: 50 }),
  industry: varchar("industry", { length: 255 }),
  industryOther: varchar("industry_other", { length: 255 }),
  productDescription: text("product_description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
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

// Assuming redditPosts and quoraPosts are defined elsewhere or below as in your previous code
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
  redditPostId: uuid("reddit_post_id").references(() => redditPosts.id, { onDelete: "cascade" }),
  intent: text("intent"),
  generatedReply: text("generated_reply"),
  createdAt: timestamp("created_at").defaultNow(),
});

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
  quoraPostId: uuid("quora_post_id").references(() => quoraPosts.id, { onDelete: "cascade" }).notNull(),
  replyOption1: text("reply_option_1").notNull(),
  replyOption2: text("reply_option_2").notNull(),
  approved: boolean("approved").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});