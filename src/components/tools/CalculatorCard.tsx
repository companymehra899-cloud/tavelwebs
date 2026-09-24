import type { ReactNode } from "react";

export function CalculatorCard({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <section
      id={id}
      aria-label="Calculator"
      className="print-block relative overflow-hidden rounded-2xl border border-border bg-surface p-5 shadow-[var(--shadow)] sm:p-7"
    >
      <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,var(--accent),var(--cyan),transparent)]" />
      {children}
    </section>
  );
}

export function FieldGrid({ children, columns = 2 }: { children: ReactNode; columns?: 1 | 2 | 3 }) {
  const cols = columns === 1 ? "sm:grid-cols-1" : columns === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2";
  return <div className={`grid grid-cols-1 gap-4 ${cols}`}>{children}</div>;
}

export function SectionHeading({ children, as: Tag = "h2" }: { children: ReactNode; as?: "h2" | "h3" }) {
  return <Tag className="text-base font-semibold tracking-tight text-ink">{children}</Tag>;
}
