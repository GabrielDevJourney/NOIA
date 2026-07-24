const relativeTimeFormatter = new Intl.RelativeTimeFormat("en", {
  numeric: "always",
  style: "narrow",
});

const DIVISIONS: { amount: number; unit: Intl.RelativeTimeFormatUnit }[] = [
  { amount: 60, unit: "second" },
  { amount: 60, unit: "minute" },
  { amount: 24, unit: "hour" },
  { amount: 7, unit: "day" },
  { amount: 4.34524, unit: "week" },
  { amount: 12, unit: "month" },
  { amount: Number.POSITIVE_INFINITY, unit: "year" },
];

/**
 * Formats an ISO date string as a short relative time, e.g. "3d ago", "1w ago".
 * Falls back to "just now" for anything under a minute old.
 */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  let duration = (date.getTime() - Date.now()) / 1000;

  if (Math.abs(duration) < 60) {
    return "just now";
  }

  for (const division of DIVISIONS) {
    if (Math.abs(duration) < division.amount) {
      return relativeTimeFormatter.format(Math.round(duration), division.unit);
    }
    duration /= division.amount;
  }

  return relativeTimeFormatter.format(Math.round(duration), "year");
}
