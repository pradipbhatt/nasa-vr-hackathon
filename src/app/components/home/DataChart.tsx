import React from "react";
import { temperatureData } from "./climateData";

const colors = {
  secondary: "rgba(15, 41, 82, 0.15)",
  accent: "rgba(56, 189, 248, 0.9)",
  text: "rgba(226, 232, 240, 0.95)",
  textMuted: "rgba(148, 163, 184, 0.8)",
  border: "rgba(56, 189, 248, 0.15)",
};

interface DataChartProps {
  showChart: boolean;
  setShowChart: (value: boolean) => void;
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
  yearIndex: number;
}

export const DataChart: React.FC<DataChartProps> = ({
  showChart,
  setShowChart,
  currentLayerConfig,
  yearIndex,
}) => {
  if (!showChart) return null;

  return (
    <div
      className="fixed top-32 right-4 z-30 w-80 rounded-xl border backdrop-blur-2xl p-4"
      style={{
        backgroundColor: colors.secondary,
        borderColor: colors.border,
        boxShadow: '0 4px 20px rgba(56, 189, 248, 0.05)',
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium" style={{ color: colors.text }}>
          {currentLayerConfig.name} Trend
        </h3>
        <button
          onClick={() => setShowChart(false)}
          className="text-xs px-2 py-1 rounded hover:bg-blue-500/10"
          style={{ color: colors.textMuted }}
        >
          Close
        </button>
      </div>
      <svg width="100%" height="180" viewBox="0 0 300 180">
        <defs>
          <linearGradient id="dataGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={`rgba(${currentLayerConfig.color.hot.join(',')}, 0.3)`} />
            <stop offset="100%" stopColor={`rgba(${currentLayerConfig.color.cold.join(',')}, 0.1)`} />
          </linearGradient>
        </defs>
        {temperatureData.map((d, i) => {
          const value = d[currentLayerConfig.dataKey as keyof typeof d] as number;
          const x = (i / (temperatureData.length - 1)) * 280 + 10;
          const normalizedValue = (value - currentLayerConfig.range[0]) / (currentLayerConfig.range[1] - currentLayerConfig.range[0]);
          const y = 160 - normalizedValue * 140;
          const nextData = temperatureData[i + 1];
          if (nextData) {
            const nextValue = nextData[currentLayerConfig.dataKey as keyof typeof nextData] as number;
            const nextX = ((i + 1) / (temperatureData.length - 1)) * 280 + 10;
            const nextNormalizedValue = (nextValue - currentLayerConfig.range[0]) / (currentLayerConfig.range[1] - currentLayerConfig.range[0]);
            const nextY = 160 - nextNormalizedValue * 140;
            return (
              <g key={i}>
                <line
                  x1={x}
                  y1={y}
                  x2={nextX}
                  y2={nextY}
                  stroke={i === yearIndex || i + 1 === yearIndex ? colors.accent : 'rgba(56, 189, 248, 0.3)'}
                  strokeWidth={i === yearIndex || i + 1 === yearIndex ? '3' : '2'}
                />
                {i === yearIndex && (
                  <circle cx={x} cy={y} r="5" fill={colors.accent}>
                    <animate attributeName="r" values="5;7;5" dur="1s" repeatCount="indefinite" />
                  </circle>
                )}
              </g>
            );
          }
          return null;
        })}
        <line x1="10" y1="160" x2="290" y2="160" stroke={colors.border} strokeWidth="1" />
        <text x="150" y="175" textAnchor="middle" fontSize="10" fill={colors.textMuted}>
          Year
        </text>
        <text x="5" y="15" fontSize="10" fill={colors.textMuted}>
          {currentLayerConfig.range[1]}{currentLayerConfig.unit}
        </text>
        <text x="5" y="165" fontSize="10" fill={colors.textMuted}>
          {currentLayerConfig.range[0]}{currentLayerConfig.unit}
        </text>
      </svg>
      <div className="mt-2 text-xs text-center" style={{ color: colors.textMuted }}>
        {currentLayerConfig.name} ({currentLayerConfig.unit})
      </div>
    </div>
  );
};