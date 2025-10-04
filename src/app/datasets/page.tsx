import Card from "./Card";

export default function Datasets() {
  return (
    <div className="min-h-screen bg-primary text-text font-atkinson p-8 sm:p-20">
      <h1 className="text-4xl font-bold glow mb-6 w-full text-center mt-15">Ocean Datasets</h1>
      <p className="text-lg leading-relaxed mb-4 text-center">
        Explore a variety of NASA ocean datasets that provide insights into sea surface temperature, chlorophyll concentration, ocean salinity, and sea level rise. These datasets are crucial for understanding the health of our oceans and the impact of climate change.
      </p>
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8">
        <Card icon="/icons/SST.svg" title="Sea Surface Temperature" description="Visualize global sea surface temperature patterns and anomalies over time." />
        <Card icon="/icons/CC.svg" title="Chlorophyll Concentration" description="Explore chlorophyll levels to understand phytoplankton distribution and ocean health." />
        <Card icon="/icons/OS.svg" title="Ocean Salinity" description="Analyze ocean salinity variations and their impact on marine ecosystems." />
        <Card icon="/icons/SLR.svg" title="Sea Level Rise" description="Examine sea level rise trends and their implications for coastal communities." />
        <Card icon="/icons/MD.svg" title="More NASA datasets…" description="Discover additional datasets for comprehensive oceanographic studies." />
      </div>
    </div>
  );
}
