// components/home/StatsPanel.tsx

interface Stat {
  value: string;
  label: string;
  color?: string; // Tailwind text color from theme
}

interface StatsPanelProps {
  stats?: Stat[];
  className?: string;
}

// Default stats
export const OCEAN_STATS: Stat[] = [
  { value: '50TB+', label: 'NASA Data', color: 'text-icon' },
  { value: 'Real-Time', label: 'Satellite Updates', color: 'text-icon' },
  { value: '360°', label: 'VR Immersion', color: 'text-icon' },
  { value: '4K', label: 'Visualization', color: 'text-icon' },
];

export default function StatsPanel({ stats = OCEAN_STATS, className = '' }: StatsPanelProps) {
  const columnsClass =
    stats.length === 4 ? 'grid-cols-2 md:grid-cols-4' :
    stats.length === 3 ? 'grid-cols-3' :
    'grid-cols-2';

  return (
    <div className={`bg-secondary/50 backdrop-blur-xl border border-text/20 rounded-2xl p-6 ${className}`}>
      <div className={`grid gap-8 text-center ${columnsClass}`}>
        {stats.map((stat, index) => (
          <div key={index} className="space-y-1">
            <div className={`text-3xl sm:text-4xl font-bold ${stat.color || 'text-text'}`}>
              {stat.value}
            </div>
            <div className="text-sm sm:text-base text-text/70">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
