"use client";

import { TOOL_COMPONENTS } from "./ToolRegistry";

export function ToolRenderer({ slug }: { slug: string }) {
  const Component = TOOL_COMPONENTS[slug];
  if (!Component) {
    return (
      <p className="rounded-xl border border-dashed border-border bg-white p-4 text-sm text-muted">
        This tool is not available right now. Please choose another tool.
      </p>
    );
  }
  return <Component />;
}
