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

import { useLocalStorage } from 'usehooks-ts';
import './App.css';
import { FlexCol } from './components/FlexBoxCol/FlexBoxCol';
import { Viewer } from './components/Viewer/Viewer';
import { Grid } from './components/Grid/Grid';
import { Header } from './components/Header/Header';
import { List } from './components/List/List';
import { List } from './components/List/List';
import { usePathData } from './utils/usePathData';
import { usePathMeta } from './utils/usePathMeta';
import { joinPath } from './utils/path';
import { LoadingBoundary } from './components/LoadingBoundary/LoadingBoundary';
import { css } from '@emotion/css';
import { Colors } from '@blueprintjs/core';
import { FlexBox } from './components/FlexBox/FlexBox';
import { LIST_ROW_HEIGHT } from './constants/layout';

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

export type ListView = 'list' | 'grid';

export type ListPageProps = {
  startFolder?: string;
};

function ListPage({ startFolder }: ListPageProps) {
  const { pathname } = useLocation();
  const path = startFolder ?? pathname;

  const { folderPath, fileName } = usePathMeta(path);

  console.log('folderPath', folderPath, 'fileName', fileName);

  const [itemsRendered, setItemsRendered] = useState(false);



  const [activeView, setActiveView] = useLocalStorage<ListView>(
    'activeView',
    'grid',
  );

  const [activeVerticalPos, setActiveVerticalPos] = useLocalStorage(
    'activeVerticalPos',
    {},
  );

    {},
  );

  const listRef = useRef<ElementRef<typeof List>>(null);
  const gridRef = useRef<ElementRef<typeof Grid>>(null);

  // There are two meta data to fetch:
  // 1. always fetch the folder
  const { data, isLoading, error } = usePathData(folderPath);

  // TODO: Persist last scroll position for the folder view

  // Sync document title with path
  useEffect(() => {
    document.title = `Carp ${path ? `- ${path}` : ''}`;
  }, [path]);

  const folderContentData =
    data?.type === EntryType.ENTRY_TYPE_FOLDER &&
    (data?.data?.displayItems?.data?.length ?? 0) > 0
      ? data.data
      : ({ displayItems: defaultDisplayItems } as FolderContentData);

      : ({ displayItems: defaultDisplayItems } as FolderContentData);

  // TODO: now scrolling triggers the view re-rendering, why???
  const { displayItems } = folderContentData;
  console.log('displayItems', displayItems);

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
  return (
    <>
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
              192.168.1.100
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
                  <Text>Scan on mobile</Text>
                </CompoundTag>
              )}
            >
              <SectionCard>This is the QR code image</SectionCard>
            </Section>

            <CompoundTag
              fill
              minimal
              size="large"
              leftContent="Server started"
              icon="cloud-tick"
            >
              xxxx-xx-xx (5 minutes ago)
            </CompoundTag>
            <CompoundTag
              fill
              minimal
              size="large"
              leftContent="Local folder"
              icon="folder-open"
            >
              /Users/admin/Downloads/
            </CompoundTag>
          </div>
        </SectionCard>
      </Section>

      <Section
        title="Root Folder"
        collapsible={true}
        icon="home"
        titleRenderer={() => (
          <FlexBox
            style={{ alignItems: 'center', justifyContent: 'center' }}
            gap={10}
          >
            <H6 style={{ marginBottom: 0 }}>Root Folder</H6>
            <Link to="/~/">
              <FlexBox gap={5}>
                <Tag minimal icon="folder-shared-open" size="large">
                  <code>~</code>
                </Tag>
              </FlexBox>
            </Link>
          </FlexBox>
        )}
      >
        <ListPage startFolder="/~/" />
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
