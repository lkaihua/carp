import { ElementRef, useEffect, useMemo, useRef, useState } from 'react';
import { Route, Routes, useLocation, useParams } from 'react-router-dom';

import {
  NonIdealState,
  NonIdealStateIconSize,
  Spinner,
} from '@blueprintjs/core';
import { Issue } from '@blueprintjs/icons';
import { DisplayItem, DisplayItems, EntryType } from './types/proto/types';

import AutoSizer from 'react-virtualized-auto-sizer';

import { useLocalStorage } from 'usehooks-ts';
import './App.css';
import { BoxCol } from './components/BoxCol/BoxCol';
import { Viewer } from './components/Viewer/Viewer';
import { Grid } from './components/Grid/Grid';
import { Header } from './components/Header/Header';
import { List } from './components/List/List';
import { useActiveVerticalPos } from './utils/useActiveVerticalPos';
import { usePathData } from './utils/usePathData';
import { usePathMeta } from './utils/usePathMeta';
import { joinPath } from './utils/path';
import { LoadingBoundary } from './components/LoadingBoundary/LoadingBoundary';
import { css } from '@emotion/css';
import { Colors } from '@blueprintjs/core';

const rowHeight = 50;

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
  isRoot?: boolean;
};

function ListPage({ isRoot }: ListPageProps) {
  const { pathname } = useLocation();

  const { folderPath, fileName } = usePathMeta(pathname);

  const resolvedIsRoot = isRoot || pathname === '/';

  console.log('folderPath', folderPath, 'fileName', fileName);

  // const isFolder = pathname.endsWith('/');
  // const segments = pathname.split('/').filter(Boolean); // removes empty strings
  // const currentPath = `${segments.join('/')}${isFolder ? '/' : ''}`;

  const [itemsRendered, setItemsRendered] = useState(false);

  // `/photos/test.jpg` -> folder `/photos/`, file `test.jpg` -> list `/photos/` folder, and then toggle on the preview if needed
  // `/photos/` -> folder `/photos/`, file `null`

  const [activeView, setActiveView] = useLocalStorage<ListView>(
    'activeView',
    'grid',
  );

  const [activeVerticalPos, setActiveVerticalPos] = useLocalStorage(
    'activeVerticalPos',
    {},
  );

  // const [activeVerticalPos, setActiveVerticalPos] = useActiveVerticalPos(
  //   `${currentPath}::${activeView}`, // distinguish between list and grid views
  //   0,
  // );

  const listRef = useRef<ElementRef<typeof List>>(null);
  const gridRef = useRef<ElementRef<typeof Grid>>(null);

  // There are two meta data to fetch:
  // 1. always fetch the folder
  const { data, isLoading, error } = usePathData(folderPath);

  // TODO: Persist last scroll position for the folder view
  // useEffect(() => {
  // A true itemsRendered flag makes sure container ref is ready
  // if (itemsRendered && activeVerticalPos > 0) {
  //   if (activeView === 'list' && listRef.current) {
  //     requestAnimationFrame(() =>
  //       listRef.current.scrollTo(activeVerticalPos),
  //     );
  //   } else if (activeView === 'grid' && gridRef.current) {
  //     requestAnimationFrame(() =>
  //       gridRef.current.scrollTo({
  //         scrollTop: activeVerticalPos,
  //       }),
  //     );
  //   }
  // }
  // }, [currentFolderPath, activeView]);

  // useEffect(() => {
  //   console.log('activeVerticalPos', activeVerticalPos);
  // }, [activeVerticalPos]);

  // Sync document title with path
  useEffect(() => {
    document.title = `Carp ${pathname ? `- ${pathname}` : ''}`;
  }, [pathname]);

  const folderData =
    data?.type === EntryType.ENTRY_TYPE_FOLDER &&
    (data?.folder?.displayItems?.data ?? []).length > 0
      ? data
      : { folder: { displayItems: defaultDisplayItems } };

  // const fileData =
  //   currentFileData?.type !== EntryType.ENTRY_TYPE_FOLDER
  //     ? currentFileData
  //     : null;

  // console.log('current folder', currentFolderPath);
  // console.log('current path', currentPath);
  // console.log('current folderData', folderData);
  // console.log('current fileData', fileData);

  // TODO: now scrolling triggers the view re-rendering, why???
  // because the
  const { displayItems } = folderData.folder;
  console.log('displayItems', displayItems);

  if (!displayItems) {
    return null;
  }

  return (
    <>
      {resolvedIsRoot && (
        <NonIdealState
          className={styles.welcomeState}
          title="Welcome to Carp"
          description="This is a self-hosted personal media server. To get started, please configure the root folder in the settings."
        />
      )}
      <LoadingBoundary isLoading={isLoading} error={error}>
        <BoxCol className={styles.listPage}>
          <AutoSizer>
            {({ height, width }) =>
              activeView === 'list' ? (
                <List
                  width={width}
                  height={height}
                  itemData={displayItems.data}
                  rowHeight={rowHeight}
                  ref={listRef}
                  // onItemsRendered={() => setItemsRendered(true)}
                  // setActiveVerticalPos={setActiveVerticalPos}
                />
              ) : (
                <Grid
                  width={width}
                  height={height}
                  itemData={displayItems.data}
                  columnWidth={Math.floor(width / 3)}
                  columnCount={3}
                  rowHeight={200}
                  ref={gridRef}
                  // onItemsRendered={() => setItemsRendered(true)}
                  // setActiveVerticalPos={setActiveVerticalPos}
                />
              )
            }
          </AutoSizer>
        </BoxCol>
        <Viewer
          file={fileName ? pathname : undefined}
          parentFolderPath={folderPath}
        />
      </LoadingBoundary>
    </>
  );
}

function App() {
  return (
    <BoxCol className="app-container">
      <Header />
      <Routes>
        <Route path="/" element={<ListPage isRoot />} />
        <Route path=":path/*" element={<ListPage />} />
      </Routes>
    </BoxCol>
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
};

export default App;
