import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { insertReviewSchema, type InsertReview } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, CheckCircle2, Star, MessageSquare, Quote } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";

export default function Reviews() {
  const { toast } = useToast();
  const [isSuccess, setIsSuccess] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);

  type PublicReview = Omit<InsertReview, "email"> & { id: string; createdAt: string | null };

  const { data: reviewsData, isLoading: reviewsLoading } = useQuery<{ data: PublicReview[] }>({
    queryKey: ["/api/reviews"],
  });

  const featuredReviews = reviewsData?.data || [];

  const form = useForm<InsertReview>({
    resolver: zodResolver(insertReviewSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      eventAttended: "",
      rating: "",
      review: "",
      canFeature: "yes",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertReview) => {
      return await apiRequest("POST", "/api/reviews", data);
    },
    onSuccess: () => {
      setIsSuccess(true);
      form.reset();
      setSelectedRating(0);
      queryClient.invalidateQueries({ queryKey: ["/api/reviews"] });
      toast({
        title: "Thank You!",
        description: "Your review has been submitted successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Oops!",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertReview) => {
    if (selectedRating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a star rating before submitting.",
        variant: "destructive",
      });
      return;
    }
    data.rating = selectedRating.toString();
    mutation.mutate(data);
  };

  const handleRatingClick = (rating: number) => {
    setSelectedRating(rating);
    form.setValue("rating", rating.toString());
  };

  return (
    <div className="min-h-screen pt-20">
      <section className="pt-12 pb-8 sm:pt-32 sm:pb-12 bg-gradient-to-b from-black via-background to-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-foreground/10 mb-8 animate-scale-in">
            <MessageSquare className="w-10 h-10 text-foreground" />
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold mb-8 animate-fade-in-up">
            Share Your <span className="text-foreground">Experience</span>
          </h1>
          <p className="text-xl sm:text-2xl text-foreground/80 leading-relaxed animate-fade-in">
            Loved your Delco Divas Day experience? We'd love to hear about it! Your review may be featured on our website.
          </p>
        </div>
      </section>

      {featuredReviews.length > 0 && (
        <section className="pt-4 pb-8 sm:pt-8 sm:pb-16" data-testid="section-featured-reviews">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-center mb-4">
              What Our <span className="text-gold">Divas</span> Say
            </h2>
            <p className="text-foreground/60 text-center mb-12 text-lg">
              Real experiences from our amazing community
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredReviews.map((review) => (
                <Card
                  key={review.id}
                  className="bg-card border border-foreground/10 p-6 flex flex-col"
                  data-testid={`card-review-${review.id}`}
                >
                  <div className="flex items-center gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-5 h-5 ${
                          star <= parseInt(review.rating)
                            ? "fill-gold text-gold"
                            : "text-foreground/20"
                        }`}
                      />
                    ))}
                  </div>
                  <Quote className="w-8 h-8 text-gold/30 mb-3" />
                  <p className="text-foreground/80 leading-relaxed flex-1 mb-4" data-testid={`text-review-${review.id}`}>
                    {review.review}
                  </p>
                  <div className="border-t border-foreground/10 pt-4 mt-auto">
                    <p className="font-semibold text-foreground" data-testid={`text-reviewer-${review.id}`}>
                      {review.firstName} {review.lastName}
                    </p>
                    <p className="text-sm text-foreground/50">{review.eventAttended}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {reviewsLoading && (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-foreground/40" />
        </div>
      )}

      <section className="py-8 sm:py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-center mb-8">
            Leave a <span className="text-gold">Review</span>
          </h2>
          {isSuccess ? (
            <div className="bg-card border border-foreground/20 rounded-lg p-12 text-center animate-scale-in">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-foreground/10 mb-6">
                <CheckCircle2 className="w-10 h-10 text-foreground" />
              </div>
              <h2 className="text-3xl font-display font-bold mb-4">
                Thank You, Diva!
              </h2>
              <p className="text-lg text-foreground/80 mb-8">
                Your review has been submitted. We appreciate you taking the time to share your experience with us!
              </p>
              <Button
                onClick={() => setIsSuccess(false)}
                variant="outline"
                data-testid="button-submit-another"
              >
                Submit Another Review
              </Button>
            </div>
          ) : (
            <div className="bg-card border border-card-border rounded-lg p-8 sm:p-12 transition-all duration-300">
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8" data-testid="form-review">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-medium">
                      First Name *
                    </Label>
                    <Input
                      id="firstName"
                      {...form.register("firstName")}
                      placeholder="Jane"
                      data-testid="input-firstname"
                      className="h-12 bg-background border-input focus:border-primary focus:ring-primary transition-all duration-300"
                    />
                    {form.formState.errors.firstName && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.firstName.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-medium">
                      Last Name *
                    </Label>
                    <Input
                      id="lastName"
                      {...form.register("lastName")}
                      placeholder="Doe"
                      data-testid="input-lastname"
                      className="h-12 bg-background border-input focus:border-primary focus:ring-primary transition-all duration-300"
                    />
                    {form.formState.errors.lastName && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    {...form.register("email")}
                    placeholder="jane@example.com"
                    data-testid="input-email"
                    className="h-12 bg-background border-input focus:border-primary focus:ring-primary transition-all duration-300"
                  />
                  {form.formState.errors.email && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="eventAttended" className="text-sm font-medium">
                    Which Event Did You Attend? *
                  </Label>
                  <Input
                    id="eventAttended"
                    {...form.register("eventAttended")}
                    placeholder="e.g., Delco Divas Day - January 2025"
                    data-testid="input-event-attended"
                    className="h-12 bg-background border-input focus:border-primary focus:ring-primary transition-all duration-300"
                  />
                  {form.formState.errors.eventAttended && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.eventAttended.message}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium">
                    Your Rating *
                  </Label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleRatingClick(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        className="p-1 transition-transform duration-200 hover:scale-110"
                        data-testid={`button-star-${star}`}
                      >
                        <Star
                          className={`w-10 h-10 transition-colors duration-200 ${
                            star <= (hoveredRating || selectedRating)
                              ? "fill-gold text-gold"
                              : "text-foreground/30"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <input type="hidden" {...form.register("rating")} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="review" className="text-sm font-medium">
                    Your Review *
                  </Label>
                  <Textarea
                    id="review"
                    {...form.register("review")}
                    placeholder="Tell us about your experience at Delco Divas Day! What did you love? How did it make you feel?"
                    rows={6}
                    data-testid="input-review"
                    className="bg-background border-input focus:border-primary focus:ring-primary transition-all duration-300 resize-none"
                  />
                  {form.formState.errors.review && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.review.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Can we feature your review on our website?
                  </Label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value="yes"
                        {...form.register("canFeature")}
                        defaultChecked
                        className="w-4 h-4 accent-gold"
                        data-testid="radio-feature-yes"
                      />
                      <span className="text-foreground/80">Yes, feature my review!</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value="no"
                        {...form.register("canFeature")}
                        className="w-4 h-4 accent-gold"
                        data-testid="radio-feature-no"
                      />
                      <span className="text-foreground/80">No, keep it private</span>
                    </label>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={mutation.isPending}
                  className="w-full bg-gold text-black font-semibold py-6 text-lg transition-all duration-300"
                  data-testid="button-submit-review"
                >
                  {mutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Your Review"
                  )}
                </Button>
              </form>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
