import Mark from "./Mark";

/** "(02) — Selected work" style section marker. */
export default function SectionLabel({
  index,
  children,
  className = "",
}: {
  index: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={`label flex items-center gap-3 text-mute ${className}`}>
      <Mark size={12} className="text-paper" />
      <span className="text-paper">({index})</span>
      <span aria-hidden="true" className="h-px w-8 bg-line" />
      <span>{children}</span>
    </p>
  );
}
