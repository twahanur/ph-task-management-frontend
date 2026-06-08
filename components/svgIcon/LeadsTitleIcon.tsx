import * as React from "react";
import { LucideProps } from "lucide-react";

const LeadsTitleIcon = React.forwardRef<SVGSVGElement, LucideProps>(
  ({ size = 20, ...props }, ref) => (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      {...props}
    >
      <path
        d="M4.16667 13.75C3.6357 14.1907 3.33334 14.7235 3.33334 15.2632C3.33334 16.9587 6.3181 18.3333 10 18.3333C13.6819 18.3333 16.6667 16.9587 16.6667 15.2632C16.6667 14.7235 16.3643 14.1907 15.8333 13.75"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.83334 11.6663H7.5L8.75 15.833H11.25L12.5 11.6663H14.1667V9.99967C14.1667 7.69849 12.3012 5.83301 10 5.83301C7.69882 5.83301 5.83334 7.69849 5.83334 9.99967V11.6663Z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 5.83366C11.1506 5.83366 12.0833 4.90092 12.0833 3.75033C12.0833 2.59973 11.1506 1.66699 10 1.66699C8.8494 1.66699 7.91666 2.59973 7.91666 3.75033C7.91666 4.90092 8.8494 5.83366 10 5.83366Z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
);

LeadsTitleIcon.displayName = "LeadsTitleIcon";

export default LeadsTitleIcon;
