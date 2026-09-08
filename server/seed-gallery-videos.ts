import { db } from "./db";
import { galleryVideos } from "@shared/schema";

const initialVideos = [
  { title: "Dance Practice 1", videoUrl: "/assets/IMG_2046_1762216044030.mov", sortOrder: 1 },
  { title: "Dance Practice 2", videoUrl: "/assets/IMG_2047_1762215897326.mov", sortOrder: 2 },
  { title: "Dance Practice 3", videoUrl: "/assets/IMG_2048_1762215992790.mov", sortOrder: 3 },
  { title: "Dance Practice 4", videoUrl: "/assets/IMG_2054_1762215992791.mov", sortOrder: 4 },
  { title: "Dance Practice 5", videoUrl: "/assets/IMG_2081_1762215992791.mov", sortOrder: 5 },
  { title: "Dance Practice 6", videoUrl: "/assets/IMG_2093_1762215897325.mov", sortOrder: 6 },
  { title: "Dance Practice 7", videoUrl: "/assets/IMG_2103_1762216032752.mov", sortOrder: 7 },
  { title: "Dance Practice 8", videoUrl: "/assets/IMG_2519_1762215897326.mov", sortOrder: 8 },
  { title: "Dance Practice 9", videoUrl: "/assets/IMG_5735_1762216032753.mov", sortOrder: 9 },
  { title: "Dance Practice 10", videoUrl: "/assets/IMG_5737_1762216032753.mov", sortOrder: 10 },
  { title: "Dance Practice 11", videoUrl: "/assets/IMG_6361_1762216044029.mp4", sortOrder: 11 },
  { title: "Dance Practice 12", videoUrl: "/assets/IMG_6604_1762216044030.mov", sortOrder: 12 },
  { title: "Dance Practice 13", videoUrl: "/assets/IMG_6672_1762216044030.mov", sortOrder: 13 },
];

async function seedGalleryVideos() {
  console.log("Seeding gallery videos...");
  
  try {
    for (const video of initialVideos) {
      await db.insert(galleryVideos).values(video as any);
      console.log(`Added: ${video.title}`);
    }
    
    console.log("Gallery videos seeded successfully!");
  } catch (error) {
    console.error("Error seeding gallery videos:", error);
  }
  
  process.exit(0);
}

seedGalleryVideos();
