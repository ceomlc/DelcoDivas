import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <div className="text-center px-4">
        <h1 className="text-8xl sm:text-9xl font-display font-bold text-foreground mb-4 animate-scale-in">
          404
        </h1>
        <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4 animate-fade-in">
          Page Not Found
        </h2>
        <p className="text-xl text-foreground/70 mb-12 max-w-md mx-auto animate-fade-in-up">
          Looks like this page took a wrong turn. Let's get you back on track!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <Button
            asChild
            size="lg"
            className="bg-gold hover:bg-gold/90 text-black font-semibold px-8 py-6 text-lg transition-all duration-300 hover:scale-105"
            data-testid="button-home"
          >
            <Link href="/">
              <Home className="mr-2 h-5 w-5" />
              Go Home
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => window.history.back()}
            data-testid="button-back"
            className="px-8 py-6 text-lg transition-all duration-300 hover:scale-105"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}
