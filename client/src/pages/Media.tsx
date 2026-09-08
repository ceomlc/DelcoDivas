import { Play, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import type { GalleryVideo, MediaLink } from "@shared/schema";

const FALLBACK_THUMBNAIL = "https://placehold.co/1280x720/1a1a1a/gold?text=Watch+Now";

export default function Media() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const { data: galleryData } = useQuery<{ data: GalleryVideo[] }>({
    queryKey: ["/api/gallery-videos"],
  });

  const { data: mediaData, isLoading: mediaLoading } = useQuery<{ data: MediaLink[] }>({
    queryKey: ["/api/media"],
  });

  const videos = (galleryData?.data || [])
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

  const mediaLinks = (mediaData?.data || []);
  const featuredMedia = mediaLinks.filter(m => m.featured);
  const displayMedia = featuredMedia.length > 0 ? featuredMedia : mediaLinks;

  useEffect(() => {
    if (videos.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % videos.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [videos.length]);

  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (video) {
        if (index === currentIndex) {
          video.currentTime = 0;
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      }
    });
  }, [currentIndex]);

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="py-8 sm:py-16 bg-gradient-to-b from-black via-background to-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold mb-4 animate-fade-in-up">
            The Delco Divas <span className="text-foreground">Spotlight</span>
          </h1>
          <p className="text-xl sm:text-2xl text-foreground/80 leading-relaxed animate-fade-in">
            PRESS + MEDIA FEATURES + SOCIAL MEDIA
          </p>
        </div>
      </section>

      {/* Featured Media Links */}
      <section className="py-4 sm:py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {mediaLoading && (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-gold" />
            </div>
          )}

          {!mediaLoading && displayMedia.length === 0 && (
            <div className="text-center py-12 text-foreground/50">
              <p>No media links yet — add press features in the admin panel under Media Links.</p>
            </div>
          )}

          {displayMedia.map((media) => (
            <div
              key={media.id}
              className="bg-card border border-card-border rounded-lg overflow-hidden hover-elevate transition-all duration-300 animate-scale-in"
              data-testid={`media-item-${media.id}`}
            >
              {/* Thumbnail with Play Button */}
              <a
                href={media.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block relative group"
                data-testid="link-video-external"
              >
                <div className="relative aspect-video bg-black">
                  <img
                    src={media.thumbnailUrl || FALLBACK_THUMBNAIL}
                    alt={media.title || "Media"}
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300"
                    data-testid="img-video-thumbnail"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 group-hover:bg-gold transition-all duration-300 shadow-2xl">
                      <Play className="w-12 h-12 sm:w-16 sm:h-16 text-black fill-black ml-2" />
                    </div>
                  </div>
                  {media.featured && (
                    <div className="absolute top-6 left-6">
                      <span className="px-4 py-2 bg-white/90 text-black text-sm font-semibold rounded-md backdrop-blur-sm">
                        Featured Coverage
                      </span>
                    </div>
                  )}
                </div>
              </a>

              <div className="p-8 sm:p-12">
                <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4" data-testid="text-media-title">
                  {media.title}
                </h2>
                {media.description && (
                  <p className="text-lg text-foreground/80 leading-relaxed mb-8" data-testid="text-media-description">
                    {media.description}
                  </p>
                )}
                <Button
                  asChild
                  className="bg-gold hover:bg-gold/90 text-black font-semibold px-8 py-6 text-lg transition-all duration-300 hover:scale-105"
                  data-testid="button-watch-video"
                >
                  <a href={media.url} target="_blank" rel="noopener noreferrer">
                    Watch Full Video
                    <ExternalLink className="ml-2 h-5 w-5" />
                  </a>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Video Gallery Section - 3D Carousel */}
      <section className="py-10 sm:py-20 bg-black overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-4xl sm:text-5xl font-display font-bold mb-4 text-white">
              DIVAS IN ACTION
            </h2>
            <p className="text-lg text-white/80 max-w-3xl mx-auto mb-2">
              SEE WHAT THE DIVAS ARE UP TO!
            </p>
            <p className="text-lg text-white/70 max-w-3xl mx-auto">
              FOLLOW US ON SOCIAL MEDIA: FACEBOOK &amp; INSTAGRAM
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-8 mt-4 text-white/60">
              <span className="font-semibold">FACEBOOK: DELCO DIVAS</span>
              <span className="font-semibold">INSTAGRAM: @DELCODIVAS_</span>
            </div>
          </div>

          {videos.length === 0 ? (
            <p className="text-center text-white/40 py-12">
              No gallery videos yet — add videos in the admin panel under Gallery Videos.
            </p>
          ) : (
            <>
              {/* 3D Carousel */}
              <div className="relative h-[500px] sm:h-[600px] flex items-center justify-center" style={{ perspective: "1200px" }}>
                {videos.map((video, index) => {
                  const offset = index - currentIndex;
                  const absOffset = Math.abs(offset);
                  const isActive = offset === 0;
                  const isVisible = absOffset <= 3;

                  const translateX = offset * 180;
                  const translateZ = isActive ? 100 : -absOffset * 120;
                  const rotateY = offset * -15;
                  const opacity = isActive ? 1 : Math.max(0.3, 1 - absOffset * 0.25);
                  const scale = isActive ? 1.15 : Math.max(0.7, 1 - absOffset * 0.1);

                  return isVisible ? (
                    <div
                      key={video.id}
                      className="absolute transition-all duration-700 ease-out cursor-pointer"
                      style={{
                        transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                        opacity,
                        zIndex: 10 - absOffset,
                      }}
                      onClick={() => setCurrentIndex(index)}
                      data-testid={`media-video-${index}`}
                    >
                      <div
                        className={`relative w-[200px] sm:w-[280px] aspect-[9/16] rounded-xl overflow-hidden border-2 ${
                          isActive ? "border-gold shadow-2xl shadow-gold/30" : "border-white/20"
                        } transition-all duration-500`}
                      >
                        <video
                          ref={(el) => { videoRefs.current[index] = el; }}
                          src={video.videoUrl}
                          className="w-full h-full object-cover"
                          loop
                          muted
                          playsInline
                          preload="auto"
                          data-testid={`media-video-player-${index}`}
                        />
                        {!isActive && (
                          <div className="absolute inset-0 bg-black/40 transition-opacity duration-300" />
                        )}
                      </div>
                    </div>
                  ) : null;
                })}
              </div>

              {/* Carousel Indicators */}
              <div className="flex justify-center gap-2 mt-6">
                {videos.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentIndex ? "bg-gold w-6" : "bg-white/40 hover:bg-white/60"
                    }`}
                    data-testid={`carousel-indicator-${index}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Social Follow Buttons */}
      <section className="py-10 sm:py-16 bg-gradient-to-b from-black to-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Button
              asChild
              size="lg"
              className="bg-[#1877F2] hover:bg-[#166FE5] text-white font-semibold px-10 py-6 text-lg transition-all duration-300 hover:scale-105"
              data-testid="button-follow-facebook"
            >
              <a href="https://www.facebook.com/delcodivas" target="_blank" rel="noopener noreferrer">
                <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Follow Delco Divas
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 hover:from-purple-600 hover:via-pink-600 hover:to-orange-600 text-white font-semibold px-10 py-6 text-lg transition-all duration-300 hover:scale-105"
              data-testid="button-follow-instagram"
            >
              <a href="https://www.instagram.com/delcodivas_" target="_blank" rel="noopener noreferrer">
                <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                Follow @delcodivas_
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-foreground/5 via-transparent to-transparent" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl sm:text-5xl font-display font-bold mb-8">
            Want to Feature the Divas?
          </h2>
          <p className="text-xl text-foreground/80 mb-12 leading-relaxed">
            We're always excited to share our story and mission. Contact us for press inquiries, event coverage, or partnership opportunities.
          </p>
          <Button
            size="lg"
            className="bg-gold hover:bg-gold/90 text-black font-semibold px-12 py-6 text-lg transition-all duration-300 hover:scale-105"
            data-testid="button-contact-press"
            onClick={() => {
              window.location.href = "mailto:info@delcodivas.com?subject=Press%20Inquiry";
            }}
          >
            Contact Us
          </Button>
        </div>
      </section>
    </div>
  );
}
