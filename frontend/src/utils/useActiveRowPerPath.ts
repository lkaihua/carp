import { useLocalStorage } from 'usehooks-ts';
import { useMemo } from 'react';

type ActiveRowMap = Record<string, number>;

/**
 * Hook to remember the last active row index for each path.
 * @param currentPath - The current path (folder, route, etc.)
 * @param defaultIndex - The default row index when none is saved
 */
export function useActiveRowPerPath(currentPath: string, defaultIndex = 0) {
  const [activeRowMap, setActiveRowMap] = useLocalStorage<ActiveRowMap>(
    'activeRowMap',
    {},
  );

  const activeRowIndex = useMemo(
    () => activeRowMap[currentPath] ?? defaultIndex,
    [activeRowMap, currentPath, defaultIndex],
  );

  const setActiveRowIndex = (index: number) => {
    setActiveRowMap((prev) => ({
      ...prev,
      [currentPath]: index,
    }));
  };

  return [activeRowIndex, setActiveRowIndex] as const;
}
