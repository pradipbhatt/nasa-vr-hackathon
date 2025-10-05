import Card from "./Card";

export default function Team() {
  return (
    <div className="min-h-screen bg-primary text-text font-atkinson p-8 sm:p-20">
      <h1 className="text-4xl font-bold glow mb-16 w-full text-center mt-15">Meet the Team</h1>
      <p className="text-center text-lg mb-16">We build it. We own it. Excellence is non-negotiable. See who drives the mission.</p>
      <div className="mt-12 flex flex-wrap gap-8 justify-center ">
        <Card profile="/profiles/1.jpg" name="John Doe" role="Team Lead" description="Loves coding" linkedin="https://linkedin.com/in/johndoe" github="https://github.com/johndoe" facebook="https://facebook.com/johndoe" />
        <Card profile="/profiles/1.jpg" name="John Doe" role="UI/UX Designer" description="Loves coding" linkedin="https://linkedin.com/in/johndoe" github="https://github.com/johndoe" facebook="https://facebook.com/johndoe" />
        <Card profile="/profiles/1.jpg" name="John Doe" role="Data Scientist" description="Loves coding and enthusiast of AI, ML and data science" linkedin="https://linkedin.com/in/johndoe" github="https://github.com/johndoe" facebook="https://facebook.com/johndoe" />
      </div>
    </div>
  );
}
