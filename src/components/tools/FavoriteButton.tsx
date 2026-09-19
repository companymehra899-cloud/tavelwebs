"use client";

import { usePreferences } from "@/components/providers/PreferencesProvider";
import { trackToolFavorited } from "@/lib/analytics";

export function FavoriteButton({ slug, title }: { slug: string; title: string }) {
  const { isFavorite, toggleFavorite, t } = usePreferences();
  const active = isFavorite(slug);

  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={() => {
        toggleFavorite(slug);
        trackToolFavorited(title);
      }}
      className={`no-print inline-flex min-h-11 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
        active
          ? "border-brand bg-brand-soft text-brand-strong"
          : "border-border bg-white text-muted hover:bg-brand-soft"
      }`}
    >
      {active ? t("calculator.removeFavorite") : t("calculator.addFavorite")}
    </button>
  );
}
