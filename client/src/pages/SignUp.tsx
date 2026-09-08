import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { insertSignupSchema, type InsertSignup } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, CheckCircle2, Calendar, Clock, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { nextEventInfo } from "@/data/static-data";

export default function SignUp() {
  const { toast } = useToast();
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<InsertSignup>({
    resolver: zodResolver(insertSignupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      message: "",
      referralSource: "",
      eventId: "diva-day-jan-2025",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertSignup) => {
      return await apiRequest("POST", "/api/signup", data);
    },
    onSuccess: () => {
      setIsSuccess(true);
      form.reset();
      toast({
        title: "You're Signed Up",
        description: "We can't wait to see you at Delco Divas Day!",
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

  const onSubmit = (data: InsertSignup) => {
    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="py-8 sm:py-16 bg-gradient-to-b from-black via-background to-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold mb-4 animate-fade-in-up">
            Sign Up for <span className="text-foreground">March into Movement</span>
          </h1>
          <p className="text-xl sm:text-2xl text-foreground/80 leading-relaxed animate-fade-in">
            Reserve your spot for an unforgettable day of movement, wellness, and community
          </p>
        </div>
      </section>

      {/* Event Details */}
      <section className="py-4 sm:py-8 bg-gradient-to-b from-background to-black/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-card border border-foreground/20 rounded-lg overflow-hidden">
            <div className="grid gap-0">
              <div className="p-8 sm:p-12 flex flex-col justify-center">
                <h2 className="text-3xl sm:text-4xl font-display font-bold mb-8">
                  {nextEventInfo.title}
                </h2>
                <div className="grid gap-6 mb-8">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-foreground/10 flex items-center justify-center shrink-0">
                      <Calendar className="w-6 h-6 text-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Date</p>
                      <p className="text-lg font-semibold" data-testid="text-event-date">{nextEventInfo.date}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-foreground/10 flex items-center justify-center shrink-0">
                      <Clock className="w-6 h-6 text-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Time</p>
                      <p className="text-lg font-semibold" data-testid="text-event-time">{nextEventInfo.time}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-foreground/10 flex items-center justify-center shrink-0">
                      <MapPin className="w-6 h-6 text-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Location</p>
                      <p className="text-lg font-semibold" data-testid="text-event-location">{nextEventInfo.location}</p>
                    </div>
                  </div>
                </div>
                <p className="text-foreground/80 leading-relaxed" data-testid="text-event-description">
                  {nextEventInfo.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sign-Up Form */}
      <section className="py-16 sm:py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {isSuccess ? (
            <div className="bg-card border border-foreground/20 rounded-lg p-12 text-center animate-scale-in">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-foreground/10 mb-6">
                <CheckCircle2 className="w-10 h-10 text-foreground" />
              </div>
              <h2 className="text-3xl font-display font-bold mb-4">
                You're All Set
              </h2>
              <p className="text-lg text-foreground/80 mb-8">
                We've received your registration for Delco Divas Day. Check your email for confirmation and event details.
              </p>
              <Button
                onClick={() => setIsSuccess(false)}
                variant="outline"
                data-testid="button-register-another"
              >
                Register Another Person
              </Button>
            </div>
          ) : (
            <div className="bg-card border border-card-border rounded-lg p-8 sm:p-12 hover-elevate transition-all duration-300">
              <h2 className="text-2xl font-display font-bold mb-8">
                Registration Form
              </h2>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8" data-testid="form-signup">
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
                    Phone Number *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    {...form.register("phone")}
                    placeholder="(555) 123-4567"
                    data-testid="input-phone"
                    className="h-12 bg-background border-input focus:border-primary focus:ring-primary transition-all duration-300"
                  />
                  {form.formState.errors.phone && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.phone.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="referralSource" className="text-sm font-medium">
                    How Did You Hear About Us? <span className="text-muted-foreground">(Optional)</span>
                  </Label>
                  <Input
                    id="referralSource"
                    {...form.register("referralSource")}
                    placeholder="Friend, social media, event, etc."
                    data-testid="input-referral-source"
                    className="h-12 bg-background border-input focus:border-primary focus:ring-primary transition-all duration-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-sm font-medium">
                    Message or Special Requests <span className="text-muted-foreground">(Optional)</span>
                  </Label>
                  <Textarea
                    id="message"
                    {...form.register("message")}
                    placeholder="Tell us anything we should know (dietary restrictions, accessibility needs, etc.)"
                    data-testid="input-message"
                    rows={4}
                    className="bg-background border-input focus:border-primary focus:ring-primary transition-all duration-300 resize-none"
                  />
                </div>

                <div className="bg-foreground/5 border border-foreground/10 rounded-lg p-4">
                  <p className="text-sm text-foreground/80 text-center font-medium">
                    Ticket price & payment method will be sent out via email once you have submitted your registration form.
                  </p>
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
                        Submitting...
                      </>
                    ) : (
                      "Complete Registration"
                    )}
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
