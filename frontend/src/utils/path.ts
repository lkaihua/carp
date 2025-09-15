export interface PathMeta {
  folderPath: string;
  fileName: string | null;
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
    const fileName = segments.pop()!;
    const folderPath = segments.length > 0 ? `/${segments.join('/')}/` : '/';
    return { folderPath, fileName };
  }
}

export function joinPath(folderPath?: string, fileName?: string): string {
  const path = `${folderPath?.replace(/\/+$/, '')}/${fileName?.replace(/^\/+/, '')}`;
  return path;
}
