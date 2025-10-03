export default function Contact() {
  return (
    <div className="min-h-screen bg-primary text-text font-atkinson flex flex-col items-center justify-center gap-6 p-8 sm:p-20">
      <h1 className="text-4xl font-bold glow">Contact Us</h1>
      <p className="text-lg text-center max-w-lg">
        Reach out for questions, feedback, or collaboration. You can link your email, GitHub, or social profiles here.
      </p>
      <a
        href="mailto:team@example.com"
        className="px-6 py-3 bg-icon text-primary rounded font-semibold hover:opacity-80 transition"
      >
        Email Us
      </a>
    </div>
  );
}
