import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, json, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session table for express-session (managed by connect-pg-simple)
export const sessions = pgTable("session", {
  sid: varchar("sid").primaryKey(),
  sess: json("sess").notNull(),
  expire: timestamp("expire").notNull(),
});

// Password reset tokens
export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull(),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  used: boolean("used").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPasswordResetTokenSchema = createInsertSchema(passwordResetTokens).omit({
  id: true,
  used: true,
  createdAt: true,
});

export type InsertPasswordResetToken = z.infer<typeof insertPasswordResetTokenSchema>;
export type PasswordResetToken = typeof passwordResetTokens.$inferSelect;

// Admin users for CMS access
export const adminUsers = pgTable("admin_users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  role: text("role").default("admin"),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertAdminUserSchema = createInsertSchema(adminUsers).omit({
  id: true,
  lastLogin: true,
  createdAt: true,
});

export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;
export type AdminUser = typeof adminUsers.$inferSelect;

// Events table for editable events
export const events = pgTable("events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  date: text("date").notNull(),
  time: text("time").notNull(),
  location: text("location").notNull(),
  description: text("description").notNull(),
  price: text("price"),
  isUpcoming: boolean("is_upcoming").default(true),
  isActive: boolean("is_active").default(true),
  imageUrl: text("image_url"),
  featured: boolean("featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = typeof events.$inferSelect;

// Merchandise items table
export const merchItems = pgTable("merch_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  title: text("title"),
  description: text("description").notNull(),
  price: text("price").notNull(),
  imageUrl: text("image_url").notNull(),
  sizes: text("sizes"),
  colors: text("colors"),
  colorOptions: text("color_options"),
  isActive: boolean("is_active").default(true),
  isAvailable: boolean("is_available").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertMerchItemSchema = createInsertSchema(merchItems).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertMerchItem = z.infer<typeof insertMerchItemSchema>;
export type MerchItem = typeof merchItems.$inferSelect;

// Founders/team members table
export const founders = pgTable("founders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  title: text("title"),
  bio: text("bio").notNull(),
  pullQuote: text("pull_quote"),
  imageUrl: text("image_url"),
  order: text("order").default("0"),
  displayOrder: text("display_order").default("0"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertFounderSchema = createInsertSchema(founders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertFounder = z.infer<typeof insertFounderSchema>;
export type Founder = typeof founders.$inferSelect;

// Media links table
export const mediaLinks = pgTable("media_links", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: text("type").notNull().default("video"),
  title: text("title"),
  description: text("description"),
  url: text("url").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  featured: boolean("featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertMediaLinkSchema = createInsertSchema(mediaLinks).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertMediaLink = z.infer<typeof insertMediaLinkSchema>;
export type MediaLinkRecord = typeof mediaLinks.$inferSelect;
export type MediaLink = typeof mediaLinks.$inferSelect;

// Gallery videos for the "Experience the Energy" carousel
export const galleryVideos = pgTable("gallery_videos", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title"),
  videoUrl: text("video_url").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  sortOrder: integer("sort_order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertGalleryVideoSchema = createInsertSchema(galleryVideos).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertGalleryVideo = z.infer<typeof insertGalleryVideoSchema>;
export type GalleryVideo = typeof galleryVideos.$inferSelect;

// Site settings table for hero content and other global settings
export const siteSettings = pgTable("site_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertSiteSettingSchema = createInsertSchema(siteSettings).omit({
  id: true,
  updatedAt: true,
});

export type InsertSiteSetting = z.infer<typeof insertSiteSettingSchema>;
export type SiteSetting = typeof siteSettings.$inferSelect;

// Newsletter subscribers
export const newsletters = pgTable("newsletters", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  referralSource: text("referral_source"),
  subscribedAt: timestamp("subscribed_at").defaultNow(),
});

export const insertNewsletterSchema = createInsertSchema(newsletters).omit({
  id: true,
  subscribedAt: true,
});

export type InsertNewsletter = z.infer<typeof insertNewsletterSchema>;
export type Newsletter = typeof newsletters.$inferSelect;

// Event sign-ups
export const signups = pgTable("signups", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  message: text("message"),
  referralSource: text("referral_source"),
  eventId: text("event_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertSignupSchema = createInsertSchema(signups).omit({
  id: true,
  createdAt: true,
});

export type InsertSignup = z.infer<typeof insertSignupSchema>;
export type Signup = typeof signups.$inferSelect;

// Event reviews
export const reviews = pgTable("reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  eventAttended: text("event_attended").notNull(),
  rating: text("rating").notNull(),
  review: text("review").notNull(),
  canFeature: text("can_feature").default("yes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
});

export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviews.$inferSelect;

// Contact inquiries (for merchandise)
export const contacts = pgTable("contacts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  itemId: text("item_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertContactSchema = createInsertSchema(contacts).omit({
  id: true,
  createdAt: true,
});

export type InsertContact = z.infer<typeof insertContactSchema>;
export type Contact = typeof contacts.$inferSelect;

// Static data types for frontend (legacy - used for static-data.ts)
export interface StaticDivaBio {
  id: string;
  name: string;
  title: string;
  bio: string;
  pullQuote: string;
  imageUrl: string;
}

export interface StaticPastEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  imageUrl: string;
  featured?: boolean;
}

export interface StaticMerchItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  sizes?: string[];
  colorOptions?: { name: string; imageUrl: string }[];
}

export interface StaticMediaLink {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnailUrl: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}
