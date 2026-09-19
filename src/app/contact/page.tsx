import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "How to get in touch with the Travel Utility team.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <article className="page-shell max-w-3xl py-10 sm:py-12">
      <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">Contact</h1>
      <p className="mt-4 text-sm text-muted">
        We welcome feedback, bug reports and suggestions for new tools. This is a static site, so there is no
        contact form and no account system.
      </p>
      <h2 className="mt-6 text-lg font-semibold text-foreground">Email</h2>
      <p className="mt-2 text-sm text-muted">
        Replace this placeholder with your support address before launch, for example support@example.com.
      </p>
      <h2 className="mt-6 text-lg font-semibold text-foreground">What to include</h2>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted">
        <li>The tool name and the values you entered.</li>
        <li>What you expected and what you saw instead.</li>
        <li>Your browser and device if the issue is visual.</li>
      </ul>
      <p className="mt-4 text-sm text-muted">
        For corrections about live data, please include the source you are comparing against.
      </p>
    </article>
  );
}
