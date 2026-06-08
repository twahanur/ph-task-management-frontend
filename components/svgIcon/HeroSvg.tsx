const HeroSvg = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1440"
      height="663"
      viewBox="0 0 1440 663"
      fill="none"
      className="absolute bottom-0 left-0 w-full h-full object-cover z-10 pointer-events-none"
    >
      <g filter="url(#filter0_f_1535_58479)">
        <ellipse
          cx="746"
          cy=""
          rx="420"
          ry="138.041"
          fill="url(#paint0_radial_1535_58479)"
          fillOpacity="0.65"
        />
      </g>
      <defs>
        <filter
          id="filter0_f_1535_58479"
          x="-194"
          y="-254"
          width="1880"
          height="916.081"
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
            stdDeviation="160"
            result="effect1_foregroundBlur_1535_58479"
          />
        </filter>
        <radialGradient
          id="paint0_radial_1535_58479"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(746 204.041) rotate(90) scale(138.041 736.972)"
        >
          <stop stopColor="#E99BFD" />
          <stop offset="0.494792" stopColor="#D028FA" />
        </radialGradient>
      </defs>
    </svg>
  );
};

export default HeroSvg;
