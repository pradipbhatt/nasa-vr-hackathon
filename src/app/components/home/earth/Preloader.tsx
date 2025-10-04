import React from "react";
import { GlobeIcon } from "./Icons";

const colors = {
  secondary: "rgba(15, 41, 82, 0.15)",
  accent: "rgba(56, 189, 248, 0.9)",
  accentGlow: "rgba(56, 189, 248, 0.3)",
  text: "rgba(226, 232, 240, 0.95)",
  textMuted: "rgba(148, 163, 184, 0.8)",
  border: "rgba(56, 189, 248, 0.15)",
  sliderTrack: "rgba(30, 41, 59, 0.2)",
};

export const Preloader = ({ progress }: { progress: number }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
    <div className="text-center">
      <div className="mb-6">
        <GlobeIcon />
      </div>
      <h2 className="text-2xl font-light mb-4" style={{ color: colors.accent }}>
        Loading Earth Climate Data
      </h2>
      <div className="w-64 h-2 rounded-full backdrop-blur-sm mb-2" style={{ backgroundColor: colors.sliderTrack }}>
        <div
          className="h-2 rounded-full transition-all duration-300"
          style={{
            width: `${progress}%`,
            background: `linear-gradient(90deg, ${colors.accent} 0%, ${colors.accentGlow} 100%)`,
            boxShadow: `0 0 10px ${colors.accentGlow}`
          }}
        />
      </div>
      <p className="text-sm" style={{ color: colors.textMuted }}>
        {progress < 30 && 'Initializing 3D engine...'}
        {progress >= 30 && progress < 60 && 'Loading Earth textures...'}
        {progress >= 60 && progress < 90 && 'Processing NASA data...'}
        {progress >= 90 && 'Almost ready...'}
      </p>
    </div>
  </div>
);