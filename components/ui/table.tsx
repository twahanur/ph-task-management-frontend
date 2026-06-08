"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

function Table({ className, ...props }: React.ComponentProps<"table">) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [startX, setStartX] = React.useState(0);
  const [scrollLeft, setScrollLeft] = React.useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 2; // scroll-speed
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      className={cn(
        "relative w-full overflow-auto no-scrollbar select-none",
        isDragging ? "cursor-grabbing" : "cursor-grab"
      )}
    >
      <table
        data-slot="table"
        className={cn("caption-bottom text-sm w-full", className)}
        {...props}
      />
    </div>
  );
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn("min-w-full", className)}
      {...props}
    />
  );
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  );
}

function TableFooter({ className,  ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "bg-muted/50 border-t font-medium [&>tr]:last:border-b-0",
        className,
      )}
      {...props}
    />
  );
}
type TableRowProps = React.ComponentProps<"tr"> & {
  link?: string; // optional
};

function TableRow({ className, link, ...props }: TableRowProps) {
  const router = useRouter();

  const handleClick = () => {
    if (!link) return;
    router.push(link);
  };

  return (
    <tr
      data-slot="table-row"
      onClick={link ? handleClick : undefined}
      className={cn(
        "transition-colors w-full rounded-2xl",
        "data-[state=selected]:bg-muted",
        link ? "cursor-pointer hover:bg-muted/50" : "hover:bg-transparent",
        className,
      )}
      {...props}
    />
  );
}

function TableHead({
  first,
  last,
  children,
  secondClass,
  className,
  ...props
}: React.ComponentProps<"th"> & {
  first?: boolean;
  last?: boolean;
  secondClass?: string;
}) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "text-foreground h-10 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 *:[[role=checkbox]]:translate-y-0.5",
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          `px-4 py-3 bg-white/10 border border-y-white/40   border-x-white/20 ${first
            ? "rounded-tl-2xl rounded-bl-2xl"
            : last
              ? "rounded-tr-2xl rounded-br-2xl"
              : ""
          } text-center text-white`,
          secondClass,
        )}
      >
        {children}
      </div>
    </th>
  );
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 *:[[role=checkbox]]:translate-y-0.5  border-b-2 border-white/20",
        className,
      )}
      {...props}
    />
  );
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("text-muted-foreground mt-4 text-sm", className)}
      {...props}
    />
  );
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
