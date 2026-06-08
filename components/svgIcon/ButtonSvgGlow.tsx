const ButtonSvgGlow = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="195"
      height="32"
      viewBox="0 0 195 32"
      fill="none"
      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-full object-cover z-10 rounded-xl "
    >
      <g filter="url(#filter0_f_1093_40256)">
        <ellipse
          cx="75"
          cy="35"
          rx="79"
          ry="10"
          fill="#FFB13F"
          fillOpacity="1"
        />
      </g>
      <defs>
        <filter
          id="filter0_f_1093_40256"
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
            result="effect1_foregroundBlur_1093_40256"
          />
        </filter>
      </defs>
    </svg>
  );
};

export default ButtonSvgGlow;
