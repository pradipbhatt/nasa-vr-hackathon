export default function Datasets() {
  return (
    <div className="min-h-screen bg-primary text-text font-atkinson p-8 sm:p-20">
      <h1 className="text-4xl font-bold glow mb-6">Ocean Datasets</h1>
      <ul className="list-disc list-inside space-y-2">
        <li>Sea Surface Temperature</li>
        <li>Chlorophyll Concentration</li>
        <li>Ocean Salinity</li>
        <li>Sea Level Rise</li>
        <li>More NASA datasets…</li>
      </ul>
    </div>
  );
}
