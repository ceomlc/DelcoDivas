import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertNewsletterSchema, insertSignupSchema, insertContactSchema, insertReviewSchema, insertEventSchema, insertMerchItemSchema, insertFounderSchema, insertMediaLinkSchema, insertSiteSettingSchema, insertGalleryVideoSchema } from "@shared/schema";
import bcrypt from "bcryptjs";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import multer from "multer";
import path from "path";
import fs from "fs";
import { sendNotificationEmail, formatNewsletterNotification, formatSignupNotification, formatContactNotification, formatReviewNotification, sendPasswordResetEmail } from "./email";
import crypto from "crypto";

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const uploadStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage: uploadStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp|svg/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

// Rate limiter for login attempts (5 attempts per 15 minutes)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: "Too many login attempts. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Admin authentication middleware
const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session?.adminId) {
    return res.status(401).json({ message: "Unauthorized. Please log in." });
  }
  next();
};

// Login schema
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve uploaded files statically
  app.use("/uploads", (await import("express")).default.static(uploadsDir));

  // Image upload endpoint (admin only)
  app.post("/api/upload", requireAdmin, upload.single("image"), (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      const url = `/uploads/${req.file.filename}`;
      return res.json({ url, filename: req.file.filename });
    } catch (error) {
      console.error("Upload error:", error);
      return res.status(500).json({ message: "Failed to upload file" });
    }
  });

  // Newsletter subscription endpoint
  app.post("/api/newsletter", async (req, res) => {
    try {
      const data = insertNewsletterSchema.parse(req.body);
      
      // Check if email already exists
      const existing = await storage.getNewsletterByEmail(data.email);
      if (existing) {
        return res.status(400).json({ 
          message: "This email is already subscribed to our newsletter." 
        });
      }

      const newsletter = await storage.createNewsletter(data);
      
      // Send notification email (don't block the response)
      sendNotificationEmail(formatNewsletterNotification(data.email)).catch(err => 
        console.error("Failed to send newsletter notification:", err)
      );
      
      return res.status(201).json({
        message: "Successfully subscribed to the newsletter!",
        data: newsletter,
      });
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({ message: "Failed to subscribe to newsletter" });
    }
  });

  // Event sign-up endpoint
  app.post("/api/signup", async (req, res) => {
    try {
      const data = insertSignupSchema.parse(req.body);
      
      const signup = await storage.createSignup(data);
      
      // Send notification email (don't block the response)
      sendNotificationEmail(formatSignupNotification({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        message: data.message,
        referralSource: data.referralSource,
        eventId: data.eventId,
      })).catch(err => 
        console.error("Failed to send signup notification:", err)
      );
      
      return res.status(201).json({
        message: "Successfully registered for the event!",
        data: signup,
      });
    } catch (error) {
      console.error("Event sign-up error:", error);
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({ message: "Failed to register for event" });
    }
  });

  // Contact/merchandise inquiry endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      const data = insertContactSchema.parse(req.body);
      
      const contact = await storage.createContact(data);
      
      // Send notification email (don't block the response)
      sendNotificationEmail(formatContactNotification({
        name: data.name,
        email: data.email,
        message: data.message,
        itemId: data.itemId,
      })).catch(err => 
        console.error("Failed to send contact notification:", err)
      );
      
      return res.status(201).json({
        message: "Your inquiry has been received!",
        data: contact,
      });
    } catch (error) {
      console.error("Contact inquiry error:", error);
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({ message: "Failed to submit inquiry" });
    }
  });

  // Get all newsletter subscriptions (for admin purposes)
  app.get("/api/newsletters", async (req, res) => {
    try {
      const newsletters = await storage.getAllNewsletters();
      return res.json({ data: newsletters });
    } catch (error) {
      console.error("Get newsletters error:", error);
      return res.status(500).json({ message: "Failed to retrieve newsletters" });
    }
  });

  // Get all event sign-ups (for admin purposes)
  app.get("/api/signups", async (req, res) => {
    try {
      const signups = await storage.getAllSignups();
      return res.json({ data: signups });
    } catch (error) {
      console.error("Get signups error:", error);
      return res.status(500).json({ message: "Failed to retrieve signups" });
    }
  });

  // Get all contact inquiries (for admin purposes)
  app.get("/api/contacts", async (req, res) => {
    try {
      const contacts = await storage.getAllContacts();
      return res.json({ data: contacts });
    } catch (error) {
      console.error("Get contacts error:", error);
      return res.status(500).json({ message: "Failed to retrieve contacts" });
    }
  });

  // Review submission endpoint
  app.post("/api/reviews", async (req, res) => {
    try {
      const data = insertReviewSchema.parse(req.body);
      
      const review = await storage.createReview(data);
      
      // Send notification email (don't block the response)
      sendNotificationEmail(formatReviewNotification({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        eventAttended: data.eventAttended,
        rating: data.rating,
        review: data.review,
        canFeature: data.canFeature,
      })).catch(err => 
        console.error("Failed to send review notification:", err)
      );
      
      return res.status(201).json({
        message: "Thank you for your review!",
        data: review,
      });
    } catch (error) {
      console.error("Review submission error:", error);
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({ message: "Failed to submit review" });
    }
  });

  app.get("/api/reviews", async (req, res) => {
    try {
      const reviews = await storage.getAllReviews();
      const featured = reviews
        .filter((r) => r.canFeature === "yes")
        .map(({ email, ...rest }) => rest);
      return res.json({ data: featured });
    } catch (error) {
      console.error("Get reviews error:", error);
      return res.status(500).json({ message: "Failed to retrieve reviews" });
    }
  });

  // ==================== PUBLIC CONTENT ROUTES ====================
  // These routes allow the public website to fetch content without authentication

  // Public events list
  app.get("/api/events", async (req, res) => {
    try {
      const events = await storage.getAllEvents();
      return res.json({ data: events });
    } catch (error) {
      console.error("Get events error:", error);
      return res.status(500).json({ message: "Failed to retrieve events" });
    }
  });

  // Public merchandise list
  app.get("/api/merchandise", async (req, res) => {
    try {
      const items = await storage.getAllMerchItems();
      return res.json({ data: items });
    } catch (error) {
      console.error("Get merchandise error:", error);
      return res.status(500).json({ message: "Failed to retrieve merchandise" });
    }
  });

  // Public founders list
  app.get("/api/founders", async (req, res) => {
    try {
      const founders = await storage.getAllFounders();
      return res.json({ data: founders });
    } catch (error) {
      console.error("Get founders error:", error);
      return res.status(500).json({ message: "Failed to retrieve founders" });
    }
  });

  // Public media links
  app.get("/api/media", async (req, res) => {
    try {
      const media = await storage.getAllMediaLinks();
      return res.json({ data: media });
    } catch (error) {
      console.error("Get media error:", error);
      return res.status(500).json({ message: "Failed to retrieve media" });
    }
  });

  // Public site settings
  app.get("/api/settings", async (req, res) => {
    try {
      const settings = await storage.getAllSettings();
      return res.json({ data: settings });
    } catch (error) {
      console.error("Get settings error:", error);
      return res.status(500).json({ message: "Failed to retrieve settings" });
    }
  });

  // ==================== ADMIN ROUTES ====================

  // Admin login
  app.post("/api/admin/login", loginLimiter, async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      
      const admin = await storage.getAdminByEmail(email);
      if (!admin) {
        return res.status(401).json({ message: "Invalid email or password." });
      }

      const isValid = await bcrypt.compare(password, admin.passwordHash);
      if (!isValid) {
        return res.status(401).json({ message: "Invalid email or password." });
      }

      // Update last login and set session
      await storage.updateAdminLastLogin(admin.id);
      req.session.adminId = admin.id;
      req.session.adminEmail = admin.email;

      return res.json({ 
        message: "Login successful",
        admin: { id: admin.id, email: admin.email, name: admin.name }
      });
    } catch (error) {
      console.error("Admin login error:", error);
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({ message: "Login failed" });
    }
  });

  // Admin logout
  app.post("/api/admin/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.clearCookie('connect.sid');
      return res.json({ message: "Logged out successfully" });
    });
  });

  // Forgot password - request reset
  app.post("/api/admin/forgot-password", async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      const admin = await storage.getAdminByEmail(email);
      if (!admin) {
        // Don't reveal if email exists or not for security
        return res.json({ message: "If that email exists, a password reset link has been sent." });
      }

      // Generate secure token
      const token = crypto.randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiry

      // Save token to database
      await storage.createPasswordResetToken({
        email: admin.email,
        token,
        expiresAt,
      });

      // Send reset email - use REPLIT_DOMAINS for reliable URL in production
      const replitDomain = process.env.REPLIT_DOMAINS || process.env.REPLIT_DEV_DOMAIN;
      let baseUrl: string;
      if (replitDomain) {
        baseUrl = `https://${replitDomain}`;
      } else {
        const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'https';
        const host = req.headers['x-forwarded-host'] || req.headers['host'] || req.hostname;
        baseUrl = `${protocol}://${host}`;
      }
      const resetLink = `${baseUrl}/admin/reset-password?token=${token}`;
      
      console.log(`Password reset requested for: ${admin.email}`);
      console.log(`Reset link generated: ${resetLink}`);
      
      const emailSent = await sendPasswordResetEmail(admin.email, resetLink);
      
      if (!emailSent) {
        console.log(`Primary email delivery failed, trying notification email as fallback`);
        const fallbackSent = await sendPasswordResetEmail('delcodivas@gmail.com', resetLink);
        console.log(`Fallback password reset email sent status: ${fallbackSent}`);
      } else {
        console.log(`Password reset email sent successfully`);
      }

      return res.json({ message: "If that email exists, a password reset link has been sent." });
    } catch (error) {
      console.error("Forgot password error:", error);
      return res.status(500).json({ message: "Failed to process request" });
    }
  });

  // Reset password - validate token and update password
  app.post("/api/admin/reset-password", async (req, res) => {
    try {
      const { token, newPassword, password } = req.body;
      const pwd = newPassword || password;
      if (!token || !pwd) {
        return res.status(400).json({ message: "Token and password are required" });
      }

      if (pwd.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters" });
      }

      // Find valid token
      const resetToken = await storage.getPasswordResetToken(token);
      if (!resetToken) {
        return res.status(400).json({ message: "Invalid or expired reset link" });
      }

      if (resetToken.used) {
        return res.status(400).json({ message: "This reset link has already been used" });
      }

      if (new Date() > new Date(resetToken.expiresAt)) {
        return res.status(400).json({ message: "This reset link has expired" });
      }

      // Get admin and update password
      const admin = await storage.getAdminByEmail(resetToken.email);
      if (!admin) {
        return res.status(400).json({ message: "Account not found" });
      }

      const passwordHash = await bcrypt.hash(pwd, 12);
      await storage.updateAdminPassword(admin.id, passwordHash);
      
      // Mark token as used
      await storage.markPasswordResetTokenUsed(token);

      return res.json({ message: "Password has been reset successfully. You can now log in." });
    } catch (error) {
      console.error("Reset password error:", error);
      return res.status(500).json({ message: "Failed to reset password" });
    }
  });

  // Verify reset token is valid
  app.get("/api/admin/verify-reset-token", async (req, res) => {
    try {
      const { token } = req.query;
      if (!token || typeof token !== "string") {
        return res.status(400).json({ valid: false, message: "Token is required" });
      }

      const resetToken = await storage.getPasswordResetToken(token);
      if (!resetToken) {
        return res.status(400).json({ valid: false, message: "Invalid or expired reset link" });
      }

      if (resetToken.used) {
        return res.status(400).json({ valid: false, message: "This reset link has already been used" });
      }

      if (new Date() > new Date(resetToken.expiresAt)) {
        return res.status(400).json({ valid: false, message: "This reset link has expired" });
      }

      return res.json({ valid: true });
    } catch (error) {
      console.error("Verify token error:", error);
      return res.status(500).json({ valid: false, message: "Failed to verify token" });
    }
  });

  // Check admin session
  app.get("/api/admin/me", requireAdmin, async (req, res) => {
    try {
      const admin = await storage.getAdminById(req.session.adminId!);
      if (!admin) {
        return res.status(401).json({ message: "Session invalid" });
      }
      return res.json({ 
        admin: { id: admin.id, email: admin.email, name: admin.name }
      });
    } catch (error) {
      return res.status(500).json({ message: "Failed to get admin info" });
    }
  });

  app.post("/api/admin/change-password", requireAdmin, async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: "Current password and new password are required" });
      }
      if (newPassword.length < 8) {
        return res.status(400).json({ message: "New password must be at least 8 characters" });
      }

      const admin = await storage.getAdminById(req.session.adminId!);
      if (!admin) {
        return res.status(401).json({ message: "Session invalid" });
      }

      const isValid = await bcrypt.compare(currentPassword, admin.passwordHash);
      if (!isValid) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }

      const passwordHash = await bcrypt.hash(newPassword, 12);
      await storage.updateAdminPassword(admin.id, passwordHash);

      return res.json({ message: "Password updated successfully" });
    } catch (error) {
      console.error("Change password error:", error);
      return res.status(500).json({ message: "Failed to change password" });
    }
  });

  // Create initial admin (only works if no admins exist)
  app.post("/api/admin/setup", async (req, res) => {
    try {
      // Check if any admin already exists
      const existingAdmin = await storage.getAdminByEmail("admin@delcodivas.com");
      if (existingAdmin) {
        return res.status(400).json({ message: "Admin already exists" });
      }

      const { email, password, name } = req.body;
      if (!email || !password || !name) {
        return res.status(400).json({ message: "Email, password, and name are required" });
      }

      const passwordHash = await bcrypt.hash(password, 12);
      const admin = await storage.createAdmin({
        email,
        passwordHash,
        name,
        role: "admin",
      });

      return res.status(201).json({ 
        message: "Admin created successfully",
        admin: { id: admin.id, email: admin.email, name: admin.name }
      });
    } catch (error) {
      console.error("Admin setup error:", error);
      return res.status(500).json({ message: "Failed to create admin" });
    }
  });

  // Protected admin routes for data management
  app.get("/api/admin/newsletters", requireAdmin, async (req, res) => {
    try {
      const newsletters = await storage.getAllNewsletters();
      return res.json({ data: newsletters });
    } catch (error) {
      return res.status(500).json({ message: "Failed to retrieve newsletters" });
    }
  });

  app.get("/api/admin/signups", requireAdmin, async (req, res) => {
    try {
      const signups = await storage.getAllSignups();
      return res.json({ data: signups });
    } catch (error) {
      return res.status(500).json({ message: "Failed to retrieve signups" });
    }
  });

  app.get("/api/admin/contacts", requireAdmin, async (req, res) => {
    try {
      const contacts = await storage.getAllContacts();
      return res.json({ data: contacts });
    } catch (error) {
      return res.status(500).json({ message: "Failed to retrieve contacts" });
    }
  });

  app.get("/api/admin/reviews", requireAdmin, async (req, res) => {
    try {
      const reviews = await storage.getAllReviews();
      return res.json({ data: reviews });
    } catch (error) {
      return res.status(500).json({ message: "Failed to retrieve reviews" });
    }
  });

  app.patch("/api/admin/reviews/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const { canFeature } = req.body;
      if (canFeature !== undefined && canFeature !== "yes" && canFeature !== "no") {
        return res.status(400).json({ message: "canFeature must be 'yes' or 'no'" });
      }
      const existing = await storage.getReview(id);
      if (!existing) {
        return res.status(404).json({ message: "Review not found" });
      }
      const updated = await storage.updateReview(id, { canFeature });
      return res.json({ data: updated });
    } catch (error) {
      console.error("PATCH review error:", error);
      return res.status(500).json({ message: "Failed to update review" });
    }
  });

  app.delete("/api/admin/reviews/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const existing = await storage.getReview(id);
      if (!existing) {
        return res.status(404).json({ message: "Review not found" });
      }
      await storage.deleteReview(id);
      return res.json({ message: "Review deleted" });
    } catch (error) {
      return res.status(500).json({ message: "Failed to delete review" });
    }
  });

  // Events CRUD
  app.get("/api/admin/events", requireAdmin, async (req, res) => {
    try {
      const events = await storage.getAllEvents();
      return res.json({ data: events });
    } catch (error) {
      return res.status(500).json({ message: "Failed to retrieve events" });
    }
  });

  app.post("/api/admin/events", requireAdmin, async (req, res) => {
    try {
      const data = insertEventSchema.parse(req.body);
      const event = await storage.createEvent(data);
      return res.status(201).json({ data: event });
    } catch (error) {
      console.error("Create event error:", error);
      return res.status(400).json({ message: "Failed to create event" });
    }
  });

  app.put("/api/admin/events/:id", requireAdmin, async (req, res) => {
    try {
      const event = await storage.updateEvent(req.params.id, req.body);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      return res.json({ data: event });
    } catch (error) {
      return res.status(400).json({ message: "Failed to update event" });
    }
  });

  // PATCH for partial updates (inline editing)
  app.patch("/api/admin/events/:id", requireAdmin, async (req, res) => {
    try {
      const event = await storage.updateEvent(req.params.id, req.body);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      return res.json({ data: event });
    } catch (error) {
      return res.status(400).json({ message: "Failed to update event" });
    }
  });

  app.delete("/api/admin/events/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deleteEvent(req.params.id);
      return res.json({ message: "Event deleted" });
    } catch (error) {
      return res.status(500).json({ message: "Failed to delete event" });
    }
  });

  // Merchandise CRUD
  app.get("/api/admin/merchandise", requireAdmin, async (req, res) => {
    try {
      const items = await storage.getAllMerchItems();
      return res.json({ data: items });
    } catch (error) {
      return res.status(500).json({ message: "Failed to retrieve merchandise" });
    }
  });

  app.post("/api/admin/merchandise", requireAdmin, async (req, res) => {
    try {
      const data = insertMerchItemSchema.parse(req.body);
      const item = await storage.createMerchItem(data);
      return res.status(201).json({ data: item });
    } catch (error) {
      return res.status(400).json({ message: "Failed to create merchandise item" });
    }
  });

  app.put("/api/admin/merchandise/:id", requireAdmin, async (req, res) => {
    try {
      const item = await storage.updateMerchItem(req.params.id, req.body);
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }
      return res.json({ data: item });
    } catch (error) {
      return res.status(400).json({ message: "Failed to update merchandise item" });
    }
  });

  // PATCH for partial updates (inline editing)
  app.patch("/api/admin/merchandise/:id", requireAdmin, async (req, res) => {
    try {
      const item = await storage.updateMerchItem(req.params.id, req.body);
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }
      return res.json({ data: item });
    } catch (error) {
      return res.status(400).json({ message: "Failed to update merchandise item" });
    }
  });

  app.delete("/api/admin/merchandise/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deleteMerchItem(req.params.id);
      return res.json({ message: "Merchandise item deleted" });
    } catch (error) {
      return res.status(500).json({ message: "Failed to delete merchandise item" });
    }
  });

  // Founders CRUD
  app.get("/api/admin/founders", requireAdmin, async (req, res) => {
    try {
      const founders = await storage.getAllFounders();
      return res.json({ data: founders });
    } catch (error) {
      return res.status(500).json({ message: "Failed to retrieve founders" });
    }
  });

  app.post("/api/admin/founders", requireAdmin, async (req, res) => {
    try {
      const data = insertFounderSchema.parse(req.body);
      const founder = await storage.createFounder(data);
      return res.status(201).json({ data: founder });
    } catch (error) {
      return res.status(400).json({ message: "Failed to create founder" });
    }
  });

  app.put("/api/admin/founders/:id", requireAdmin, async (req, res) => {
    try {
      const founder = await storage.updateFounder(req.params.id, req.body);
      if (!founder) {
        return res.status(404).json({ message: "Founder not found" });
      }
      return res.json({ data: founder });
    } catch (error) {
      return res.status(400).json({ message: "Failed to update founder" });
    }
  });

  // PATCH for partial updates (inline editing)
  app.patch("/api/admin/founders/:id", requireAdmin, async (req, res) => {
    try {
      const founder = await storage.updateFounder(req.params.id, req.body);
      if (!founder) {
        return res.status(404).json({ message: "Founder not found" });
      }
      return res.json({ data: founder });
    } catch (error) {
      return res.status(400).json({ message: "Failed to update founder" });
    }
  });

  app.delete("/api/admin/founders/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deleteFounder(req.params.id);
      return res.json({ message: "Founder deleted" });
    } catch (error) {
      return res.status(500).json({ message: "Failed to delete founder" });
    }
  });

  // Media Links CRUD
  app.get("/api/admin/media", requireAdmin, async (req, res) => {
    try {
      const media = await storage.getAllMediaLinks();
      return res.json({ data: media });
    } catch (error) {
      return res.status(500).json({ message: "Failed to retrieve media links" });
    }
  });

  app.post("/api/admin/media", requireAdmin, async (req, res) => {
    try {
      const data = insertMediaLinkSchema.parse(req.body);
      const media = await storage.createMediaLink(data);
      return res.status(201).json({ data: media });
    } catch (error) {
      return res.status(400).json({ message: "Failed to create media link" });
    }
  });

  app.put("/api/admin/media/:id", requireAdmin, async (req, res) => {
    try {
      const media = await storage.updateMediaLink(req.params.id, req.body);
      if (!media) {
        return res.status(404).json({ message: "Media link not found" });
      }
      return res.json({ data: media });
    } catch (error) {
      return res.status(400).json({ message: "Failed to update media link" });
    }
  });

  // PATCH for partial updates (inline editing)
  app.patch("/api/admin/media/:id", requireAdmin, async (req, res) => {
    try {
      const media = await storage.updateMediaLink(req.params.id, req.body);
      if (!media) {
        return res.status(404).json({ message: "Media link not found" });
      }
      return res.json({ data: media });
    } catch (error) {
      return res.status(400).json({ message: "Failed to update media link" });
    }
  });

  app.delete("/api/admin/media/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deleteMediaLink(req.params.id);
      return res.json({ message: "Media link deleted" });
    } catch (error) {
      return res.status(500).json({ message: "Failed to delete media link" });
    }
  });

  // Site Settings
  app.get("/api/admin/settings", requireAdmin, async (req, res) => {
    try {
      const settings = await storage.getAllSettings();
      return res.json({ data: settings });
    } catch (error) {
      return res.status(500).json({ message: "Failed to retrieve settings" });
    }
  });

  app.post("/api/admin/settings", requireAdmin, async (req, res) => {
    try {
      const data = insertSiteSettingSchema.parse(req.body);
      const setting = await storage.upsertSetting(data);
      return res.json({ data: setting });
    } catch (error) {
      return res.status(400).json({ message: "Failed to update setting" });
    }
  });

  // Gallery Videos CRUD - Public endpoint
  app.get("/api/gallery-videos", async (req, res) => {
    try {
      const videos = await storage.getAllGalleryVideos();
      return res.json({ data: videos });
    } catch (error) {
      return res.status(500).json({ message: "Failed to retrieve gallery videos" });
    }
  });

  // Gallery Videos CRUD - Admin endpoints
  app.get("/api/admin/gallery-videos", requireAdmin, async (req, res) => {
    try {
      const videos = await storage.getAllGalleryVideosAdmin();
      return res.json({ data: videos });
    } catch (error) {
      return res.status(500).json({ message: "Failed to retrieve gallery videos" });
    }
  });

  app.post("/api/admin/gallery-videos", requireAdmin, async (req, res) => {
    try {
      const data = insertGalleryVideoSchema.parse(req.body);
      const video = await storage.createGalleryVideo(data);
      return res.status(201).json({ data: video });
    } catch (error) {
      return res.status(400).json({ message: "Failed to create gallery video" });
    }
  });

  app.put("/api/admin/gallery-videos/:id", requireAdmin, async (req, res) => {
    try {
      const video = await storage.updateGalleryVideo(req.params.id, req.body);
      if (!video) {
        return res.status(404).json({ message: "Gallery video not found" });
      }
      return res.json({ data: video });
    } catch (error) {
      return res.status(400).json({ message: "Failed to update gallery video" });
    }
  });

  app.patch("/api/admin/gallery-videos/:id", requireAdmin, async (req, res) => {
    try {
      const video = await storage.updateGalleryVideo(req.params.id, req.body);
      if (!video) {
        return res.status(404).json({ message: "Gallery video not found" });
      }
      return res.json({ data: video });
    } catch (error) {
      return res.status(400).json({ message: "Failed to update gallery video" });
    }
  });

  app.delete("/api/admin/gallery-videos/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deleteGalleryVideo(req.params.id);
      return res.json({ message: "Gallery video deleted" });
    } catch (error) {
      return res.status(500).json({ message: "Failed to delete gallery video" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
