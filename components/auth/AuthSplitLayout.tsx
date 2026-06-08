"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

interface AuthSplitLayoutProps {
  activeSide: "login" | "register";
  loginForm: React.ReactNode;
  registerForm: React.ReactNode;
}

// Stylized S-Logo SVG component matching the premium look
export const SLogo = ({ className = "w-8 h-8", active = false, side = "login" }: { className?: string; active?: boolean; side?: "login" | "register" }) => {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="s-grad-purple" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#c084fc" />
          <stop offset="50%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
        <linearGradient id="s-grad-yellow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
        <linearGradient id="s-grad-white" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f3f4f6" />
          <stop offset="100%" stopColor="#9ca3af" />
        </linearGradient>
      </defs>
      
      {/* S-shape composed of two interlocking premium curved ribbons */}
      <path
        d="M12 6C7.58 6 4 9.58 4 14C4 18.42 7.58 22 12 22C16.42 22 20 18.42 20 14"
        stroke={active ? (side === "login" ? "url(#s-grad-purple)" : "url(#s-grad-yellow)") : "url(#s-grad-white)"}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="opacity-90"
      />
      <path
        d="M20 26C24.42 26 28 22.42 28 18C28 13.58 24.42 10 20 10C15.58 10 12 13.58 12 18"
        stroke={active ? (side === "register" ? "url(#s-grad-yellow)" : "url(#s-grad-purple)") : "url(#s-grad-white)"}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="opacity-95"
      />
    </svg>
  );
};

export default function AuthSplitLayout({
  activeSide,
  loginForm,
  registerForm,
}: AuthSplitLayoutProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#08090d] text-white overflow-x-hidden font-sans">
      {/* ================= LEFT SIDE: SIGN IN ================= */}
      <div
        onClick={() => {
          if (activeSide === "register") {
            router.push("/login");
          }
        }}
        className={`relative flex-1 min-h-[50vh] lg:min-h-screen flex flex-col justify-between p-6 md:p-12 lg:p-16 transition-all duration-500 ease-out select-none
          ${activeSide === "login" ? "w-full" : "hidden lg:flex lg:max-w-[50%] opacity-40 hover:opacity-60 cursor-pointer"}
          bg-gradient-to-br from-[#1b0e40] via-[#050414] to-[#03010b] overflow-hidden`}
      >
        {/* Subtle grid and wave backgrounds */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none opacity-40" />
        
        {/* Wavy line graphic at bottom left */}
        <div className="absolute bottom-0 left-0 right-0 h-64 pointer-events-none opacity-20 z-0">
          <svg className="w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
            <path
              d="M0,150 C100,180 200,120 300,160 C350,180 380,170 400,160 L400,200 L0,200 Z"
              fill="url(#wave-grad)"
            />
            <defs>
              <linearGradient id="wave-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4c1d95" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Top Header */}
        <div className="flex items-center gap-3 relative z-10">
          <SLogo className="w-9 h-9" active={activeSide === "login"} side="login" />
          <span className="text-sm font-semibold tracking-wide text-violet-200/90 font-medium">
            Smart Project & Task Collaboration System
          </span>
        </div>

        {/* Main Content Area */}
        <div className="w-full max-w-md mx-auto my-auto relative z-10 flex flex-col justify-center py-8">
          {activeSide === "login" ? (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {loginForm}
            </motion.div>
          ) : (
            <div className="hidden lg:flex flex-col items-center justify-center py-12 text-center pointer-events-none">
              <span className="text-xs font-bold tracking-widest text-violet-400 uppercase mb-2">SIGN IN</span>
              <h2 className="text-2xl font-bold text-slate-200 mb-2">Welcome Back!</h2>
              <p className="text-sm text-slate-400 max-w-xs mb-6">Login to manage your projects.</p>
              <div className="px-6 py-2.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-sm font-medium text-violet-300">
                Click to Sign In
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-6 text-xs text-slate-500 relative z-10">
          <Link href="#" className="hover:text-violet-400 transition-colors">
            System Overview
          </Link>
          <span className="h-3 w-px bg-slate-800" />
          <Link href="#" className="hover:text-violet-400 transition-colors">
            Help
          </Link>
        </div>

        {/* Inactive Overlay Mask */}
        {activeSide === "register" && (
          <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px] hover:backdrop-blur-none transition-all duration-300 flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
          </div>
        )}
      </div>

      {/* ================= RIGHT SIDE: SIGN UP ================= */}
      <div
        onClick={() => {
          if (activeSide === "login") {
            router.push("/register");
          }
        }}
        className={`relative flex-1 min-h-[50vh] lg:min-h-screen flex flex-col justify-between p-6 md:p-12 lg:p-16 transition-all duration-500 ease-out select-none
          ${activeSide === "register" ? "w-full" : "hidden lg:flex lg:max-w-[50%] opacity-40 hover:opacity-60 cursor-pointer"}
          bg-[#0a0b0f] border-t lg:border-t-0 lg:border-l border-slate-900/60 overflow-hidden`}
      >
        {/* Subtle grid and ambient light */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.005)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.005)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />

        {/* Top Header */}
        <div className="flex items-center justify-between w-full relative z-10">
          <div className="flex items-center gap-3">
            <SLogo className="w-9 h-9" active={activeSide === "register"} side="register" />
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-yellow-500/20 bg-yellow-950/20 text-[10px] md:text-xs font-semibold text-yellow-400 tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
            Deployment: ACTIVE
          </div>
        </div>

        {/* Main Content Area */}
        <div className="w-full max-w-md mx-auto my-auto relative z-10 flex flex-col justify-center py-8">
          {activeSide === "register" ? (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {registerForm}
            </motion.div>
          ) : (
            <div className="hidden lg:flex flex-col items-center justify-center py-12 text-center pointer-events-none">
              <span className="text-xs font-bold tracking-widest text-yellow-400 uppercase mb-2">SIGN UP</span>
              <h2 className="text-2xl font-bold text-slate-200 mb-2">Start Your Project Journey</h2>
              <p className="text-sm text-slate-400 max-w-xs mb-6">Create your free account today.</p>
              <div className="px-6 py-2.5 rounded-full border border-yellow-500/30 bg-yellow-500/10 text-sm font-medium text-yellow-300">
                Click to Sign Up
              </div>
            </div>
          )}
        </div>

        {/* Empty space for layout balance on right footer */}
        <div className="h-4 lg:block hidden relative z-10" />

        {/* Inactive Overlay Mask */}
        {activeSide === "login" && (
          <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px] hover:backdrop-blur-none transition-all duration-300 flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
          </div>
        )}
      </div>
    </div>
  );
}
