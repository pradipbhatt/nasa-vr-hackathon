"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { 
  GlobeIcon, 
  WavesIcon, 
  ThermometerIcon, 
  WindIcon, 
  IceIcon,
  CloudRainIcon,
  ArrowRightIcon,
  PlayIcon
} from './earth/Icons';
import ClimateMonitor from './earth/ClimateMonitor';

const colors = {
  primary: "#020204",
  secondary: "#0a1f2d", 
  text: "#babab8",
  icon: "rgb(26, 86, 126)",
  accent: "rgba(56, 189, 248, 0.9)",
  textMuted: "rgba(148, 163, 184, 0.8)",
  border: "rgba(56, 189, 248, 0.15)",
  gradient: "linear-gradient(135deg, rgba(56, 189, 248, 0.1) 0%, rgba(15, 41, 82, 0.2) 100%)"
};

const featureCards = [
  {
    id: 'ocean-system',
    title: 'Ocean System',
    description: 'Explore real-time ocean currents, temperature patterns, and marine ecosystems in our interactive 3D globe',
    icon: WavesIcon,
    color: 'from-blue-500/10 to-cyan-400/10',
    delay: 0.1
  },
  {
    id: 'climate-patterns',
    title: 'Climate Patterns',
    description: 'Visualize global climate data, weather systems, and atmospheric conditions across different regions',
    icon: CloudRainIcon,
    color: 'from-purple-500/10 to-blue-400/10',
    delay: 0.2
  },
  {
    id: 'temperature-map',
    title: 'Temperature Map',
    description: 'Track sea surface temperatures and thermal variations with detailed heat mapping',
    icon: ThermometerIcon,
    color: 'from-red-500/10 to-orange-400/10',
    delay: 0.3
  }
];

