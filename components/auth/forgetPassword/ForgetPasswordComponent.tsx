/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import logo from "../../../public/images/OptiluxBD.png";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { toast } from "sonner";
import { MoveRight } from "lucide-react";
import LargeYellowSvg from "@/components/svgIcon/LargeYellowSvg";
import Link from "next/link";
import LoginText from "../login/LoginText";
import SubmissionSuccess from "../register/SubmissionSuccess";
import { forgetPassword } from "@/service/authService";

const forgetPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export type TForgetPasswordData = z.infer<typeof forgetPasswordSchema>;

const ForgetPasswordComponent = () => {
  const [open, setOpen] = useState(false);

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TForgetPasswordData>({
    resolver: zodResolver(forgetPasswordSchema),
  });

  const onSubmit = async (data: TForgetPasswordData) => {
    const toastId = toast.loading("Processing...", { duration: 3000 });
    try {
      const res = await forgetPassword(data);
      if (res?.success) {
        toast.success(res?.message, { id: toastId, duration: 3000 });
        reset();
        setOpen(true);
      } else {
        toast.error(res?.message, { id: toastId, duration: 3000 });
      }
    } catch (error: any) {
      const errorInfo =
        error?.data?.errorSource[1]?.message ||
        error?.data?.message ||
        error?.error ||
        "Something went wrong!";
      toast.error(errorInfo, { id: toastId, duration: 3000 });
    }
  };

  return (
    <>
      {open ? (
        <SubmissionSuccess
          title="Check Your Email Inbox"
          content="we have sent a password reset link to your email. Please check your inbox  "
          path="/forgot-password"
          buttonName="send again"
          buttonTitle="Didn`t get any Email ?"
          open={open}
          setOpen={setOpen}
        />
      ) : (
        <div className="flex flex-col lg:flex-row items-center justify-center gap-x-6 lg:gap-x-56">
          <LoginText />

          <div className="rounded-lg border border-[#221F33] bg-[linear-gradient(331deg,rgba(238,235,255,0.04)_-7.38%,rgba(238,235,255,0.02)_-7.37%,rgba(238,235,255,0.08)_107.38%)] px-4 py-4 max-w-md relative">
            {/* top and bottom border */}
            <div className="absolute top-0 left-0 inset-1 border-l border-t border-[#221F33] rounded-tl-lg pointer-events-none" />
            <div className="absolute bottom-0 right-0 inset-1 border-r border-b border-[#221F33] rounded-br-lg pointer-events-none" />

            <div className="space-y-4">
              <div className="space-y-5">
                <div className="flex items-center justify-start">
                  <Link href="/" className="text-xl font-bold tracking-wider text-white">
                    PH <span className="text-violet-500">TASKS</span>
                  </Link>
                </div>

                <div className="space-y-1">
                  <h1 className="text-2xl font-medium text-[#C3C0D8]">
                    Forgot Password
                  </h1>
                  <p className="text-[#9B98AE]">
                    Enter your registered email address <br /> and we’ll send
                    you a secure password <br /> reset link.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Email */}
                <input
                  id="email"
                  type="email"
                  placeholder="Email Address"
                  className={`${
                    errors.email && "border-red-500 dark:border-red-400"
                  } bg-transparent text-[#514D6A] placeholder:text-[#514D6A] placeholder:text-sm outline-none border border-[#2C293D] py-2 px-5 rounded-full w-full`}
                  {...register("email", { required: "Email is required" })}
                />

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="relative cursor-pointer bg-white/5 rounded-xl py-2 flex items-center justify-center px-4 overflow-hidden w-full text-white"
                >
                  {/* top and bottom line */}
                  <div className="absolute top-0 left-0 inset-3 border-l border-t border-white/20 rounded-tl-xl pointer-events-none" />
                  <div className="absolute bottom-0 right-0 inset-3 border-r border-b border-white/20 rounded-br-xl pointer-events-none" />

                  {/* Button text */}
                  <p className="flex items-center gap-2">
                    <span className="text-sm">Submit</span>
                    <MoveRight />
                  </p>

                  <div className="pointer-events-none absolute bottom-0 left-1/2 w-[calc(100%-2rem)] -translate-x-1/2 z-20">
                    <span className="block h-[1.5px] w-full bg-[linear-gradient(to_right,rgba(255,177,63,0)_0%,#FFB13F_50%,rgba(255,177,63,0)_100%)]" />
                  </div>
                  <div className="pointer-events-none">
                    <LargeYellowSvg />
                  </div>
                </button>
              </form>
              <p className="flex justify-center gap-1 text-[#9B98AE]">
                Back to
                <Link
                  className="bg-linear-to-b from-[#C3C0D8] to-[#4E0C73] bg-clip-text text-transparent underline underline-offset-2 decoration-[#4E0C73]"
                  href="/login"
                >
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ForgetPasswordComponent;
