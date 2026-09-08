import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { insertNewsletterSchema, type InsertNewsletter } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle2, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Newsletter() {
  const { toast } = useToast();
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<InsertNewsletter>({
    resolver: zodResolver(insertNewsletterSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      referralSource: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertNewsletter) => {
      return await apiRequest("POST", "/api/newsletter", data);
    },
    onSuccess: () => {
      setIsSuccess(true);
      form.reset();
      toast({
        title: "Welcome to the Movement",
        description: "You've successfully joined the Delco Divas newsletter.",
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

  const onSubmit = (data: InsertNewsletter) => {
    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="py-8 sm:py-16 bg-gradient-to-b from-black via-background to-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-foreground/10 mb-6 animate-scale-in">
            <Mail className="w-8 h-8 text-foreground" />
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-4 animate-fade-in-up">
            Become a <span className="text-foreground">Diva Today</span>
          </h1>
          <p className="text-lg sm:text-xl text-foreground/80 leading-relaxed animate-fade-in">
            Subscribe to our newsletter for exclusive updates, early event announcements, wellness tips, and more
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-4 sm:py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {isSuccess ? (
            <div className="bg-card border border-foreground/20 rounded-lg p-12 text-center animate-scale-in">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-foreground/10 mb-6">
                <CheckCircle2 className="w-10 h-10 text-foreground" />
              </div>
              <h2 className="text-3xl font-display font-bold mb-4">
                You're In
              </h2>
              <p className="text-lg text-foreground/80 mb-8">
                Welcome to the Delco Divas community! Check your inbox for a confirmation email.
              </p>
              <Button
                onClick={() => setIsSuccess(false)}
                variant="outline"
                data-testid="button-subscribe-another"
              >
                Subscribe Another Email
              </Button>
            </div>
          ) : (
            <div className="bg-card border border-card-border rounded-lg p-8 sm:p-12 hover-elevate transition-all duration-300">
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8" data-testid="form-newsletter">
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
                  <Label htmlFor="phone" className="text-sm font-medium">
                    Phone Number <span className="text-muted-foreground">(Optional)</span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    {...form.register("phone")}
                    placeholder="(555) 123-4567"
                    data-testid="input-phone"
                    className="h-12 bg-background border-input focus:border-primary focus:ring-primary transition-all duration-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="referralSource" className="text-sm font-medium">
                    How Did You Hear About the Divas? <span className="text-muted-foreground">(Optional)</span>
                  </Label>
                  <Input
                    id="referralSource"
                    {...form.register("referralSource")}
                    placeholder="Friend, social media, event, etc."
                    data-testid="input-referral-source"
                    className="h-12 bg-background border-input focus:border-primary focus:ring-primary transition-all duration-300"
                  />
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    disabled={mutation.isPending}
                    data-testid="button-submit"
                    className="w-full h-14 bg-gold hover:bg-gold/90 text-black font-semibold text-lg transition-all duration-300 hover:scale-105 disabled:opacity-50"
                  >
                    {mutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Subscribing...
                      </>
                    ) : (
                      "Join the Newsletter"
                    )}
                  </Button>
                </div>
              </form>

              <div className="mt-8 pt-8 border-t border-border">
                <p className="text-sm text-muted-foreground text-center">
                  By subscribing, you'll receive updates about upcoming events, wellness tips, and exclusive Delco Divas news. You can unsubscribe at any time.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-10 sm:py-20 bg-gradient-to-b from-background to-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-center mb-12">
            What You'll Get
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Early Access",
                description: "Be the first to know about new events and workshops before public announcements",
              },
              {
                title: "Wellness Tips",
                description: "Exclusive Pilates and dance tips from Brooke and Kim delivered to your inbox",
              },
              {
                title: "Community Updates",
                description: "Stay connected with Divas news, photos from events, and inspiring stories",
              },
            ].map((benefit, index) => (
              <div
                key={index}
                className="bg-card border border-card-border rounded-lg p-6 hover-elevate transition-all duration-300"
              >
                <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                <p className="text-foreground/70 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
