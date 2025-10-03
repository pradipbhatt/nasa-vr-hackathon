"use client"; // ensure client component
import React, { useRef, useEffect } from "react";
import { useRouter } from "next/navigation"; // router for navigation
import { StorySection } from "../types"; // Adjust import path as needed

interface UIControlsProps {
  showControls: boolean;
  setShowControls: (show: boolean) => void;
  scrollProgress: number;
  currentSection: number;
  sections: StorySection[];
  scrollToSection: (index: number) => void;
}

export const UIControls: React.FC<UIControlsProps> = ({
  showControls,
  setShowControls,
  scrollProgress,
  currentSection,
  sections,
  scrollToSection,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter(); // router instance

  // Fade out scroll indicator when scrolling starts
  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current && scrollProgress > 0.01) {
        scrollRef.current.style.opacity = "0";
        scrollRef.current.style.pointerEvents = "none";
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollProgress]);

  return (
    <>
      {/* Exit VR Button - always visible */}
      <button
        onClick={() => router.push("/")}
        className="fixed top-5 right-5 z-50 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 shadow-lg transition-all"
        aria-label="Exit VR"
      >
        ⬅ Exit VR
      </button>

      {showControls && (
        <>
          <div
            ref={scrollRef}
            className="fixed bottom-12 left-1/2 transform -translate-x-1/2 z-20 opacity-60 animate-bounce transition-opacity duration-500 pointer-events-none md:bottom-16"
          >
            <div className="text-center text-white">
              <div className="text-sm mb-1 font-light tracking-wider">
                Scroll & Drag to Explore
              </div>
              <div className="text-2xl">↓</div>
            </div>
          </div>

          {/* Section Dots */}
          <div className="fixed top-24 right-4 z-20 space-y-2 md:right-6">
            {sections.map((step, index) => (
              <button
                key={index}
                onClick={() => scrollToSection(index)}
                className={`block w-3 h-3 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
                  currentSection === index
                    ? "bg-cyan-400 scale-150 shadow-lg shadow-cyan-400/50"
                    : "bg-white/30 hover:bg-white/50 hover:scale-125"
                }`}
                title={step.title}
                aria-label={`Go to ${step.title}`}
              />
            ))}
          </div>

          {/* UI Controls Panel */}
          <div className="fixed bottom-6 right-4 z-20 space-y-3 md:right-6">
            <button
              onClick={() => setShowControls(!showControls)}
              className="block bg-indigo-900/50 backdrop-blur-md border border-white/20 rounded-lg px-4 py-2 text-white text-sm hover:bg-indigo-900/70 transition-all focus:outline-none focus:ring-2 focus:ring-cyan-400"
              aria-label={showControls ? "Hide UI controls" : "Show UI controls"}
            >
              {showControls ? "✕ Hide UI" : "☰ Show UI"}
            </button>
            <div className="bg-indigo-900/50 backdrop-blur-md border border-white/20 rounded-lg px-4 py-3 text-white">
              <div className="text-xs opacity-60 mb-1">Progress</div>
              <div className="text-2xl font-bold text-cyan-400">
                {Math.round(scrollProgress * 100)}%
              </div>
            </div>
            <div className="bg-indigo-900/50 backdrop-blur-md border border-white/20 rounded-lg px-4 py-3 text-white text-center">
              <div className="text-xs opacity-60 mb-1">Section</div>
              <div className="text-lg font-semibold">
                {currentSection + 1} / {sections.length}
              </div>
            </div>
            <div className="bg-indigo-900/50 backdrop-blur-md border border-white/20 rounded-lg px-4 py-3 text-white text-center">
              <div className="text-xs opacity-60 mb-1">Controls</div>
              <div className="text-xs font-light">Drag to Rotate</div>
            </div>
          </div>
        </>
      )}

      {/* Bottom Progress Bar */}
      <div className="fixed bottom-0 left-0 w-full h-2 bg-gradient-to-r from-purple-900/30 via-blue-900/30 to-cyan-900/30 z-20">
        <div
          className="h-full bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 transition-all duration-300 shadow-lg shadow-cyan-500/50 hover:brightness-125"
          style={{ width: `${scrollProgress * 100}%` }}
        />
      </div>

      {/* Show UI button when hidden */}
      {!showControls && (
        <button
          onClick={() => setShowControls(!showControls)}
          className="fixed bottom-6 right-4 z-30 bg-indigo-900/50 backdrop-blur-md border border-white/20 rounded-lg px-4 py-2 text-white text-sm hover:bg-indigo-900/70 transition-all focus:outline-none focus:ring-2 focus:ring-cyan-400 md:right-6"
          aria-label="Show UI controls"
        >
          ☰ Show UI
        </button>
      )}

      {/* Chapters Info */}
      <div className="fixed bottom-6 left-4 z-20 bg-indigo-900/50 backdrop-blur-md border border-white/20 rounded-lg px-4 py-2 text-white text-xs opacity-70 md:left-6">
        <div className="font-mono">🌍 Earth Story: {sections.length} Chapters</div>
      </div>
    </>
  );
};
