import { Drawer } from "@blueprintjs/core/lib/esm/components/drawer/drawer";
import { Video } from "@blueprintjs/icons";
import { useNavigate } from "react-router-dom";

export function VideoPlayer({ src, onCloseNavigateTo }: { src: string; onCloseNavigateTo?: string }) {
  const navigate = useNavigate();

  return (
    <Drawer position='bottom' size="95%"
      title={decodeURIComponent(src.split('/').pop() ?? "")} usePortal icon={<Video />} onClose={() => {
        if (onCloseNavigateTo) {
          navigate(onCloseNavigateTo);
        }
      }} isOpen={true}>
      <video src={src} controls autoPlay muted width="100%" />
    </Drawer>
  );
}