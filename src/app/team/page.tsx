import Card from "./Card";

export default function Team() {
  return (
    <div className="min-h-screen bg-primary text-text font-atkinson p-8 sm:p-20">
      <h1 className="text-4xl font-bold glow mb-16 w-full text-center mt-15">Meet the Team</h1>
      <p className="text-center text-lg mb-16">We build it. We own it. Excellence is non-negotiable. See who drives the mission.</p>
      <div className="mt-12 flex flex-wrap gap-8 justify-center ">
        <Card profile="/profiles/pradip.jpg" name="Pradip Bhatt" role="Full-stack developer" description="Bringing ideas to life through code" linkedin="https://www.linkedin.com/in/pradipbhatt2626/" github="https://github.com/pradipbhatt" facebook="https://www.facebook.com/pradipbhatt21/" />
        <Card profile="/profiles/jelina.jpg" name="Jelina Bhatt" role="Tester" description="Ensures precision with every detail" linkedin="https://www.linkedin.com/in/jelinabhatt/" github="https://github.com/Jelina-bhatt/" facebook="https://www.facebook.com/jelina.bhatt" />
        <Card profile="/profiles/manoj.png" name="Manoj Joshi" role="UI/UX designer" description="Crafting designs that connect with people" linkedin="https://www.linkedin.com/in/manoj-joshi-6b7662166/" github="https://github.com/mnojz" facebook="#" />
      </div>
    </div>
  );
}
