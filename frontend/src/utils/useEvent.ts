import { useRef, useCallback } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useEvent<T extends (...args: any[]) => void>(fn: T): T {
  const ref = useRef(fn);
  ref.current = fn;

  return useCallback(((...args) => ref.current(...args)) as T, []);
}
