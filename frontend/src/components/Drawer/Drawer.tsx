import {
  Drawer as BlueprintDrawer,
  DrawerProps,
} from '@blueprintjs/core/lib/esm/components/drawer/drawer';
import { Media } from '@blueprintjs/icons';
import { useNavigate } from 'react-router-dom';

import './Drawer.css';
import { BoxCol } from '../BoxCol/BoxCol';
import { PropsWithChildren, useCallback } from 'react';

const DRAWER_HEIGHT = '80%';

export interface Props {
  src?: string;
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
  if (!src) {
    return null;
  }
  const title = name ?? decodeURIComponent(src.split('/').pop() ?? '');
  const onClose = useCallback(() => {
    if (onCloseNavigateTo) {
      navigate(onCloseNavigateTo);
    }
  }, [navigate, onCloseNavigateTo]);

  return (
    <BlueprintDrawer
      position="bottom"
      size={DRAWER_HEIGHT}
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
