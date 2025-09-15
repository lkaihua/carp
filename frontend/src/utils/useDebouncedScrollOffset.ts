import { useState, useEffect, useRef, useCallback } from 'react';
import { useDebounce } from '@uidotdev/usehooks';
import { useEvent } from './useEvent';

export function useDebouncedScrollOffset(
  onScrollFinished: (offset: number) => void,
  delay = 100,
) {
  const hasMountedRef = useRef(false);
  const [scrollOffset, setScrollOffset] = useState(0);
  const debouncedScrollOffset = useDebounce(scrollOffset, delay);

  const stableOnScrollFinished = useEvent(onScrollFinished);

  useEffect(() => {
    if (!hasMountedRef.current) return;
    if (debouncedScrollOffset >= 0) {
      stableOnScrollFinished(debouncedScrollOffset);
    }
  }, [debouncedScrollOffset, stableOnScrollFinished]);

  const handleScroll = useCallback((offset: number) => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }
    setScrollOffset(offset);
  }, []);

  return { handleScroll };
}
