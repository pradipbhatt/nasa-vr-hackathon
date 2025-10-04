import React from "react";
import { ControlSlider } from "./ControlSlider";
import {
  GlobeIcon,
  MoveIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  BarChartIcon,
  CloudIcon,
  ZapIcon,
  LayersIcon,
  SunIcon,
} from "./Icons";
import { dataLayers } from "./climateData";
import { PauseIcon, PlayIcon } from "lucide-react";

const colors = {
  primary: "#020204",
  secondary: "#0a1f2d",
  accent: "rgba(56, 189, 248, 0.9)",
  accentDark: "#1e3a8a",
  border: "rgba(56, 189, 248, 0.15)",
  text: "rgba(226, 232, 240, 0.95)",
  textMuted: "rgba(148, 163, 184, 0.8)",
};

interface ControlPanelProps {
  isMobile: boolean;
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
  isDragging: boolean;
  panelStyle: React.CSSProperties;
  handleMouseDown: (e: React.MouseEvent) => void;
  handleTouchStart: (e: React.TouchEvent) => void;
  activeLayer: string;
  setActiveLayer: (value: string) => void;
  rotateEarth: boolean;
  setRotateEarth: (value: boolean) => void;
  showChart: boolean;
  setShowChart: (value: boolean) => void;
  earthSpeed: number;
  setEarthSpeed: (value: number) => void;
  cloudSpeed: number;
  setCloudSpeed: (value: number) => void;
  glow: number; // Restored to fix TS error
  setGlow: (value: number) => void; // Restored to fix TS error
  glowIntensity: number; // Restored to fix TS error (unused, but kept for compatibility)
  setGlowIntensity: (value: number) => void; // Restored to fix TS error (unused, but kept for compatibility)
  atmosphereOpacity: number;
  setAtmosphereOpacity: (value: number) => void;
  cloudOpacity: number;
  setCloudOpacity: (value: number) => void;
  layerIntensity: number;
  setLayerIntensity: (value: number) => void;
}

