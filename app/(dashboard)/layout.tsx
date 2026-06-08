/* eslint-disable @typescript-eslint/no-unused-vars */
import { AppSidebar } from "@/components/pages/shared/dashboard/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Navbar from "@/components/pages/shared/dashboard/navbar";
import StoreProvider from "@/provider/StoreProvider";

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
  title: "PH Task Management",
  description: "The dashboard of PH Task Management",
};

// Root layout component
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className={`
        ${geistSans.variable} ${geistMono.variable} 
        antialiased 
        relative 
        min-h-screen 
        bg-[#f5f6f8]
        text-slate-800`}
    >
      {/* Layout Structure */}
      <div className="max-w-360 mx-auto relative">
        <SidebarProvider className="gap-0" defaultOpen={true}>
          <AppSidebar />
          <SidebarInset className="max-w-[1200px] mx-auto space-y-0">
            <Navbar />
            <div className="w-full mx-auto px-4 py-2">
              <StoreProvider>{children}</StoreProvider>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </div>
  );
}
