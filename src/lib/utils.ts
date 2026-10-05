export { cn } from "cn";

export function formatDuration(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts: string[] = [];
  if (hours > 0) parts.push(`${hours} hour${hours === 1 ? "" : "s"}`);
  if (minutes > 0) parts.push(`${minutes} minute${minutes === 1 ? "" : "s"}`);
  if (seconds > 0 || parts.length === 0)
    parts.push(`${seconds} second${seconds === 1 ? "" : "s"}`);

  return parts.length === 1
    ? parts[0]
    : `${parts.slice(0, -1).join(", ")} and ${parts.at(-1)}`;
}
