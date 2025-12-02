// import './Video.css'
import ReactPlayer from 'react-player';

interface VideoProps {
  src: string;
  controls?: boolean;
  autoPlay?: boolean;
  isSquare?: boolean;
}

export function Video(props: VideoProps) {
  const { src, controls = true, autoPlay = false, isSquare = false } = props;
  return (
    <ReactPlayer
      src={src}
      controls={controls}
      style={{
        width: '100%',
        height: '100%',
        objectFit: isSquare ? 'cover' : 'contain',
      }}
      muted={true}
      autoPlay={autoPlay}
      loop
      playsInline
    />
  );
}
