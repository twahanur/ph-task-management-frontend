"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LockKeyhole, MoveLeft, LogIn } from "lucide-react";
import LargeYellowSvg from "@/components/svgIcon/LargeYellowSvg";
import AuthEllipsSVG from "@/components/svgIcon/AuthEllipsSVG";

const Unauthorized = () => {
  const router = useRouter();

  return (
    <div className="relative min-h-screen bg-[#030115] overflow-hidden flex items-center justify-center px-4">
      <AuthEllipsSVG />

      {/* Ambient glow top-right */}
      <div className="pointer-events-none absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[#C309FF]/10 blur-[120px]" />

      <div className="relative z-20 flex flex-col items-center text-center max-w-md w-full space-y-8">
        {/* Icon badge */}
        <div className="relative flex items-center justify-center w-24 h-24 rounded-2xl bg-[linear-gradient(331deg,rgba(238,235,255,0.04)_-7.38%,rgba(238,235,255,0.08)_107.38%)] effect-no-bg border border-[#2C293D]">
          <LockKeyhole className="w-10 h-10 text-[#7361E5]" strokeWidth={1.5} />
          <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#7361E5]/20 border border-[#7361E5]/40 text-[10px] font-bold text-[#C3C0D8]">
            ?
          </span>
        </div>

        {/* Error code */}
        <div className="space-y-1">
          <p className="text-xs font-medium tracking-[0.3em] uppercase text-[#514D6A]">
            Error 401
          </p>
          <h1 className="text-5xl font-bold bg-[linear-gradient(180deg,#C3C0D8_0%,#C309FF_100%)] bg-clip-text text-transparent">
            Unauthorized
          </h1>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 w-full">
          <div className="flex-1 border-t border-[#2C293D]" />
          <LockKeyhole className="w-3 h-3 text-[#514D6A]" />
          <div className="flex-1 border-t border-[#2C293D]" />
        </div>

        {/* Message card */}
        <div className="w-full rounded-xl bg-[linear-gradient(331deg,rgba(238,235,255,0.04)_-7.38%,rgba(238,235,255,0.08)_107.38%)] effect-no-bg border border-[#2C293D] px-6 py-5 space-y-2">
          <p className="text-[#C3C0D8] font-medium">Authentication Required</p>
          <p className="text-sm text-[#9B98AE] leading-relaxed">
            You need to be signed in to access this page. Please log in with
            your credentials to continue.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <button
            onClick={() => router.back()}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-full border border-[#2C293D] text-[#C3C0D8] text-sm hover:bg-white/5 transition-colors cursor-pointer"
          >
            <MoveLeft size={16} />
            Go Back
          </button>

          <Link
            href="/login"
            className="relative flex-1 cursor-pointer bg-white/5 rounded-xl py-2.5 flex items-center justify-center px-4 overflow-hidden text-white text-sm"
          >
            <div className="absolute top-0 left-0 inset-3 border-l border-t border-white/20 rounded-tl-xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 inset-3 border-r border-b border-white/20 rounded-br-xl pointer-events-none" />
            <div className="pointer-events-none absolute bottom-0 left-1/2 w-[calc(100%-2rem)] -translate-x-1/2 z-20">
              <span className="block h-[1.5px] w-full bg-[linear-gradient(to_right,rgba(255,177,63,0)_0%,#FFB13F_50%,rgba(255,177,63,0)_100%)]" />
            </div>
            <div className="pointer-events-none">
              <LargeYellowSvg />
            </div>
            <span className="flex items-center gap-2 relative z-10">
              <LogIn size={16} />
              Sign In
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
