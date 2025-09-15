import { Media } from '@blueprintjs/icons';

import './Photo.css';

export function Photo({ src, name }: { src: string; name?: string }) {
  return <img className="photo-img" src={src} alt={name} />;
}
