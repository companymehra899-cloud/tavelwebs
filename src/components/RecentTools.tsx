"use client";

import { useEffect } from "react";
import { usePreferences } from "./providers/PreferencesProvider";

export function RecentTools() {
  const { recent, t } = usePreferences();

  return (
    <section aria-labelledby="recent-heading" className="no-print">
      <h2 id="recent-heading" className="text-lg font-semibold text-ink">
        {t("home.recentlyUsed")}
      </h2>
      {recent.length === 0 ? (
        <p className="mt-2 text-sm text-muted">{t("home.noFavorites")}</p>
      ) : (
        <ul className="mt-4 flex flex-wrap gap-2">
          {recent.map((slug) => (
            <li key={slug}>
              <a
                href={`/tools/${slug}`}
                className="inline-flex rounded-full border border-border bg-white px-3.5 py-2 text-xs font-medium capitalize text-foreground hover:border-brand"
              >
                {slug.replace(/-/g, " ")}
              </a>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function RecordRecent({ slug }: { slug: string }) {
  const { recordRecent } = usePreferences();
  useEffect(() => {
    recordRecent(slug);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);
  return null;
}
