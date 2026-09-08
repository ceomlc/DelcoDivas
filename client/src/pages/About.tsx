import { founders as staticFounders } from "@/data/static-data";
import { Quote, Loader2 } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Founder } from "@shared/schema";
import { EditableText } from "@/components/EditableText";
import { EditableImage } from "@/components/EditableImage";
import { useEditMode } from "@/contexts/EditModeContext";
import { useToast } from "@/hooks/use-toast";
import groupPhoto1 from "@assets/IMG_1656_1762219885963.png";
import groupPhoto2 from "@assets/IMG_1658_1762219885964.png";
import groupPhoto3 from "@assets/FullSizeRender(1)_1762219885959.jpg";
import groupPhoto4 from "@assets/FullSizeRender(2)_1762219885960.jpg";
import groupPhoto5 from "@assets/FullSizeRender(3)_1762219885960.jpg";
import groupPhoto6 from "@assets/FullSizeRender_1762219885962.jpg";

export default function About() {
  const { isEditMode } = useEditMode();
  const { toast } = useToast();

  // Fetch founders from database
  const { data: apiResponse, isLoading } = useQuery<{ data: Founder[] }>({
    queryKey: ['/api/founders'],
  });

  // Mutation to update founder
  const updateFounderMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Founder> }) => {
      return apiRequest("PATCH", `/api/admin/founders/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/founders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/founders"] });
      toast({
        title: "Saved",
        description: "Your changes have been saved.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to save changes. Please try again.",
        variant: "destructive",
      });
      console.error("Update error:", error);
    },
  });

  // Use database founders if available, otherwise fall back to static data
  const dbFounders = apiResponse?.data || [];
  const founders = dbFounders.length > 0
    ? dbFounders.map((f) => ({
        id: f.id,
        name: f.name,
        title: f.title || '',
        bio: f.bio || '',
        pullQuote: f.pullQuote || '',
        imageUrl: f.imageUrl || '',
      }))
    : staticFounders;

  // Show loading state while fetching
  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    );
  }

  // Make sure we have at least 2 founders for the layout
  const founder1 = founders[0] || staticFounders[0];
  const founder2 = founders[1] || staticFounders[1];

  // Helper to update a founder field
  const updateFounder = (founderId: string, field: string, value: string) => {
    if (dbFounders.length > 0) {
      updateFounderMutation.mutate({ id: founderId, data: { [field]: value } });
    } else {
      toast({
        title: "Add founders first",
        description: "Please add founders in the admin panel before editing.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="pt-16 pb-4 sm:pt-20 sm:pb-6 bg-gradient-to-b from-black via-background to-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold mb-8 animate-fade-in-up">
            Meet the <span className="font-semibold">Founders</span>
          </h1>
          <p className="text-xl sm:text-2xl text-foreground/80 leading-relaxed animate-fade-in">
            The visionaries behind the Delco Divas movement
          </p>
        </div>
      </section>

      {/* Founder 1 - Asymmetric Layout (Left-heavy) */}
      <section className="py-12 sm:py-16 relative overflow-hidden" data-testid="section-founder-brooke">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Image - Bleeds off left edge on desktop */}
            <div className="relative animate-slide-in-left">
              <div className="aspect-[4/5] max-w-md mx-auto rounded-lg overflow-hidden border-2 border-foreground/20 shadow-2xl hover:scale-105 transition-transform duration-500">
                {isEditMode && dbFounders.length > 0 ? (
                  <EditableImage
                    src={founder1.imageUrl}
                    alt={founder1.name}
                    onImageChange={(url) => updateFounder(founder1.id, "imageUrl", url)}
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                    data-testid="img-founder-brooke"
                  />
                ) : (
                  <img
                    src={founder1.imageUrl}
                    alt={founder1.name}
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                    data-testid="img-founder-brooke"
                  />
                )}
              </div>
            </div>

            {/* Content */}
            <div className="space-y-8 animate-slide-in-right">
              <div>
                {isEditMode && dbFounders.length > 0 ? (
                  <>
                    <EditableText
                      value={founder1.name}
                      onSave={(value) => updateFounder(founder1.id, "name", value)}
                      as="h2"
                      className="text-4xl sm:text-5xl font-display font-bold mb-3"
                      data-testid="text-name-brooke"
                    />
                    <EditableText
                      value={founder1.title}
                      onSave={(value) => updateFounder(founder1.id, "title", value)}
                      as="p"
                      className="text-xl text-muted-foreground font-medium tracking-wide uppercase"
                      data-testid="text-title-brooke"
                    />
                  </>
                ) : (
                  <>
                    <h2 className="text-4xl sm:text-5xl font-display font-bold mb-3" data-testid="text-name-brooke">
                      {founder1.name}
                    </h2>
                    <p className="text-xl text-muted-foreground font-medium tracking-wide uppercase" data-testid="text-title-brooke">
                      {founder1.title}
                    </p>
                  </>
                )}
              </div>

              {isEditMode && dbFounders.length > 0 ? (
                <EditableText
                  value={founder1.bio}
                  onSave={(value) => updateFounder(founder1.id, "bio", value)}
                  as="p"
                  multiline
                  className="text-lg text-foreground/80 leading-relaxed"
                  data-testid="text-bio-brooke"
                />
              ) : (
                <p className="text-lg text-foreground/80 leading-relaxed" data-testid="text-bio-brooke">
                  {founder1.bio}
                </p>
              )}

              {/* Pull Quote */}
              <div className="relative pl-6 border-l-4 border-foreground/30 py-4">
                <Quote className="absolute -left-3 top-0 w-6 h-6 text-muted-foreground" />
                {isEditMode && dbFounders.length > 0 ? (
                  <EditableText
                    value={founder1.pullQuote}
                    onSave={(value) => updateFounder(founder1.id, "pullQuote", value)}
                    as="p"
                    className="text-2xl sm:text-3xl font-display italic text-foreground/90 leading-relaxed"
                    data-testid="text-quote-brooke"
                  />
                ) : (
                  <p className="text-2xl sm:text-3xl font-display italic text-foreground/90 leading-relaxed" data-testid="text-quote-brooke">
                    "{founder1.pullQuote}"
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Spacer */}
      <div className="h-8 sm:h-20" />

      {/* Founder 2 - Inverted Asymmetric Layout (Right-heavy) */}
      <section className="py-8 sm:py-16 relative overflow-hidden bg-gradient-to-b from-background to-black" data-testid="section-founder-kim">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Content - Left side on desktop */}
            <div className="space-y-8 lg:order-1 animate-slide-in-left">
              <div>
                {isEditMode && dbFounders.length > 0 ? (
                  <>
                    <EditableText
                      value={founder2.name}
                      onSave={(value) => updateFounder(founder2.id, "name", value)}
                      as="h2"
                      className="text-4xl sm:text-5xl font-display font-bold mb-3 text-black"
                      data-testid="text-name-kim"
                    />
                    <EditableText
                      value={founder2.title}
                      onSave={(value) => updateFounder(founder2.id, "title", value)}
                      as="p"
                      className="text-xl text-white font-medium tracking-wide uppercase"
                      data-testid="text-title-kim"
                    />
                  </>
                ) : (
                  <>
                    <h2 className="text-4xl sm:text-5xl font-display font-bold mb-3 text-black" data-testid="text-name-kim">
                      {founder2.name}
                    </h2>
                    <p className="text-xl text-white font-medium tracking-wide uppercase" data-testid="text-title-kim">
                      {founder2.title}
                    </p>
                  </>
                )}
              </div>

              {isEditMode && dbFounders.length > 0 ? (
                <EditableText
                  value={founder2.bio}
                  onSave={(value) => updateFounder(founder2.id, "bio", value)}
                  as="p"
                  multiline
                  className="text-lg text-white leading-relaxed"
                  data-testid="text-bio-kim"
                />
              ) : (
                <p className="text-lg text-white leading-relaxed" data-testid="text-bio-kim">
                  {founder2.bio}
                </p>
              )}

              {/* Pull Quote */}
              <div className="relative pl-6 border-l-4 border-white/30 py-4">
                <Quote className="absolute -left-3 top-0 w-6 h-6 text-white/70" />
                {isEditMode && dbFounders.length > 0 ? (
                  <EditableText
                    value={founder2.pullQuote}
                    onSave={(value) => updateFounder(founder2.id, "pullQuote", value)}
                    as="p"
                    className="text-2xl sm:text-3xl font-display italic text-white leading-relaxed"
                    data-testid="text-quote-kim"
                  />
                ) : (
                  <p className="text-2xl sm:text-3xl font-display italic text-white leading-relaxed" data-testid="text-quote-kim">
                    "{founder2.pullQuote}"
                  </p>
                )}
              </div>
            </div>

            {/* Image - Bleeds off right edge on desktop */}
            <div className="relative lg:order-2 animate-slide-in-right">
              <div className="aspect-[4/5] max-w-md mx-auto rounded-lg overflow-hidden border-2 border-foreground/20 shadow-2xl hover:scale-105 transition-transform duration-500">
                {isEditMode && dbFounders.length > 0 ? (
                  <EditableImage
                    src={founder2.imageUrl}
                    alt={founder2.name}
                    onImageChange={(url) => updateFounder(founder2.id, "imageUrl", url)}
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                    data-testid="img-founder-kim"
                  />
                ) : (
                  <img
                    src={founder2.imageUrl}
                    alt={founder2.name}
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                    data-testid="img-founder-kim"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-foreground/5 via-transparent to-transparent" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl sm:text-5xl font-display font-bold mb-8 animate-fade-in">
            Our Mission
          </h2>
          <p className="text-xl sm:text-2xl text-foreground/80 leading-relaxed mb-8">
            The Delco Divas exist to create a welcoming, empowering space where women can discover their strength through movement, build lasting friendships, and celebrate their unique journey to wellness. We believe that fitness should be joyful, inclusive, and transformative—not just for the body, but for the soul.
          </p>
          <p className="text-lg text-foreground/70 leading-relaxed">
            From our featured performance at the Philadelphia Phillies game to our intimate studio workshops, we're committed to bringing women together through dance, Pilates, and community celebration.
          </p>
        </div>
      </section>

      {/* Community in Action Gallery */}
      <section className="py-20 bg-gradient-to-b from-black via-background to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-display font-bold mb-6 text-white">
              Community in <span className="font-semibold">Action</span>
            </h2>
            <p className="text-xl text-white/80 leading-relaxed max-w-3xl mx-auto">
              See the Delco Divas in motion—from group fitness classes to special events
            </p>
          </div>

          {/* Photo Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { src: groupPhoto1, alt: "Delco Divas group fitness class with exercise balls" },
              { src: groupPhoto2, alt: "Women exercising together with exercise balls" },
              { src: groupPhoto3, alt: "Delco Divas community gathering" },
              { src: groupPhoto4, alt: "Group workout session" },
              { src: groupPhoto5, alt: "Divas celebrating together" },
              { src: groupPhoto6, alt: "Community fitness event" },
            ].map((photo, index) => (
              <div
                key={index}
                className="group relative aspect-[4/3] rounded-lg overflow-hidden bg-card border border-card-border hover-elevate transition-all duration-300"
                data-testid={`img-community-${index}`}
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
