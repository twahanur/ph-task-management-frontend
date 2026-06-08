const DeepRedSvg = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="66"
      height="44"
      viewBox="0 0 66 44"
      fill="none"
      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-full object-cover z-10 rounded-xl"
    >
      <g filter="url(#filter0_f_1784_4559)">
        <ellipse
          cx="32.5"
          cy="39"
          rx="33"
          ry="9"
          fill="#F50F0F"
          fillOpacity="1"
        />
      </g>
      <defs>
        <filter
          id="filter0_f_1784_4559"
          x="-39"
          y="-8.5"
          width="143"
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
            result="effect1_foregroundBlur_1784_4559"
          />
        </filter>
      </defs>
    </svg>
  );
};

export default DeepRedSvg;
