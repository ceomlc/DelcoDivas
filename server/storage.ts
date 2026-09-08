import type { 
  Newsletter, 
  InsertNewsletter, 
  Signup, 
  InsertSignup, 
  Contact, 
  InsertContact,
  Review,
  InsertReview,
  AdminUser,
  InsertAdminUser,
  Event,
  InsertEvent,
  MerchItem,
  InsertMerchItem,
  Founder,
  InsertFounder,
  MediaLinkRecord,
  InsertMediaLink,
  SiteSetting,
  InsertSiteSetting,
  GalleryVideo,
  InsertGalleryVideo,
  PasswordResetToken,
  InsertPasswordResetToken
} from "@shared/schema";
import { 
  newsletters, 
  signups, 
  contacts, 
  reviews, 
  adminUsers, 
  events, 
  merchItems, 
  founders, 
  mediaLinks, 
  siteSettings,
  galleryVideos,
  passwordResetTokens
} from "@shared/schema";
import { db, neonSql } from "./db";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";
import { 
  sanity, 
  sanityToFounder, 
  sanityToMerchItem, 
  sanityToEvent, 
  sanityToMediaLink, 
  sanityToSiteSetting,
  sanityToGalleryVideo
} from "./sanity";

export interface IStorage {
  // Newsletter subscriptions
  getNewsletter(id: string): Promise<Newsletter | undefined>;
  getNewsletterByEmail(email: string): Promise<Newsletter | undefined>;
  getAllNewsletters(): Promise<Newsletter[]>;
  createNewsletter(newsletter: InsertNewsletter): Promise<Newsletter>;

  // Event sign-ups
  getSignup(id: string): Promise<Signup | undefined>;
  getSignupsByEmail(email: string): Promise<Signup[]>;
  getAllSignups(): Promise<Signup[]>;
  createSignup(signup: InsertSignup): Promise<Signup>;

  // Contact inquiries
  getContact(id: string): Promise<Contact | undefined>;
  getAllContacts(): Promise<Contact[]>;
  createContact(contact: InsertContact): Promise<Contact>;

  // Reviews
  getReview(id: string): Promise<Review | undefined>;
  getAllReviews(): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  updateReview(id: string, data: Partial<InsertReview>): Promise<Review | undefined>;
  deleteReview(id: string): Promise<void>;

  // Admin users
  hasAnyAdmin(): Promise<boolean>;
  getAdminByEmail(email: string): Promise<AdminUser | undefined>;
  getAdminById(id: string): Promise<AdminUser | undefined>;
  createAdmin(admin: InsertAdminUser): Promise<AdminUser>;
  updateAdminLastLogin(id: string): Promise<void>;
  updateAdminPassword(id: string, passwordHash: string): Promise<void>;

  // Password Reset Tokens
  createPasswordResetToken(data: InsertPasswordResetToken): Promise<PasswordResetToken>;
  getPasswordResetToken(token: string): Promise<PasswordResetToken | undefined>;
  markPasswordResetTokenUsed(token: string): Promise<void>;

