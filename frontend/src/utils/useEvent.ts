import { useRef, useCallback } from 'react';

export function useEvent<T extends (...args: any[]) => void>(fn: T): T {
  const ref = useRef(fn);
  ref.current = fn;

  return useCallback(((...args) => ref.current(...args)) as T, []);
}
