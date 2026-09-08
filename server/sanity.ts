import { createClient } from "@sanity/client";

const projectId = process.env.SANITY_PROJECT_ID;
const apiToken = process.env.SANITY_API_TOKEN;

if (!projectId || !apiToken) {
  console.warn("Sanity credentials not configured. Content management will use fallback data.");
}

export const sanityClient = createClient({
  projectId: projectId || "",
  dataset: "production",
  apiVersion: "2024-01-01",
  token: apiToken,
  useCdn: false,
});

export interface SanityFounder {
  _id: string;
  _type: "founder";
  name: string;
  title?: string;
  bio: string;
  pullQuote?: string;
  imageUrl?: string;
  order?: number;
}

export interface SanityMerchItem {
  _id: string;
  _type: "merchItem";
  name: string;
  title?: string;
  description: string;
  price: string;
  imageUrl: string;
  sizes?: string;
  colors?: string;
  colorOptions?: string;
  isActive?: boolean;
  isAvailable?: boolean;
}

export interface SanityEvent {
  _id: string;
  _type: "event";
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  price?: string;
  isUpcoming?: boolean;
  isActive?: boolean;
  imageUrl?: string;
  featured?: boolean;
}

export interface SanityMediaLink {
  _id: string;
  _type: "mediaLink";
  type: string;
  title?: string;
  description?: string;
  url: string;
  thumbnailUrl?: string;
  featured?: boolean;
}

export interface SanitySiteSetting {
  _id: string;
  _type: "siteSetting";
  key: string;
  value: string;
}

export interface SanityGalleryVideo {
  _id: string;
  _type: "galleryVideo";
  title?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  order?: number;
  isActive?: boolean;
}