const ControlPanel = React.memo<ControlPanelProps>(({
  isMobile,
  isCollapsed,
  setIsCollapsed,
  isDragging,
  panelStyle,
  handleMouseDown,
  handleTouchStart,
  activeLayer,
  setActiveLayer,
  rotateEarth,
  setRotateEarth,
  showChart,
  setShowChart,
  earthSpeed,
  setEarthSpeed,
  cloudSpeed,
  setCloudSpeed,
  glow,
  setGlow,
  atmosphereOpacity,
  setAtmosphereOpacity,
  cloudOpacity,
  setCloudOpacity,
  layerIntensity,
  setLayerIntensity,
}) => {
  const currentLayerConfig = dataLayers.find((l) => l.id === activeLayer) || dataLayers[0];
  const panelSize = isCollapsed ? 60 : isMobile ? Math.min(400, window.innerWidth * 0.9) : 320;

  const enhancedPanelStyle: React.CSSProperties = {
    ...panelStyle,
    left: `calc(${panelStyle.left || "24px"} + 16px)`,
    top: panelStyle.top || "24px",
    width: `${panelSize}px`,
    height: `${panelSize}px`,
    backgroundColor: colors.secondary,
    borderColor: isDragging ? colors.accent : colors.border,
    boxShadow: isDragging 
      ? "0 20px 40px rgba(56, 189, 248, 0.15)"
      : "0 8px 32px rgba(0, 0, 0, 0.3)",
  };

  const toggleCollapse = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div
      className={`fixed z-40 rounded-2xl border-2 backdrop-blur-2xl transition-all duration-300 ${
        isDragging ? "cursor-grabbing scale-105 shadow-2xl" : "cursor-move hover:scale-102"
      } touch-none select-none`}
      style={enhancedPanelStyle}
    >
      {/* Header Section */}
      <div
        className={`flex items-center justify-between p-4 border-b rounded-t-2xl transition-all duration-300 ${
          isDragging ? "bg-blue-900/30" : "hover:bg-blue-900/20"
        }`}
        style={{
          borderColor: colors.border,
          height: "60px",
          backgroundColor: isDragging ? colors.accentDark : colors.primary,
          cursor: isDragging ? "grabbing" : "grab",
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <div className="flex items-center gap-3 flex-1">
          <div
            className="p-2 rounded-lg backdrop-blur-sm transition-all duration-200"
            style={{ 
              backgroundColor: "rgba(56, 189, 248, 0.15)",
              transform: isDragging ? "scale(1.1)" : "scale(1)"
            }}
          >
            {isMobile ? <GlobeIcon /> : <MoveIcon />}
          </div>
          {!isCollapsed && !isMobile && (
            <div className="flex flex-col">
              <h2 className="text-sm font-semibold" style={{ color: colors.text }}>
                Climate Controls
              </h2>
              <div className="text-[10px] opacity-60" style={{ color: colors.textMuted }}>
                Drag to reposition
              </div>
            </div>
          )}
        </div>
        
        {/* Collapse Button */}
        <button
          onClick={toggleCollapse}
          className="p-2 rounded-lg hover:bg-blue-900/30 active:bg-blue-900/40 transition-all duration-200"
          style={{ 
            color: colors.text, 
            minWidth: "44px", 
            minHeight: "44px",
            transform: isDragging ? "scale(0.95)" : "scale(1)"
          }}
        >
          {isCollapsed ? <ChevronUpIcon /> : <ChevronDownIcon />}
        </button>
      </div>

      {/* Content Section */}
      {!isCollapsed && (
        <div
          className="overflow-y-auto custom-scrollbar"
          style={{
            height: `calc(${panelSize}px - 60px)`,
            backgroundColor: colors.secondary,
          }}
        >
          <div className="p-4 space-y-6 pb-6">
            {/* Data Layers Section */}
            <SectionContainer title="Data Layers">
              <div className="grid grid-cols-3 gap-2">
                {dataLayers.map((layer) => (
                  <LayerButton
                    key={layer.id}
                    icon={layer.icon}
                    label={layer.name.split(" ")[0]}
                    isActive={activeLayer === layer.id}
                    onClick={() => setActiveLayer(layer.id)}
                  />
                ))}
              </div>
              <DescriptionBox text={currentLayerConfig.description} />
            </SectionContainer>

            {/* Control Buttons Section */}
            <SectionContainer title="Visualization Controls">
              <div className="flex items-center gap-2">
                <ControlButton
                  icon={rotateEarth ? PauseIcon : PlayIcon}
                  label={rotateEarth ? "Pause" : "Play"}
                  isActive={rotateEarth}
                  onClick={() => setRotateEarth(!rotateEarth)}
                  accentColor={colors.accentDark}
                />
                <ControlButton
                  icon={BarChartIcon}
                  label={showChart ? "Hide" : "Show"}
                  isActive={showChart}
                  onClick={() => setShowChart(!showChart)}
                />
              </div>
            </SectionContainer>

            {/* Sliders Section */}
            <SectionContainer title="Visual Controls">
              <div 
                className="space-y-4 p-3 rounded-xl border"
                style={{ 
                  borderColor: colors.border, 
                  backgroundColor: 'rgba(15, 41, 82, 0.1)' 
                }}
              >
                {/* Earth Speed - Reduced sensitivity */}
                <ControlSlider
                  value={earthSpeed}
                  setValue={setEarthSpeed}
                  icon={GlobeIcon}
                  label="Rotation Speed"
                  min={0}
                  max={0.5}
                  step={0.01}
                />
                <ControlSlider
                  value={cloudSpeed}
                  setValue={setCloudSpeed}
                  icon={CloudIcon}
                  label="Cloud Speed"
                  min={0}
                  max={1}
                  step={0.01}
                />
                {/* Glow Slider - Restored */}
                <ControlSlider
                  value={glow}
                  setValue={setGlow}
                  min={0}
                  max={10}
                  step={0.1}
                  icon={ZapIcon}
                  label="Glow Intensity"
                />
                <ControlSlider
                  value={atmosphereOpacity}
                  setValue={setAtmosphereOpacity}
                  icon={LayersIcon}
                  label="Atmosphere"
                  min={0}
                  max={1}
                  step={0.01}
                />
                <ControlSlider
                  value={cloudOpacity}
                  setValue={setCloudOpacity}
                  icon={SunIcon}
                  label="Cloud Cover"
                  min={0}
                  max={1}
                  step={0.01}
                />
                <ControlSlider
                  value={layerIntensity}
                  setValue={setLayerIntensity}
                  icon={currentLayerConfig.icon}
                  label="Data Intensity"
                  min={0}
                  max={1}
                  step={0.01}
                />
              </div>
            </SectionContainer>
          </div>
        </div>
      )}
    </div>
  );
});

// Reusable Section Container Component
interface SectionContainerProps {
  title: string;
  children: React.ReactNode;
}

const SectionContainer: React.FC<SectionContainerProps> = React.memo(({ title, children }) => (
  <div className="space-y-3">
    <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: colors.text }}>
      {title}
    </label>
    {children}
  </div>
));

