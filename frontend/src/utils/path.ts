import { SHARE_API_PREFIX, SHARE_PAGE_PREFIX } from '../constants/routes';

export interface PathMeta {
  folderPath: string;
  fileName: string | null;
}

// Translate a browser page URL into the matching Go content URL.
export function toShareApiPath(pagePath: string): string {
  return pagePath.startsWith(SHARE_PAGE_PREFIX)
    ? `${SHARE_API_PREFIX}${pagePath.slice(SHARE_PAGE_PREFIX.length)}`
    : pagePath;
}

export function getPathMeta(path: string): PathMeta {
  // - /folder/folder2/file.jpg
  // - /folder/folder2/file2.mp3
  // - /folder/folder2/
  // all these should return `/folder/folder2/`

  // - `/.IMG/` -> `/.IMG/`, null
  // - `/file.mp3` -> `/`, `file.mp3`
  // - `/` -> `/`, null

  const segments = path.split('/').filter(Boolean);
  const isFolder = path.endsWith('/');
  if (segments.length === 0) {
    return { folderPath: '/', fileName: null };
  }
  if (isFolder) {
    return { folderPath: `/${segments.join('/')}/`, fileName: null };
  } else {
    const fileName = segments.pop() || null;
    const folderPath = segments.length > 0 ? `/${segments.join('/')}/` : '/';
    return { folderPath, fileName };
  }
}

export function joinPath(folderPath?: string, fileName?: string): string {
  const path = `${folderPath?.replace(/\/+$/, '')}/${fileName?.replace(/^\/+/, '')}`;
  return path;
}
