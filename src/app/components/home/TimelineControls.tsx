import React from "react";
import { PlayIcon, PauseIcon, SkipBackIcon, SkipForwardIcon } from "./Icons";
import { temperatureData } from "./climateData";

// ============================================
// COLOR CONSTANTS
// Shared across UI components for consistency
// ============================================
const colors = {
  secondary: "rgba(15, 41, 82, 0.15)",
  accent: "rgba(56, 189, 248, 0.9)",
  text: "rgba(226, 232, 240, 0.95)",
  textMuted: "rgba(148, 163, 184, 0.8)",
  border: "rgba(56, 189, 248, 0.15)",
  sliderTrack: "rgba(30, 41, 59, 0.2)",
};

// ============================================
// PROPS INTERFACE
// Defines props for timeline controls
// ============================================
interface TimelineControlsProps {
  yearIndex: number;
  setYearIndex: (value: number) => void;
  isAutoPlay: boolean;
  toggleAutoPlay: () => void;
  handlePrevYear: () => void;
  handleNextYear: () => void;
  currentData: typeof temperatureData[0];
  currentLayerConfig: {
    id: string;
    name: string;
    icon: React.FC;
    description: string;
    color: { cold: number[]; warm: number[]; hot: number[] };
    dataKey: string;
    unit: string;
    range: number[];
  };
}

// ============================================
// TIMELINE CONTROLS COMPONENT
// Renders the timeline UI with year slider and playback controls
// ============================================
export const TimelineControls: React.FC<TimelineControlsProps> = ({
  yearIndex,
  setYearIndex,
  isAutoPlay,
  toggleAutoPlay,
  handlePrevYear,
  handleNextYear,
  currentData,
  currentLayerConfig,
}) => {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-30 pb-6 pt-4 px-4 md:px-8"
      style={{
        background: 'linear-gradient(to top, rgba(10, 10, 15, 0.95) 0%, rgba(10, 10, 15, 0.7) 70%, transparent 100%)',
      }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Header Section: Year and Layer Info */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div
              className="p-2 rounded-lg backdrop-blur-sm"
              style={{
                backgroundColor: colors.secondary,
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: colors.border,
              }}
            >
              {React.createElement(currentLayerConfig.icon)}
            </div>
            <div>
              <div className="text-xl md:text-2xl font-bold" style={{ color: colors.accent }}>
                {currentData.year}
              </div>
              <div className="text-xs" style={{ color: colors.textMuted }}>
                {currentLayerConfig.name}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium" style={{ color: colors.text }}>
              {(currentData[currentLayerConfig.dataKey as keyof typeof currentData] as number).toFixed(2)} {currentLayerConfig.unit}
            </div>
            <div className="text-xs" style={{ color: colors.textMuted }}>
              Current Value
            </div>
            <div className="text-xs mt-1" style={{ color: colors.textMuted }}>
              CO₂: {currentData.co2} ppm
            </div>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-2 mb-3 justify-center">
          {/* Previous Year Button */}
          <button
            onClick={handlePrevYear}
            disabled={yearIndex === 0}
            className="p-2 rounded-lg transition-all duration-200 hover:scale-105 disabled:opacity-30 disabled:cursor-not-allowed backdrop-blur-sm"
            style={{
              backgroundColor: 'rgba(15, 41, 82, 0.3)',
              borderWidth: '1px', // Use longhand to avoid conflicts
              borderStyle: 'solid',
              borderColor: colors.border,
              color: colors.text,
            }}
          >
            <SkipBackIcon />
          </button>

          {/* Auto-Play Toggle Button */}
          <button
            onClick={toggleAutoPlay}
            className="px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 flex items-center gap-2 backdrop-blur-sm font-medium"
            style={{
              backgroundColor: isAutoPlay ? 'rgba(239, 68, 68, 0.2)' : colors.accent,
              borderWidth: '1px', // Use longhand to avoid conflicts
              borderStyle: 'solid',
              borderColor: isAutoPlay ? 'rgba(239, 68, 68, 0.5)' : colors.accent,
              color: colors.text,
            }}
          >
            {isAutoPlay ? <PauseIcon /> : <PlayIcon />}
            {isAutoPlay ? 'Stop' : 'Auto-Play'}
          </button>

          {/* Next Year Button */}
          <button
            onClick={handleNextYear}
            disabled={yearIndex === temperatureData.length - 1}
            className="p-2 rounded-lg transition-all duration-200 hover:scale-105 disabled:opacity-30 disabled:cursor-not-allowed backdrop-blur-sm"
            style={{
              backgroundColor: 'rgba(15, 41, 82, 0.3)',
              borderWidth: '1px', // Use longhand to avoid conflicts
              borderStyle: 'solid',
              borderColor: colors.border,
              color: colors.text,
            }}
          >
            <SkipForwardIcon />
          </button>
        </div>

        {/* Timeline Slider */}
        <div className="relative mb-3">
          <div className="h-2 rounded-full backdrop-blur-sm" style={{ backgroundColor: colors.sliderTrack }}>
            <div
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: `${(yearIndex / (temperatureData.length - 1)) * 100}%`,
                background: `linear-gradient(90deg, rgba(${currentLayerConfig.color.cold.join(',')}), rgba(${currentLayerConfig.color.hot.join(',')}))`,
                boxShadow: `0 0 10px rgba(${currentLayerConfig.color.hot.join(',')}, 0.5)`,
              }}
            />
          </div>
          <input
            type="range"
            min={0}
            max={temperatureData.length - 1}
            step={1}
            value={yearIndex}
            onChange={(e) => setYearIndex(parseInt(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>

        {/* Timeline Labels */}
        <div className="flex justify-between text-xs mb-2" style={{ color: colors.textMuted }}>
          <span>1880</span>
          <span>1920</span>
          <span>1960</span>
          <span>2000</span>
          <span>2035</span>
        </div>
      </div>
    </div>
  );
};
