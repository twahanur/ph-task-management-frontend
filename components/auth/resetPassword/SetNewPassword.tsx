/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { usePasswordToggle } from "@/hooks/usePasswordToggle";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import logo from "../../../public/images/OptiluxBD.png";
import { Eye, EyeOff, MoveRight, X } from "lucide-react";
import LargeYellowSvg from "@/components/svgIcon/LargeYellowSvg";
import { passwordRules } from "../register/RegisterComponent";
import { setNewPassword } from "@/service/authService";

const setPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must include at least one uppercase letter")
      .regex(/[a-z]/, "Must include at least one lowercase letter")
      .regex(/[0-9]/, "Must include at least one number")
      .regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Must include at least one special character",
      ),
    confirmPassword: z
      .string()
      .min(1, "Confirm password is required")
      .optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type TSetNewPass = z.infer<typeof setPasswordSchema>;

const SetNewPassword = ({
  token,
  setOpen,
}: {
  token: string;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const router = useRouter();
  const { visible, toggle } = usePasswordToggle();
  const [touched, setTouched] = useState(false);
  const [passwordtext, setPasswordText] = useState("");
  const {
    handleSubmit,
    register,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<TSetNewPass>({
    resolver: zodResolver(setPasswordSchema),
  });
  const passwordValue = useWatch({ control, name: "password" });

  const onSubmit = async (data: TSetNewPass) => {
    delete data.confirmPassword;
    const toastId = toast.loading("Processing...", { duration: 3000 });
    try {
      const res = await setNewPassword(data, token);
      if (res?.success) {
        toast.success(res?.message, { id: toastId, duration: 3000 });
        router.push("/login");
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
      toast.error(errorInfo, { duration: 3000 });
    }
  };

  return (
    <div className="rounded-lg bg-[linear-gradient(331deg,rgba(238,235,255,0.04)_-7.38%,rgba(238,235,255,0.02)_-7.37%,rgba(238,235,255,0.08)_107.38%)] px-4 py-4 max-w-sm relative">
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
              Update your password
            </h1>
            <p className="text-[#9B98AE]">
              Update Your Password Choose a strong password to keep your account
              secure.
            </p>
          </div>

          <div className="flex items-center gap-2 px-6 py-1">
            <div className="border border-[#2C293D] w-full" />
            <span>OR</span>
            <div className="border border-[#2C293D] w-full" />
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Password */}
          <div className="relative space-y-1">
            <input
              id="password"
              type={visible ? "text" : "password"}
              placeholder="Password"
              className={`${
                errors.password && "border-red-500 dark:border-red-400"
              } bg-transparent text-[#514D6A] placeholder:text-[#514D6A] placeholder:text-sm outline-none border border-[#2C293D] py-2 px-5 rounded-full w-full`}
              {...register("password", {
                required: "Password is required",
                onChange: (e) => {
                  setPasswordText(e.target.value);
                  setTouched(true);
                },
                onBlur: () => setTouched(true),
              })}
            />
            <button
              type="button"
              onClick={toggle}
              className="absolute right-4 top-3 text-[#514D6A] "
            >
              {visible ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>

            {touched && (
              <div className=" space-y-1">
                {passwordRules
                  .filter((rule) => !rule.regex.test(passwordtext || ""))
                  .map((rule) => (
                    <div
                      key={rule.label}
                      className="flex items-center gap-2 text-sm transition-all duration-200 ease-in-out"
                    >
                      <X size={14} className="text-red-700" />
                      <span className="text-[#514D6A]">{rule.label}</span>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* confirm password */}
          <div className="relative space-y-1">
            <input
              id="confirmPassword"
              type={visible ? "text" : "password"}
              placeholder="Confirm Password"
              className={`${
                errors.password && "border-red-500 dark:border-red-400"
              } bg-transparent text-[#514D6A] placeholder:text-[#514D6A] placeholder:text-sm outline-none border border-[#2C293D] py-2 px-5 rounded-full w-full`}
              {...register("confirmPassword", {
                required: "Confirm Password is required",
                validate: (value) =>
                  value === passwordValue || "Passwords do not match",
              })}
            />
            <button
              type="button"
              onClick={toggle}
              className="absolute right-4 top-3 text-[#514D6A] "
            >
              {visible ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </div>

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
      </div>
    </div>
  );
};

export default SetNewPassword;