export const sanity = {
  async getFounders(): Promise<SanityFounder[]> {
    try {
      const founders = await sanityClient.fetch<SanityFounder[]>(
        `*[_type == "founder"] | order(order asc)`
      );
      return founders || [];
    } catch (error) {
      console.error("Sanity getFounders error:", error);
      return [];
    }
  },

  async getFounder(id: string): Promise<SanityFounder | null> {
    try {
      const founder = await sanityClient.fetch<SanityFounder>(
        `*[_type == "founder" && _id == $id][0]`,
        { id }
      );
      return founder || null;
    } catch (error) {
      console.error("Sanity getFounder error:", error);
      return null;
    }
  },

  async createFounder(data: Omit<SanityFounder, "_id" | "_type">): Promise<SanityFounder> {
    const doc = await sanityClient.create({
      _type: "founder",
      ...data,
    });
    return doc as SanityFounder;
  },

  async updateFounder(id: string, data: Partial<Omit<SanityFounder, "_id" | "_type">>): Promise<SanityFounder> {
    const doc = await sanityClient.patch(id).set(data).commit();
    return doc as unknown as SanityFounder;
  },

  async deleteFounder(id: string): Promise<void> {
    await sanityClient.delete(id);
  },

  async getMerchItems(): Promise<SanityMerchItem[]> {
    try {
      const items = await sanityClient.fetch<SanityMerchItem[]>(
        `*[_type == "merchItem" && isActive != false] | order(_createdAt desc)`
      );
      return items || [];
    } catch (error) {
      console.error("Sanity getMerchItems error:", error);
      return [];
    }
  },

  async getMerchItem(id: string): Promise<SanityMerchItem | null> {
    try {
      const item = await sanityClient.fetch<SanityMerchItem>(
        `*[_type == "merchItem" && _id == $id][0]`,
        { id }
      );
      return item || null;
    } catch (error) {
      console.error("Sanity getMerchItem error:", error);
      return null;
    }
  },

  async createMerchItem(data: Omit<SanityMerchItem, "_id" | "_type">): Promise<SanityMerchItem> {
    const doc = await sanityClient.create({
      _type: "merchItem",
      ...data,
      isActive: true,
      isAvailable: true,
    });
    return doc as SanityMerchItem;
  },

  async updateMerchItem(id: string, data: Partial<Omit<SanityMerchItem, "_id" | "_type">>): Promise<SanityMerchItem> {
    const doc = await sanityClient.patch(id).set(data).commit();
    return doc as unknown as SanityMerchItem;
  },

  async deleteMerchItem(id: string): Promise<void> {
    await sanityClient.delete(id);
  },

  async getEvents(): Promise<SanityEvent[]> {
    try {
      const events = await sanityClient.fetch<SanityEvent[]>(
        `*[_type == "event" && isActive != false] | order(date desc)`
      );
      return events || [];
    } catch (error) {
      console.error("Sanity getEvents error:", error);
      return [];
    }
  },

  async getEvent(id: string): Promise<SanityEvent | null> {
    try {
      const event = await sanityClient.fetch<SanityEvent>(
        `*[_type == "event" && _id == $id][0]`,
        { id }
      );
      return event || null;
    } catch (error) {
      console.error("Sanity getEvent error:", error);
      return null;
    }
  },

  async createEvent(data: Omit<SanityEvent, "_id" | "_type">): Promise<SanityEvent> {
    const doc = await sanityClient.create({
      _type: "event",
      ...data,
      isActive: true,
    });
    return doc as SanityEvent;
  },

  async updateEvent(id: string, data: Partial<Omit<SanityEvent, "_id" | "_type">>): Promise<SanityEvent> {
    const doc = await sanityClient.patch(id).set(data).commit();
    return doc as unknown as SanityEvent;
  },

  async deleteEvent(id: string): Promise<void> {
    await sanityClient.delete(id);
  },

  async getMediaLinks(): Promise<SanityMediaLink[]> {
    try {
      const links = await sanityClient.fetch<SanityMediaLink[]>(
        `*[_type == "mediaLink"] | order(_createdAt desc)`
      );
      return links || [];
    } catch (error) {
      console.error("Sanity getMediaLinks error:", error);
      return [];
    }
  },

  async getMediaLink(id: string): Promise<SanityMediaLink | null> {
    try {
      const link = await sanityClient.fetch<SanityMediaLink>(
        `*[_type == "mediaLink" && _id == $id][0]`,
        { id }
      );
      return link || null;
    } catch (error) {
      console.error("Sanity getMediaLink error:", error);
      return null;
    }
  },

  async createMediaLink(data: Omit<SanityMediaLink, "_id" | "_type">): Promise<SanityMediaLink> {
    const doc = await sanityClient.create({
      _type: "mediaLink",
      ...data,
    });
    return doc as SanityMediaLink;
  },

  async updateMediaLink(id: string, data: Partial<Omit<SanityMediaLink, "_id" | "_type">>): Promise<SanityMediaLink> {
    const doc = await sanityClient.patch(id).set(data).commit();
    return doc as unknown as SanityMediaLink;
  },

  async deleteMediaLink(id: string): Promise<void> {
    await sanityClient.delete(id);
  },

  async getSiteSettings(): Promise<SanitySiteSetting[]> {
    try {
      const settings = await sanityClient.fetch<SanitySiteSetting[]>(
        `*[_type == "siteSetting"]`
      );
      return settings || [];
    } catch (error) {
      console.error("Sanity getSiteSettings error:", error);
      return [];
    }
  },

  async getSiteSetting(key: string): Promise<SanitySiteSetting | null> {
    try {
      const setting = await sanityClient.fetch<SanitySiteSetting>(
        `*[_type == "siteSetting" && key == $key][0]`,
        { key }
      );
      return setting || null;
    } catch (error) {
      console.error("Sanity getSiteSetting error:", error);
      return null;
    }
  },

  async upsertSiteSetting(key: string, value: string): Promise<SanitySiteSetting> {
    const existing = await this.getSiteSetting(key);
    if (existing) {
      const doc = await sanityClient.patch(existing._id).set({ value }).commit();
      return doc as unknown as SanitySiteSetting;
    } else {
      const doc = await sanityClient.create({
        _type: "siteSetting",
        key,
        value,
      });
      return doc as SanitySiteSetting;
    }
  },

  async deleteSiteSetting(id: string): Promise<void> {
    await sanityClient.delete(id);
  },

  async getGalleryVideos(): Promise<SanityGalleryVideo[]> {
    try {
      const videos = await sanityClient.fetch<SanityGalleryVideo[]>(
        `*[_type == "galleryVideo" && isActive != false] | order(order asc)`
      );
      return videos || [];
    } catch (error) {
      console.error("Sanity getGalleryVideos error:", error);
      return [];
    }
  },

  async getGalleryVideosAll(): Promise<SanityGalleryVideo[]> {
    try {
      const videos = await sanityClient.fetch<SanityGalleryVideo[]>(
        `*[_type == "galleryVideo"] | order(order asc)`
      );
      return videos || [];
    } catch (error) {
      console.error("Sanity getGalleryVideosAll error:", error);
      return [];
    }
  },

  async getGalleryVideo(id: string): Promise<SanityGalleryVideo | null> {
    try {
      const video = await sanityClient.fetch<SanityGalleryVideo>(
        `*[_type == "galleryVideo" && _id == $id][0]`,
        { id }
      );
      return video || null;
    } catch (error) {
      console.error("Sanity getGalleryVideo error:", error);
      return null;
    }
  },

  async createGalleryVideo(data: Omit<SanityGalleryVideo, "_id" | "_type">): Promise<SanityGalleryVideo> {
    const doc = await sanityClient.create({
      _type: "galleryVideo",
      ...data,
      isActive: true,
    });
    return doc as SanityGalleryVideo;
  },

  async updateGalleryVideo(id: string, data: Partial<Omit<SanityGalleryVideo, "_id" | "_type">>): Promise<SanityGalleryVideo> {
    const doc = await sanityClient.patch(id).set(data).commit();
    return doc as unknown as SanityGalleryVideo;
  },

  async deleteGalleryVideo(id: string): Promise<void> {
    await sanityClient.delete(id);
  },
};

