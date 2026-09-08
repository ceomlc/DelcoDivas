import bcrypt from "bcryptjs";
import { storage } from "./storage";

export async function seedAdmin() {
  try {
    const anyAdminExists = await storage.hasAnyAdmin();
    if (anyAdminExists) {
      return;
    }

    const passwordHash = await bcrypt.hash("DivasAdmin2024!", 12);
    await storage.createAdmin({
      email: "admin@delcodivas.com",
      passwordHash,
      name: "Admin",
      role: "admin",
    });
    console.log("Default admin account created");
  } catch (error) {
    console.error("Admin seed error:", error);
  }
}
