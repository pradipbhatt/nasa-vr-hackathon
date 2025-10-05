import Link from "next/link";
import { FaEnvelope, FaGithub, FaWhatsapp } from "react-icons/fa";

export default function Contact() {
  return (
    <div className="min-h-screen bg-primary text-text font-atkinson p-8 sm:p-20">
      <h1 className="text-4xl font-bold glow mb-16 w-full text-center mt-15">Contact Us</h1>
      <p className="text-center text-lg mb-16">Reach out for questions, feedback, or collaboration.</p>
      <div className="flex flex-col items-center gap-8 text-lg">
        <Link href="#" className="flex items-center gap-4 group w-xs">
          <div className="flex items-center justify-center w-13 h-13 rounded-full bg-[#071d35]">
            <FaWhatsapp className="text-3xl text-cyan-500 group-hover:text-[#25d366] transition-colors" />
          </div>
          <div>
            <h2>WhatsApp</h2>
            <p>+977 9812345678</p>
          </div>
        </Link>
        <Link href="#" className="flex items-center gap-4 group w-xs">
          <div className="flex items-center justify-center w-13 h-13 rounded-full bg-[#071d35]">
            <FaEnvelope className="text-3xl text-cyan-500 group-hover:text-red-400 transition-colors" />
          </div>
          <div>
            <h2>Email</h2>
            <p>example@gmail.com</p>
          </div>
        </Link>
        <Link href="#" className="flex items-center gap-4 group w-xs">
          <div className="flex items-center justify-center w-13 h-13 rounded-full bg-[#071d35]">
            <FaGithub className="text-3xl text-cyan-500 group-hover:text-white transition-colors" />
          </div>
          <div>
            <h2>GitHub</h2>
            <p>github.com/yourprofile</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
