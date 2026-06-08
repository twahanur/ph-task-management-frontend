const GreenSvgForButton = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="113"
      height="64"
      viewBox="0 0 113 64"
      fill="none"
      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-full object-cover z-10 rounded-xl"
    >
      <g filter="url(#filter0_f_600_28349)">
        <ellipse
          cx="82"
          cy="44.5"
          rx="70"
          ry="5"
          fill="#05BD3D"
          fillOpacity="1"
        />
      </g>
      <defs>
        <filter
          id="filter0_f_600_28349"
          x="-26.5"
          y="-1.5"
          width="217"
          height="92"
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
            stdDeviation="21.25"
            result="effect1_foregroundBlur_600_28349"
          />
        </filter>
      </defs>
    </svg>
  );
};

export default GreenSvgForButton;