export function sanityToFounder(s: SanityFounder) {
  return {
    id: s._id,
    name: s.name,
    title: s.title || null,
    bio: s.bio,
    pullQuote: s.pullQuote || null,
    imageUrl: s.imageUrl || null,
    order: s.order?.toString() || "0",
    displayOrder: s.order?.toString() || "0",
    createdAt: null,
    updatedAt: null,
  };
}

export function sanityToMerchItem(s: SanityMerchItem) {
  return {
    id: s._id,
    name: s.name,
    title: s.title || null,
    description: s.description,
    price: s.price,
    imageUrl: s.imageUrl,
    sizes: s.sizes || null,
    colors: s.colors || null,
    colorOptions: s.colorOptions || null,
    isActive: s.isActive ?? true,
    isAvailable: s.isAvailable ?? true,
    createdAt: null,
    updatedAt: null,
  };
}

export function sanityToEvent(s: SanityEvent) {
  return {
    id: s._id,
    title: s.title,
    date: s.date,
    time: s.time,
    location: s.location,
    description: s.description,
    price: s.price || null,
    isUpcoming: s.isUpcoming ?? true,
    isActive: s.isActive ?? true,
    imageUrl: s.imageUrl || null,
    featured: s.featured ?? false,
    createdAt: null,
    updatedAt: null,
  };
}

export function sanityToMediaLink(s: SanityMediaLink) {
  return {
    id: s._id,
    type: s.type,
    title: s.title || null,
    description: s.description || null,
    url: s.url,
    thumbnailUrl: s.thumbnailUrl || null,
    featured: s.featured ?? false,
    createdAt: null,
    updatedAt: null,
  };
}

export function sanityToSiteSetting(s: SanitySiteSetting) {
  return {
    id: s._id,
    key: s.key,
    value: s.value,
    updatedAt: null,
  };
}

export function sanityToGalleryVideo(s: SanityGalleryVideo) {
  return {
    id: s._id,
    title: s.title || null,
    videoUrl: s.videoUrl,
    thumbnailUrl: s.thumbnailUrl || null,
    sortOrder: s.order ?? 0,
    isActive: s.isActive ?? true,
    createdAt: null,
    updatedAt: null,
  };
}
