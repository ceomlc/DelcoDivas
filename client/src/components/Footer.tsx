import { Link } from "wouter";
import { Facebook, Instagram } from "lucide-react";
import { socialLinks } from "@/data/static-data";
import { useQuery } from "@tanstack/react-query";
import { InlineEditable } from "@/components/InlineEditable";
import type { SiteSetting } from "@shared/schema";

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  const { data: settingsData } = useQuery<{ data: SiteSetting[] }>({
    queryKey: ["/api/settings"],
  });

  const settings = settingsData?.data || [];
  const getSetting = (key: string) => settings.find(s => s.key === key)?.value || "";

  return (
    <footer className="border-t border-white/10 bg-black/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          {/* Left: Navigation Links */}
          <div className="flex flex-wrap gap-x-8 gap-y-4">
            <Link href="/about">
              <span
                data-testid="link-footer-about"
                className="text-sm text-white/70 hover:text-foreground transition-colors duration-300 cursor-pointer"
              >
                About
              </span>
            </Link>
            <Link href="/events">
              <span
                data-testid="link-footer-events"
                className="text-sm text-white/70 hover:text-foreground transition-colors duration-300 cursor-pointer"
              >
                Events
              </span>
            </Link>
            <Link href="/newsletter">
              <span
                data-testid="link-footer-newsletter"
                className="text-sm text-white/70 hover:text-foreground transition-colors duration-300 cursor-pointer"
              >
                Newsletter
              </span>
            </Link>
            <Link href="/signup">
              <span
                data-testid="link-footer-signup"
                className="text-sm text-white/70 hover:text-foreground transition-colors duration-300 cursor-pointer"
              >
                Sign Up
              </span>
            </Link>
            <Link href="/merch">
              <span
                data-testid="link-footer-merch"
                className="text-sm text-white/70 hover:text-foreground transition-colors duration-300 cursor-pointer"
              >
                Merch
              </span>
            </Link>
            <Link href="/media">
              <span
                data-testid="link-footer-media"
                className="text-sm text-white/70 hover:text-foreground transition-colors duration-300 cursor-pointer"
              >
                Media
              </span>
            </Link>
          </div>

          {/* Right: Social Icons */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.platform}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                data-testid={`link-social-${social.platform.toLowerCase()}`}
                className="flex items-center justify-center w-10 h-10 rounded-full border border-white/20 text-white/70 hover:text-foreground hover:border-foreground hover:scale-110 transition-all duration-300"
                aria-label={social.platform}
              >
                {social.icon === "facebook" && <Facebook className="w-5 h-5" />}
                {social.icon === "instagram" && <Instagram className="w-5 h-5" />}
              </a>
            ))}
          </div>
        </div>

        {/* Footer Tagline */}
        <div className="mt-8 pt-8 border-t border-white/10 text-center space-y-4">
          <div className="text-lg font-display text-white/70 italic">
            <InlineEditable
              contentKey="footerTagline"
              value={getSetting("footerTagline")}
              fallback="Dance • Pilates • Community"
              as="p"
            />
          </div>
          
          {/* Copyright */}
          <p className="text-sm text-white/50">
            © {currentYear} Delco Divas. All rights reserved.
          </p>
          <div className="flex items-center justify-center gap-3 text-xs text-white/30">
            <span>Website by More Life Consulting</span>
            <span>•</span>
            <Link href="/admin">
              <span
                data-testid="link-footer-admin"
                className="hover:text-white/50 transition-colors cursor-pointer"
              >
                Admin
              </span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
