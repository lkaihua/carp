import { useMemo } from 'react';
import { getPathMeta, PathMeta } from './path';

export function usePathMeta(path: string): PathMeta {
  return useMemo(() => getPathMeta(path), [path]);
}
