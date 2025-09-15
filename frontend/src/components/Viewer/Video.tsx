// import './Video.css'
import ReactPlayer from 'react-player';

export function Video({ src }: { src: string }) {
  /* 
  <video
    src={src}
    controls
    autoPlay={true}
    muted={false}
    width="100%"
    style={{ maxHeight: '100%' }}
  /> 
  */

  return (
    <ReactPlayer
      src={src}
      controls={true}
      style={{
        width: 'auto',
        height: 'auto',
        maxHeight: '100%',
        maxWidth: '100%',
      }}
      muted={false}
      autoPlay={true}
    />
  );
}
