// src/app/layout.tsx
import "./globals.css";
import { ReactNode } from "react";
import ClientNavWrapper from "./components/ClientNavWrapper";
import { geistSans, geistMono } from "./fonts";

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html className={`${geistSans.variable} ${geistMono.variable}`} lang="en">
      <body className="bg-primary text-text font-sans min-h-screen flex flex-col">
        <ClientNavWrapper>{children}</ClientNavWrapper>
      </body>
    </html>
  );
}
