import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { EditModeProvider } from "@/contexts/EditModeContext";
import { EditModeToggle } from "@/components/EditModeToggle";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Events from "@/pages/Events";
import Newsletter from "@/pages/Newsletter";
import SignUp from "@/pages/SignUp";
import Merchandise from "@/pages/Merchandise";
import Media from "@/pages/Media";
import Reviews from "@/pages/Reviews";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/events" component={Events} />
      <Route path="/newsletter" component={Newsletter} />
      <Route path="/signup" component={SignUp} />
      <Route path="/merch" component={Merchandise} />
      <Route path="/media" component={Media} />
      <Route path="/reviews" component={Reviews} />
      <Route path="/admin" component={AdminLogin} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/admin/forgot-password" component={ForgotPassword} />
      <Route path="/admin/reset-password" component={ResetPassword} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const [location] = useLocation();
  const isAdminRoute = location.startsWith("/admin");

  if (isAdminRoute) {
    return <Router />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Router />
      </main>
      <Footer />
      <EditModeToggle />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <EditModeProvider>
          <AppContent />
          <Toaster />
        </EditModeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
