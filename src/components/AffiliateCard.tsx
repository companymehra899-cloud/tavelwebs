export interface AffiliateCardProps {
  category: "hotels" | "insurance" | "car-rental" | "accessories" | "sim" | "luggage";
  title: string;
  description: string;
  href?: string;
}

const LABELS: Record<AffiliateCardProps["category"], string> = {
  hotels: "Hotels",
  insurance: "Travel insurance",
  "car-rental": "Car rental",
  accessories: "Travel accessories",
  sim: "SIM / eSIM",
  luggage: "Luggage",
};

export function AffiliateCard({ category, title, description, href }: AffiliateCardProps) {
  const content = (
    <div className="rounded-3xl border border-border bg-surface p-5 shadow-[0_10px_30px_rgba(28,36,48,0.06)]">
      <span className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-muted">
        {LABELS[category]}
      </span>
      <h3 className="mt-2 text-sm font-semibold text-ink">{title}</h3>
      <p className="mt-1 text-xs leading-6 text-muted">{description}</p>
    </div>
  );

  if (!href) {
    return content;
  }

  return (
    <a href={href} rel="sponsored nofollow" target="_blank" className="block hover:opacity-90">
      {content}
    </a>
  );
}
