// layout.tsx
import "./globals.css";
import { ReactNode } from "react";
import Navigation from "./components/Navigation";
import ClientNavWrapper from "./components/ClientNavWrapper";

export const metadata = {
  title: "AstroYatra",
  description: "Immersive VR experience with NASA ocean datasets",
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className="bg-primary text-text font-atkinson min-h-screen flex flex-col">
        {/* Client-side Nav + Footer wrapper */}
        <ClientNavWrapper>{children}</ClientNavWrapper>
      </body>
    </html>
  );
}
