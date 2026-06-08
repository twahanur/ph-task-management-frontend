/**
 * TakaSymbol - Renders the Bangladeshi Taka symbol (৳) using Noto Sans Bengali font
 * to ensure proper rendering regardless of the primary app font.
 */
const TakaSymbol = ({ className = "" }: { className?: string }) => (
  <span
    style={{ fontFamily: "var(--font-noto-bengali), sans-serif" }}
    className={className}
  >
    ৳
  </span>
);

export default TakaSymbol;
