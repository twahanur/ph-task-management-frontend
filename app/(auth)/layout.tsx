import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";

// Load custom fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Metadata for Next.js
export const metadata: Metadata = {
  title: "Smart Project Kanban",
  description: "Smart Project & Task Collaboration System",
};

// Root layout component
const AuthLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div
      className={`${geistSans.variable} ${geistMono.variable} relative min-h-screen bg-[#0c0d12] overflow-hidden`}
    >
      {children}
    </div>
  );
};

export default AuthLayout;
