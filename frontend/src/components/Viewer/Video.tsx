// import './Video.css'
import ReactPlayer from 'react-player';

interface VideoProps {
  src: string;
  controls?: boolean;
  autoPlay?: boolean;
}

export function Video({ src, controls = true, autoPlay = true }: VideoProps) {
  return (
    <ReactPlayer
      src={src}
      controls={controls}
      style={{
        width: 'auto',
        height: '100%',
        maxHeight: '100%',
        maxWidth: '100%',
        backgroundColor: 'black',
      }}
      muted={true}
      autoPlay={autoPlay}
      loop
      playsInline
    />
  );
}
