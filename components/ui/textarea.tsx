import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full rounded-md px-3 py-2 text-base outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm silver-input",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
