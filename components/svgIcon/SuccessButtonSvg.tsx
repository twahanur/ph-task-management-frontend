const SuccessButtonSvg = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="516"
      height="48"
      viewBox="0 0 516 48"
      fill="none"
      className="absolute bottom-0 left-0 object-cover z-30 rounded-xl "
    >
      <g filter="url(#filter0_f_2117_30582)">
        <ellipse
          cx="266"
          cy="39"
          rx="250"
          ry="9"
          fill="#05BD3D"
          fillOpacity="1"
        />
      </g>
      <defs>
        <filter
          id="filter0_f_2117_30582"
          x="-22.5"
          y="-8.5"
          width="577"
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
            result="effect1_foregroundBlur_2117_30582"
          />
        </filter>
      </defs>
    </svg>
  );
};

export default SuccessButtonSvg;