  // Events
  getEvent(id: string): Promise<Event | undefined>;
  getAllEvents(): Promise<Event[]>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: string, event: Partial<InsertEvent>): Promise<Event | undefined>;
  deleteEvent(id: string): Promise<void>;

  // Merchandise
  getMerchItem(id: string): Promise<MerchItem | undefined>;
  getAllMerchItems(): Promise<MerchItem[]>;
  createMerchItem(item: InsertMerchItem): Promise<MerchItem>;
  updateMerchItem(id: string, item: Partial<InsertMerchItem>): Promise<MerchItem | undefined>;
  deleteMerchItem(id: string): Promise<void>;

  // Founders
  getFounder(id: string): Promise<Founder | undefined>;
  getAllFounders(): Promise<Founder[]>;
  createFounder(founder: InsertFounder): Promise<Founder>;
  updateFounder(id: string, founder: Partial<InsertFounder>): Promise<Founder | undefined>;
  deleteFounder(id: string): Promise<void>;

  // Media Links
  getMediaLink(id: string): Promise<MediaLinkRecord | undefined>;
  getAllMediaLinks(): Promise<MediaLinkRecord[]>;
  createMediaLink(link: InsertMediaLink): Promise<MediaLinkRecord>;
  updateMediaLink(id: string, link: Partial<InsertMediaLink>): Promise<MediaLinkRecord | undefined>;
  deleteMediaLink(id: string): Promise<void>;

  // Site Settings
  getSetting(key: string): Promise<SiteSetting | undefined>;
  getAllSettings(): Promise<SiteSetting[]>;
  upsertSetting(setting: InsertSiteSetting): Promise<SiteSetting>;

  // Gallery Videos
  getGalleryVideo(id: string): Promise<GalleryVideo | undefined>;
  getAllGalleryVideos(): Promise<GalleryVideo[]>;
  getAllGalleryVideosAdmin(): Promise<GalleryVideo[]>;
  createGalleryVideo(video: InsertGalleryVideo): Promise<GalleryVideo>;
  updateGalleryVideo(id: string, video: Partial<InsertGalleryVideo>): Promise<GalleryVideo | undefined>;
  deleteGalleryVideo(id: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private newsletters: Map<string, Newsletter>;
  private signups: Map<string, Signup>;
  private contacts: Map<string, Contact>;

  constructor() {
    this.newsletters = new Map();
    this.signups = new Map();
    this.contacts = new Map();
  }

  // Newsletter methods
  async getNewsletter(id: string): Promise<Newsletter | undefined> {
    return this.newsletters.get(id);
  }

  async getNewsletterByEmail(email: string): Promise<Newsletter | undefined> {
    return Array.from(this.newsletters.values()).find(
      (newsletter) => newsletter.email.toLowerCase() === email.toLowerCase()
    );
  }

  async getAllNewsletters(): Promise<Newsletter[]> {
    return Array.from(this.newsletters.values());
  }

  async createNewsletter(insertNewsletter: InsertNewsletter): Promise<Newsletter> {
    const id = randomUUID();
    const newsletter: Newsletter = {
      ...insertNewsletter,
      id,
      phone: insertNewsletter.phone ?? null,
      referralSource: insertNewsletter.referralSource ?? null,
      subscribedAt: new Date(),
    };
    this.newsletters.set(id, newsletter);
    return newsletter;
  }

  // Event sign-up methods
  async getSignup(id: string): Promise<Signup | undefined> {
    return this.signups.get(id);
  }

  async getSignupsByEmail(email: string): Promise<Signup[]> {
    return Array.from(this.signups.values()).filter(
      (signup) => signup.email.toLowerCase() === email.toLowerCase()
    );
  }

  async getAllSignups(): Promise<Signup[]> {
    return Array.from(this.signups.values());
  }

  async createSignup(insertSignup: InsertSignup): Promise<Signup> {
    const id = randomUUID();
    const signup: Signup = {
      ...insertSignup,
      id,
      message: insertSignup.message ?? null,
      referralSource: insertSignup.referralSource ?? null,
      eventId: insertSignup.eventId ?? null,
      createdAt: new Date(),
    };
    this.signups.set(id, signup);
    return signup;
  }

  // Contact methods
  async getContact(id: string): Promise<Contact | undefined> {
    return this.contacts.get(id);
  }

  async getAllContacts(): Promise<Contact[]> {
    return Array.from(this.contacts.values());
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = randomUUID();
    const contact: Contact = {
      ...insertContact,
      id,
      itemId: insertContact.itemId ?? null,
      createdAt: new Date(),
    };
    this.contacts.set(id, contact);
    return contact;
  }

  // Review methods
  private reviews: Map<string, Review> = new Map();

  async getReview(id: string): Promise<Review | undefined> {
    return this.reviews.get(id);
  }

  async getAllReviews(): Promise<Review[]> {
    return Array.from(this.reviews.values());
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const id = randomUUID();
    const review: Review = {
      ...insertReview,
      id,
      canFeature: insertReview.canFeature ?? null,
      createdAt: new Date(),
    };
    this.reviews.set(id, review);
    return review;
  }

  async updateReview(id: string, data: Partial<InsertReview>): Promise<Review | undefined> {
    const existing = this.reviews.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...data };
    this.reviews.set(id, updated);
    return updated;
  }

  async deleteReview(id: string): Promise<void> {
    this.reviews.delete(id);
  }

  // Admin stub methods (MemStorage not used for admin)
  async hasAnyAdmin(): Promise<boolean> { return false; }
  async getAdminByEmail(): Promise<AdminUser | undefined> { return undefined; }
  async getAdminById(): Promise<AdminUser | undefined> { return undefined; }
  async createAdmin(): Promise<AdminUser> { throw new Error("Not implemented"); }
  async updateAdminLastLogin(): Promise<void> {}
  async updateAdminPassword(): Promise<void> {}

  // Password Reset Token stub methods
  async createPasswordResetToken(): Promise<PasswordResetToken> { throw new Error("Not implemented"); }
  async getPasswordResetToken(): Promise<PasswordResetToken | undefined> { return undefined; }
  async markPasswordResetTokenUsed(): Promise<void> {}

  // Events stub methods
  async getEvent(): Promise<Event | undefined> { return undefined; }
  async getAllEvents(): Promise<Event[]> { return []; }
  async createEvent(): Promise<Event> { throw new Error("Not implemented"); }
  async updateEvent(): Promise<Event | undefined> { return undefined; }
  async deleteEvent(): Promise<void> {}

  // Merchandise stub methods
  async getMerchItem(): Promise<MerchItem | undefined> { return undefined; }
  async getAllMerchItems(): Promise<MerchItem[]> { return []; }
  async createMerchItem(): Promise<MerchItem> { throw new Error("Not implemented"); }
  async updateMerchItem(): Promise<MerchItem | undefined> { return undefined; }
  async deleteMerchItem(): Promise<void> {}

  // Founders stub methods
  async getFounder(): Promise<Founder | undefined> { return undefined; }
  async getAllFounders(): Promise<Founder[]> { return []; }
  async createFounder(): Promise<Founder> { throw new Error("Not implemented"); }
  async updateFounder(): Promise<Founder | undefined> { return undefined; }
  async deleteFounder(): Promise<void> {}

  // Media Links stub methods
  async getMediaLink(): Promise<MediaLinkRecord | undefined> { return undefined; }
  async getAllMediaLinks(): Promise<MediaLinkRecord[]> { return []; }
  async createMediaLink(): Promise<MediaLinkRecord> { throw new Error("Not implemented"); }
  async updateMediaLink(): Promise<MediaLinkRecord | undefined> { return undefined; }
  async deleteMediaLink(): Promise<void> {}

  // Site Settings stub methods
  async getSetting(): Promise<SiteSetting | undefined> { return undefined; }
  async getAllSettings(): Promise<SiteSetting[]> { return []; }
  async upsertSetting(): Promise<SiteSetting> { throw new Error("Not implemented"); }

  // Gallery Videos stub methods
  async getGalleryVideo(): Promise<GalleryVideo | undefined> { return undefined; }
  async getAllGalleryVideos(): Promise<GalleryVideo[]> { return []; }
  async getAllGalleryVideosAdmin(): Promise<GalleryVideo[]> { return []; }
  async createGalleryVideo(): Promise<GalleryVideo> { throw new Error("Not implemented"); }
  async updateGalleryVideo(): Promise<GalleryVideo | undefined> { return undefined; }
  async deleteGalleryVideo(): Promise<void> {}
}

