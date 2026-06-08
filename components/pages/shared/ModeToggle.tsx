"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, Palette } from "lucide-react";
import { useTheme } from "next-themes";

const themes = [
  { label: "Sapphire", value: "theme-sapphire", swatch: "bg-[#2563eb]" },
  { label: "Silver", value: "theme-silver", swatch: "bg-[#94a3b8]" },
  { label: "Metal", value: "theme-metal", swatch: "bg-[#6366f1]" },
  { label: "Aurora", value: "theme-aurora", swatch: "bg-[#a855f7]" },
  { label: "Amber", value: "theme-amber", swatch: "bg-[#de9c3a]" },
  { label: "Amber Dark", value: "theme-amber-dark", swatch: "bg-[#9a6a15]" },
];

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const currentTheme = theme || "theme-sapphire";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="text-foreground"
          title="Choose theme"
        >
          <Palette className="size-4" />
          <span className="sr-only">Choose theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {themes.map((item) => (
          <DropdownMenuItem
            key={item.value}
            onClick={() => setTheme(item.value)}
            className="justify-between"
          >
            <span className="flex items-center gap-2">
              <span
                className={`size-3 rounded-full border border-border ${item.swatch}`}
              />
              {item.label}
            </span>
            {currentTheme === item.value && <Check className="size-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
