import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "How to get the most out of Travel Utility and report a problem.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <article className="page-shell max-w-3xl py-10 sm:py-12">
      <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">Contact</h1>
      <p className="mt-4 text-sm text-muted">
        We welcome feedback, bug reports and suggestions for new tools. This is a static site, so there is no
        contact form, no account system and no support inbox.
      </p>
      <h2 className="mt-6 text-lg font-semibold text-foreground">Getting help</h2>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted">
        <li>Each tool page includes a short FAQ and a formula and methodology section.</li>
        <li>Currency and distance tools show a clear message when live data is unavailable; try again in a few minutes.</li>
        <li>Nothing you enter is sent to us. Preferences, favourites and checklists stay in your browser.</li>
      </ul>
      <h2 className="mt-6 text-lg font-semibold text-foreground">Reporting a problem</h2>
      <p className="mt-2 text-sm text-muted">
        If a result looks wrong, note the details below so you can check it against the formula shown on the tool
        page.
      </p>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted">
        <li>The tool name and the values you entered.</li>
        <li>What you expected and what you saw instead.</li>
        <li>Your browser and device if the issue is visual.</li>
      </ul>
      <p className="mt-4 text-sm text-muted">
        Live figures such as exchange rates and driving routes come from free public data sources. When comparing
        results, please include the source you are using.
      </p>
    </article>
  );
}
