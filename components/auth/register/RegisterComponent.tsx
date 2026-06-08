"use client";

import Link from "next/link";
import { register } from "@/service/authService";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, User, Mail, Lock, Shield, ChevronDown, Check } from "lucide-react";

export const passwordRules = [
  { label: "Min 8 characters", regex: /^.{8,}$/ },
  { label: "At least 1 uppercase letter", regex: /[A-Z]/ },
  { label: "At least 1 lowercase letter", regex: /[a-z]/ },
  { label: "At least 1 number", regex: /[0-9]/ },
  { label: "At least 1 special character", regex: /[!@#$%^&*(),.?\":{}|<>]/ },
];

export default function RegisterComponent() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const handleRegister = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.password || !formData.role) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!agreeToTerms) {
      toast.error("Please agree to the Terms and Conditions");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Creating your account...");
    try {
      const res = await register(formData);
      if (res?.success) {
        toast.success("Registration successful! Please sign in.", { id: toastId });
        router.push("/login");
      } else {
        toast.error(res?.message ?? "Registration failed", { id: toastId });
      }
    } catch (err: any) {
      toast.error(err?.message ?? "Something went wrong", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="space-y-2">
        <span className="text-xs font-bold tracking-widest text-yellow-400 uppercase">
          SIGN UP
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          Start Your Project Journey
        </h1>
        <p className="text-slate-400 text-sm">
          Create your free account today.
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleRegister}>
        {/* Full Name Input */}
        <div className="space-y-1">
          <div className="relative flex items-center">
            <User className="absolute left-4 w-5 h-5 text-slate-500" />
            <input
              required
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-[#0a0b0f]/60 border border-slate-800/80 hover:border-slate-700/80 focus:border-yellow-500 text-white placeholder:text-slate-500 text-sm rounded-xl py-3 pl-12 pr-4 outline-none transition-all duration-200"
            />
          </div>
        </div>

        {/* Email Input */}
        <div className="space-y-1">
          <div className="relative flex items-center">
            <Mail className="absolute left-4 w-5 h-5 text-slate-500" />
            <input
              required
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-[#0a0b0f]/60 border border-slate-800/80 hover:border-slate-700/80 focus:border-yellow-500 text-white placeholder:text-slate-500 text-sm rounded-xl py-3 pl-12 pr-4 outline-none transition-all duration-200"
            />
          </div>
        </div>

        {/* Password Input */}
        <div className="space-y-1">
          <div className="relative flex items-center">
            <Lock className="absolute left-4 w-5 h-5 text-slate-500" />
            <input
              required
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full bg-[#0a0b0f]/60 border border-slate-800/80 hover:border-slate-700/80 focus:border-yellow-500 text-white placeholder:text-slate-500 text-sm rounded-xl py-3 pl-12 pr-12 outline-none transition-all duration-200"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 text-slate-500 hover:text-slate-300 transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Role Select Dropdown (Required by backend) */}
        <div className="space-y-1">
          <div className="relative flex items-center">
            <Shield className="absolute left-4 w-5 h-5 text-slate-500" />
            <select
              required
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full bg-[#0a0b0f]/60 border border-slate-800/80 hover:border-slate-700/80 focus:border-yellow-500 text-white text-sm rounded-xl py-3 pl-12 pr-10 outline-none transition-all duration-200 appearance-none cursor-pointer"
            >
              <option value="" disabled className="bg-[#0a0b0f] text-slate-500">Select Role</option>
              <option value="team_member" className="bg-[#0a0b0f] text-white">Team Member</option>
              <option value="admin" className="bg-[#0a0b0f] text-white">Admin</option>
              <option value="project_manager" className="bg-[#0a0b0f] text-white">Project Manager</option>
            </select>
            <div className="absolute right-4 pointer-events-none text-slate-500">
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Terms and Conditions Checkbox */}
        <div className="flex items-center gap-2 py-1">
          <label className="relative flex items-center p-1 rounded-md cursor-pointer hover:bg-slate-900/30">
            <input
              type="checkbox"
              checked={agreeToTerms}
              onChange={(e) => setAgreeToTerms(e.target.checked)}
              className="peer sr-only"
            />
            <div className="w-4 h-4 rounded border border-slate-700 bg-slate-950 flex items-center justify-center transition-all peer-checked:bg-yellow-500 peer-checked:border-yellow-400">
              {agreeToTerms && <Check className="w-3 h-3 text-black stroke-[3px]" />}
            </div>
          </label>
          <span className="text-xs text-slate-400">
            Agree to{" "}
            <Link href="#" className="text-yellow-400 hover:underline">
              Terms and Conditions
            </Link>
          </span>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-yellow-600 hover:bg-yellow-500 active:bg-yellow-700 text-white font-bold text-sm py-3 px-4 rounded-xl transition-all duration-150 shadow-lg shadow-yellow-900/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? "REGISTERING..." : "SIGN UP"}
        </button>
      </form>

      {/* Already have an account? Sign In */}
      <p className="text-center text-xs text-slate-400">
        Already have an account?{" "}
        <button
          type="button"
          onClick={() => router.push("/login")}
          className="font-bold text-yellow-400 hover:text-yellow-300 hover:underline transition-all cursor-pointer"
        >
          Sign In
        </button>
      </p>
    </div>
  );
}