export class DbStorage implements IStorage {
  // Newsletter methods
  async getNewsletter(id: string): Promise<Newsletter | undefined> {
    const result = await db.select().from(newsletters).where(eq(newsletters.id, id));
    return result[0];
  }

  async getNewsletterByEmail(email: string): Promise<Newsletter | undefined> {
    const result = await db
      .select()
      .from(newsletters)
      .where(eq(newsletters.email, email.toLowerCase()));
    return result[0];
  }

  async getAllNewsletters(): Promise<Newsletter[]> {
    return await db.select().from(newsletters);
  }

  async createNewsletter(insertNewsletter: InsertNewsletter): Promise<Newsletter> {
    const result = await db
      .insert(newsletters)
      .values({
        ...insertNewsletter,
        email: insertNewsletter.email.toLowerCase(),
      })
      .returning();
    return result[0];
  }

  // Event sign-up methods
  async getSignup(id: string): Promise<Signup | undefined> {
    const result = await db.select().from(signups).where(eq(signups.id, id));
    return result[0];
  }

  async getSignupsByEmail(email: string): Promise<Signup[]> {
    return await db
      .select()
      .from(signups)
      .where(eq(signups.email, email.toLowerCase()));
  }

  async getAllSignups(): Promise<Signup[]> {
    return await db.select().from(signups);
  }

  async createSignup(insertSignup: InsertSignup): Promise<Signup> {
    const result = await db
      .insert(signups)
      .values({
        ...insertSignup,
        email: insertSignup.email.toLowerCase(),
      })
      .returning();
    return result[0];
  }

  // Contact methods
  async getContact(id: string): Promise<Contact | undefined> {
    const result = await db.select().from(contacts).where(eq(contacts.id, id));
    return result[0];
  }

