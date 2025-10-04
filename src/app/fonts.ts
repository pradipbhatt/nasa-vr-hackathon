// src/app/fonts.ts
import localFont from "next/font/local";

// Geist Sans Variable Font
export const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans", // CSS variable
  weight: "100 900",
  style: "normal",
  display: "swap",
});

// Geist Mono Variable Font
export const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
  style: "normal",
  display: "swap",
});
