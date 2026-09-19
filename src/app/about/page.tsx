import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "About",
  description: "About Travel Utility, a free collection of fast travel calculators.",
  alternates: { canonical: "/about" },
};

export default function AboutPage(): ReactNode {
  return (
    <article className="page-shell max-w-3xl py-10 sm:py-12">
      <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">About Travel Utility</h1>
      <p className="mt-4 text-sm text-muted">
        Travel Utility is a collection of fast, focused travel calculators. Instead of a general-purpose travel
        chatbot, it focuses on a single job: helping you answer a specific travel question in a few seconds.
      </p>
      <h2 className="mt-6 text-lg font-semibold text-foreground">What you can do here</h2>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted">
        <li>Work out fuel, toll and total road trip costs.</li>
        <li>Plan a travel budget and split costs between travellers.</li>
        <li>Convert currencies using a public reference rate feed.</li>
        <li>Convert time zones, estimate flight times and plan around jet lag.</li>
        <li>Generate packing lists, checklists and a trip countdown.</li>
      </ul>
      <h2 className="mt-6 text-lg font-semibold text-foreground">How we handle data</h2>
      <p className="mt-2 text-sm text-muted">
        Most tools run entirely in your browser. Preferences such as units, favourites, checklists and countdowns
        are stored in your device&apos;s local storage and are not sent to a server. Currency rates come from a public
        European Central Bank reference feed. Where live data is not available, we say so rather than showing
        invented values.
      </p>
      <p className="mt-4 text-sm text-muted">
        The tools provide estimates and general information only. They are not professional, legal, medical or
        financial advice. Always confirm important details with official sources.
      </p>
    </article>
  );
}