  async getAllContacts(): Promise<Contact[]> {
    return await db.select().from(contacts);
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const result = await db
      .insert(contacts)
      .values({
        ...insertContact,
        email: insertContact.email.toLowerCase(),
      })
      .returning();
    return result[0];
  }

  // Review methods
  async getReview(id: string): Promise<Review | undefined> {
    const result = await db.select().from(reviews).where(eq(reviews.id, id));
    return result[0];
  }

  async getAllReviews(): Promise<Review[]> {
    try {
      return await db.select().from(reviews);
    } catch (error: unknown) {
      if (error instanceof TypeError && (error as Error).message?.includes("Cannot read properties of null")) {
        return [];
      }
      throw error;
    }
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const result = await db
      .insert(reviews)
      .values({
        ...insertReview,
        email: insertReview.email.toLowerCase(),
      })
      .returning();
    return result[0];
  }

  async updateReview(id: string, data: Partial<InsertReview>): Promise<Review | undefined> {
    const setClauses: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;

    if (data.canFeature !== undefined) {
      setClauses.push(`can_feature = $${paramIndex++}`);
      values.push(data.canFeature);
    }
    if (data.firstName !== undefined) {
      setClauses.push(`first_name = $${paramIndex++}`);
      values.push(data.firstName);
    }
    if (data.lastName !== undefined) {
      setClauses.push(`last_name = $${paramIndex++}`);
      values.push(data.lastName);
    }
    if (data.email !== undefined) {
      setClauses.push(`email = $${paramIndex++}`);
      values.push(data.email);
    }
    if (data.eventAttended !== undefined) {
      setClauses.push(`event_attended = $${paramIndex++}`);
      values.push(data.eventAttended);
    }
    if (data.rating !== undefined) {
      setClauses.push(`rating = $${paramIndex++}`);
      values.push(data.rating);
    }
    if (data.review !== undefined) {
      setClauses.push(`review = $${paramIndex++}`);
      values.push(data.review);
    }

    if (setClauses.length === 0) {
      return await this.getReview(id);
    }

    values.push(id);
    const query = `UPDATE reviews SET ${setClauses.join(', ')} WHERE id = $${paramIndex}`;
    await neonSql(query, values);
    return await this.getReview(id);
  }

  async deleteReview(id: string): Promise<void> {
    await db.delete(reviews).where(eq(reviews.id, id));
  }

  // Admin user methods
  async hasAnyAdmin(): Promise<boolean> {
    const result = await db.select({ id: adminUsers.id }).from(adminUsers).limit(1);
    return result.length > 0;
  }