export default function Home() {
  const [selectedSystem, setSelectedSystem] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleCardClick = (systemId: string) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedSystem(systemId);
      setIsTransitioning(false);
    }, 800);
  };

  const handleBackToHome = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedSystem(null);
      setIsTransitioning(false);
    }, 800);
  };

  if (selectedSystem) {
    return (
      <div className="relative min-h-screen" style={{ backgroundColor: colors.primary }}>
        <AnimatePresence mode="wait">
          {!isTransitioning && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="relative h-screen flex flex-col"
            >
              {/* Climate Monitor takes most space */}
              <div className="flex-1">
                <ClimateMonitor />
              </div>
              
              {/* Back button at bottom */}
                <motion.div
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="fixed bottom-6 left-8 z-50"
                >
                <button
                  onClick={handleBackToHome}
                  className="flex gap-3 px-6 py-3 rounded-xl backdrop-blur-xl border transition-all duration-300 hover:scale-105 hover:bg-blue-500/10 group"
                  style={{
                  backgroundColor: 'rgba(10, 31, 45, 0.8)',
                  borderColor: colors.border,
                  color: colors.text
                  }}
                >
                  <ArrowRightIcon className="rotate-180 group-hover:-translate-x-1 transition-transform duration-300" />
                  <span className="text-sm font-medium">Back</span>
                </button>
                </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ backgroundColor: colors.primary }}>
      {/* Simplified Background */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            background: `linear-gradient(135deg, ${colors.secondary} 0%, #0f2942 50%, ${colors.primary} 100%)`
          }}
        ></div>
        {/* Subtle animated dots */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full blur-3xl" style={{ backgroundColor: colors.icon }}></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: colors.accent }}></div>
        </div>
      </div>

      {/* Content */}
      <AnimatePresence>
        {!isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 container mx-auto px-4 py-8"
          >
            {/* Header */}
            <motion.header
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center mb-12 pt-12"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.8, delay: 0.5, type: "spring" }}
                className="inline-flex items-center gap-4 mb-8 p-6 rounded-2xl backdrop-blur-xl border mt-6"
                style={{
                  backgroundColor: 'rgba(10, 31, 45, 0.6)',
                  borderColor: colors.border
                }}
              >
                <div 
                  className="p-3 rounded-xl"
                  style={{ 
                    backgroundColor: 'rgba(26, 86, 126, 0.3)',
                    color: colors.icon
                  }}
                >
                  <GlobeIcon />
                </div>
                <div>
                  <h1 
                    className="text-4xl md:text-6xl font-bold mb-2 mt-10"
                    style={{ color: colors.text }}
                  >
                    Climate Vision
                  </h1>
                  <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="text-lg md:text-xl"
                    style={{ color: colors.textMuted }}
                  >
                    Interactive 3D Visualization of Earth's Climate Systems
                  </motion.p>
                </div>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="flex items-center justify-center gap-3 text-sm"
                style={{ color: colors.textMuted }}
              >
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg backdrop-blur-sm border" style={{ borderColor: colors.border }}>
                  <PlayIcon size={16} />
                  <span>Select a system to explore</span>
                </div>
              </motion.div>
            </motion.header>

            {/* Feature Cards Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-7xl mx-auto mb-16"
            >
              {featureCards.map((card, index) => (
                <motion.div
                  key={card.id}
                  initial={{ y: 50, opacity: 0, scale: 0.9 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: card.delay,
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{ 
                    y: -5,
                    scale: 1.02,
                    transition: { duration: 0.3 }
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.button
                    onClick={() => handleCardClick(card.id)}
                    className="w-full h-full text-left p-5 rounded-xl border backdrop-blur-xl transition-all duration-500 group relative overflow-hidden"
                    style={{
                      backgroundColor: 'rgba(10, 31, 45, 0.7)',
                      borderColor: colors.border,
                    }}
                    whileHover={{
                      backgroundColor: 'rgba(10, 31, 45, 0.9)',
                      borderColor: colors.accent,
                    }}
                  >
                    {/* Gradient Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-30 transition-opacity duration-500`} />
                    
                    {/* Content */}
                    <div className="relative z-10">
                      {/* Icon */}
                      <motion.div
                        className="inline-flex items-center justify-center p-3 rounded-lg mb-4 group-hover:scale-110 transition-transform duration-300"
                        style={{
                          backgroundColor: 'rgba(26, 86, 126, 0.3)',
                          color: colors.icon
                        }}
                        whileHover={{ rotate: 5 }}
                      >
                        <card.icon />
                      </motion.div>

                      {/* Title */}
                      <h3 
                        className="text-lg font-semibold mb-3 group-hover:text-blue-300 transition-colors duration-300"
                        style={{ color: colors.text }}
                      >
                        {card.title}
                      </h3>

                      {/* Description */}
                      <p 
                        className="text-sm mb-4 leading-relaxed group-hover:text-gray-300 transition-colors duration-300"
                        style={{ color: colors.textMuted }}
                      >
                        {card.description}
                      </p>

                      {/* CTA */}
                      <motion.div
                        className="flex items-center gap-2 text-sm font-medium group-hover:gap-3 transition-all duration-300"
                        style={{ color: colors.icon }}
                        whileHover={{ x: 5 }}
                      >
                        <span>Explore System</span>
                        <ArrowRightIcon className="group-hover:scale-110 transition-transform duration-300" />
                      </motion.div>
                    </div>

                    {/* Border glow effect */}
                    <div className="absolute inset-0 border-2 border-transparent bg-gradient-to-r from-cyan-500/0 via-blue-500/5 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />
                  </motion.button>
                </motion.div>
              ))}
            </motion.div>

            {/* Footer */}
            <motion.footer
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.8 }}
              className="text-center"
            >
              <p 
                className="text-sm px-6 py-3 rounded-lg backdrop-blur-sm border inline-block"
                style={{ 
                  color: colors.textMuted,
                  borderColor: colors.border,
                  backgroundColor: 'rgba(10, 31, 45, 0.4)'
                }}
              >
                Real-time climate data visualization • Built with WebGL & React
              </p>
            </motion.footer>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading Transition */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 z-50 flex items-center justify-center"
            style={{ backgroundColor: colors.primary }}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 0.8, type: "spring" }}
              className="text-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 border-4 rounded-full mx-auto mb-4"
                style={{
                  borderColor: `${colors.icon}30`,
                  borderTopColor: colors.icon
                }}
              />
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-lg"
                style={{ color: colors.text }}
              >
                Loading {featureCards.find(card => card.id === selectedSystem)?.title}...
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}