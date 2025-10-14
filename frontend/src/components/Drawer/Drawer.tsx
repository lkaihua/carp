import {
  Drawer as BlueprintDrawer,
  DrawerProps,
} from '@blueprintjs/core/lib/esm/components/drawer/drawer';
import { Media } from '@blueprintjs/icons';
import { useNavigate } from 'react-router-dom';

import './Drawer.css';
import { BoxCol } from '../BoxCol/BoxCol';
import { PropsWithChildren, useCallback } from 'react';
import { Button } from '@blueprintjs/core/lib/esm/components/button/buttons';
import { css } from '@emotion/css';

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
  const onClose = useCallback(() => {
    if (onCloseNavigateTo) {
      navigate(onCloseNavigateTo);
    }
  }, [navigate, onCloseNavigateTo]);
  // if (!src) {
  //   return null;
  // }
  const title = name ?? decodeURIComponent(src?.split('/').pop() ?? '');

  // breadcrumb height: 50px
  // minus extra space to show the breadcrumb and the most top cells
  const size = window.innerHeight - 150;

  return (
    <BlueprintDrawer
      position="bottom"
      size={`${size}px`}
      title={title}
      usePortal
      icon={icon}
      isOpen={!!src}
      onClose={onClose}
      className="drawer-container"
      transitionDuration={0}
    >
      <BoxCol className={styles.drawerContent}>{children}</BoxCol>
      <BoxCol className={styles.drawerFooter}>
        <Button onClick={onClose}>Close</Button>
      </BoxCol>
    </BlueprintDrawer>
  );
}

const styles = {
  drawerContent: css`
    flex: 1 1 auto;
    justify-content: space-between;
    align-items: center;
    overflow: scroll;
  `,
  drawerFooter: css`
    padding: 12px 16px;
    border-top: 1px solid #eee;
  `,
};

// .drawer-container {
//   .bp6-drawer-header {
//     height: 50px; /* aligned with navbar */
//   }
// }
// .drawer-content {
//   flex: 1 1 auto;
//   justify-content: center;
//   align-items: center;
//   overflow: scroll;
// }