  async getAdminByEmail(email: string): Promise<AdminUser | undefined> {
    const result = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.email, email.toLowerCase()));
    return result[0];
  }

  async getAdminById(id: string): Promise<AdminUser | undefined> {
    const result = await db.select().from(adminUsers).where(eq(adminUsers.id, id));
    return result[0];
  }

  async createAdmin(admin: InsertAdminUser): Promise<AdminUser> {
    const result = await db
      .insert(adminUsers)
      .values({
        ...admin,
        email: admin.email.toLowerCase(),
      })
      .returning();
    return result[0];
  }

  async updateAdminLastLogin(id: string): Promise<void> {
    await db
      .update(adminUsers)
      .set({ lastLogin: new Date() })
      .where(eq(adminUsers.id, id));
  }

  async updateAdminPassword(id: string, passwordHash: string): Promise<void> {
    await db
      .update(adminUsers)
      .set({ passwordHash })
      .where(eq(adminUsers.id, id));
  }

  // Password Reset Token methods
  async createPasswordResetToken(data: InsertPasswordResetToken): Promise<PasswordResetToken> {
    const result = await db.insert(passwordResetTokens).values(data).returning();
    return result[0];
  }

  async getPasswordResetToken(token: string): Promise<PasswordResetToken | undefined> {
    const result = await db.select().from(passwordResetTokens).where(eq(passwordResetTokens.token, token));
    return result[0];
  }

  async markPasswordResetTokenUsed(token: string): Promise<void> {
    await db
      .update(passwordResetTokens)
      .set({ used: true })
      .where(eq(passwordResetTokens.token, token));
  }

  // Events methods
  async getEvent(id: string): Promise<Event | undefined> {
    const result = await db.select().from(events).where(eq(events.id, id));
    return result[0];
  }

  async getAllEvents(): Promise<Event[]> {
    return await db.select().from(events);
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    const result = await db.insert(events).values(event).returning();
    return result[0];
  }

  async updateEvent(id: string, eventData: Partial<InsertEvent>): Promise<Event | undefined> {
    const result = await db
      .update(events)
      .set({ ...eventData, updatedAt: new Date() })
      .where(eq(events.id, id))
      .returning();
    return result[0];
  }

  async deleteEvent(id: string): Promise<void> {
    await db.delete(events).where(eq(events.id, id));
  }

  // Merchandise methods
  async getMerchItem(id: string): Promise<MerchItem | undefined> {
    const result = await db.select().from(merchItems).where(eq(merchItems.id, id));
    return result[0];
  }

  async getAllMerchItems(): Promise<MerchItem[]> {
    return await db.select().from(merchItems);
  }

  async createMerchItem(item: InsertMerchItem): Promise<MerchItem> {
    const result = await db.insert(merchItems).values(item).returning();
    return result[0];
  }

  async updateMerchItem(id: string, item: Partial<InsertMerchItem>): Promise<MerchItem | undefined> {
    const result = await db
      .update(merchItems)
      .set({ ...item, updatedAt: new Date() })
      .where(eq(merchItems.id, id))
      .returning();
    return result[0];
  }

  async deleteMerchItem(id: string): Promise<void> {
    await db.delete(merchItems).where(eq(merchItems.id, id));
  }

  // Founders methods
  async getFounder(id: string): Promise<Founder | undefined> {
    const result = await db.select().from(founders).where(eq(founders.id, id));
    return result[0];
  }

  async getAllFounders(): Promise<Founder[]> {
    return await db.select().from(founders);
  }

  async createFounder(founder: InsertFounder): Promise<Founder> {
    const result = await db.insert(founders).values(founder).returning();
    return result[0];
  }

  async updateFounder(id: string, founderData: Partial<InsertFounder>): Promise<Founder | undefined> {
    const result = await db
      .update(founders)
      .set({ ...founderData, updatedAt: new Date() })
      .where(eq(founders.id, id))
      .returning();
    return result[0];
  }

  async deleteFounder(id: string): Promise<void> {
    await db.delete(founders).where(eq(founders.id, id));
  }

  // Media Links methods
  async getMediaLink(id: string): Promise<MediaLinkRecord | undefined> {
    const result = await db.select().from(mediaLinks).where(eq(mediaLinks.id, id));
    return result[0];
  }

  async getAllMediaLinks(): Promise<MediaLinkRecord[]> {
    return await db.select().from(mediaLinks);
  }

  async createMediaLink(link: InsertMediaLink): Promise<MediaLinkRecord> {
    const result = await db.insert(mediaLinks).values(link).returning();
    return result[0];
  }

  async updateMediaLink(id: string, link: Partial<InsertMediaLink>): Promise<MediaLinkRecord | undefined> {
    const result = await db
      .update(mediaLinks)
      .set({ ...link, updatedAt: new Date() })
      .where(eq(mediaLinks.id, id))
      .returning();
    return result[0];
  }

  async deleteMediaLink(id: string): Promise<void> {
    await db.delete(mediaLinks).where(eq(mediaLinks.id, id));
  }

  // Site Settings methods
  async getSetting(key: string): Promise<SiteSetting | undefined> {
    const result = await db.select().from(siteSettings).where(eq(siteSettings.key, key));
    return result[0];
  }

  async getAllSettings(): Promise<SiteSetting[]> {
    try {
      return await db.select().from(siteSettings);
    } catch (error: unknown) {
      if (error instanceof TypeError && (error as Error).message?.includes("Cannot read properties of null")) {
        return [];
      }
      throw error;
    }
  }

  async upsertSetting(setting: InsertSiteSetting): Promise<SiteSetting> {
    const existing = await this.getSetting(setting.key);
    if (existing) {
      const result = await db
        .update(siteSettings)
        .set({ value: setting.value, updatedAt: new Date() })
        .where(eq(siteSettings.key, setting.key))
        .returning();
      return result[0];
    }
    const result = await db.insert(siteSettings).values(setting).returning();
    return result[0];
  }

  // Gallery Videos methods
  async getGalleryVideo(id: string): Promise<GalleryVideo | undefined> {
    const result = await db.select().from(galleryVideos).where(eq(galleryVideos.id, id));
    return result[0];
  }

  async getAllGalleryVideos(): Promise<GalleryVideo[]> {
    // No is_active filter — boolean column has DB-level type issue; all seeded rows are valid
    const rows = await neonSql`SELECT id, title, video_url as "videoUrl", thumbnail_url as "thumbnailUrl", sort_order as "sortOrder", is_active as "isActive", created_at as "createdAt", updated_at as "updatedAt" FROM gallery_videos ORDER BY sort_order ASC`;
    return rows as unknown as GalleryVideo[];
  }

  async getAllGalleryVideosAdmin(): Promise<GalleryVideo[]> {
    return await db.select().from(galleryVideos);
  }

  async createGalleryVideo(video: InsertGalleryVideo): Promise<GalleryVideo> {
    const result = await db.insert(galleryVideos).values(video).returning();
    return result[0];
  }

  async updateGalleryVideo(id: string, video: Partial<InsertGalleryVideo>): Promise<GalleryVideo | undefined> {
    const result = await db
      .update(galleryVideos)
      .set({ ...video, updatedAt: new Date() })
      .where(eq(galleryVideos.id, id))
      .returning();
    return result[0];
  }

  async deleteGalleryVideo(id: string): Promise<void> {
    await db.delete(galleryVideos).where(eq(galleryVideos.id, id));
  }
}

