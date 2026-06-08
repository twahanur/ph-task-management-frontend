import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md  font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        secondary:
          "text-secondary-foreground bg-linear-to-t from-[#8B07A8] to-white/10",
        destructive: "bg-destructive text-white",
        default:
          "text-secondary-foreground bg-white/10 border-b border-b-white/60",
        red: "text-secondary-foreground bg-linear-to-t from-[#B5050B] to-white/10",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        yellow:
          "text-secondary-foreground bg-linear-to-t from-[#CB9228] to-white/10",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
        purple:
          "text-secondary-foreground bg-linear-to-t from-[#8B07A8] to-white/10",
        green:
          "text-secondary-foreground bg-linear-to-t from-[#00A656] to-white/10",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  children,
  className,
  variant,
  icon,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    icon?: React.ReactNode;
  }) {
  const Comp = asChild ? Slot : "button";
  const yellowGradient = {
    left: `linear-gradient(to right,  #CB9228 40%,   #FECC6F 100%)`,
    right: `linear-gradient(to right,  #FECC6F 40%,   #CB9228 100%)`,
  };
  const purpleGradient = {
    left: `linear-gradient(to right,  #8B07A8 40%,   #AA00FF 100%)`,
    right: `linear-gradient(to right,  #AA00FF 40%,   #8B07A8 100%)`,
  };
  const redGradient = {
    left: `linear-gradient(to right,  #B5050B 40%,   #E03137 100%)`,
    right: `linear-gradient(to right,  #E03137 40%,   #B5050B 100%)`,
  };
  const greenGradient = {
    left: `linear-gradient(to right,  #00A656 40%,   #09EB7E 100%)`,
    right: `linear-gradient(to right,  #09EB7E 40%,   #00A656 100%)`,
  };

  return (
    <Comp
      data-slot="button"
      className={cn(
        "relative overflow-hidden text-white",
        buttonVariants({ variant, size, className })
      )}
      {...props}
    >
      <div className="rounded-xl ">
        <span
          data-slot="button-content"
          className="relative z-10 flex items-center gap-2"
        >
          {icon}{children}
        </span>
        <div className="absolute flex w-full bottom-0 left-1/2 -translate-x-1/2">
          <span
            className="w-1/2 h-0.5"
            style={{
              background: `${variant === "yellow"
                ? yellowGradient.left
                : variant === "purple"
                  ? purpleGradient.left
                  : variant === "red"
                    ? redGradient.left
                    : variant === "green"
                      ? greenGradient.left
                      : ""
                }`,
            }}
          />
          <span
            className="w-1/2 h-0.5"
            style={{
              background: `${variant === "yellow"
                ? yellowGradient.right
                : variant === "purple"
                  ? purpleGradient.right
                  : variant === "red"
                    ? redGradient.right
                    : variant === "green"
                      ? greenGradient.right
                      : ""
                }`,
            }}
          />
        </div>
      </div>
    </Comp>
  );
}
export { Button, buttonVariants };
