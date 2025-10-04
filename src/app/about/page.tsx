import Card from "./Card";

export default function About() {
  return (
    <div className="min-h-screen bg-primary text-text font-atkinson p-8 sm:p-20">
      <h1 className="text-4xl font-bold glow mb-6 w-full text-center mt-15">About the Challenge</h1>
      <p className="text-lg leading-relaxed mb-4 text-center">
        NASA’s open data makes ocean observations accessible to everyone. This VR experience helps people explore ocean data visually and interactively. Our mission is to create an immersive storytelling environment that reveals insights about our oceans, leveraging NASA datasets to connect the
        audience with the beauty and science of Earth.
      </p>
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8">
        <Card icon="/icons/satellite.svg" title="DATA" description="data is always complex and unintuitive, especially when it comes from satellites" />
        <Card icon="/icons/VR.svg" title="Experience" description="we created VR storytelling to make this same data intuative and meaningful for normal people" />
        <Card icon="/icons/earth.svg" title="GOAL" description="we connected normal people with real science sparking curiosity and awareness about nature and the technology behind." />
      </div>
    </div>
  );
}
