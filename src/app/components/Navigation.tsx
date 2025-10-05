"use client";
import { useState, useEffect, useRef } from "react";
import { FaSpaceShuttle, FaStar, FaGalacticRepublic, FaRocket, FaArrowRight } from "react-icons/fa";

interface NavLink {
  href: string;
  label: string;
}

interface NavigationProps {
  logo?: string;
  links?: NavLink[];
  ctaLabel?: string;
  className?: string;
  isMobileMenuOpen?: boolean;
  onMobileMenuToggle?: () => void;
  onMobileMenuClose?: () => void;
}

const Navigation = ({ 
  logo = "Yatra", 
  links = [
    { href: "/explore", label: "Explore" },
    { href: "/destinations", label: "Destinations" },
    { href: "/experience", label: "Experience" },
    { href: "/about", label: "About" }
  ], 
  ctaLabel = "Launch VR", 
  className = "",
  isMobileMenuOpen = false,
  onMobileMenuToggle,
  onMobileMenuClose
}: NavigationProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState("");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHoveringCta, setIsHoveringCta] = useState(false);
  const [scrollVelocity, setScrollVelocity] = useState(0);
  const navRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    let lastTime = Date.now();
    let lastY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const currentTime = Date.now();
      const timeDelta = currentTime - lastTime;
      const scrollDelta = currentScrollY - lastY;
      
      // Calculate velocity for smooth hide/show
      const velocity = Math.abs(scrollDelta / timeDelta);
      setScrollVelocity(velocity);
      
      // Only hide on fast downward scroll
      if (currentScrollY > lastScrollY && currentScrollY > 80 && velocity > 0.5) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY || currentScrollY < 80) {
        setIsVisible(true);
      }
      
      setIsScrolled(currentScrollY > 20);
      setLastScrollY(currentScrollY);
      lastTime = currentTime;
      lastY = currentScrollY;
    };

    // Smoother scroll handling with throttle
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

    window.addEventListener("scroll", scrollHandler, { passive: true });
    return () => window.removeEventListener("scroll", scrollHandler);
  }, [lastScrollY]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setActiveLink(href);
    
    // Smooth scroll to section if it's an anchor
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      // Navigate after animation
      setTimeout(() => {
        window.location.href = href;
      }, 300);
    }
  };

  return (
    <>
      <nav 
        ref={navRef}
        className={`
          fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 sm:px-8 lg:px-16 
          transition-all duration-[600ms] ease-[cubic-bezier(0.4,0,0.2,1)]
          ${isVisible ? 'translate-y-0' : '-translate-y-full'}
          ${isScrolled 
            ? 'py-3 bg-[#020204]/80 backdrop-blur-3xl shadow-[0_8px_40px_rgba(0,0,0,0.6)] border-b border-[#1a567e]/20' 
            : 'py-5 bg-transparent'
          }
          ${className}
        `}
        style={{
          willChange: 'transform',
          transform: `translate3d(0, ${isVisible ? '0' : '-100%'}, 0)`,
        }}
      >
        {/* Ambient background glow */}
        {isScrolled && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#1a567e]/10 rounded-full blur-3xl" />
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#2a7bbe]/10 rounded-full blur-3xl" />
          </div>
        )}

        {/* Logo */}
        <a 
          href="/" 
          className="flex items-center space-x-3 group relative z-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1a567e] rounded-2xl p-1 -m-1"
          onClick={(e) => handleLinkClick(e, '/')}
        >
          <div className="relative">
            {/* Smooth pulsing glow */}
            <div className="absolute inset-0 rounded-full">
              <div className="absolute inset-0 bg-[#1a567e]/40 rounded-full blur-xl scale-100 group-hover:scale-150 transition-transform duration-1000 ease-out" />
              <div className="absolute inset-0 bg-[#2a7bbe]/30 rounded-full blur-2xl scale-100 group-hover:scale-125 transition-transform duration-1000 ease-out" style={{ animationDelay: '0.5s' }} />
            </div>
            
            <div className="relative bg-gradient-to-br from-[#0a1f2d]/90 via-[#020204] to-[#0a1f2d]/90 border border-[#1a567e]/50 rounded-full p-3 group-hover:border-[#2a7bbe]/70 group-hover:scale-105 transition-all duration-500 ease-out shadow-2xl shadow-[#1a567e]/20">
              <FaGalacticRepublic className="w-7 h-7 text-[#1a567e] group-hover:text-[#2a7bbe] transition-all duration-700 ease-out" style={{ transform: 'translateZ(0)' }} />
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#1a567e]/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            </div>
          </div>
          
          <div className="flex flex-col">
            <span className="text-3xl font-black text-white tracking-tight transition-all duration-300 group-hover:tracking-normal">
              {logo}
            </span>
            <div className="flex items-center space-x-2 overflow-hidden">
              <span className="text-[10px] text-[#1a567e] font-bold tracking-[0.25em] uppercase transition-all duration-300 group-hover:text-[#2a7bbe] group-hover:tracking-[0.3em]">
                Space Exploration
              </span>
            </div>
          </div>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-3">
          <div className="relative backdrop-blur-2xl rounded-full border border-[#1a567e]/20 p-1 shadow-2xl overflow-hidden"
               style={{ background: 'linear-gradient(90deg, rgba(10,31,45,0.4) 0%, rgba(10,31,45,0.6) 50%, rgba(10,31,45,0.4) 100%)' }}>
            
            {/* Animated shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#1a567e]/10 to-transparent animate-shine" />
            
            <div className="relative flex items-center">
              {links.map((link, index) => (
                <a 
                  key={link.href} 
                  href={link.href}
                  className="relative px-7 py-3 text-sm font-semibold text-[#babab8] hover:text-white transition-all duration-500 ease-out group rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1a567e]/50"
                  onMouseEnter={() => setActiveLink(link.href)}
                  onMouseLeave={() => setActiveLink("")}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  style={{ 
                    transitionDelay: `${index * 30}ms`,
                    willChange: 'transform'
                  }}
                >
                  <span className="relative z-10 flex items-center space-x-2">
                    <span className="transition-transform duration-300 group-hover:translate-x-0.5">{link.label}</span>
                    <FaArrowRight className="w-3 h-3 opacity-0 -translate-x-2 scale-0 group-hover:opacity-100 group-hover:translate-x-0 group-hover:scale-100 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]" />
                  </span>
                  
                  {/* Smooth active background */}
                  <div className={`
                    absolute inset-0 rounded-full
                    transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]
                    ${activeLink === link.href 
                      ? 'bg-gradient-to-br from-[#1a567e]/40 via-[#1a567e]/25 to-[#1a567e]/10 border border-[#1a567e]/40 scale-100 opacity-100' 
                      : 'bg-transparent scale-95 opacity-0'}
                  `} 
                  style={{
                    boxShadow: activeLink === link.href ? '0 4px 20px rgba(26,86,126,0.3)' : 'none'
                  }}
                  />
                  
                  {/* Subtle bottom glow */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-gradient-to-r from-transparent via-[#2a7bbe] to-transparent rounded-full group-hover:w-3/4 transition-all duration-700 ease-out shadow-[0_0_10px_rgba(42,123,190,0.5)]" />
                </a>
              ))}
            </div>
          </div>
          
          {/* Magnetic CTA Button */}
          <a 
            ref={ctaRef}
            href="/vr" 
            className="group relative overflow-hidden rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2a7bbe] focus-visible:ring-offset-2 focus-visible:ring-offset-[#020204]"
            onClick={(e) => handleLinkClick(e, '/vr')}
            onMouseEnter={() => setIsHoveringCta(true)}
            onMouseLeave={() => setIsHoveringCta(false)}
            onMouseMove={handleMouseMove}
            style={{ willChange: 'transform' }}
          >
            {/* Multi-layer glow with smooth animation */}
            <div className="absolute -inset-2 bg-gradient-to-r from-[#1a567e] via-[#2a7bbe] to-[#1a567e] rounded-full opacity-50 group-hover:opacity-100 blur-2xl transition-all duration-700 ease-out animate-glow-pulse" 
                 style={{ backgroundSize: '200% 200%' }} />
            <div className="absolute -inset-1 bg-gradient-to-r from-[#2a7bbe] to-[#1a567e] rounded-full opacity-60 group-hover:opacity-90 blur-lg transition-all duration-500" />
            
            {/* Button surface */}
            <div className="relative flex items-center space-x-3 px-8 py-3.5 bg-gradient-to-r from-[#1a567e] via-[#2067a8] to-[#2a7bbe] rounded-full font-bold text-white transition-all duration-500 ease-out group-hover:scale-105 group-active:scale-100 shadow-2xl border border-[#2a7bbe]/30"
                 style={{ 
                   backgroundSize: '200% 100%',
                   backgroundPosition: isHoveringCta ? '100% 0' : '0% 0',
                   transition: 'background-position 0.8s ease-out, transform 0.3s ease-out'
                 }}>
              
              {/* Rocket with smooth animation */}
              <div className="relative flex items-center justify-center w-5 h-5">
                <FaSpaceShuttle className="w-5 h-5 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:rotate-12" 
                                style={{ filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.4))' }} />
              </div>
              
              <span className="relative tracking-wide transition-all duration-300 group-hover:tracking-wider">{ctaLabel}</span>
              
              {/* Dynamic light follow cursor */}
              <div 
                className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: `radial-gradient(circle 100px at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.2), transparent 70%)`,
                }}
              />
              
              {/* Smooth shine sweep */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" 
                   style={{ transform: 'skewX(-20deg)' }} />
            </div>
          </a>
        </div>

        {/* Refined Mobile Menu Button */}
        <button 
          onClick={onMobileMenuToggle}
          className="lg:hidden group relative p-3.5 rounded-2xl backdrop-blur-xl border border-[#1a567e]/30 hover:border-[#2a7bbe]/50 transition-all duration-500 ease-out hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1a567e]"
          style={{ background: 'linear-gradient(135deg, rgba(10,31,45,0.6) 0%, rgba(2,2,4,0.8) 100%)' }}
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
        >
          <div className="w-6 h-6 relative flex flex-col justify-center items-center">
            <span className={`
              absolute w-6 h-0.5 bg-gradient-to-r from-[#1a567e] to-[#2a7bbe] rounded-full
              transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
              ${isMobileMenuOpen ? 'rotate-45 translate-y-0' : '-translate-y-2'}
            `} />
            <span className={`
              absolute w-6 h-0.5 bg-gradient-to-r from-[#1a567e] to-[#2a7bbe] rounded-full
              transition-all duration-300 ease-out
              ${isMobileMenuOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100'}
            `} />
            <span className={`
              absolute w-6 h-0.5 bg-gradient-to-r from-[#1a567e] to-[#2a7bbe] rounded-full
              transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
              ${isMobileMenuOpen ? '-rotate-45 translate-y-0' : 'translate-y-2'}
            `} />
          </div>
          
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#1a567e]/0 via-[#1a567e]/20 to-[#1a567e]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </button>
      </nav>

      {/* Mobile Menu Overlay with smooth fade */}
      <div 
        className={`
          fixed inset-0 z-40 lg:hidden 
          transition-all duration-500 ease-out
          ${isMobileMenuOpen ? 'opacity-100 backdrop-blur-md' : 'opacity-0 pointer-events-none backdrop-blur-none'}
        `}
        onClick={onMobileMenuClose}
        style={{ 
          background: 'radial-gradient(circle at 80% 20%, rgba(10,31,45,0.95) 0%, rgba(2,2,4,0.98) 100%)',
          transition: 'opacity 0.5s ease-out, backdrop-filter 0.5s ease-out'
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(26,86,126,0.08),transparent_60%)] opacity-0 animate-fade-in" 
             style={{ animationDelay: '0.2s' }} />
      </div>

      {/* Mobile Menu Drawer with physics-based animation */}
      <div 
        className={`
          fixed top-0 right-0 bottom-0 w-full max-w-md z-50 lg:hidden
          transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]
          ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
        style={{ 
          willChange: 'transform',
          boxShadow: isMobileMenuOpen ? '-20px 0 60px rgba(0,0,0,0.5)' : 'none'
        }}
      >
        <div className="relative h-full w-full overflow-hidden">
          {/* Layered background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a1f2d] via-[#020204] to-[#0a1f2d]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(26,86,126,0.15),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(42,123,190,0.1),transparent_50%)]" />
          <div className="absolute inset-0 backdrop-blur-3xl" />
          
          {/* Content with smooth scroll */}
          <div className="relative h-full flex flex-col overflow-y-auto overscroll-contain" 
               style={{ scrollbarWidth: 'thin', scrollbarColor: '#1a567e transparent' }}>
            <div className="p-8 space-y-8">
              {/* Header */}
              <div className="flex items-center justify-between">
                <a 
                  href="/" 
                  className="flex items-center space-x-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1a567e] rounded-xl p-1 -m-1"
                  onClick={(e) => { handleLinkClick(e, '/'); onMobileMenuClose?.(); }}
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-[#1a567e]/50 rounded-full blur-lg" />
                    <div className="relative bg-gradient-to-br from-[#0a1f2d] to-[#020204] border border-[#1a567e]/70 rounded-full p-2.5 group-hover:scale-110 transition-transform duration-500">
                      <FaGalacticRepublic className="w-6 h-6 text-[#1a567e] group-hover:text-[#2a7bbe] transition-colors duration-500" />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-2xl font-black text-white">{logo}</span>
                    <span className="text-[10px] text-[#1a567e] font-bold tracking-[0.2em]">EXPLORATION</span>
                  </div>
                </a>
                
                <button
                  onClick={onMobileMenuClose}
                  className="p-3 rounded-2xl bg-[#1a567e]/20 hover:bg-[#1a567e]/30 border border-[#1a567e]/30 hover:border-[#1a567e]/50 hover:scale-110 active:scale-95 transition-all duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1a567e]"
                  aria-label="Close menu"
                >
                  <svg className="w-6 h-6 text-[#1a567e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Navigation Links with stagger */}
              <nav className="space-y-3 pt-4">
                {links.map((link, index) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="group relative flex items-center justify-between p-5 rounded-2xl backdrop-blur-xl border border-[#1a567e]/20 hover:border-[#2a7bbe]/40 transition-all duration-500 ease-out hover:translate-x-1 hover:shadow-xl hover:shadow-[#1a567e]/20 overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1a567e] active:scale-98"
                    style={{ 
                      background: 'linear-gradient(135deg, rgba(10,31,45,0.5) 0%, rgba(2,2,4,0.3) 100%)',
                      transitionDelay: isMobileMenuOpen ? `${index * 80}ms` : '0ms',
                      opacity: isMobileMenuOpen ? 1 : 0,
                      transform: isMobileMenuOpen ? 'translateX(0)' : 'translateX(30px)',
                      willChange: 'transform, opacity'
                    }}
                    onClick={(e) => { handleLinkClick(e, link.href); onMobileMenuClose?.(); }}
                  >
                    <div className="flex items-center space-x-4 z-10">
                      <div className="relative p-3 rounded-xl bg-gradient-to-br from-[#1a567e]/30 to-[#1a567e]/10 group-hover:from-[#2a7bbe]/40 group-hover:to-[#1a567e]/20 transition-all duration-500">
                        <FaStar className="w-5 h-5 text-[#1a567e] group-hover:text-[#2a7bbe] group-hover:scale-110 transition-all duration-500 ease-out" />
                        <div className="absolute inset-0 rounded-xl bg-[#1a567e]/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      </div>
                      
                      <span className="text-lg font-bold text-[#babab8] group-hover:text-white transition-colors duration-300">
                        {link.label}
                      </span>
                    </div>
                    
                    <FaRocket className="w-5 h-5 text-[#1a567e] z-10 opacity-0 translate-x-4 scale-50 group-hover:opacity-100 group-hover:translate-x-0 group-hover:scale-100 group-hover:text-[#2a7bbe] transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]" />
                    
                    {/* Smooth hover gradient */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#1a567e]/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                  </a>
                ))}
              </nav>

              {/* CTA Button */}
              <div className="pt-6 border-t border-[#1a567e]/20">
                <a
                  href="/vr"
                  className="group relative flex items-center justify-center space-x-3 w-full p-5 rounded-2xl overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2a7bbe] focus-visible:ring-offset-2 focus-visible:ring-offset-[#020204] active:scale-98 transition-transform duration-200"
                  onClick={(e) => { handleLinkClick(e, '/vr'); onMobileMenuClose?.(); }}
                  style={{
                    transitionDelay: isMobileMenuOpen ? `${links.length * 80 + 100}ms` : '0ms',
                    opacity: isMobileMenuOpen ? 1 : 0,
                  }}
                >
                  {/* Glow layers */}
                  <div className="absolute -inset-2 bg-gradient-to-r from-[#1a567e] to-[#2a7bbe] blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#1a567e] via-[#2067a8] to-[#2a7bbe] group-hover:scale-105 transition-transform duration-500" 
                       style={{ backgroundSize: '200% 100%', backgroundPosition: '0% 0%' }} />
                  
                  {/* Content */}
                  <div className="relative flex items-center space-x-3 z-10">
                    <FaSpaceShuttle className="w-6 h-6 text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]" 
                                    style={{ filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.5))' }} />
                    <span className="text-xl font-black text-white tracking-wide">{ctaLabel}</span>
                  </div>
                  
                  {/* Animated shine */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" 
                       style={{ transform: 'skewX(-20deg)' }} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        
        @keyframes glow-pulse {
          0%, 100% { 
            opacity: 0.5;
            transform: scale(1);
          }
          50% { 
            opacity: 1;
            transform: scale(1.05);
          }
        }
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .animate-shine {
          animation: shine 8s ease-in-out infinite;
        }
        
        .animate-glow-pulse {
          animation: glow-pulse 3s ease-in-out infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }

        /* Smooth scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
        }
        
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        
        ::-webkit-scrollbar-thumb {
          background: rgba(26, 86, 126, 0.3);
          border-radius: 10px;
          transition: background 0.3s ease;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(26, 86, 126, 0.6);
        }

        /* Hardware acceleration */
        nav, a, button {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          transform: translateZ(0);
          -webkit-transform: translateZ(0);
        }
      `}</style>
    </>
  );
};

export default Navigation;