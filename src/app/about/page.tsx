export default function About() {
  return (
    <div className="min-h-screen p-8 sm:p-20 bg-primary text-text">
      
      {/* Geist Sans for main headings */}
      <h1 className="text-4xl font-bold font-mono mb-6">
        Geist Sans Heading
      </h1>
      
      {/* Geist Sans for paragraph text */}
      <p className="text-lg leading-relaxed font-mono mb-4">
        This paragraph uses Geist Sans font. NASA’s open data makes ocean observations accessible to everyone. 
        This VR experience helps people explore ocean data visually and interactively.
      </p>
      
      {/* Geist Mono for code or monospace sections */}
      <pre className="font-mono bg-slate-800/30 p-4 rounded mb-4">
{`function exploreOceans() {
  console.log("Geist Mono code example");
}`}
      </pre>

      {/* Mixing fonts inline */}
      <p className="text-lg leading-relaxed">
        You can mix fonts inline: 
        <span className="font-sans text-emerald-400"> Geist Sans </span>, 
        <span className="font-mono text-pink-400"> Geist Mono </span>.
      </p>
      
    </div>
  );
}
