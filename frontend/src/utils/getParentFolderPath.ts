export function getParentFolderPath(segments: string[]): string {
  return segments.length > 0 ? `/${segments.slice(0, -1).join("/")}` : "/";
}