
const VerifyEmailIcon = () => {
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
      <circle
        cx="32"
        cy="32"
        r="30"
        fill="url(#yellowBlackGradient)"
        opacity="0.15"
      />
      <path
        d="M16 32L28 44L48 20"
        fill="none"
        stroke="url(#yellowBlackGradient)"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default VerifyEmailIcon;