// Reusable Layer Button Component
interface LayerButtonProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const LayerButton: React.FC<LayerButtonProps> = React.memo(({ icon: Icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`relative p-2 rounded-xl transition-all duration-200 flex flex-col items-center gap-1.5 border-2 group overflow-hidden ${
      isActive ? "ring-2 ring-offset-1 ring-offset-slate-900" : ""
    }`}
    style={{
      backgroundColor: isActive ? "rgba(56, 189, 248, 0.25)" : "rgba(15, 41, 82, 0.3)",
      borderColor: isActive ? colors.accent : colors.border,
      color: colors.text,
      minHeight: "64px",
      transform: isActive ? "scale(1.02)" : "scale(1)",
    }}
  >
    {isActive && (
      <div 
        className="absolute top-1 right-1 w-2 h-2 rounded-full animate-pulse"
        style={{ backgroundColor: colors.accent }}
      />
    )}
    <Icon className={`w-4 h-4 transition-all duration-200 ${
      isActive ? "scale-110" : "group-hover:scale-110"
    }`} />
    <span className="text-[10px] font-medium text-center leading-tight">{label}</span>
  </button>
));

// Reusable Control Button Component
interface ControlButtonProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  isActive: boolean;
  onClick: () => void;
  accentColor?: string;
}

const ControlButton: React.FC<ControlButtonProps> = React.memo(({ 
  icon: Icon, 
  label, 
  isActive, 
  onClick, 
  accentColor 
}) => (
  <button
    onClick={onClick}
    className={`flex-1 py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 font-medium border-2 backdrop-blur-sm group ${
      isActive ? "shadow-lg" : ""
    }`}
    style={{
      backgroundColor: isActive
        ? (accentColor || "rgba(56, 189, 248, 0.25)")
        : "rgba(15, 41, 82, 0.3)",
      borderColor: isActive ? colors.accent : colors.border,
      color: colors.text,
      minHeight: "44px",
      transform: isActive ? "scale(1.02)" : "scale(1)",
    }}
  >
    <Icon className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
    <span className="text-xs">{label}</span>
  </button>
));

// Reusable Description Box Component
interface DescriptionBoxProps {
  text: string;
}

const DescriptionBox: React.FC<DescriptionBoxProps> = React.memo(({ text }) => (
  <div 
    className="p-3 rounded-lg border backdrop-blur-sm"
    style={{
      backgroundColor: "rgba(15, 41, 82, 0.2)",
      borderColor: colors.border,
    }}
  >
    <p className="text-xs leading-relaxed text-center" style={{ color: colors.textMuted }}>
      {text}
    </p>
  </div>
));

export { ControlPanel };