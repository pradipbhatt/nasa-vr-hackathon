// components/ClientNavWrapper.tsx
"use client";

import { ReactNode, useState, useEffect, useRef } from "react";
import Navigation from "./Navigation";
import { usePathname } from "next/navigation";
import { 
  FaGlobeAmericas, 
  FaGithub, 
  FaRocket, 
  FaStar, 
  FaGalacticRepublic,
  FaSpaceShuttle,
  FaTwitter,
  FaLinkedin,
  FaArrowUp,
  FaHeart
} from "react-icons/fa";

type Props = {
  children: ReactNode;
  hideOnPaths?: string[];
};

export default function ClientNavWrapper({ children, hideOnPaths = ["/vr"] }: Props) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [mounted, setMounted] = useState(false);
  const hideNavAndFooter = hideOnPaths.includes(pathname);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };

    let ticking = false;
    const scrollHandler = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', scrollHandler, { passive: true });
    return () => window.removeEventListener('scroll', scrollHandler);
  }, []);

  useEffect(() => {
    closeMobileMenu();
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const socialLinks = [
    { icon: FaGlobeAmericas, href: "https://nasa.gov", label: "NASA" },
    { icon: FaGithub, href: "https://github.com/", label: "GitHub" },
    { icon: FaTwitter, href: "https://twitter.com/", label: "Twitter" },
    { icon: FaLinkedin, href: "https://linkedin.com/", label: "LinkedIn" }
  ];

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/story/chapter1", label: "Story" },
    { href: "/datasets", label: "Datasets" },
    { href: "/team", label: "Team" },
    { href: "/contact", label: "Contact" }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#020204] relative overflow-hidden">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#1a567e]/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#2a7bbe]/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
      </div>

      {/* Navbar */}
      {!hideNavAndFooter && (
        <Navigation
          logo="Yatra"
          links={navLinks}
          ctaLabel="Launch VR"
          isMobileMenuOpen={isMobileMenuOpen}
          onMobileMenuToggle={toggleMobileMenu}
          onMobileMenuClose={closeMobileMenu}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 w-full relative z-10">
        {children}
      </main>

      {/* Scroll to Top Button */}
      {!hideNavAndFooter && mounted && (
        <button
          onClick={scrollToTop}
          className={`
            fixed bottom-8 right-8 z-40 group
            p-4 rounded-full backdrop-blur-xl
            bg-gradient-to-br from-[#1a567e]/90 to-[#2a7bbe]/90
            border border-[#1a567e]/30 hover:border-[#2a7bbe]/50
            shadow-2xl shadow-[#1a567e]/20
            transition-all duration-500 ease-out
            hover:scale-110 hover:shadow-[#1a567e]/40
            active:scale-95
            focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2a7bbe]
            ${showScrollTop ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}
          `}
          aria-label="Scroll to top"
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#1a567e] to-[#2a7bbe] blur-lg opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
          <FaArrowUp className="w-5 h-5 text-white relative z-10 group-hover:-translate-y-1 transition-transform duration-300" />
        </button>
      )}

      {/* Footer */}
      {!hideNavAndFooter && (
        <footer className="w-full relative mt-20 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#1a567e]/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#020204] via-[#0a1f2d]/80 to-[#0a1f2d]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(26,86,126,0.1),transparent_50%)]" />
          <div className="absolute inset-0 backdrop-blur-3xl" />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
              
              {/* Brand Section */}
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center space-x-3 group">
                  <div className="relative">
                    <div className="absolute inset-0 bg-[#1a567e] rounded-full blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative bg-gradient-to-br from-[#0a1f2d] to-[#020204] border border-[#1a567e]/60 rounded-full p-3 group-hover:scale-110 transition-all duration-500">
                      <FaGalacticRepublic className="w-8 h-8 text-[#1a567e] group-hover:text-[#2a7bbe] transition-colors duration-500" />
                    </div>
                  </div>
                  <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-[#babab8] to-white">
                    Yatra
                  </span>
                </div>
                
                <p className="text-[#babab8] text-base leading-relaxed max-w-md">
                  Embark on an immersive journey through space and time. Explore cosmic wonders through cutting-edge VR technology and interactive storytelling.
                </p>

                <div className="flex items-center space-x-3">
                  <span className="text-sm text-[#1a567e] font-semibold">Connect:</span>
                  <div className="flex space-x-2">
                    {socialLinks.map((social) => (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative p-3 rounded-xl bg-[#0a1f2d]/60 backdrop-blur-xl border border-[#1a567e]/20 hover:border-[#2a7bbe]/40 transition-all duration-500 hover:scale-110 hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1a567e]"
                        aria-label={social.label}
                      >
                        <social.icon className="w-4 h-4 text-[#babab8] group-hover:text-[#2a7bbe] transition-colors duration-300" />
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#1a567e]/0 via-[#1a567e]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="space-y-6">
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-lg bg-[#1a567e]/20">
                    <FaStar className="w-4 h-4 text-[#1a567e]" />
                  </div>
                  <h4 className="text-lg font-bold text-white">Explore</h4>
                </div>
                <nav className="space-y-2">
                  {navLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      className="group flex items-center space-x-2 text-[#babab8] hover:text-white transition-all duration-300 py-1.5 px-3 -mx-3 rounded-lg hover:bg-[#1a567e]/10"
                    >
                      <div className="w-0 h-px bg-gradient-to-r from-[#1a567e] to-transparent group-hover:w-4 transition-all duration-300" />
                      <span className="text-sm font-medium group-hover:translate-x-1 transition-transform duration-300">
                        {link.label}
                      </span>
                    </a>
                  ))}
                </nav>
              </div>

              {/* VR Experience */}
              <div className="space-y-6">
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-lg bg-[#1a567e]/20">
                    <FaRocket className="w-4 h-4 text-[#1a567e]" />
                  </div>
                  <h4 className="text-lg font-bold text-white">Experience</h4>
                </div>
                <div className="space-y-4">
                  <a 
                    href="/vr" 
                    className="group relative inline-flex items-center justify-center space-x-2 w-full py-3.5 px-6 rounded-2xl overflow-hidden font-bold text-white transition-all duration-500 hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2a7bbe]"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#1a567e] via-[#2067a8] to-[#2a7bbe]" />
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#1a567e] to-[#2a7bbe] blur-lg opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative flex items-center space-x-2 z-10">
                      <FaSpaceShuttle className="w-5 h-5 group-hover:rotate-12 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-500" />
                      <span className="text-sm tracking-wide">Launch VR Experience</span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </a>
                  
                  <p className="text-[#babab8] text-xs leading-relaxed px-2">
                    Immerse yourself in our cutting-edge virtual reality journey through the cosmos
                  </p>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="p-3 rounded-xl bg-[#0a1f2d]/60 backdrop-blur-xl border border-[#1a567e]/20">
                      <div className="text-2xl font-black text-[#2a7bbe]">50+</div>
                      <div className="text-xs text-[#babab8]">Destinations</div>
                    </div>
                    <div className="p-3 rounded-xl bg-[#0a1f2d]/60 backdrop-blur-xl border border-[#1a567e]/20">
                      <div className="text-2xl font-black text-[#2a7bbe]">4K</div>
                      <div className="text-xs text-[#babab8]">Resolution</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="pt-8 border-t border-[#1a567e]/20">
              <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                <div className="flex items-center space-x-2 text-[#babab8] text-sm">
                  <span>© 2025 NASA Space Apps Challenge</span>
                  <span className="hidden sm:inline">•</span>
                  <span className="flex items-center space-x-1">
                    <span>Built with</span>
                    <FaHeart className="w-3 h-3 text-red-500 animate-pulse" />
                    <span>for space exploration</span>
                  </span>
                </div>
                
                <div className="flex items-center space-x-3">
                  {[FaStar, FaRocket, FaGalacticRepublic].map((Icon, index) => (
                    <div key={index} className="relative group">
                      <div className="absolute inset-0 bg-[#1a567e] rounded-full blur-md opacity-0 group-hover:opacity-60 transition-opacity duration-500" />
                      <Icon className="w-4 h-4 text-[#babab8] hover:text-[#2a7bbe] transition-all duration-500 hover:scale-110 hover:rotate-12 cursor-pointer" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}