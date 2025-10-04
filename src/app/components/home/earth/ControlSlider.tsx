import React from "react";

const colors = {
  secondary: "rgba(15, 41, 82, 0.15)",
  accent: "rgba(56, 189, 248, 0.9)",
  accentGlow: "rgba(56, 189, 248, 0.3)",
  text: "rgba(226, 232, 240, 0.95)",
  textMuted: "rgba(148, 163, 184, 0.8)",
  border: "rgba(56, 189, 248, 0.15)",
  sliderTrack: "rgba(30, 41, 59, 0.2)",
};

export const ControlSlider = ({ 
  value, 
  setValue, 
  min = 0, 
  max = 1, 
  step = 0.01,
  icon: Icon, 
  label,
  formatMax = 1
}: { 
  value: number; 
  setValue: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  icon: React.ComponentType;
  label: string;
  formatMax?: number;
}) => {
  const percentage = ((value - min) / (max - min)) * 100;
  
  return (
    <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-blue-500/5 transition-all duration-150 group">
      <div className="flex-shrink-0 p-1.5 rounded-md group-hover:scale-105 transition-transform duration-150 backdrop-blur-sm" 
           style={{ backgroundColor: 'rgba(15, 41, 82, 0.2)' }}>
        <Icon />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium truncate" style={{ color: colors.text }}>
            {label}
          </span>
          <span className="text-xs px-1.5 py-0.5 rounded font-mono transition-all duration-150 backdrop-blur-sm" 
                style={{ backgroundColor: 'rgba(56, 189, 248, 0.15)', color: colors.accent }}>
            {Math.round((value / formatMax) * 100)}%
          </span>
        </div>
        
        <div className="relative">
          <div className="h-1 rounded-full backdrop-blur-sm" style={{ backgroundColor: colors.sliderTrack }}>
            <div
              className="h-1 rounded-full transition-all duration-200 ease-out"
              style={{
                width: `${percentage}%`,
                background: `linear-gradient(90deg, ${colors.accent} 0%, ${colors.accentGlow} 100%)`,
                boxShadow: `0 0 6px ${colors.accentGlow}`
              }}
            />
          </div>
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => setValue(parseFloat(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};