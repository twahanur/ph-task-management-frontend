const DeactiveIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      className="w-16 h-16"
    >
      <defs>
        <linearGradient id="yellowBlackGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFD700" />
          <stop offset="100%" stopColor="#000000" />
        </linearGradient>
      </defs>

      <rect
        x="18"
        y="20"
        width="28"
        height="32"
        rx="4"
        ry="4"
        stroke="url(#yellowBlackGradient)"
        strokeWidth="3"
        fill="none"
      />
      <line
        x1="14"
        y1="20"
        x2="50"
        y2="20"
        stroke="url(#yellowBlackGradient)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <rect
        x="26"
        y="12"
        width="12"
        height="6"
        rx="2"
        fill="url(#yellowBlackGradient)"
      />

      <path
        d="M22 40l6 6 14-14"
        fill="none"
        stroke="url(#yellowBlackGradient)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default DeactiveIcon;
