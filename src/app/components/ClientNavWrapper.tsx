// components/ClientNavWrapper.tsx
"use client";

import { ReactNode } from "react";
// import Navigation from "./Navigation";
import Navigation from "./Navigation"; // ✅ default import

import { usePathname } from "next/navigation";


type Props = {
  children: ReactNode;
  hideOnPaths?: string[]; // optional array of paths to hide nav/footer
};

export default function ClientNavWrapper({ children, hideOnPaths = ["/vr"] }: Props) {
  const pathname = usePathname();
  const hideNavAndFooter = hideOnPaths.includes(pathname);

  return (
    <>
      {/* Navbar */}
      {!hideNavAndFooter && (
        <Navigation
          logo="AstroYatra"
          links={[
            { href: "/", label: "Home" },
            { href: "/about", label: "About" },
            { href: "/story/chapter1", label: "Story" },
            { href: "/datasets", label: "Datasets" },
            { href: "/team", label: "Team" },
            { href: "/contact", label: "Contact" },
          ]}
          ctaLabel="Enter VR"
        />
      )}

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      {!hideNavAndFooter && (
        <footer className="w-full bg-secondary py-4 px-8 flex flex-col sm:flex-row justify-between items-center text-sm mt-auto">
          <p>© 2025 NASA Space Apps Challenge</p>
          <div className="flex gap-4 mt-2 sm:mt-0">
            <a
              href="https://nasa.gov"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-icon transition"
            >
              NASA
            </a>
            <a
              href="https://github.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-icon transition"
            >
              GitHub
            </a>
          </div>
        </footer>
      )}
    </>
  );
}
