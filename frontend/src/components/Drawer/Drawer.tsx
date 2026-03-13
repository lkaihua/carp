import {
  Drawer as BlueprintDrawer,
  DrawerProps,
} from '@blueprintjs/core/lib/esm/components/drawer/drawer';
import { Media } from '@blueprintjs/icons';
import { useNavigate } from 'react-router-dom';

import { FlexCol } from '../FlexBoxCol/FlexBoxCol';
import { PropsWithChildren, useCallback, useState } from 'react';
import { Button } from '@blueprintjs/core/lib/esm/components/button/buttons';
import { css } from '@emotion/css';

import { FlexBox } from '../FlexBox/FlexBox';
import { Colors, H5, Classes } from '@blueprintjs/core';
import { HEADER_NAV_HEIGHT } from '../../constants/layout';

export interface Props {
  src: string;
  filePath?: string; // could be any existing file
  name?: string;
  icon?: DrawerProps['icon'];
  onCloseNavigateTo?: string;
}

export function Drawer({
  children,
  src,
  filePath,
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

  const title = name ?? decodeURIComponent(src.split('/').pop() ?? '');

  const [isMaximized, setIsMaximized] = useState(false);
  const toggleMaximize = useCallback(
    () => setIsMaximized((prev) => !prev),
    [],
  );

  const size = isMaximized
    ? window.innerHeight - HEADER_NAV_HEIGHT
    : window.innerHeight * 0.5;

  return (
    <BlueprintDrawer
      position="bottom"
      size={`${size}px`}
      title={
        <FlexBox
          style={{ justifyContent: 'space-between', alignItems: 'center' }}
        >
          <H5>{title}</H5>
          {!!filePath && (
            <FlexBox>
              <Button
                minimal
                icon={isMaximized ? 'minimize' : 'maximize'}
                title={isMaximized ? 'Restore size' : 'Maximize'}
                onClick={toggleMaximize}
              />
              <a href={filePath} download={name}>
                <Button minimal icon="share" title="Open the file" />
              </a>
            </FlexBox>
          )}
        </FlexBox>
      }
      usePortal
      enforceFocus
      autoFocus
      icon={icon}
      isOpen={!!src}
      onClose={onClose}
      className={`drawer-container ${Classes.DARK}`}
      transitionDuration={0}
    >
      <FlexBox className={styles.drawerContainer}>
        <FlexCol className={styles.drawerContent}>{children}</FlexCol>
        {/* <FlexCol className={styles.drawerFooter}>
          <Button className={styles.drawerFooterCloseButton} onClick={onClose}>
            Close
          </Button>
        </FlexCol> */}
      </FlexBox>
    </BlueprintDrawer>
  );
}

const styles = {
  drawerContainer: css`
    display: flex;
    flex-direction: column;
    height: 100%;
    max-height: 100%;
    overflow: hidden;
  `,
  drawerContent: css`
    flex: 1 1 auto;
    justify-content: space-between;
    align-items: center;
    overflow-y: scroll;
    overflow-x: hidden;
    width: 100%;
  `,
  drawerFooter: css`
    flex: 0 0 auto;
    height: 50px;
    justify-content: center;
    border-top: 1px solid ${Colors.LIGHT_GRAY3};
  `,
  drawerFooterCloseButton: css`
    margin-inline: 10px;
  `,
};