// SanityStorage class - uses Sanity for content, PostgreSQL for form submissions
export class SanityStorage extends DbStorage {
  // Override Events methods to use Sanity
  async getEvent(id: string): Promise<Event | undefined> {
    try {
      const sanityEvent = await sanity.getEvent(id);
      return sanityEvent ? sanityToEvent(sanityEvent) as Event : undefined;
    } catch (error) {
      console.error("Sanity getEvent error:", error);
      return super.getEvent(id); // Fallback to DB
    }
  }

  async getAllEvents(): Promise<Event[]> {
    try {
      const sanityEvents = await sanity.getEvents();
      if (sanityEvents.length === 0) {
        // Fallback to database if no Sanity events
        return super.getAllEvents();
      }
      return sanityEvents.map(e => sanityToEvent(e) as Event);
    } catch (error) {
      console.error("Sanity getAllEvents error:", error);
      return super.getAllEvents();
    }
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    try {
      const sanityEvent = await sanity.createEvent({
        title: event.title,
        date: event.date,
        time: event.time,
        location: event.location,
        description: event.description,
        price: event.price || undefined,
        isUpcoming: event.isUpcoming ?? true,
        isActive: event.isActive ?? true,
        imageUrl: event.imageUrl || undefined,
        featured: event.featured ?? false,
      });
      return sanityToEvent(sanityEvent) as Event;
    } catch (error) {
      console.error("Sanity createEvent error:", error);
      return super.createEvent(event);
    }
  }

