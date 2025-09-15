import { useLocalStorage } from 'usehooks-ts';
import { useCallback, useMemo } from 'react';

type ActiveVerticalPosMap = Record<string, number>;

/**
 * Hook to remember the last active row index for each path.
 * @param currentPath - The current path (folder, route, etc.)
 * @param defaultIndex - The default row index when none is saved
 */
export function useActiveVerticalPos(currentPath: string, defaultIndex = 0) {
  const [activeVerticalPosMap, setActiveVerticalPosMap] =
    useLocalStorage<ActiveVerticalPosMap>('activeVerticalPosMap', {});

  const activeVerticalPos = useMemo(
    () => activeVerticalPosMap[currentPath] ?? defaultIndex,
    [activeVerticalPosMap, currentPath, defaultIndex],
  );

  const setActiveVerticalPos = useCallback(
    (index: number) => {
      setActiveVerticalPosMap((prev) => ({
        ...prev,
        [currentPath]: index,
      }));
    },
    [currentPath, setActiveVerticalPosMap],
  );

  return [activeVerticalPos, setActiveVerticalPos] as const;
}
