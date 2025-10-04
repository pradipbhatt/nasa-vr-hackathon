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
  secondary: "rgba(15, 41, 82, 0.15)",
  accent: "rgba(56, 189, 248, 0.9)",
  text: "rgba(226, 232, 240, 0.95)",
  textMuted: "rgba(148, 163, 184, 0.8)",
  border: "rgba(56, 189, 248, 0.15)",
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
  glow: number;
  setGlow: (value: number) => void;
  atmosphereOpacity: number;
  setAtmosphereOpacity: (value: number) => void;
  cloudOpacity: number;
  setCloudOpacity: (value: number) => void;
  layerIntensity: number;
  setLayerIntensity: (value: number) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
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
  const currentLayerConfig =
    dataLayers.find((l) => l.id === activeLayer) || dataLayers[0];

  const panelSize = isCollapsed
    ? 60
    : isMobile
    ? window.innerWidth * 0.9
    : 320;

  return (
    <div
      className={`fixed z-40 rounded-xl border backdrop-blur-2xl transition-all duration-300 ${
        isDragging ? "cursor-grabbing" : isMobile ? "" : "cursor-grab"
      }`}
      style={{
        ...panelStyle,
        width: `${panelSize}px`,
        height: `${panelSize}px`,
        backgroundColor: colors.secondary,
        borderColor: colors.border,
        boxShadow: "0 4px 20px rgba(56, 189, 248, 0.05)",
        willChange: isDragging ? "transform" : "auto",
      }}
    >
      {/* Header (fixed height 60px) */}
      <div
        className="flex items-center justify-between p-3 border-b"
        style={{
          borderColor: colors.border,
          height: "60px",
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <div className="flex items-center gap-2">
          <div
            className="p-1.5 rounded-md backdrop-blur-sm"
            style={{ backgroundColor: "rgba(15, 41, 82, 0.2)" }}
          >
            {isMobile ? <GlobeIcon /> : <MoveIcon />}
          </div>
          {!isCollapsed && (
            <h2 className="text-sm font-medium" style={{ color: colors.text }}>
              Controls
            </h2>
          )}
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-md hover:bg-blue-500/10 transition-all duration-150"
          style={{ color: colors.text }}
        >
          {isCollapsed ? <ChevronUpIcon /> : <ChevronDownIcon />}
        </button>
      </div>

      {/* Scrollable Content */}
      {!isCollapsed && (
        <div
          className="overflow-y-auto"
          style={{
            height: `calc(${panelSize}px - 60px)`,
          }}
        >
          <div className="px-3 space-y-2 mt-3 pb-3">
            {/* Data Layers */}
            <div>
              <label
                className="text-xs font-medium mb-2 block"
                style={{ color: colors.text }}
              >
                Data Layer
              </label>
              <div className="grid grid-cols-3 gap-2">
                {dataLayers.map((layer) => {
                  const Icon = layer.icon;
                  return (
                    <button
                      key={layer.id}
                      onClick={() => setActiveLayer(layer.id)}
                      className="p-1.5 rounded-lg transition-all duration-200 text-[10px] flex flex-col items-center gap-1 border hover:scale-[1.02] active:scale-95"
                      style={{
                        backgroundColor:
                          activeLayer === layer.id
                            ? "rgba(56, 189, 248, 0.2)"
                            : "rgba(15, 41, 82, 0.2)",
                        borderColor:
                          activeLayer === layer.id
                            ? colors.accent
                            : colors.border,
                        color: colors.text,
                      }}
                    >
                      <Icon />
                      <span className="text-center leading-tight hidden sm:block">
                        {layer.name.split(" ")[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
              <p
                className="text-[10px] mt-1 text-center"
                style={{ color: colors.textMuted }}
              >
                {currentLayerConfig.description}
              </p>
            </div>

            {/* Rotation + Chart */}
            <div className="flex items-center gap-1 mt-2">
              <button
                onClick={() => setRotateEarth(!rotateEarth)}
                className="flex-1 py-1 rounded-md transition-all duration-200 flex items-center justify-center gap-1 text-[10px] font-medium border hover:scale-[1.03] backdrop-blur-sm active:scale-95"
                style={{
                  backgroundColor: rotateEarth
                    ? colors.accent
                    : "rgba(15, 41, 82, 0.2)",
                  borderColor: colors.accent,
                  color: colors.text,
                }}
              >
                {rotateEarth ? (
                  <>
                    <PauseIcon size={12} /> Pause
                  </>
                ) : (
                  <>
                    <PlayIcon size={12} /> Play
                  </>
                )}
              </button>
              <button
                onClick={() => setShowChart(!showChart)}
                className="flex-1 py-1 rounded-md transition-all duration-200 flex items-center justify-center gap-1 text-[10px] font-medium border hover:scale-[1.03] backdrop-blur-sm active:scale-95"
                style={{
                  backgroundColor: showChart
                    ? "rgba(56, 189, 248, 0.2)"
                    : "rgba(15, 41, 82, 0.2)",
                  borderColor: showChart ? colors.accent : colors.border,
                  color: colors.text,
                }}
              >
                <BarChartIcon />
                {showChart ? "Hide" : "Show"}
              </button>
            </div>

            {/* Sliders */}
            <div className="space-y-1">
              <ControlSlider
                value={earthSpeed}
                setValue={setEarthSpeed}
                icon={GlobeIcon}
                label="Rotation"
              />
              <ControlSlider
                value={cloudSpeed}
                setValue={setCloudSpeed}
                icon={CloudIcon}
                label="Clouds"
              />
              <ControlSlider
                value={glow}
                setValue={setGlow}
                min={0}
                max={10}
                step={0.1}
                icon={ZapIcon}
                label="Glow"
              />
              <ControlSlider
                value={atmosphereOpacity}
                setValue={setAtmosphereOpacity}
                icon={LayersIcon}
                label="Atmosphere"
              />
              <ControlSlider
                value={cloudOpacity}
                setValue={setCloudOpacity}
                icon={SunIcon}
                label="Cloud Cover"
              />
              <ControlSlider
                value={layerIntensity}
                setValue={setLayerIntensity}
                icon={currentLayerConfig.icon}
                label="Layer Intensity"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
