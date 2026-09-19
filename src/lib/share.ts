export async function shareOrCopy(title: string, text: string, url: string): Promise<"shared" | "copied"> {
  if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
    try {
      await navigator.share({ title, text, url });
      return "shared";
    } catch {
      // Fall through to copy.
    }
  }
  await navigator.clipboard.writeText(url);
  return "copied";
}

export async function copyText(text: string): Promise<void> {
  await navigator.clipboard.writeText(text);
}

export function buildShareUrl(pathname: string, params: Record<string, string | number | boolean | undefined>): string {
  const url = new URL(pathname, typeof window === "undefined" ? "http://localhost" : window.location.origin);
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === "") {
      return;
    }
    url.searchParams.set(key, String(value));
  });
  return `${url.pathname}${url.search}`;
}
