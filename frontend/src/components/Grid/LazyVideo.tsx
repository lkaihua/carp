import { useEffect, useRef, useState } from 'react';
import { Video } from '../Viewer/Video';
import { Icon } from '@blueprintjs/core';
import { css } from '@emotion/css';

interface LazyVideoProps {
  src: string;
  controls?: boolean;
  isSquare?: boolean;
}

/**
 * This seems the best approach that we can do. On iOS, it's still noticed that the first X (~20) videos
 * can be loaded, and after that even the video player can show the video size correctly, it can not display
 * any frame or playback. It looks like a limitation of mobile devices. 
 */
export function LazyVideo({ src, controls = false, isSquare = false }: LazyVideoProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [mountKey, setMountKey] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const wasVisibleRef = useRef(false);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const nowVisible = entry.isIntersecting;
          
          // If transitioning from visible to not visible, force remount next time
          if (wasVisibleRef.current && !nowVisible) {
            setMountKey(prev => prev + 1);
          }
          
          wasVisibleRef.current = nowVisible;
          setIsVisible(nowVisible);
        });
      },
      {
        // Start loading when video is within 200px of viewport
        rootMargin: '200px',
        threshold: 0,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Force cleanup when component unmounts
  useEffect(() => {
    return () => {
      // Ensure any video resources are cleaned up
      setIsVisible(false);
    };
  }, []);

  return (
    <div ref={containerRef} className={styles.container}>
      {isVisible ? (
        // Use key to force complete remount when video becomes visible again
        <Video 
          key={`${src}-${mountKey}`}
          src={src} 
          controls={controls} 
          isSquare={isSquare} 
          autoPlay={false}
        />
      ) : (
        // Placeholder while not visible
        <div className={styles.placeholder}>
          <Icon icon="play" />
        </div>
      )}
    </div>
  );
}

const styles = {
  container: css`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  `,
  placeholder: css`
    width: 100%;
    height: 100%;
    background-color: #000;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #666;
    font-size: 12px;
  `,
};
