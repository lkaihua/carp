import { memo } from 'react';
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
import { FixedSizeList as List } from 'react-window';

import { useLocalStorage } from 'usehooks-ts';
import './App.css';
import { Box } from './components/Box';
import { BoxCol } from './components/BoxCol';
import { Grid } from './components/Grid';
import { Header } from './components/Header';
import { Photo } from './components/Photo';
import { Video } from './components/Video';
import { getParentFolderPath } from './utils/getParentFolderPath';
import { usePathData } from './utils/usePathData';
import { getIconForType } from './utils/getIconForType';

const itemHeight = 50;

const Row = memo(
  ({
    index,
    style,
    data,
  }: {
    index: number;
    style: React.CSSProperties;
    data: DisplayItem[];
  }) => {
    const item = data[index];
    const icon = getIconForType(item.entryType);

    return (
      <div className="list-item" style={style}>
        <Link to={item.urlString} className="list-item-link">
          <EntityTitle
            title={<span className="list-item-title">{item.firstName}</span>}
            icon={icon}
            ellipsize
            subtitle={
              <Box gap={10} className="list-item-subtitle">
                {item.lastName !== '/' && (
                  <>
                    <code>{item.lastName}</code>
                    <Box gap={4} style={{ alignItems: 'center' }}>
                      <Icon icon="box" size={12} />
                      <span>{item.size}</span>
                    </Box>
                  </>
                )}
                <Box gap={4} style={{ alignItems: 'center' }}>
                  <Icon icon="time" size={12} />
                  <span>{item.modTime}</span>
                </Box>
              </Box>
            }
          />
        </Link>
        <Divider />
      </div>
    );
  },
);

function ListPage() {
  // const {path = ""} = useParams();
  const { pathname } = useLocation();
  const segments = pathname.split('/').filter(Boolean); // removes empty strings
  const parentFolderPath = getParentFolderPath(segments);

  // TODO: always try to scroll to the last active item
  // const [lastActiveItem, setLastActiveItem] = useLocalStorage<string>(
  //   'lastActiveItem',
  //   segments.at(-1) || '',
  // );

  // Read the current path and the parent folder
  const { data, isLoading, error } = usePathData(pathname);
  const { data: parentFolderData } = usePathData(parentFolderPath);
  const [activeView] = useLocalStorage<string>('activeView', 'list');

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

  const { viewCategory, coverImage, displayItems } = folderData;

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
              itemCount={displayItems.length}
              itemSize={itemHeight}
            >
              {Row}
            </List>
          ) : (
            <Grid
              width={width}
              height={height}
              itemData={displayItems}
              columnWidth={Math.floor(width / 3)}
              columnCount={3}
              rowHeight={200}
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
