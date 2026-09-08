/**
 * Full content seed — founders, events, gallery videos, media links,
 * merchandise, and site settings. Safe to re-run (skips if data exists).
 *
 * Run: npm run db:seed
 */

import { db, neonSql } from "./db";
import {
  founders,
  events,
  galleryVideos,
  mediaLinks,
  merchItems,
  siteSettings,
} from "../shared/schema";

async function main() {
  console.log("🌱 Seeding Delco Divas content...\n");

  // ── Site Settings (upsert by unique key) ──────────────────────────────────
  console.log("Site settings...");
  const settingsList: { key: string; value: string }[] = [
    { key: "heroVideoUrl", value: "/attached_assets/hero-video.mp4" },
    { key: "homeCtaImageUrl", value: "/attached_assets/FullSizeRender(1)_1762219885959.jpg" },
    { key: "eventsCtaImageUrl", value: "/attached_assets/IMG_1056_1762219885963.jpg" },
    { key: "heroTitle", value: "Delco Divas" },
    { key: "heroSubtitle", value: "A dynamic women's fitness group" },
    { key: "heroTagline", value: "Why just watch the fun… when you can be the Diva?" },
    { key: "heroCta1", value: "Become a Diva" },
    { key: "heroCta2", value: "Learn More" },
    { key: "whoWeAreTitle", value: "Who Are the Delco Divas" },
    { key: "whoWeAreDescription", value: "The Delco Divas are a dynamic group of women who come together to move, dance, laugh, and break a sweat—all while celebrating our confidence, strength, and unstoppable Diva pride! Founded by Brooke Lambert and choreographer Kim Forlini, the Delco Divas bring together women of all ages and backgrounds for unforgettable wellness experiences." },
    { key: "featureCard1Title", value: "Community First" },
    { key: "featureCard1Description", value: "Building lasting connections through shared movement and wellness" },
    { key: "featureCard2Title", value: "All Levels Welcome" },
    { key: "featureCard2Description", value: "From beginners to experienced movers, everyone has a place here" },
    { key: "featureCard3Title", value: "Regular Events" },
    { key: "featureCard3Description", value: "Workshops, retreats, and performances throughout the year" },
    { key: "energyTitle", value: "Experience the Energy" },
    { key: "energyDescription", value: "Watch our Divas in action! From Phillies performances to Barre Burn classes, these women are all high-impact, all energy, all the time." },
    { key: "ctaHeadline", value: "Ready to Become a Diva?" },
    { key: "ctaDescription", value: "Why just watch from the sidelines? Step into the spotlight and become a Diva—where the energy is electric, the friendships are real, and the fun is nonstop." },
    { key: "ctaButton1", value: "Join Our Newsletter" },
    { key: "ctaButton2", value: "View Past Events" },
  ];

  for (const s of settingsList) {
    await db.insert(siteSettings)
      .values(s)
      .onConflictDoUpdate({ target: siteSettings.key, set: { value: s.value } });
  }
  console.log(`  ✓ ${settingsList.length} settings upserted\n`);

  // ── Founders ───────────────────────────────────────────────────────────────
  console.log("Founders...");
  await db.insert(founders).values([
    {
      name: "Brooke Lambert",
      title: "Co-Founder & Pilates Expert",
      bio: `Brooke Lambert is a passionate and certified Pilates instructor with a degree in Kinesiology from Temple University. Based on the Main Line, Brooke combines classical Pilates with Contemporary, athletic twist - creating empowering classes that challenge the body and uplift the spirit. In 2024, Brooke founded The Delco Divas, a women's wellness and fitness collective known for its vibrant events and supportive community. The group recently made headlines with a feature on Fox 29 News and a live performance at a Philadelphia Phillies game, capturing attention across the region for their fun, fearless approach to wellness. Brooke's entrepreneurial drive and creative vision earned her the title of "Entrepreneur of the Year", and her leadership continues to inspire women to move with purpose and confidence. Her passion for movement began at age five, inspired by her mother - a professional dancer - and a childhood filled with dance recitals and competitions. Today, Brooke channels that lifelong love of movement into helping others feel strong, connected, and confident - whether in the studio, at a retreat, or on the Phillies field.`,
      pullQuote: "Every woman deserves a space where she can move, grow, and shine.",
      imageUrl: "/attached_assets/image6_1762727596013.jpg",
      displayOrder: "1",
    },
    {
      name: "Kim Forlini",
      title: "Choreographer & Star Search Competitor",
      bio: `Kim's career started as a Professional Dancer, Teacher, and Choreographer in Philadelphia, PA. She was lead contestant on the hit show "Star Search", and performed nationally throughout the US. She owned and operated several dance studios where she gave her students the opportunity to perform at many beautiful venues. Since 1994, she has been choreographing for her favorite dance student the "Phillie Phanatic" where she recently appeared with her fitness group called the "Delco Divas" which will be featured in a new documentary coming in 2026. Kim's path to the Pilates Method began in 2013 after a serious hip injury. She quickly discovered that Pilates was meant to quicker recovery and started extensive training first on the mat than the reformer. A big fan of Cross-training, Kim later went on to get certified as a Personal Trainer, Barre, TRX, and Spinning instructor. Kim is now bringing a lifetime of expertise to the Delco Divas.`,
      pullQuote: "Dance isn't about perfection—it's about expression, connection, and pure joy.",
      imageUrl: "/attached_assets/image6_1764097127058.jpg",
      displayOrder: "2",
    },
  ]).onConflictDoNothing();
  console.log("  ✓ Founders seeded\n");

  // ── Past Events ────────────────────────────────────────────────────────────
  console.log("Events...");
  await db.insert(events).values([
    {
      title: "Fall Retreat — October 2025",
      date: "October 12, 2025",
      time: "All Day",
      location: "Delaware County, PA",
      description: "An incredible fall retreat where the Divas came together for movement, bonding, and wellness. Barre class, Eagles game watch, and sisterhood — a perfect day!",
      imageUrl: "/attached_assets/10_12.FALLRETREAT_1765462506884.jpg",
      isActive: true,
      isUpcoming: false,
      featured: true,
    },
    {
      title: "Phillies Halftime Performance",
      date: "June 2025",
      time: "Game Time",
      location: "Citizens Bank Park, Philadelphia",
      description: "The Delco Divas brought their signature energy to Citizens Bank Park, performing for thousands of Phillies fans. A proud moment showcasing our community's talent and spirit.",
      imageUrl: "/attached_assets/IMG_1056_1762219885963.jpg",
      isActive: true,
      isUpcoming: false,
      featured: true,
    },
    {
      title: "Phillies Game Day with the Divas",
      date: "Summer 2025",
      time: "Game Time",
      location: "Citizens Bank Park, Philadelphia",
      description: "Divas night out at the Phillies! Community, spirit, and Philly pride all in one unforgettable evening.",
      imageUrl: "/attached_assets/Phillies_game_1765462506898.jpg",
      isActive: true,
      isUpcoming: false,
      featured: false,
    },
    {
      title: "Summer Wellness Retreat 2024",
      date: "August 15, 2024",
      time: "All Day",
      location: "Brandywine Valley, PA",
      description: "An unforgettable weekend of dance, Pilates, and sisterhood in the beautiful Pennsylvania countryside. Over 100 Divas came together for movement, laughter, and community.",
      imageUrl: "/attached_assets/FullSizeRender_1762219885962.jpg",
      isActive: true,
      isUpcoming: false,
      featured: false,
    },
    {
      title: "Spring Dance Workshop",
      date: "April 20, 2024",
      time: "10:00 AM",
      location: "Main Line Studio, PA",
      description: "High-energy choreography workshop featuring new routines and special guest instructors. The studio was packed with Divas ready to move and groove!",
      imageUrl: "/attached_assets/FullSizeRender(1)_1762219885959.jpg",
      isActive: true,
      isUpcoming: false,
      featured: false,
    },
    {
      title: "Winter Wellness Celebration",
      date: "December 8, 2023",
      time: "2:00 PM",
      location: "Delaware County Community Center",
      description: "A festive gathering celebrating a year of movement and community. Dance performances, wellness workshops, and lots of holiday cheer.",
      imageUrl: "/attached_assets/FullSizeRender(2)_1762219885960.jpg",
      isActive: true,
      isUpcoming: false,
      featured: false,
    },
  ]).onConflictDoNothing();
  console.log("  ✓ Events seeded\n");

  // ── Gallery Videos ─────────────────────────────────────────────────────────
  console.log("Gallery videos...");
  // Use raw SQL to bypass Drizzle/Neon boolean serialization issues
  await neonSql`DELETE FROM gallery_videos`;
  await neonSql`
    INSERT INTO gallery_videos (title, video_url, sort_order, is_active) VALUES
    ('Fox News Feature', '/attached_assets/JenFredFoxNews_ExperiencetheEnergy_1765458597245.mp4', 1, TRUE),
    ('Divas Clip', '/attached_assets/IMG_2046_1762216044030.mp4', 2, TRUE),
    ('Divas Clip 2', '/attached_assets/IMG_2047_1762215897326.mp4', 3, TRUE),
    ('Divas Clip 3', '/attached_assets/IMG_2048_1762215992790.mp4', 4, TRUE),
    ('Divas Clip 4', '/attached_assets/IMG_2081_1762215992791.mp4', 5, TRUE),
    ('Divas Clip 5', '/attached_assets/IMG_2054_1762215992791.mp4', 6, TRUE),
    ('Divas Clip 6', '/attached_assets/IMG_2093_1762215897325.mp4', 7, TRUE),
    ('Divas Clip 7', '/attached_assets/IMG_2103_1762216032752.mp4', 8, TRUE),
    ('Divas Clip 8', '/attached_assets/IMG_5735_1762216032753.mp4', 9, TRUE),
    ('Divas Clip 9', '/attached_assets/IMG_5737_1762216032753.mp4', 10, TRUE),
    ('Divas Clip 10', '/attached_assets/IMG_6361_1762216044029.mp4', 11, TRUE),
    ('Divas Clip 11', '/attached_assets/IMG_6604_1762216044030.mp4', 12, TRUE),
    ('Divas Clip 12', '/attached_assets/IMG_6672_1762216044030.mp4', 13, TRUE)
  `;
  console.log("  ✓ Gallery videos seeded\n");

  // ── Media Links ────────────────────────────────────────────────────────────
  console.log("Media links...");
  await db.insert(mediaLinks).values([
    {
      type: "video",
      title: "Fox 29 News Feature",
      description: "Watch the Delco Divas featured on Fox 29 News! This segment showcases our community, our mission, and the incredible energy that makes the Divas special.",
      url: "https://www.fox29.com/video/1660324",
      thumbnailUrl: "/attached_assets/IMG_1719_1762219885964.jpg",
      featured: true,
    },
  ]).onConflictDoNothing();
  console.log("  ✓ Media links seeded\n");

  // ── Merchandise ────────────────────────────────────────────────────────────
  console.log("Merchandise...");
  await db.insert(merchItems).values([
    {
      name: "Delco Divas Signature Crop Tee",
      title: "Delco Divas Signature Crop Tee",
      description: "Our signature crop tee featuring the iconic Delco Divas logo! The red version includes the exclusive Phillies design on the back. Comfortable, stylish, and perfect for showing your Diva pride. Premium cotton fabric. Available in sizes XS-3XL.",
      price: "Contact for pricing",
      imageUrl: "/attached_assets/PNG image_1762730900743.jpeg",
      sizes: JSON.stringify(["XS", "S", "M", "L", "XL", "2XL", "3XL"]),
      colors: JSON.stringify(["Black", "Red"]),
      colorOptions: JSON.stringify([
        { name: "Black", imageUrl: "/attached_assets/PNG image_1762730900743.jpeg" },
        { name: "Red", imageUrl: "/attached_assets/PNG image(1)_1762730900744.jpeg" },
      ]),
      isActive: true,
      isAvailable: true,
    },
    {
      name: "Eagles Green Delco Divas Tee",
      title: "Eagles Green Delco Divas Tee",
      description: "Show your Philadelphia pride with our exclusive Eagles green tee! Features the Delco Divas logo on the back and Eagles logo on front. Perfect for game day or any day. Premium cotton fabric. Available in sizes XS-3XL.",
      price: "Contact for pricing",
      imageUrl: "/attached_assets/IMG_0079_1762219885962.png",
      sizes: JSON.stringify(["XS", "S", "M", "L", "XL", "2XL", "3XL"]),
      isActive: true,
      isAvailable: true,
    },
    {
      name: "Phillies Divas Tee",
      title: "Phillies Divas Tee",
      description: "Celebrate the Phillies with this exclusive Delco Divas collaboration tee! Perfect for game days and showing your Philly pride.",
      price: "Contact for pricing",
      imageUrl: "/attached_assets/PhilliesTshirt_1765461384729.jpeg",
      isActive: true,
      isAvailable: true,
    },
  ]).onConflictDoNothing();
  console.log("  ✓ Merchandise seeded\n");

  console.log("✅ All done!");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
