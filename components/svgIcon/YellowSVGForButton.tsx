const YellowSVGForButton = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="120"
      height="48"
      viewBox="0 0 120 48"
      fill="none"
      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-full object-cover z-10 rounded-xl"
    >
      <g filter="url(#filter0_f_1900_22678)">
        <ellipse
          cx="82"
          cy="39"
          rx="66"
          ry="9"
          fill="#FFB13F"
          fillOpacity="1"
        />
      </g>
      <defs>
        <filter
          id="filter0_f_1900_22678"
          x="-22.5"
          y="-8.5"
          width="209"
          height="95"
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
            stdDeviation="19.25"
            result="effect1_foregroundBlur_1900_22678"
          />
        </filter>
      </defs>
    </svg>
  );
};

export default YellowSVGForButton;
