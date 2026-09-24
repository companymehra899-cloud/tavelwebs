"use client";

import { usePreferences } from "@/components/providers/PreferencesProvider";
import { trackToolFavorited } from "@/lib/analytics";
import { Icon } from "@/components/ui/Icon";

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
      className={`no-print inline-flex min-h-10 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition ${
        active
          ? "border-accent/30 bg-accent-soft text-accent-strong"
          : "border-border bg-surface text-muted hover:border-border-strong hover:text-ink"
      }`}
    >
      <Icon name="heart" size={16} className={active ? "fill-current" : ""} />
      <span className="hidden sm:inline">{active ? t("calculator.removeFavorite") : t("calculator.addFavorite")}</span>
    </button>
  );
}
