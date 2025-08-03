// components/VideoPlayer.tsx
import videojs from "video.js";
import "../../../node_modules/video.js/dist/video-js.css";
import { useEffect, useRef } from "react";

interface Props {
  src: string;
  type?: string; // e.g. "application/x-mpegURL" for HLS
}

export default function VideoPlayer({ src, type = "video/mp4" }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerRef = useRef<videojs.Player | null>(null);

  useEffect(() => {
    if (!playerRef.current && videoRef.current) {
      playerRef.current = videojs(videoRef.current, {
        controls: true,
        autoplay: true,
        preload: "auto",
        fluid: true,
        sources: [{ src, type }],
      });
    } else {
      playerRef.current?.src({ src, type });
    }

    return () => {
      playerRef.current?.dispose();
      playerRef.current = null;
    };
  }, [src, type]);

  return (
    <div data-vjs-player>
      <video ref={videoRef} className="video-js vjs-big-play-centered" />
    </div>
  );
}
