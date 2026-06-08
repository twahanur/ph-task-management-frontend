const ActiveIcon = () => {
  return (
    <svg
      width="261"
      height="125"
      viewBox="0 0 261 125"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-full object-cover -z-10"
    >
      <g filter="url(#filter0_f_758_11327)">
        <ellipse
          cx="130.5"
          cy="108"
          rx="130.5"
          ry="44"
          fill="#FFB13F"
          fillOpacity="0.4"
        />
      </g>
      <defs>
        <filter
          id="filter0_f_758_11327"
          x="-100"
          y="-36"
          width="461"
          height="288"
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
            stdDeviation="50"
            result="effect1_foregroundBlur_758_11327"
          />
        </filter>
      </defs>
    </svg>
  );
};

export default ActiveIcon;
