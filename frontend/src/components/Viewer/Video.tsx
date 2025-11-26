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
        width: isSquare ? '100%' : 'auto',
        height: isSquare ? '100%' : 'auto',
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
