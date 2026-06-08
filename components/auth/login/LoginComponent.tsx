/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { usePasswordToggle } from "@/hooks/usePasswordToggle";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { Eye, EyeOff, Mail, Lock, Play } from "lucide-react";
import { FaGoogle, FaLinkedinIn } from "react-icons/fa";
import { useUser } from "@/provider/AuthProvider";
import { login } from "@/service/authService";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type TLoginData = z.infer<typeof loginSchema>;

const LoginComponent = () => {
  const router = useRouter();
  const { visible, toggle } = usePasswordToggle();
  const [redirect, setRedirect] = useState<string | null>(null);
  const { refetchUser, setIsLoading } = useUser();

  const {
    handleSubmit,
    register,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TLoginData>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const redirectParam = params.get("redirectPath");
    if (redirectParam) {
      Promise.resolve().then(() => {
        setRedirect(redirectParam);
      });
    }
  }, []);

  const onSubmit = async (data: TLoginData) => {
    const toastId = toast.loading("Logging in...");
    try {
      const res = await login(data);
      if (res?.success) {
        setIsLoading(false);
        await refetchUser();
        toast.success(res?.message || "Logged in successfully!", { id: toastId, duration: 3000 });
        reset();
        router.push(redirect ? redirect : "/dashboard/profile");
      } else {
        toast.error(res?.error?.message || res?.message || "Login failed", { id: toastId, duration: 3000 });
      }
    } catch (error: any) {
      toast.error("Something went wrong!", { id: toastId, duration: 3000 });
      console.log(error);
    }
  };

  const handleAdminLogin = async () => {
    setValue("email", "admin@demo.com");
    setValue("password", "Admin@123");
    const toastId = toast.loading("Logging in as Demo Admin...");
    try {
      const res = await login({ email: "admin@demo.com", password: "Admin@123" });
      if (res?.success) {
        setIsLoading(false);
        await refetchUser();
        toast.success(res?.message || "Welcome Admin!", { id: toastId, duration: 3000 });
        reset();
        const onboarding = res?.data?.onboarding || res?.data?.onboardingStatus?.data;
        if (onboarding) {
          const isCompleted = onboarding?.completed || onboarding?.isOnboardingComplete || false;
          if (!isCompleted) {
            return router.push("/onboarding");
          }
        }
        router.push(redirect ? redirect : "/dashboard/profile");
      } else {
        toast.error(res?.message || "Demo login failed", { id: toastId, duration: 3000 });
      }
    } catch (error: any) {
      toast.error("Something went wrong during demo login!", { id: toastId, duration: 3000 });
      console.log(error);
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="space-y-2">
        <span className="text-xs font-bold tracking-widest text-violet-400 uppercase">
          SIGN IN
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          Welcome Back!
        </h1>
        <p className="text-slate-400 text-sm">
          Login to manage your projects.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email Input */}
        <div className="space-y-1">
          <div className="relative flex items-center">
            <Mail className="absolute left-4 w-5 h-5 text-slate-500" />
            <input
              id="email"
              type="email"
              placeholder="Email"
              autoComplete="email"
              className={`w-full bg-[#0d1527]/60 border ${
                errors.email ? "border-red-500" : "border-slate-800/80 hover:border-slate-700/80 focus:border-violet-500"
              } text-white placeholder:text-slate-500 text-sm rounded-xl py-3 pl-12 pr-4 outline-none transition-all duration-200`}
              {...register("email")}
            />
          </div>
          {errors.email && (
            <span className="text-xs text-red-500 pl-1">{errors.email.message}</span>
          )}
        </div>

        {/* Password Input */}
        <div className="space-y-1">
          <div className="relative flex items-center">
            <Lock className="absolute left-4 w-5 h-5 text-slate-500" />
            <input
              id="password"
              type={visible ? "text" : "password"}
              placeholder="Password"
              autoComplete="current-password"
              className={`w-full bg-[#0d1527]/60 border ${
                errors.password ? "border-red-500" : "border-slate-800/80 hover:border-slate-700/80 focus:border-violet-500"
              } text-white placeholder:text-slate-500 text-sm rounded-xl py-3 pl-12 pr-12 outline-none transition-all duration-200`}
              {...register("password")}
            />
            <button
              type="button"
              onClick={toggle}
              className="absolute right-4 text-slate-500 hover:text-slate-300 transition-colors"
            >
              {visible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.password && (
            <span className="text-xs text-red-500 pl-1">{errors.password.message}</span>
          )}
        </div>

        {/* Forgot Password Link */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => router.push("/forgot-password")}
            className="text-xs font-semibold text-violet-400 hover:text-violet-300 transition-colors cursor-pointer"
          >
            Forgot Password?
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white font-bold text-sm py-3 px-4 rounded-xl transition-all duration-150 shadow-lg shadow-violet-900/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? "SIGNING IN..." : "SIGN IN"}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3 py-1">
        <div className="h-px bg-slate-800/80 flex-1" />
        <span className="text-slate-600 text-xs font-medium uppercase tracking-wider">
          or sign in with
        </span>
        <div className="h-px bg-slate-800/80 flex-1" />
      </div>

      {/* Social Logins */}
      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          className="flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-900/40 hover:bg-slate-900/60 active:bg-slate-900/80 border border-slate-800/60 hover:border-slate-700/60 rounded-xl transition-all text-sm font-medium text-slate-300"
        >
          <FaGoogle className="w-4 h-4 text-red-500" />
          <span className="text-xs">Google</span>
        </button>
        <button
          type="button"
          className="flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-900/40 hover:bg-slate-900/60 active:bg-slate-900/80 border border-slate-800/60 hover:border-slate-700/60 rounded-xl transition-all text-sm font-medium text-slate-300"
        >
          <FaLinkedinIn className="w-4 h-4 text-blue-500" />
          <span className="text-xs">LinkedIn</span>
        </button>
      </div>

      {/* Demo Login Block */}
      <div className="p-4 rounded-xl border border-slate-800/80 bg-slate-950/40 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold tracking-wider text-slate-400">
            DEMO LOGIN
          </span>
          <button
            type="button"
            onClick={handleAdminLogin}
            className="flex items-center gap-1.5 px-3 py-1 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 border border-yellow-500/20 rounded-lg text-xs font-bold transition-all"
          >
            <Play className="w-3 h-3 fill-yellow-400 stroke-none" />
            Try
          </button>
        </div>
        <div className="grid grid-cols-3 text-xs gap-y-1">
          <span className="text-slate-500 font-semibold">Admin</span>
          <div className="col-span-2 text-slate-300 space-y-0.5">
            <div>Username: <span className="font-mono text-slate-200 selection:bg-violet-500/30">sarah.admin</span></div>
            <div>Password: <span className="font-mono text-slate-200">••••••••</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;
