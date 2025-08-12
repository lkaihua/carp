import { ElementRef, memo, useEffect, useRef } from 'react';
import { Link, Route, Routes, useLocation } from 'react-router-dom';

import {
  Divider,
  EntityTitle,
  Icon,
  NonIdealState,
  NonIdealStateIconSize,
  Spinner,
} from '@blueprintjs/core';
import { Issue } from '@blueprintjs/icons';
import { DisplayItem, FolderContentData } from './types/proto/types';

import AutoSizer from 'react-virtualized-auto-sizer';

import { useLocalStorage } from 'usehooks-ts';
import './App.css';
import { Box } from './components/Box';
import { BoxCol } from './components/BoxCol';
import { List } from './components/List';
import { Grid } from './components/Grid';
import { Header } from './components/Header';
import { Photo } from './components/Photo';
import { Video } from './components/Video';
import { getParentFolderPath } from './utils/getParentFolderPath';
import { usePathData } from './utils/usePathData';
import { getIconForType } from './utils/getIconForType';
import { useActiveRowPerPath } from './utils/useActiveRowPerPath';

const rowHeight = 50;

function ListPage() {
  // const {path = ""} = useParams();
  const { pathname } = useLocation();
  const segments = pathname.split('/').filter(Boolean); // removes empty strings
  const currrentPath = segments.join('/');
  const parentFolderPath = getParentFolderPath(segments);

  const [activeView] = useLocalStorage<string>('activeView', 'list');
  const [activeRowIndex, setActiveRowIndex] = useActiveRowPerPath(
    `${currrentPath}::${activeView}`, // distinguish between list and grid views
    0,
  );

  // const hasMountedRef = useRef(false);
  const listRef = useRef<ElementRef<typeof List>>(null);
  const gridRef = useRef<ElementRef<typeof Grid>>(null);

  // TODO: I don't yet know how to persist the scroll position, for each path.
  // useEffect(() => {
  //   console.log(
  //     'activeRowIndex:',
  //     activeRowIndex,
  //     listRef.current,
  //     hasMountedRef.current,
  //   );
  //   if (listRef.current && hasMountedRef.current && activeRowIndex > 0) {
  //     console.log('scrolling to active row index:', activeRowIndex);
  //     listRef.current.scrollToItem(activeRowIndex, 'center'); // 'center', 'auto', or 'smart'
  //   }
  // }, [activeRowIndex]);

  // Read the current path and the parent folder
  const { data, isLoading, error } = usePathData(pathname);
  const { data: parentFolderData } = usePathData(parentFolderPath);

  useEffect(() => {
    console.log('Path changed:', location.pathname);
    // everytime the path changes,

    if (activeView === 'list' && listRef.current && activeRowIndex > 0) {
      listRef.current.scrollToItem(activeRowIndex, 'start');
    }
    if (activeView === 'grid' && gridRef.current && activeRowIndex > 0) {
      gridRef.current.scrollToItem({
        rowIndex: activeRowIndex,
        align: 'start',
      });
    }
  }, [location.pathname]);

  if (isLoading)
    return (
      <NonIdealState
        layout={'horizontal'}
        icon={<Spinner />}
        iconSize={NonIdealStateIconSize.STANDARD}
        title="Loading ..."
        description="Fetching data from the server"
      />
    );
  if (error)
    return (
      <NonIdealState
        layout={'horizontal'}
        icon={<Issue size={NonIdealStateIconSize.STANDARD} />}
        title="Error"
        description={error.message}
      />
    );

  let fileViewer: JSX.Element | null = null;

  switch (data?.type) {
    case 'video':
      fileViewer = <Video src={data.url} parentFolderPath={parentFolderPath} />;
      break;
    case 'image':
      fileViewer = <Photo src={data.url} parentFolderPath={parentFolderPath} />;
      break;
    case 'json':
      break;
    default:
      break;
  }

  // display the current folder when the file viewer is open
  const folderData =
    data?.folder ?? parentFolderData?.folder ?? ({} as FolderContentData);

  const { displayItems } = folderData;

  let listContent: JSX.Element | null = null;
  if (Array.isArray(displayItems)) {
    listContent = (
      <AutoSizer>
        {({ height, width }) =>
          activeView === 'list' ? (
            <List
              width={width}
              height={height}
              itemData={displayItems}
              rowHeight={rowHeight}
              ref={listRef}
              setActiveRowIndex={setActiveRowIndex}
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
              setActiveRowIndex={setActiveRowIndex}
            />
          )
        }
      </AutoSizer>
    );
  }

  return (
    <BoxCol className="list-content">
      {listContent}
      <Box>{fileViewer}</Box>
    </BoxCol>
  );
}

function App() {
  return (
    <BoxCol className="list-page">
      <Header />
      <Routes>
        <Route path="/" element={<ListPage />} />
        <Route path=":path/*" element={<ListPage />} />
      </Routes>
    </BoxCol>
  );
}

export default App;
