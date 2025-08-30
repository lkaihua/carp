import { ElementRef, useEffect, useRef, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import {
  NonIdealState,
  NonIdealStateIconSize,
  Spinner,
} from '@blueprintjs/core';
import { Issue } from '@blueprintjs/icons';
import { DisplayItem, EntryType } from './types/proto/types';

import AutoSizer from 'react-virtualized-auto-sizer';

import { useLocalStorage } from 'usehooks-ts';
import './App.css';
import { BoxCol } from './components/BoxCol';
import { FileViewer } from './components/FileViewer';
import { Grid } from './components/Grid';
import { Header } from './components/Header';
import { List } from './components/List';
import { getParentFolderPath } from './utils/getParentFolderPath';
import { useActiveVerticalPos } from './utils/useActiveVerticalPos';
import { usePathData } from './utils/usePathData';

const rowHeight = 50;

function ListPage() {
  const { pathname } = useLocation();

  const segments = pathname.split('/').filter(Boolean); // removes empty strings
  const currrentPath = segments.join('/');
  const parentFolderPath = getParentFolderPath(segments);

  // TODO: the right way to do this
  // `/photos/test.jpg`
  // `/photos/`
  // list `/photos/` folder, and then toggle on the preview if needed
  // `/photos/test.jpg/` the folder fetch fails, try `/photos/test.jpg`
  console.log(currrentPath, parentFolderPath);

  const [activeView] = useLocalStorage<string>('activeView', 'list');
  const [itemsRendered, setItemsRendered] = useState(false);
  const [activeVerticalPos, setActiveVerticalPos] = useActiveVerticalPos(
    `${currrentPath}::${activeView}`, // distinguish between list and grid views
    0,
  );

  const listRef = useRef<ElementRef<typeof List>>(null);
  const gridRef = useRef<ElementRef<typeof Grid>>(null);

  // Read the current path and the parent folder
  const { data, isLoading, error } = usePathData(pathname);
  const {
    data: parentFolderData,
    isLoading: isParentFolderLoading,
    error: parentFolderError,
  } = usePathData(parentFolderPath);

  // Persist last scroll position
  useEffect(() => {
    // A true itemsRendered flag makes sure container ref is ready
    if (itemsRendered && activeVerticalPos > 0) {
      if (activeView === 'list' && listRef.current) {
        requestAnimationFrame(() =>
          listRef.current.scrollTo(activeVerticalPos),
        );
      } else if (activeView === 'grid' && gridRef.current) {
        requestAnimationFrame(() =>
          gridRef.current.scrollTo({
            scrollTop: activeVerticalPos,
          }),
        );
      }
    }
  }, [location.pathname, itemsRendered, activeVerticalPos, activeView]);

  // Sync document title with path
  useEffect(() => {
    document.title =
      segments.length > 0 ? `Carp - ${segments.join('/')}` : 'Carp';
  }, [segments]);

  if (isLoading || isParentFolderLoading) {
    return (
      <NonIdealState
        layout={'horizontal'}
        icon={<Spinner />}
        iconSize={NonIdealStateIconSize.STANDARD}
        title="Loading ..."
        description="Fetching data from the server"
      />
    );
  }
  if (error || parentFolderError) {
    return (
      <NonIdealState
        layout={'horizontal'}
        icon={<Issue size={NonIdealStateIconSize.STANDARD} />}
        title="Error"
        description={error.message || parentFolderError.message}
      />
    );
  }

  const defaultDisplayItems = [
    {
      name: 'Empty Folder',
      entryType: EntryType.UNRECOGNIZED,
      urlString: '',
      firstName: 'This folder is empty.',
      lastName: 'Empty Folder',
      modTime: '',
      modTimeUnix: 0,
    } as DisplayItem,
  ];
  // display the current folder when the file viewer is open
  const { displayItems = defaultDisplayItems } =
    data?.type === EntryType.ENTRY_TYPE_FOLDER
      ? data.folder
      : parentFolderData.type === EntryType.ENTRY_TYPE_FOLDER
        ? parentFolderData.folder
        : {};

  const listContent = (
    <AutoSizer>
      {({ height, width }) =>
        activeView === 'list' ? (
          <List
            width={width}
            height={height}
            itemData={displayItems}
            rowHeight={rowHeight}
            ref={listRef}
            onItemsRendered={() => setItemsRendered(true)}
            setActiveVerticalPos={setActiveVerticalPos}
          />
        ) : (
          <Grid
            width={width}
            height={height}
            itemData={displayItems}
            columnWidth={Math.floor(width / 3)}
            columnCount={3}
            rowHeight={200}
            ref={gridRef}
            onItemsRendered={() => setItemsRendered(true)}
            setActiveVerticalPos={setActiveVerticalPos}
          />
        )
      }
    </AutoSizer>
  );

  return (
    <>
      <BoxCol className="list-page">{listContent}</BoxCol>
      <FileViewer data={data} parentFolderPath={parentFolderPath} />
    </>
  );
}

function App() {
  return (
    <BoxCol className="app-container">
      <Header />
      <Routes>
        <Route path="/" element={<ListPage />} />
        <Route path=":path/*" element={<ListPage />} />
      </Routes>
    </BoxCol>
  );
}

export default App;
