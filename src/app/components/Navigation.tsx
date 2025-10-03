"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Waves } from "lucide-react";

interface NavLink {
  href: string;
  label: string;
}

interface NavigationProps {
  logo?: string;
  links?: NavLink[];
  ctaLabel?: string;
  className?: string;
}

const Navigation = ({ logo = "Vāyu", links = [], ctaLabel = "Launch VR", className = "" }: NavigationProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) setIsVisible(false);
      else setIsVisible(true);
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 flex items-center justify-between px-8 py-6 transition-transform duration-300 bg-black/60 backdrop-blur-md ${className} ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="flex items-center space-x-2">
        <Waves className="w-8 h-8 text-cyan-400" />
        <span className="text-2xl font-bold text-white">{logo}</span>
      </div>

      <div className="hidden md:flex items-center space-x-8">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
            {link.label}
          </Link>
        ))}
        <Link href="/vr" className="px-6 py-2 bg-white text-black rounded-full font-semibold hover:bg-gray-200 transition-all hover:scale-105">
          {ctaLabel}
        </Link>
      </div>

      <button className="md:hidden text-white">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </nav>
  );
};

export default Navigation; // ✅ Make sure it's default export
