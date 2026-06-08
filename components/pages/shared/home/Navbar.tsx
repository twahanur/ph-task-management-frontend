/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import ButtonComponent from "@/components/ui/ButtonComponent";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useUser } from "@/provider/AuthProvider";
import { logout } from "@/service/authService";
import { motion } from "framer-motion";
import { LayoutDashboard, LogOut, Menu } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { toast } from "sonner";
import { ModeToggle } from "../ModeToggle";

export type TSocialUser = {
  name: string;
  email: string;
  image: string | null;
};

export default function Navbar() {
  const router = useRouter();
  const { user, setIsLoading, setUser, isLoading } = useUser();

  const handleLogOut = async () => {
    const toastId = toast.loading("logging out", { duration: 3000 });
    try {
      const res = await logout();
      console.log("logut res-->>> ", res);
      if (res.success) {
        setIsLoading(true);
        setUser(null);
        toast.success(res?.message, { id: toastId, duration: 3000 });
        router.push("/login");
      } else {
        toast.error(res.message, { id: toastId, duration: 3000 });
      }
    } catch (error: any) {
      const errorInfo =
        error?.error ||
        error?.data?.message ||
        error?.data?.errors[0]?.message ||
        "Something went wrong!";
      toast.error(errorInfo, { id: toastId, duration: 3000 });
    }
  };

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn(
        "fixed max-w-full w-full z-50 bgGlass border-b border-border",
        "text-foreground",
      )}
    >
      <div className="max-w-[1444px] mx-auto px-4 ">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="text-primary font-bold text-xl flex items-center gap-2"
          >
            <span className="text-foreground font-extrabold tracking-wider">
              PH <span className="text-primary">TASKS</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          {/* <ul className="hidden md:flex items-center gap-8 text-sm font-medium">
            {NavLinks.map((link) => (
              <li key={link.path}>
                <Link
                  href={link.path}
                  className={cn(
                    "hover:text-yellow-400 transition-colors",
                    pathname === link.path && "text-yellow-400",
                  )}
                >
                  {link.title}
                </Link>
              </li>
            ))}
          </ul> */}

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center gap-2">
            <ModeToggle />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-primary">
                  <Menu size={24} />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="bg-popover border-border text-popover-foreground w-[300px] p-0 flex flex-col"
              >
                <SheetHeader className="text-left pt-6 px-8 mb-4">
                  <SheetTitle>
                    <span className="text-foreground font-extrabold tracking-wider">
                      PH <span className="text-primary">TASKS</span>
                    </span>
                  </SheetTitle>
                </SheetHeader>

                <div className="flex flex-col gap-6 px-8 mt-4 overflow-y-auto flex-1">
                  {/* <div className="flex flex-col gap-4">
                    {NavLinks.map((link) => (
                      <Link
                        key={link.path}
                        href={link.path}
                        className={cn(
                          "text-base font-semibold transition-all hover:text-yellow-400 hover:translate-x-1 duration-300",
                          pathname === link.path
                            ? "text-yellow-400"
                            : "text-white/60",
                        )}
                      >
                        {link.title}
                      </Link>
                    ))}
                  </div> */}

                  <div className="pt-6 border-t border-border flex flex-col gap-4">
                    {isLoading ? (
                      <div className="h-20 flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      </div>
                    ) : user ? (
                      <>
                        <Link
                          href="/dashboard"
                          className="flex items-center gap-3 text-base font-semibold text-primary hover:translate-x-1 transition-transform"
                        >
                          <LayoutDashboard size={20} />
                          Dashboard
                        </Link>
                        <button
                          onClick={handleLogOut}
                          className="flex items-center gap-3 text-base font-semibold text-red-400/80 hover:text-red-400 hover:translate-x-1 transition-all"
                        >
                          <LogOut size={20} />
                          Logout
                        </button>
                      </>
                    ) : (
                      <div className="flex flex-col gap-4">
                        <Link href="/login" className="w-full">
                          <ButtonComponent
                            buttonName="Sign In"
                            varient="purple"
                            className="w-full"
                          />
                        </Link>
                        <Link href="/register">
                          <ButtonComponent
                            buttonName="Sign Up"
                            varient="yellow"
                            className="w-full"
                          />
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <ModeToggle />
            {user ? (
              <>
                <Link href="/dashboard">
                  <ButtonComponent
                    buttonName="Dashboard"
                    icon={LayoutDashboard}
                    varient="yellow"
                  />
                </Link>
                <Button
                  onClick={handleLogOut}
                  variant="ghost"
                  className="text-red-400 hover:text-white p-2 cursor-pointer"
                >
                  <LogOut size={18} />
                </Button>
              </>
            ) : (
              <div className="flex gap-3">
                <Link href="/login">
                  <ButtonComponent buttonName="Sign In" varient="purple" />
                </Link>
                <Link href="/register">
                  <ButtonComponent buttonName="Sign Up" varient="yellow" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
