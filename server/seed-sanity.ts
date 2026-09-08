import { sanity, sanityClient } from "./sanity";

const founders = [
  {
    name: "Brooke Lambert",
    title: "Co-Founder & Pilates Expert",
    bio: "Brooke Lambert is a passionate and certified Pilates instructor with a degree in Kinesiology from Temple University. Based on the Main Line, Brooke combines classical Pilates with Contemporary, athletic twist - creating empowering classes that challenge the body and uplift the spirit. In 2024, Brooke founded The Delco Divas, a women's wellness and fitness collective known for its vibrant events and supportive community. The group recently made headlines with a feature on Fox 29 News and a live performance at a Philadelphia Phillies game, capturing attention across the region for their fun, fearless approach to wellness. Brooke's entrepreneurial drive and creative vision earned her the title of \"Entrepreneur of the Year\", and her leadership continues to inspire women to move with purpose and confidence. Her passion for movement began at age five, inspired by her mother - a professional dancer - and a childhood filled with dance recitals and competitions. Today, Brooke channels that lifelong love of movement into helping others feel strong, connected, and confident - whether in the studio, at a retreat, or on the Phillies field.",
    pullQuote: "Every woman deserves a space where she can move, grow, and shine.",
    imageUrl: "/attached_assets/image6_1762727596013.jpg",
    order: 0,
  },
  {
    name: "Kim Forlini",
    title: "Choreographer & Star Search Competitor",
    bio: "Kim's career started as a Professional Dancer, Teacher, and Choreographer in Philadelphia, PA. She was lead contestant on the hit show \"Star Search\", and performed nationally throughout the US. She owned and operated several dance studios where she gave her students the opportunity to perform at many beautiful venues. Since 1994, she has been choreographing for her favorite dance student the \"Phillie Phanatic\" where she recently appeared with her fitness group called the \"Delco Divas\" which will be featured in a new documentary coming in 2026. Kim's path to the Pilates Method began in 2013 after a serious hip injury. She quickly discovered that Pilates was meant to quicker recovery and started extensive training first on the mat than the reformer. A big fan of Cross-training, Kim later went on to get certified as a Personal Trainer, Barre, TRX, and Spinning instructor. Kim is now bringing a lifetime of expertise to the Delco Divas.",
    pullQuote: "Dance isn't about perfection—it's about expression, connection, and pure joy.",
    imageUrl: "/attached_assets/image6_1764097127058.jpg",
    order: 1,
  },
];

const merchItems = [
  {
    name: "delco-divas-signature-tee",
    title: "Delco Divas Signature Crop Tee",
    description: "Our signature crop tee featuring the iconic Delco Divas logo! The red version includes the exclusive Phillies design on the back. Comfortable, stylish, and perfect for showing your Diva pride. Premium cotton fabric. Available in sizes XS-3XL.",
    price: "$35",
    imageUrl: "/attached_assets/PNG image_1762730900743.jpeg",
    sizes: "XS, S, M, L, XL, 2XL, 3XL",
    colors: "Black, Red",
    isActive: true,
    isAvailable: true,
  },
  {
    name: "eagles-green-tee",
    title: "Eagles Green Delco Divas Tee",
    description: "Show your Philadelphia pride with our exclusive Eagles green tee! Features the Delco Divas logo on the back and Eagles logo on front. Perfect for game day or any day. Premium cotton fabric. Available in sizes XS-3XL.",
    price: "$35",
    imageUrl: "/attached_assets/IMG_0079_1762219885962.png",
    sizes: "XS, S, M, L, XL, 2XL, 3XL",
    isActive: true,
    isAvailable: true,
  },
];

const events = [
  {
    title: "Delco Divas Day - Detox & Restore",
    date: "2026-01-25",
    time: "10am-2pm",
    location: "Haverford Reserve (CREC)",
    description: "Take time to detox and unwind after the holiday season! Join us for a rejuvenating day of dance, Pilates, wellness workshops, and community celebration — featuring special guest teachers and welcoming all skill levels.",
    price: "$45",
    isUpcoming: true,
    isActive: true,
    featured: true,
  },
];

const mediaLinks = [
  {
    type: "video",
    title: "Fox 29 News Feature",
    description: "Watch the Delco Divas featured on Fox 29 News! This segment showcases our community, our mission, and the incredible energy that makes the Divas special.",
    url: "https://www.fox29.com/video/1660324",
    thumbnailUrl: "/attached_assets/IMG_1719_1762219885964.jpg",
    featured: true,
  },
];

async function seedSanity() {
  console.log("Starting Sanity seed...");

  try {
    const existingFounders = await sanity.getFounders();
    if (existingFounders.length > 0) {
      console.log(`Found ${existingFounders.length} existing founders in Sanity, skipping founders seed.`);
    } else {
      console.log("Seeding founders...");
      for (const founder of founders) {
        await sanity.createFounder(founder);
        console.log(`  Created founder: ${founder.name}`);
      }
    }

    const existingMerch = await sanity.getMerchItems();
    if (existingMerch.length > 0) {
      console.log(`Found ${existingMerch.length} existing merch items in Sanity, skipping merch seed.`);
    } else {
      console.log("Seeding merchandise...");
      for (const item of merchItems) {
        await sanity.createMerchItem(item);
        console.log(`  Created merch item: ${item.title}`);
      }
    }

    const existingEvents = await sanity.getEvents();
    if (existingEvents.length > 0) {
      console.log(`Found ${existingEvents.length} existing events in Sanity, skipping events seed.`);
    } else {
      console.log("Seeding events...");
      for (const event of events) {
        await sanity.createEvent(event);
        console.log(`  Created event: ${event.title}`);
      }
    }

    const existingMedia = await sanity.getMediaLinks();
    if (existingMedia.length > 0) {
      console.log(`Found ${existingMedia.length} existing media links in Sanity, skipping media seed.`);
    } else {
      console.log("Seeding media links...");
      for (const link of mediaLinks) {
        await sanity.createMediaLink(link);
        console.log(`  Created media link: ${link.title}`);
      }
    }

    console.log("Sanity seed completed successfully!");
  } catch (error) {
    console.error("Sanity seed error:", error);
    process.exit(1);
  }
}

seedSanity();
