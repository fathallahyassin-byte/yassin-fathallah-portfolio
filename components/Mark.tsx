/**
 * The signature: a ring with a satellite. It appears in the loader, the
 * navbar, section labels, the cursor and the footer.
 */
type Props = {
  size?: number | string;
  className?: string;
  spin?: boolean;
  filled?: boolean;
};

export default function Mark({ size = 14, className = "", spin = false, filled = false }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
      className={`inline-block shrink-0 ${className}`}
    >
      <circle
        cx="12"
        cy="12"
        r="8"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <g
        style={{ transformOrigin: "12px 12px" }}
        className={spin ? "animate-[spin_6s_linear_infinite] motion-reduce:animate-none" : ""}
      >
        <circle cx="20.5" cy="5" r="2.6" fill="var(--color-accent)" />
      </g>
    </svg>
  );
}
