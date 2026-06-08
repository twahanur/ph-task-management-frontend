const SuccessLightSvg = ({ color }: { color: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1183"
      height="906"
      viewBox="0 0 1183 906"
      fill="none"
      className="absolute bottom-0 -left-20  h-full object-cover z-20 pointer-events-none"
    >
      <g filter="url(#filter0_f_2117_30410)">
        <ellipse
          cx="474.38"
          cy="390.245"
          rx="407.574"
          ry="174.232"
          transform="rotate(-14.0959 474.38 390.245)"
          fill={color}
          fillOpacity=".5"
        />
      </g>
      <defs>
        <filter
          id="filter0_f_2117_30410"
          x="-233.586"
          y="-124.549"
          width="1415.93"
          height="1029.59"
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
            result="effect1_foregroundBlur_2117_30410"
          />
        </filter>
      </defs>
    </svg>
  );
};

export default SuccessLightSvg;