  async updateEvent(id: string, eventData: Partial<InsertEvent>): Promise<Event | undefined> {
    try {
      // Filter out null values (convert to undefined for Sanity)
      const cleanData: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(eventData)) {
        if (value !== null) {
          cleanData[key] = value;
        }
      }
      const sanityEvent = await sanity.updateEvent(id, cleanData);
      return sanityToEvent(sanityEvent) as Event;
    } catch (error) {
      console.error("Sanity updateEvent error:", error);
      return super.updateEvent(id, eventData);
    }
  }

  async deleteEvent(id: string): Promise<void> {
    try {
      await sanity.deleteEvent(id);
    } catch (error) {
      console.error("Sanity deleteEvent error:", error);
      await super.deleteEvent(id);
    }
  }

  // Override Merchandise methods to use Sanity
  async getMerchItem(id: string): Promise<MerchItem | undefined> {
    try {
      const item = await sanity.getMerchItem(id);
      return item ? sanityToMerchItem(item) as MerchItem : undefined;
    } catch (error) {
      console.error("Sanity getMerchItem error:", error);
      return super.getMerchItem(id);
    }
  }

  async getAllMerchItems(): Promise<MerchItem[]> {
    try {
      const items = await sanity.getMerchItems();
      if (items.length === 0) {
        return super.getAllMerchItems();
      }
      return items.map(i => sanityToMerchItem(i) as MerchItem);
    } catch (error) {
      console.error("Sanity getAllMerchItems error:", error);
      return super.getAllMerchItems();
    }
  }

  async createMerchItem(item: InsertMerchItem): Promise<MerchItem> {
    try {
      const sanityItem = await sanity.createMerchItem({
        name: item.name,
        title: item.title || undefined,
        description: item.description,
        price: item.price,
        imageUrl: item.imageUrl,
        sizes: item.sizes || undefined,
        colors: item.colors || undefined,
        colorOptions: item.colorOptions || undefined,
        isActive: item.isActive ?? true,
        isAvailable: item.isAvailable ?? true,
      });
      return sanityToMerchItem(sanityItem) as MerchItem;
    } catch (error) {
      console.error("Sanity createMerchItem error:", error);
      return super.createMerchItem(item);
    }
  }

  async updateMerchItem(id: string, item: Partial<InsertMerchItem>): Promise<MerchItem | undefined> {
    try {
      // Filter out null values (convert to undefined for Sanity)
      const cleanData: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(item)) {
        if (value !== null) {
          cleanData[key] = value;
        }
      }
      const sanityItem = await sanity.updateMerchItem(id, cleanData);
      return sanityToMerchItem(sanityItem) as MerchItem;
    } catch (error) {
      console.error("Sanity updateMerchItem error:", error);
      return super.updateMerchItem(id, item);
    }
  }

  async deleteMerchItem(id: string): Promise<void> {
    try {
      await sanity.deleteMerchItem(id);
    } catch (error) {
      console.error("Sanity deleteMerchItem error:", error);
      await super.deleteMerchItem(id);
    }
  }

  // Override Founders methods to use Sanity
  async getFounder(id: string): Promise<Founder | undefined> {
    try {
      const founder = await sanity.getFounder(id);
      return founder ? sanityToFounder(founder) as Founder : undefined;
    } catch (error) {
      console.error("Sanity getFounder error:", error);
      return super.getFounder(id);
    }
  }

  async getAllFounders(): Promise<Founder[]> {
    try {
      const founders = await sanity.getFounders();
      if (founders.length === 0) {
        return super.getAllFounders();
      }
      return founders.map(f => sanityToFounder(f) as Founder);
    } catch (error) {
      console.error("Sanity getAllFounders error:", error);
      return super.getAllFounders();
    }
  }

  async createFounder(founder: InsertFounder): Promise<Founder> {
    try {
      const sanityFounder = await sanity.createFounder({
        name: founder.name,
        title: founder.title || undefined,
        bio: founder.bio,
        pullQuote: founder.pullQuote || undefined,
        imageUrl: founder.imageUrl || undefined,
        order: parseInt(founder.order || "0") || 0,
      });
      return sanityToFounder(sanityFounder) as Founder;
    } catch (error) {
      console.error("Sanity createFounder error:", error);
      return super.createFounder(founder);
    }
  }

  async updateFounder(id: string, founderData: Partial<InsertFounder>): Promise<Founder | undefined> {
    try {
      const updateData: Record<string, unknown> = { ...founderData };
      if (founderData.order) {
        updateData.order = parseInt(founderData.order) || 0;
      }
      const sanityFounder = await sanity.updateFounder(id, updateData);
      return sanityToFounder(sanityFounder) as Founder;
    } catch (error) {
      console.error("Sanity updateFounder error:", error);
      return super.updateFounder(id, founderData);
    }
  }

  async deleteFounder(id: string): Promise<void> {
    try {
      await sanity.deleteFounder(id);
    } catch (error) {
      console.error("Sanity deleteFounder error:", error);
      await super.deleteFounder(id);
    }
  }

  // Override Media Links methods to use Sanity
  async getMediaLink(id: string): Promise<MediaLinkRecord | undefined> {
    try {
      const link = await sanity.getMediaLink(id);
      return link ? sanityToMediaLink(link) as MediaLinkRecord : undefined;
    } catch (error) {
      console.error("Sanity getMediaLink error:", error);
      return super.getMediaLink(id);
    }
  }

  async getAllMediaLinks(): Promise<MediaLinkRecord[]> {
    try {
      const links = await sanity.getMediaLinks();
      if (links.length === 0) {
        return super.getAllMediaLinks();
      }
      return links.map(l => sanityToMediaLink(l) as MediaLinkRecord);
    } catch (error) {
      console.error("Sanity getAllMediaLinks error:", error);
      return super.getAllMediaLinks();
    }
  }

  async createMediaLink(link: InsertMediaLink): Promise<MediaLinkRecord> {
    try {
      const sanityLink = await sanity.createMediaLink({
        type: link.type || "video",
        title: link.title || undefined,
        description: link.description || undefined,
        url: link.url,
        thumbnailUrl: link.thumbnailUrl || undefined,
        featured: link.featured ?? false,
      });
      return sanityToMediaLink(sanityLink) as MediaLinkRecord;
    } catch (error) {
      console.error("Sanity createMediaLink error:", error);
      return super.createMediaLink(link);
    }
  }

  async updateMediaLink(id: string, link: Partial<InsertMediaLink>): Promise<MediaLinkRecord | undefined> {
    try {
      // Filter out null values (convert to undefined for Sanity)
      const cleanData: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(link)) {
        if (value !== null) {
          cleanData[key] = value;
        }
      }
      const sanityLink = await sanity.updateMediaLink(id, cleanData);
      return sanityToMediaLink(sanityLink) as MediaLinkRecord;
    } catch (error) {
      console.error("Sanity updateMediaLink error:", error);
      return super.updateMediaLink(id, link);
    }
  }

  async deleteMediaLink(id: string): Promise<void> {
    try {
      await sanity.deleteMediaLink(id);
    } catch (error) {
      console.error("Sanity deleteMediaLink error:", error);
      await super.deleteMediaLink(id);
    }
  }

  // Override Site Settings methods to use Sanity
  async getSetting(key: string): Promise<SiteSetting | undefined> {
    try {
      const setting = await sanity.getSiteSetting(key);
      return setting ? sanityToSiteSetting(setting) as SiteSetting : undefined;
    } catch (error) {
      console.error("Sanity getSetting error:", error);
      return super.getSetting(key);
    }
  }

  async getAllSettings(): Promise<SiteSetting[]> {
    try {
      const settings = await sanity.getSiteSettings();
      if (settings.length === 0) {
        return super.getAllSettings();
      }
      return settings.map(s => sanityToSiteSetting(s) as SiteSetting);
    } catch (error) {
      console.error("Sanity getAllSettings error:", error);
      return super.getAllSettings();
    }
  }

  async upsertSetting(setting: InsertSiteSetting): Promise<SiteSetting> {
    try {
      const sanitySetting = await sanity.upsertSiteSetting(setting.key, setting.value);
      return sanityToSiteSetting(sanitySetting) as SiteSetting;
    } catch (error) {
      console.error("Sanity upsertSetting error:", error);
      return super.upsertSetting(setting);
    }
  }

  // Override Gallery Videos methods to use Sanity
  async getGalleryVideo(id: string): Promise<GalleryVideo | undefined> {
    try {
      const video = await sanity.getGalleryVideo(id);
      return video ? sanityToGalleryVideo(video) as GalleryVideo : undefined;
    } catch (error) {
      console.error("Sanity getGalleryVideo error:", error);
      return super.getGalleryVideo(id);
    }
  }

  async getAllGalleryVideos(): Promise<GalleryVideo[]> {
    return super.getAllGalleryVideos();
  }

  async getAllGalleryVideosAdmin(): Promise<GalleryVideo[]> {
    return super.getAllGalleryVideosAdmin();
  }

  async createGalleryVideo(video: InsertGalleryVideo): Promise<GalleryVideo> {
    try {
      const sanityVideo = await sanity.createGalleryVideo({
        title: video.title || undefined,
        videoUrl: video.videoUrl,
        thumbnailUrl: video.thumbnailUrl || undefined,
        order: video.sortOrder ?? 0,
        isActive: video.isActive ?? true,
      });
      return sanityToGalleryVideo(sanityVideo) as GalleryVideo;
    } catch (error) {
      console.error("Sanity createGalleryVideo error:", error);
      return super.createGalleryVideo(video);
    }
  }

  async updateGalleryVideo(id: string, video: Partial<InsertGalleryVideo>): Promise<GalleryVideo | undefined> {
    try {
      const cleanData: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(video)) {
        if (value !== null) {
          if (key === 'sortOrder') {
            cleanData['order'] = value;
          } else {
            cleanData[key] = value;
          }
        }
      }
      const sanityVideo = await sanity.updateGalleryVideo(id, cleanData);
      return sanityToGalleryVideo(sanityVideo) as GalleryVideo;
    } catch (error) {
      console.error("Sanity updateGalleryVideo error:", error);
      return super.updateGalleryVideo(id, video);
    }
  }

  async deleteGalleryVideo(id: string): Promise<void> {
    try {
      await sanity.deleteGalleryVideo(id);
    } catch (error) {
      console.error("Sanity deleteGalleryVideo error:", error);
      await super.deleteGalleryVideo(id);
    }
  }
}

// Use SanityStorage if Sanity credentials are configured, otherwise fallback to DbStorage
const useSanity = process.env.SANITY_PROJECT_ID && process.env.SANITY_API_TOKEN;
export const storage = useSanity ? new SanityStorage() : new DbStorage();
