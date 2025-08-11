
import { Media } from "@blueprintjs/icons";

import './Photo.css'
import { Drawer } from "./Drawer";

export function Photo({ src, name, parentFolderPath }: { src: string; name?: string; parentFolderPath?: string }) {
  return (
    <Drawer src={src} name={name} onCloseNavigateTo={parentFolderPath} icon={<Media />} >
      <img className="photo-img" src={src} alt={name} />
    </Drawer>
  );
}