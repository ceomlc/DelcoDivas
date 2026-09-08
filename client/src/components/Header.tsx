import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { Menu, X, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEditMode } from "@/contexts/EditModeContext";

export function Header() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isEditMode, setIsEditMode, isAdmin } = useEditMode();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/events", label: "Diva Day" },
    { href: "/newsletter", label: "Newsletter" },
    { href: "/signup", label: "Sign Up" },
    { href: "/merch", label: "Merch" },
    { href: "/media", label: "Media" },
    { href: "/reviews", label: "Reviews" },
  ];

  const isHomePage = location === "/";
  const shouldShowDarkBg = !isHomePage || isScrolled;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          shouldShowDarkBg
            ? "backdrop-blur-md bg-black/80 border-b border-white/10"
            : "bg-transparent"
        }`}
        data-testid="header-navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" data-testid="link-home">
              <span className="flex items-center space-x-2 hover-elevate transition-all duration-300 rounded-md px-2 py-1 cursor-pointer">
                <span className="font-display text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white via-white to-white bg-clip-text text-transparent">
                  Delco Divas
                </span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <span
                    data-testid={`link-nav-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                    className={`px-4 py-2 text-sm font-medium transition-all duration-300 rounded-md hover-elevate cursor-pointer ${
                      location === link.href
                        ? "text-gold"
                        : "text-white/90 hover:text-white"
                    }`}
                  >
                    {link.label}
                  </span>
                </Link>
              ))}
              
              {/* Edit Mode Toggle for Admin */}
              {isAdmin && (
                <Button
                  size="sm"
                  onClick={() => setIsEditMode(!isEditMode)}
                  className={`ml-4 ${
                    isEditMode
                      ? "bg-[#D4AF37] text-black"
                      : "bg-zinc-800/80 text-white border border-zinc-600"
                  }`}
                  data-testid="button-edit-mode-toggle"
                >
                  <Pencil className="w-4 h-4 mr-2" />
                  {isEditMode ? "Exit Edit" : "Edit Site"}
                </Button>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <Button
              size="icon"
              variant="ghost"
              className="lg:hidden text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Full-Screen Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/95 backdrop-blur-lg lg:hidden"
          data-testid="mobile-menu-overlay"
        >
          <div className="flex flex-col items-center justify-center h-full space-y-8 animate-fade-in">
            {navLinks.map((link, index) => (
              <Link key={link.href} href={link.href}>
                <span
                  onClick={() => setIsMobileMenuOpen(false)}
                  data-testid={`link-mobile-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                  className={`text-4xl font-display font-bold transition-all duration-300 hover:scale-110 cursor-pointer ${
                    location === link.href
                      ? "text-gold"
                      : "text-white hover:text-gold"
                  }`}
                  style={{
                    animationDelay: `${index * 0.1}s`,
                    animation: "fade-in-up 0.6s ease-out forwards",
                    opacity: 0,
                  }}
                >
                  {link.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
