import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page-shell max-w-2xl py-20 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-strong">404</p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight text-ink">Page not found</h1>
      <p className="mt-3 text-sm leading-7 text-muted">
        We could not find that page. It may have moved, or the link may be incorrect.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Link href="/" className="inline-flex min-h-11 items-center rounded-full bg-brand px-5 text-sm font-medium text-white">Go home</Link>
        <Link href="/tools" className="inline-flex min-h-11 items-center rounded-full border border-border bg-white px-5 text-sm font-medium">Browse tools</Link>
      </div>
    </div>
  );
}
