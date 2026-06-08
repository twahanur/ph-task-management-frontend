const SidebarButtonSvg = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="168"
      height="32"
      viewBox="0 0 168 32"
      fill="none"
      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-full object-cover z-10 rounded-xl"
    >
      <g filter="url(#filter0_f_1636_16574)">
        <ellipse
          cx="90"
          cy="28"
          rx="79"
          ry="7.5"
          fill="#DE9C3A"
          fillOpacity="1"
        />
      </g>
      <defs>
        <filter
          id="filter0_f_1636_16574"
          x="-24.4"
          y="-5.4"
          width="218.8"
          height="75.8"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="15.2"
            result="effect1_foregroundBlur_1636_16574"
          />
        </filter>
      </defs>
    </svg>
  );
};

export default SidebarButtonSvg;
