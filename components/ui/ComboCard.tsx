"use client";

import { cn } from "@/lib/utils";

interface ComboCardProps {
  gap?: string;
  radius?: string;
  className?: string;
  children: React.ReactNode;
}

const ComboCard = ({
  gap,
  radius = "rounded-[20px]",
  className,
  children,
}: ComboCardProps) => {
  return <div className={cn(gap, radius, className)}>{children}</div>;
};

export default ComboCard;
