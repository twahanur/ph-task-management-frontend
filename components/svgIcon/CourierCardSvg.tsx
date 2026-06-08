const CourierCardSvg = () => {
  return (
    <svg
      width="266"
      height="264"
      viewBox="0 0 266 264"
      fill="none"
      className="absolute top-0 right-0"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g opacity="0.2" filter="url(#filter0_f_600_31594)">
        <rect x="80" y="-56" width="240" height="240" rx="120" fill="#EF4444" />
      </g>
      <defs>
        <filter
          id="filter0_f_600_31594"
          x="0"
          y="-136"
          width="400"
          height="400"
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
            stdDeviation="40"
            result="effect1_foregroundBlur_600_31594"
          />
        </filter>
      </defs>
    </svg>
  );
};

export default CourierCardSvg;
