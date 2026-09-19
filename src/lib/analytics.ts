type AnalyticsEvent =
  | { name: "tool_used"; toolName: string }
  | { name: "calculation"; toolName: string }
  | { name: "result_copied"; toolName: string }
  | { name: "result_shared"; toolName: string }
  | { name: "tool_favorited"; toolName: string };

interface AnalyticsProvider {
  track(event: AnalyticsEvent): void;
}

class ConsoleAnalyticsProvider implements AnalyticsProvider {
  track(event: AnalyticsEvent): void {
    if (process.env.NODE_ENV === "development") {
      console.info("[analytics]", event);
    }
  }
}

let provider: AnalyticsProvider = new ConsoleAnalyticsProvider();

export function setAnalyticsProvider(next: AnalyticsProvider): void {
  provider = next;
}

export function trackToolUsed(toolName: string): void {
  provider.track({ name: "tool_used", toolName });
}

export function trackCalculation(toolName: string): void {
  provider.track({ name: "calculation", toolName });
}

export function trackResultCopied(toolName: string): void {
  provider.track({ name: "result_copied", toolName });
}

export function trackResultShared(toolName: string): void {
  provider.track({ name: "result_shared", toolName });
}

export function trackToolFavorited(toolName: string): void {
  provider.track({ name: "tool_favorited", toolName });
}
