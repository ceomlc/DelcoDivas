import { useState } from "react";
import { Calendar, MapPin, X, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { SiteSetting, Event } from "@shared/schema";

const FALLBACK_EVENTS_CTA_IMAGE = "https://placehold.co/1920x1080/1a1a1a/gold?text=Delco+Divas";
const FALLBACK_EVENT_IMAGE = "https://placehold.co/800x600/1a1a1a/gold?text=Delco+Divas+Event";

export default function Events() {
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const { data: settingsData } = useQuery<{ data: SiteSetting[] }>({
    queryKey: ["/api/settings"],
  });
  const settings = settingsData?.data || [];
  const getSetting = (key: string) => settings.find(s => s.key === key)?.value || "";

  const { data: eventsData, isLoading } = useQuery<{ data: Event[] }>({
    queryKey: ["/api/events"],
  });

  const events = (eventsData?.data || []).filter(e => e.isActive);

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="py-20 sm:py-32 bg-gradient-to-b from-black via-background to-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold mb-8 animate-fade-in-up">
            Delco <span className="text-foreground">Divas Day</span>
          </h1>
          <p className="text-xl sm:text-2xl text-foreground/80 leading-relaxed animate-fade-in">
            Celebrating movement, community, and unforgettable moments together
          </p>
        </div>
      </section>

      {/* Past Events Section */}
      <section className="py-16 sm:py-20 bg-background" data-testid="section-past-events">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-display font-bold mb-12 text-center">
            Past Events
          </h2>

          {isLoading && (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-gold" />
            </div>
          )}

          {!isLoading && events.length === 0 && (
            <div className="text-center py-20 text-foreground/60">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-gold/40" />
              <p className="text-xl">No past events yet — check back soon!</p>
              <p className="text-sm mt-2">Events are managed in the admin panel.</p>
            </div>
          )}

          <div className="space-y-16">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-card border border-card-border rounded-lg overflow-hidden"
                data-testid={`card-past-event-${event.id}`}
              >
                <div className="grid md:grid-cols-2 gap-0">
                  {/* Event Image */}
                  <div
                    className="relative aspect-[4/3] md:aspect-auto overflow-hidden cursor-pointer"
                    onClick={() => event.imageUrl && setLightboxImage(event.imageUrl)}
                  >
                    <img
                      src={event.imageUrl || FALLBACK_EVENT_IMAGE}
                      alt={event.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4">
                      <Badge
                        variant="secondary"
                        className="bg-white/90 text-black font-semibold backdrop-blur-sm"
                      >
                        {event.date}
                      </Badge>
                    </div>
                  </div>

                  {/* Event Info */}
                  <div className="p-8 flex flex-col justify-center">
                    <h3 className="text-2xl sm:text-3xl font-display font-bold mb-4">
                      {event.title}
                    </h3>
                    <div className="flex flex-col gap-2 mb-6 text-foreground/70">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-gold" />
                        <span>{event.date}{event.time ? ` • ${event.time}` : ""}</span>
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-gold" />
                          <span>{event.location}</span>
                        </div>
                      )}
                    </div>
                    {event.description && (
                      <p className="text-foreground/80 leading-relaxed mb-6">
                        {event.description}
                      </p>
                    )}
                    {event.price && (
                      <p className="text-gold font-semibold text-lg">{event.price}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section with Background Image */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={getSetting("eventsCtaImageUrl") || FALLBACK_EVENTS_CTA_IMAGE}
            alt="Delco Divas community"
            className="w-full h-full object-cover"
            style={{ objectPosition: '50% 25%' }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl sm:text-5xl font-display font-bold mb-8 text-white">
            Don't Miss the Next Event
          </h2>
          <p className="text-xl text-white/90 mb-12 leading-relaxed">
            Why just watch the fun… when you can be the Diva? Stay connected and be the first to know about upcoming Diva Day events, workshops, and special performances.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <button className="bg-gold hover:bg-gold/90 text-black font-semibold px-12 py-4 text-lg rounded-md transition-all duration-300 hover:scale-105" data-testid="button-cta-signup">
                Sign Up for Next Event
              </button>
            </Link>
            <Link href="/newsletter">
              <button className="backdrop-blur-sm bg-white/10 border-2 border-white/30 text-white hover:bg-white/20 px-12 py-4 text-lg rounded-md transition-all duration-300 hover:scale-105" data-testid="button-cta-newsletter">
                Join Newsletter
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Image Lightbox */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-2"
            data-testid="button-close-lightbox"
          >
            <X className="w-8 h-8" />
          </button>
          <div
            className="max-w-5xl w-full max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightboxImage}
              alt="Event photo"
              className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}
