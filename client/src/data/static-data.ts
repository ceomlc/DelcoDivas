import type { StaticDivaBio, StaticPastEvent, StaticMerchItem, StaticMediaLink, SocialLink } from "@shared/schema";
import brookeImage from "@assets/image6_1762727596013.jpg";
import kimImage from "@assets/image6_1764097127058.jpg";
import outdoorEventImage from "@assets/FullSizeRender_1762219885962.jpg";
import indoorEventImage from "@assets/FullSizeRender(1)_1762219885959.jpg";
import philliesEventImage from "@assets/IMG_1056_1762219885963.jpg";
import winterEventImage from "@assets/FullSizeRender(2)_1762219885960.jpg";
import blackShirtImage from "@assets/generated_images/Black_t-shirt_product_2b937c46.png";
import whiteShirtImage from "@assets/generated_images/White_t-shirt_product_907a6c8c.png";
import sweatpantsImage from "@assets/generated_images/Sweatpants_product_photo_70c4c8ca.png";
import greenEaglesTeeImage from "@assets/IMG_0079_1762219885962.png";
import foxNewsScreenshotImage from "@assets/IMG_1719_1762219885964.jpg";
import blackDelcoDivasShirtImage from "@assets/PNG image_1762730900743.jpeg";
import redDelcoDivasShirtImage from "@assets/PNG image(1)_1762730900744.jpeg";

export const founders: StaticDivaBio[] = [
  {
    id: "brooke",
    name: "Brooke Lambert",
    title: "Co-Founder & Pilates Expert",
    bio: "Brooke Lambert is a passionate and certified Pilates instructor with a degree in Kinesiology from Temple University. Based on the Main Line, Brooke combines classical Pilates with Contemporary, athletic twist - creating empowering classes that challenge the body and uplift the spirit. In 2024, Brooke founded The Delco Divas, a women's wellness and fitness collective known for its vibrant events and supportive community. The group recently made headlines with a feature on Fox 29 News and a live performance at a Philadelphia Phillies game, capturing attention across the region for their fun, fearless approach to wellness. Brooke's entrepreneurial drive and creative vision earned her the title of \"Entrepreneur of the Year\", and her leadership continues to inspire women to move with purpose and confidence. Her passion for movement began at age five, inspired by her mother - a professional dancer - and a childhood filled with dance recitals and competitions. Today, Brooke channels that lifelong love of movement into helping others feel strong, connected, and confident - whether in the studio, at a retreat, or on the Phillies field.",
    pullQuote: "Every woman deserves a space where she can move, grow, and shine.",
    imageUrl: brookeImage,
  },
  {
    id: "kim",
    name: "Kim Forlini",
    title: "Choreographer & Star Search Competitor",
    bio: "Kim's career started as a Professional Dancer, Teacher, and Choreographer in Philadelphia, PA. She was lead contestant on the hit show \"Star Search\", and performed nationally throughout the US. She owned and operated several dance studios where she gave her students the opportunity to perform at many beautiful venues. Since 1994, she has been choreographing for her favorite dance student the \"Phillie Phanatic\" where she recently appeared with her fitness group called the \"Delco Divas\" which will be featured in a new documentary coming in 2026. Kim's path to the Pilates Method began in 2013 after a serious hip injury. She quickly discovered that Pilates was meant to quicker recovery and started extensive training first on the mat than the reformer. A big fan of Cross-training, Kim later went on to get certified as a Personal Trainer, Barre, TRX, and Spinning instructor. Kim is now bringing a lifetime of expertise to the Delco Divas.",
    pullQuote: "Dance isn't about perfection—it's about expression, connection, and pure joy.",
    imageUrl: kimImage,
  },
];

export const pastEvents: StaticPastEvent[] = [
  {
    id: "retreat-2024",
    title: "Summer Wellness Retreat 2024",
    date: "August 15, 2024",
    location: "Brandywine Valley, PA",
    description: "An unforgettable weekend of dance, Pilates, and sisterhood in the beautiful Pennsylvania countryside. Over 100 Divas came together for movement, laughter, and community.",
    imageUrl: outdoorEventImage,
    featured: true,
  },
  {
    id: "spring-workshop-2024",
    title: "Spring Dance Workshop",
    date: "April 20, 2024",
    location: "Main Line Studio, PA",
    description: "High-energy choreography workshop featuring new routines and special guest instructors. The studio was packed with Divas ready to move and groove!",
    imageUrl: indoorEventImage,
    featured: true,
  },
  {
    id: "phillies-halftime",
    title: "Phillies Halftime Performance",
    date: "June 10, 2024",
    location: "Citizens Bank Park, Philadelphia",
    description: "The Delco Divas brought their signature energy to Citizens Bank Park, performing for thousands of Phillies fans. A proud moment showcasing our community's talent and spirit.",
    imageUrl: philliesEventImage,
    featured: false,
  },
  {
    id: "winter-celebration",
    title: "Winter Wellness Celebration",
    date: "December 8, 2023",
    location: "Delaware County Community Center",
    description: "A festive gathering celebrating a year of movement and community. Dance performances, wellness workshops, and lots of holiday cheer.",
    imageUrl: winterEventImage,
    featured: false,
  },
];

export const merchandise: StaticMerchItem[] = [
  {
    id: "delco-divas-signature-tee",
    title: "Delco Divas Signature Crop Tee",
    description: "Our signature crop tee featuring the iconic Delco Divas logo! The red version includes the exclusive Phillies design on the back. Comfortable, stylish, and perfect for showing your Diva pride. Premium cotton fabric. Available in sizes XS-3XL.",
    imageUrl: blackDelcoDivasShirtImage,
    sizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL"],
    colorOptions: [
      { name: "Black", imageUrl: blackDelcoDivasShirtImage },
      { name: "Red", imageUrl: redDelcoDivasShirtImage },
    ],
  },
  {
    id: "eagles-green-tee",
    title: "Eagles Green Delco Divas Tee",
    description: "Show your Philadelphia pride with our exclusive Eagles green tee! Features the Delco Divas logo on the back and Eagles logo on front. Perfect for game day or any day. Premium cotton fabric. Available in sizes XS-3XL.",
    imageUrl: greenEaglesTeeImage,
    sizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL"],
  },
];

export const mediaLinks: StaticMediaLink[] = [
  {
    id: "fox29-feature",
    title: "Fox 29 News Feature",
    description: "Watch the Delco Divas featured on Fox 29 News! This segment showcases our community, our mission, and the incredible energy that makes the Divas special.",
    url: "https://www.fox29.com/video/1660324",
    thumbnailUrl: foxNewsScreenshotImage,
  },
];

export const socialLinks: SocialLink[] = [
  {
    platform: "Facebook",
    url: "https://www.facebook.com/profile.php?id=61578806523530",
    icon: "facebook",
  },
  {
    platform: "Instagram",
    url: "https://www.instagram.com/delcodivas",
    icon: "instagram",
  },
];

// Next event date for countdown
export const nextEventDate = new Date("2026-03-15T11:00:00");
export const nextEventInfo = {
  title: "March into Movement",
  date: "Sunday, March 15th",
  time: "11am-3pm",
  location: "AFC Radnor",
  description: "Fitness classes led by certified & trained professionals — Barre, Pilates, and Yoga. Recharge with a healthy lunch & zen time. Giveaway bags for every attendee!",
};
