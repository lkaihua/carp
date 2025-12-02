import { ElementRef, useEffect, useRef, useState } from 'react';
import {
  Link,
  Outlet,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';

import {
  Card,
  CardList,
  CompoundTag,
  H6,
  Section,
  SectionCard,
  Tag,
  Text,
} from '@blueprintjs/core';

import hexToRgba from 'hex-to-rgba';

import {
  DisplayItems,
  EntryType,
  FolderContentData,
} from './types/proto/types';
import AutoSizer from 'react-virtualized-auto-sizer';

import './App.css';
import { FlexCol } from './components/FlexBoxCol/FlexBoxCol';
import { Viewer } from './components/Viewer/Viewer';
import { Grid } from './components/Grid/Grid';
import { Header } from './components/Header/Header';
import { List } from './components/List/List';

import { usePathData } from './utils/usePathData';
import { usePathMeta } from './utils/usePathMeta';
import { useServerInfo } from './utils/useServerInfo';

import { LoadingBoundary } from './components/LoadingBoundary/LoadingBoundary';
import { css } from '@emotion/css';
import { Colors } from '@blueprintjs/core';
import { FlexBox } from './components/FlexBox/FlexBox';
import { LIST_ROW_HEIGHT } from './constants/layout';
import { useActiveVerticalPos } from './utils/useActiveVerticalPos';
import { useActiveView } from './utils/useActiveView';
import { formatStartTime } from './utils/time';
import { ChevronRight } from '@blueprintjs/icons';

const defaultDisplayItems = {
  data: [
    {
      name: 'Empty Folder',
      entryType: EntryType.UNRECOGNIZED,
      urlString: '',
      firstName: 'This folder is empty.',
      lastName: 'Empty Folder',
      modTime: '',
      modTimeUnix: 0,
    },
  ],
} as DisplayItems;

export type ListPageProps = {
  startFolder?: string;
};

function ListPage({ startFolder }: ListPageProps) {
  const { pathname } = useLocation();
  const path = startFolder ?? pathname;

  const { folderPath, fileName } = usePathMeta(path);

  // console.log('folderPath', folderPath, 'fileName', fileName);

  const [activeView] = useActiveView();

  const listRef = useRef<ElementRef<typeof List>>(null);
  const gridRef = useRef<ElementRef<typeof Grid>>(null);

  // There are two meta data to fetch:
  // 1. always fetch the folder
  const { data, isLoading, error } = usePathData(folderPath);

  // Sync document title with path
  useEffect(() => {
    document.title = `Carp ${path ? `- ${path}` : ''}`;
  }, [path]);

  const folderContentData =
    data?.type === EntryType.ENTRY_TYPE_FOLDER &&
      (data?.data?.displayItems?.data?.length ?? 0) > 0
      ? data.data
      : ({ displayItems: defaultDisplayItems } as FolderContentData);

  const { displayItems } = folderContentData;
  // console.log('displayItems', displayItems);

  const [activeVerticalPos, setActiveVerticalPos] = useActiveVerticalPos(path, activeView);
  const hasRestoredScrollPos = useRef(false);

  // Reset the restoration flag when path or view changes
  useEffect(() => {
    hasRestoredScrollPos.current = false;
  }, [path, activeView]);

  if (!displayItems) {
    return null;
  }

  return (
    <>
      <LoadingBoundary isLoading={isLoading} error={error}>
        <FlexCol className={styles.listPage}>
          <AutoSizer>
            {({ height, width }) =>
              activeView === 'list' ? (
                <List
                  width={width}
                  height={height}
                  itemData={displayItems.data}
                  rowHeight={LIST_ROW_HEIGHT}
                  ref={listRef}
                  onItemsRendered={() => {
                    if (!hasRestoredScrollPos.current && activeVerticalPos > 0) {
                      requestAnimationFrame(() => {
                        listRef.current?.scrollTo(activeVerticalPos);
                        hasRestoredScrollPos.current = true;
                      });
                    }
                  }}
                  onScrollFinish={setActiveVerticalPos}
                />
              ) : (
                <Grid
                  width={width}
                  height={height}
                  itemData={displayItems.data}
                  columnWidth={Math.floor(width / 3)}
                  columnCount={3}
                  rowHeight={Math.floor(height / 3)}
                  ref={gridRef}
                  isSquare={true}
                  onItemsRendered={() => {
                    if (!hasRestoredScrollPos.current && activeVerticalPos > 0) {
                      requestAnimationFrame(() => {
                        gridRef.current?.scrollTo({ scrollTop: activeVerticalPos });
                        hasRestoredScrollPos.current = true;
                      })
                    }
                  }}
                  onScrollFinish={setActiveVerticalPos}
                />
              )
            }
          </AutoSizer>
        </FlexCol>
        <Viewer
          fileName={fileName}
          filePath={fileName ? path : null}
          parentFolderPath={folderPath}
          parentFolderData={folderContentData}
        />
        <Outlet />
      </LoadingBoundary>
    </>
  );
}

function Home() {
  const { data: serverInfo } = useServerInfo();

  return (
    <>
      <Section
        title="Root Folder"
        icon="home"
        titleRenderer={() => (
          <FlexBox
            style={{ alignItems: 'center', justifyContent: 'center' }}
            gap={10}
          >
            <H6 style={{ marginBottom: 0 }}>Root Folder</H6>
          </FlexBox>
        )}
      >
        <SectionCard padded>
          <Link to="/~/" className={styles.homeLink}>
            <FlexBox gap={5} style={{ alignItems: 'center', justifyContent: 'space-between' }}>
              <CompoundTag
                fill
                minimal
                size="large"
                leftContent="~"
                icon="folder-shared-open"
              >
                <FlexBox gap={5} style={{ alignItems: 'center', justifyContent: 'space-between', paddingRight: '10px' }}>
                  <Text className={styles.tipText}>Start from here</Text>
                  <ChevronRight style={{ color: Colors.GRAY2 }} />
                </FlexBox>
              </CompoundTag>
            </FlexBox>
          </Link>
        </SectionCard>
      </Section>


      <Section
        title="Server Info"
        collapsible={true}
        style={{ overflow: 'unset' }}
        icon="server"
      >
        <SectionCard padded>
          <div className={styles.serverInfoList}>
            <CompoundTag
              fill
              minimal
              size="large"
              leftContent="LAN IP"
              icon="globe-network"
            >
              {serverInfo?.ipAddress || 'Loading...'}
            </CompoundTag>

            <Section
              className={styles.qrCodeSection}
              title="QR code"
              collapsible={true}
              collapseProps={{ defaultIsOpen: false }}
              titleRenderer={() => (
                <CompoundTag
                  fill
                  minimal
                  size="large"
                  leftContent="QR code"
                  icon="mobile-phone"
                >
                  <Text className={styles.tipText}>Scan on mobile</Text>
                </CompoundTag>
              )}
            >
              <SectionCard>
                <img src="http://localhost:8100/qr/?url=http://192.168.1.100:8100" alt="QR Code" width={200} />
              </SectionCard>
            </Section>

            <CompoundTag
              fill
              minimal
              size="large"
              leftContent="Server started"
              icon="cloud-tick"
            >
              {serverInfo?.startTime ? formatStartTime(serverInfo.startTime) : 'Loading...'}
            </CompoundTag>
            <CompoundTag
              fill
              minimal
              size="large"
              leftContent="Local folder"
              icon="folder-open"
            >
              {serverInfo?.localFolder || 'Loading...'}
            </CompoundTag>
          </div>
        </SectionCard>
      </Section>
    </>
  );
}

function App() {
  return (
    <FlexCol className="app-container">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/~/*" element={<ListPage />} />
      </Routes>
    </FlexCol>
  );
}

const styles = {
  homeLink: css`
    &:hover {
      text-decoration: none;
    }
  `,
  tipText: css`
    font-style: italic;
    color: ${Colors.BLUE3};
  `,
  welcomeState: css`
    background-color: ${Colors.LIGHT_GRAY5};
    && {
      height: 150px;
    }
  `,
  listPage: css`
    flex: 1 1 auto;
    width: 100%;
    height: calc(100dvh - 50px);
    /* 50px for header */
    overflow: hidden;
  `,
  serverInfoList: css`
    display: flex;
    flex-direction: column;
    gap: 5px;
  `,

  qrCodeSection: css`
    &.bp6-section-collapsed {
      box-shadow: none;
    }

    &&& .bp6-section-header {
      padding-left: 0;
      min-height: unset;
      background-color: ${hexToRgba(Colors.GRAY1, 0.1)};

      .bp6-section-header-left {
        padding-block: 0;
      }
      .bp6-compound-tag-right {
        background-color: unset;
      }
    }
  `,
};

export default App;
