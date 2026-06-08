import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none silver-btn",
  {
    variants: {
      variant: {
        secondary: "text-gray-900",
        destructive: "text-gray-900",
        default: "text-gray-900",
        red: "text-gray-900",
        outline: "text-gray-900",
        yellow: "text-gray-900",
        ghost: "text-gray-900",
        link: "text-gray-900 underline-offset-4 hover:underline",
        purple: "text-gray-900",
        green: "text-gray-900",
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

  return (
    <Comp
      data-slot="button"
      className={cn(
        "relative overflow-hidden text-gray-900",
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
      </div>
    </Comp>
  );
}
export { Button, buttonVariants };
