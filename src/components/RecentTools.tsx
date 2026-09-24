"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePreferences } from "./providers/PreferencesProvider";
import { Icon, resolveIcon } from "@/components/ui/Icon";
import { TOOL_MAP } from "@/lib/catalog";

export function RecentTools() {
  const { recent, t } = usePreferences();
  const tools = recent.map((slug) => TOOL_MAP[slug]).filter(Boolean);

  return (
    <section aria-labelledby="recent-heading" className="no-print flex h-full flex-col">
      <h2 id="recent-heading" className="flex items-center gap-2 text-base font-semibold text-ink">
        <Icon name="refresh" size={17} className="text-accent" />
        {t("home.recentlyUsed")}
      </h2>
      {tools.length === 0 ? (
        <div className="mt-4 flex flex-1 flex-col items-start gap-3">
          <p className="text-sm text-muted">{t("home.noRecent")}</p>
          <Link href="/tools" className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-accent-soft px-3.5 text-xs font-semibold text-accent-strong">
            {t("home.exploreTools")}
            <Icon name="arrow-right" size={14} />
          </Link>
        </div>
      ) : (
        <ul className="mt-4 flex flex-wrap gap-2">
          {tools.map((tool) => (
            <li key={tool!.slug}>
              <Link
                href={`/tools/${tool!.slug}`}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-2 text-xs font-medium text-muted transition hover:border-border-strong hover:text-ink"
              >
                <Icon name={resolveIcon(tool!.icon)} size={14} />
                {tool!.shortTitle}
              </Link>
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
