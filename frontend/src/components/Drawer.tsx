import {
  Drawer as BlueprintDrawer,
  DrawerProps,
} from '@blueprintjs/core/lib/esm/components/drawer/drawer';
import { Media } from '@blueprintjs/icons';
import { useNavigate } from 'react-router-dom';

import './Drawer.css';
import { BoxCol } from './BoxCol';
import { PropsWithChildren } from 'react';

export interface Props {
  src: string;
  /**
   * Optional name for the photo, used as the title in the drawer.
   */
  name?: string;
  icon?: DrawerProps['icon'];
  onCloseNavigateTo?: string;
}

export function Drawer({
  children,
  src,
  name,
  onCloseNavigateTo,
  icon = <Media />,
}: PropsWithChildren<Props>) {
  const navigate = useNavigate();
  const title = name ?? decodeURIComponent(src.split('/').pop() ?? '');
  const onClose = () => {
    if (onCloseNavigateTo) {
      navigate(onCloseNavigateTo);
    }
  };

  return (
    <BlueprintDrawer
      position="bottom"
      size="90%"
      title={title}
      usePortal
      icon={icon}
      isOpen
      onClose={onClose}
      className="drawer-container"
      transitionDuration={0}
    >
      <BoxCol className="drawer-content">{children}</BoxCol>
    </BlueprintDrawer>
  );
}
