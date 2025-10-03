// components/DatasetSelector.tsx
import { Globe, Info } from 'lucide-react';

export interface Dataset {
  id: 'temperature' | 'currents' | 'salinity' | 'chlorophyll';
  name: string;
  description: string;
  color: string;
  source: string;
  unit?: string;
}

interface DatasetSelectorProps {
  datasets: Dataset[];
  selectedDataset: string;
  onDatasetChange: (datasetId: string) => void;
  className?: string;
}

export const OCEAN_DATASETS: Dataset[] = [
  {
    id: 'temperature',
    name: 'Sea Surface Temperature',
    description: 'NASA MODIS/GHRSST data showing ocean heat distribution',
    color: '#ff6b35',
    source: 'MODIS Aqua/Terra',
    unit: '°C'
  },
  {
    id: 'currents',
    name: 'Ocean Currents',
    description: 'OSCAR satellite-derived ocean surface currents',
    color: '#00d9ff',
    source: 'OSCAR/NASA JPL',
    unit: 'm/s'
  },
  {
    id: 'salinity',
    name: 'Sea Surface Salinity',
    description: 'SMAP mission salinity measurements',
    color: '#a78bfa',
    source: 'SMAP/NASA',
    unit: 'PSU'
  },
  {
    id: 'chlorophyll',
    name: 'Ocean Chlorophyll',
    description: 'Marine phytoplankton and ocean productivity',
    color: '#10b981',
    source: 'SeaWiFS/MODIS',
    unit: 'mg/m³'
  }
];

export default function DatasetSelector({
  datasets,
  selectedDataset,
  onDatasetChange,
  className = ''
}: DatasetSelectorProps) {
  const currentDataset = datasets.find(d => d.id === selectedDataset);

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Dataset List */}
      <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
        <div className="flex items-center space-x-2 mb-4">
          <Globe className="w-5 h-5 text-cyan-400" />
          <h3 className="text-white font-semibold">Ocean Data Layers</h3>
        </div>
        
        <div className="space-y-2">
          {datasets.map((dataset) => (
            <button
              key={dataset.id}
              onClick={() => onDatasetChange(dataset.id)}
              className={`w-full text-left p-3 rounded-xl transition-all ${
                selectedDataset === dataset.id
                  ? 'bg-cyan-500/20 border border-cyan-500/50 shadow-lg shadow-cyan-500/20'
                  : 'bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-white font-medium text-sm">{dataset.name}</span>
                <div 
                  className="w-3 h-3 rounded-full ring-2 ring-white/20" 
                  style={{ backgroundColor: dataset.color }}
                />
              </div>
              <p className="text-xs text-gray-400">{dataset.source}</p>
              {dataset.unit && (
                <span className="text-xs text-cyan-400 mt-1 inline-block">
                  Unit: {dataset.unit}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Info Panel */}
      {currentDataset && (
        <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
          <div className="flex items-start space-x-2">
            <Info className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-white text-sm font-medium mb-1">
                {currentDataset.name}
              </p>
              <p className="text-gray-400 text-xs leading-relaxed">
                {currentDataset.description}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Interaction Hint */}
      <div className="bg-black/40 backdrop-blur-lg border border-white/10 rounded-xl p-3 text-center">
        <p className="text-gray-400 text-xs">
          🖱️ Drag to rotate • 🔄 Auto-rotating
        </p>
      </div>
    </div>
  );
}