import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Users, Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { InlineEditable } from "@/components/InlineEditable";
import type { SiteSetting, GalleryVideo } from "@shared/schema";

const FALLBACK_CTA_IMAGE = "https://placehold.co/1920x1080/1a1a1a/gold?text=Delco+Divas";
// Browser-compatible encoding of the original hero video (same footage).
const FALLBACK_HERO_VIDEO = "/attached_assets/hero-video-web.mp4";
const FALLBACK_HERO_POSTER = "/attached_assets/hero-video-poster.jpg";

export default function Home() {
  const { data: settingsData } = useQuery<{ data: SiteSetting[] }>({
    queryKey: ["/api/settings"],
  });
  const { data: galleryData } = useQuery<{ data: GalleryVideo[] }>({
    queryKey: ["/api/gallery-videos"],
  });

  const settings = settingsData?.data || [];
  const getSetting = (key: string) => settings.find(s => s.key === key)?.value || "";

  const galleryVideos = (galleryData?.data || [])
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

  // Duplicate for seamless scroll loop
  const carouselVideos = galleryVideos.length > 0
    ? [...galleryVideos, ...galleryVideos]
    : [];

  const heroVideoUrl = getSetting("heroVideoUrl");

  return (
    <div className="min-h-screen">
      {/* Hero Section with Video Background */}
      <section className="relative h-screen w-full overflow-hidden" data-testid="section-hero">
        <div className="absolute inset-0 bg-black">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
            data-testid="hero-video"
            poster={FALLBACK_HERO_POSTER}
            src={heroVideoUrl || FALLBACK_HERO_VIDEO}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-6 animate-fade-in-up">
            <InlineEditable
              contentKey="heroTitle"
              value={getSetting("heroTitle")}
              fallback="Delco Divas"
              as="span"
              className="block"
            />
          </h1>
          <div className="text-xl sm:text-2xl lg:text-3xl text-white/90 max-w-3xl mb-4 font-light animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <InlineEditable
              contentKey="heroSubtitle"
              value={getSetting("heroSubtitle")}
              fallback="A dynamic women's fitness group"
              as="p"
            />
          </div>
          <div className="text-lg sm:text-xl text-white/80 max-w-2xl mb-12 italic animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <InlineEditable
              contentKey="heroTagline"
              value={getSetting("heroTagline")}
              fallback="Why just watch the fun… when you can be the Diva?"
              as="p"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <Button
              asChild
              size="lg"
              data-testid="button-hero-signup"
              className="bg-gold text-primary-foreground font-semibold px-12 py-6 text-lg rounded-md border-2 border-primary"
            >
              <Link href="/signup">
                <InlineEditable
                  contentKey="heroCta1"
                  value={getSetting("heroCta1")}
                  fallback="Become a Diva"
                  as="span"
                />
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              data-testid="button-hero-learn"
              className="backdrop-blur-sm bg-white/10 border-2 border-white/30 text-white px-12 py-6 text-lg rounded-md"
            >
              <Link href="/about">
                <InlineEditable
                  contentKey="heroCta2"
                  value={getSetting("heroCta2")}
                  fallback="Learn More"
                  as="span"
                />
              </Link>
            </Button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-white/50 rounded-full" />
          </div>
        </div>
      </section>

      {/* Who We Are Section */}
      <section className="py-16 sm:py-32 relative overflow-hidden" data-testid="section-who-we-are">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 animate-slide-in-left">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold leading-tight uppercase tracking-wide">
                <InlineEditable
                  contentKey="whoWeAreTitle"
                  value={getSetting("whoWeAreTitle")}
                  fallback="Who Are the Delco Divas"
                  as="span"
                />
              </h2>
              <div className="text-lg sm:text-xl text-foreground/80 leading-relaxed">
                <InlineEditable
                  contentKey="whoWeAreDescription"
                  value={getSetting("whoWeAreDescription")}
                  fallback="The Delco Divas are a dynamic group of women who come together to move, dance, laugh, and break a sweat—all while celebrating our confidence, strength, and unstoppable Diva pride! Founded by Brooke Lambert and choreographer Kim Forlini, the Delco Divas bring together women of all ages and backgrounds for unforgettable wellness experiences."
                  as="p"
                  multiline
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  size="lg"
                  data-testid="button-meet-founders"
                  className="bg-gold text-primary-foreground px-8 py-6 text-lg"
                >
                  <Link href="/about">
                    Meet the Founders
                  </Link>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 animate-slide-in-right">
              <div className="space-y-6">
                <div className="bg-card border border-card-border rounded-lg p-6 hover-elevate transition-all duration-300 min-h-[180px] flex flex-col">
                  <div className="w-12 h-12 rounded-full bg-foreground/10 flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    <InlineEditable
                      contentKey="featureCard1Title"
                      value={getSetting("featureCard1Title")}
                      fallback="Community First"
                      as="span"
                    />
                  </h3>
                  <div className="text-sm text-muted-foreground">
                    <InlineEditable
                      contentKey="featureCard1Description"
                      value={getSetting("featureCard1Description")}
                      fallback="Building lasting connections through shared movement and wellness"
                      as="p"
                    />
                  </div>
                </div>
                <div className="bg-card border border-card-border rounded-lg p-6 hover-elevate transition-all duration-300 min-h-[180px] flex flex-col">
                  <div className="w-12 h-12 rounded-full bg-foreground/10 flex items-center justify-center mb-4">
                    <Sparkles className="w-6 h-6 text-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    <InlineEditable
                      contentKey="featureCard2Title"
                      value={getSetting("featureCard2Title")}
                      fallback="All Levels Welcome"
                      as="span"
                    />
                  </h3>
                  <div className="text-sm text-muted-foreground">
                    <InlineEditable
                      contentKey="featureCard2Description"
                      value={getSetting("featureCard2Description")}
                      fallback="From beginners to experienced movers, everyone has a place here"
                      as="p"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-card border border-card-border rounded-lg p-6 hover-elevate transition-all duration-300 min-h-[180px] flex flex-col">
                  <div className="w-12 h-12 rounded-full bg-foreground/10 flex items-center justify-center mb-4">
                    <Calendar className="w-6 h-6 text-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    <InlineEditable
                      contentKey="featureCard3Title"
                      value={getSetting("featureCard3Title")}
                      fallback="Regular Events"
                      as="span"
                    />
                  </h3>
                  <div className="text-sm text-muted-foreground">
                    <InlineEditable
                      contentKey="featureCard3Description"
                      value={getSetting("featureCard3Description")}
                      fallback="Workshops, retreats, and performances throughout the year"
                      as="p"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Gallery Section - Auto-scrolling Carousel */}
      <section className="py-20 sm:py-32 bg-black overflow-hidden" data-testid="section-video-gallery">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-6 text-white">
              <InlineEditable
                contentKey="energyTitle"
                value={getSetting("energyTitle")}
                fallback="Experience the Energy"
                as="span"
              />
            </h2>
            <div className="text-xl text-white/80 max-w-3xl mx-auto">
              <InlineEditable
                contentKey="energyDescription"
                value={getSetting("energyDescription")}
                fallback="Watch our Divas in action! From Phillies performances to Barre Burn classes, these women are all high-impact, all energy, all the time."
                as="p"
                multiline
              />
            </div>
          </div>
        </div>

        {/* Auto-scrolling Video Carousel */}
        {carouselVideos.length > 0 ? (
          <div className="relative w-full overflow-hidden">
            <div
              className="flex gap-6 animate-scroll-left"
              style={{ width: "max-content" }}
            >
              {carouselVideos.map((video, index) => (
                <div
                  key={`${video.id}-${index}`}
                  className="group relative w-80 sm:w-96 aspect-video rounded-lg overflow-hidden bg-card border border-card-border flex-shrink-0 hover:scale-105 transition-transform duration-300"
                  data-testid={`video-card-${index}`}
                >
                  <video
                    className="w-full h-full object-cover"
                    loop
                    muted
                    playsInline
                    preload="auto"
                    autoPlay
                    data-testid={`video-${index}`}
                    src={video.videoUrl}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-100 group-hover:opacity-60 transition-opacity duration-300" />
                  {video.title && (
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-white font-semibold text-lg" data-testid={`video-title-${index}`}>
                        {video.title}
                      </h3>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-white/40 py-8">
              No videos yet — add videos in the admin panel under Gallery Videos.
            </p>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mt-12">
            <Button
              asChild
              size="lg"
              variant="outline"
              data-testid="button-see-all-media"
              className="border-2 border-foreground text-foreground px-8 py-6 text-lg"
            >
              <Link href="/media">
                See All Media Coverage
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section with Background Image */}
      <section className="relative py-32 overflow-hidden" data-testid="section-cta">
        <div className="absolute inset-0">
          <img
            src={getSetting("homeCtaImageUrl") || FALLBACK_CTA_IMAGE}
            alt="Delco Divas community"
            className="w-full h-full object-cover"
            style={{ objectPosition: "50% 15%" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-8 animate-fade-in text-white">
            <InlineEditable
              contentKey="ctaHeadline"
              value={getSetting("ctaHeadline")}
              fallback="Ready to Become a Diva?"
              as="span"
            />
          </h2>
          <div className="text-xl sm:text-2xl text-white/90 mb-12 leading-relaxed">
            <InlineEditable
              contentKey="ctaDescription"
              value={getSetting("ctaDescription")}
              fallback="Why just watch from the sidelines? Step into the spotlight and become a Diva—where the energy is electric, the friendships are real, and the fun is nonstop."
              as="p"
              multiline
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              data-testid="button-cta-newsletter"
              className="bg-gold text-primary-foreground font-semibold px-12 py-6 text-lg"
            >
              <Link href="/newsletter">
                <InlineEditable
                  contentKey="ctaButton1"
                  value={getSetting("ctaButton1")}
                  fallback="Join Our Newsletter"
                  as="span"
                />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              data-testid="button-cta-events"
              className="backdrop-blur-sm bg-white/10 border-2 border-white/30 text-white px-12 py-6 text-lg"
            >
              <Link href="/events">
                <InlineEditable
                  contentKey="ctaButton2"
                  value={getSetting("ctaButton2")}
                  fallback="View Past Events"
                  as="span"
                />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
