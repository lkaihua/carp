import { useLocalStorage } from 'usehooks-ts';
import { useCallback, useMemo } from 'react';

type ActiveVerticalPosMap = Record<string, number>;

/**
 * Hook to remember the last active row index for each path.
 */
export function useActiveVerticalPos(currentPath: string, activeView: string, defaultIndex = 0) {
  const [activeVerticalPosMap, setActiveVerticalPosMap] =
    useLocalStorage<ActiveVerticalPosMap>("ActiveVerticalPosMap", {});

  const activeVerticalPos = useMemo(
    () => activeVerticalPosMap[`${activeView}:${currentPath}`] ?? defaultIndex,
    [activeVerticalPosMap, activeView, currentPath, defaultIndex],
  );

  const setActiveVerticalPos = useCallback(
    (index: number) => {
      setActiveVerticalPosMap((prev) => ({
        ...prev,
        [`${activeView}:${currentPath}`]: index,
      }));
    },
    [activeView, currentPath, setActiveVerticalPosMap],
  );

  return [activeVerticalPos, setActiveVerticalPos] as const;
}
