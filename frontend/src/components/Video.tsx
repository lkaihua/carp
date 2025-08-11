
import { Video as VideoIcon } from "@blueprintjs/icons";

// import './Video.css'
import { Drawer } from "./Drawer";

export function Video({ src, name, parentFolderPath }: { src: string; name?: string; parentFolderPath?: string }) {
  return (
    <Drawer src={src} name={name} onCloseNavigateTo={parentFolderPath} icon={<VideoIcon />} >
      <video src={src} controls autoPlay muted width="100%" style={{ maxHeight: "100%" }} />
    </Drawer>
  );
}