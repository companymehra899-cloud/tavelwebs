"use client";

import Link from "next/link";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="page-shell max-w-2xl py-20 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Error</p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-ink">Something went wrong</h1>
      <p className="mt-3 text-sm leading-7 text-muted">
        This page ran into a problem. You can try again or return to the home page.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <button type="button" onClick={reset} className="inline-flex min-h-11 items-center rounded-full bg-brand px-5 text-sm font-medium text-white">
          Try again
        </button>
        <Link href="/" className="inline-flex min-h-11 items-center rounded-full border border-border bg-white px-5 text-sm font-medium">
          Go home
        </Link>
      </div>
    </div>
  );
}
