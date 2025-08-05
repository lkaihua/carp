import { Drawer } from "@blueprintjs/core/lib/esm/components/drawer/drawer";
import { Media } from "@blueprintjs/icons";
import { useNavigate } from "react-router-dom";

export function Photo({ src, name, onCloseNavigateTo }: { src: string; name?: string; onCloseNavigateTo?: string }) {
  const navigate = useNavigate();

  return (
    <Drawer position='bottom' size="95%"
      title={decodeURIComponent(src.split('/').pop() ?? "")} usePortal icon={<Media />} onClose={() => {
        if (onCloseNavigateTo) {
          navigate(onCloseNavigateTo);
        }
      }} isOpen={true}>
      <img src={src} alt={name} style={{ maxWidth: "100%" }} />;
    </Drawer>
  );
}