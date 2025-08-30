export function getParentFolderPath(segments: string[]): string {
  if (segments.length === 0) {
    return '/'; // root has no parent
  }

  // remove last segment
  const parent = segments.slice(0, -1).join('/');

  // ensure leading slash, and ensure exactly one trailing slash
  return parent.length > 0 ? `/${parent}/` : '/';
}
