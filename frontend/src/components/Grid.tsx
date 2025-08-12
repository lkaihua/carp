import { forwardRef, memo, useRef } from 'react';
import { FixedSizeGrid, GridOnScrollProps } from 'react-window';
import { DisplayItem, EntryType } from '../types/proto/types';
import {
  Card,
  EntityTitle,
  NonIdealState,
  NonIdealStateIconSize,
} from '@blueprintjs/core';
import { Link, useLocation } from 'react-router-dom';
import { serverBaseUrl, usePathData } from '../utils/usePathData';

import './Grid.css';
import { getIconForType } from '../utils/getIconForType';

interface CellProps {
  columnIndex: number;
  rowIndex: number;
  style: React.CSSProperties;
  data: {
    itemData: DisplayItem[];
    columnCount: number;
  };
}

const Cell = memo(({ columnIndex, rowIndex, style, data }: CellProps) => {
  const { itemData, columnCount } = data;

  // Calculate the 1D index from row/column
  const index = rowIndex * columnCount + columnIndex;
  const item = itemData?.[index];

  if (!item) {
    return null;
  }

  const icon = getIconForType(item.entryType);

  let cover;
  const { pathname } = useLocation();
  const { data: newData } = usePathData(pathname + item.urlString);

  if (!!newData?.folder?.coverImage?.[0]) {
    const coverImage = newData.folder.coverImage[0];
    const filePath = pathname + item.urlString + coverImage;
    // console.log('Cover file path:', filePath);

    // TODO: use better way to determine if it's a video or image
    if (
      coverImage.toLowerCase().endsWith('.mp4') ||
      coverImage.toLowerCase().endsWith('.mov')
    ) {
      cover = (
        <Link to={filePath}>
          <video
            src={serverBaseUrl + filePath}
            controls={false}
            autoPlay={true}
            loop
            playsInline
            muted
            height={200}
            width="100%"
            style={{ maxHeight: '100%' }}
          />
        </Link>
      );
    } else {
      cover = (
        <Link to={filePath}>
          <img src={serverBaseUrl + filePath} alt="Cover" height={200} />
        </Link>
      );
    }
  }

  // TODO: preview 4 item for each folder
  // TODO: click the folder to open it, now the preview takes to much space
  return (
    <div style={style} className="cell-container">
      {cover ? (
        <div className="cover-container">{cover}</div>
      ) : (
        <NonIdealState
          className="grid-item-title"
          iconSize={NonIdealStateIconSize.STANDARD}
          icon={icon}
          title={
            <Link to={item.urlString} className="grid-item-link">
              <EntityTitle
                className="grid-item-entity-title"
                title={item.name}
                ellipsize
              />
            </Link>
          }
        />
      )}
    </div>
  );
});

interface GridProps {
  width: number;
  height: number;
  itemData: DisplayItem[];
  columnCount?: number;
  columnWidth?: number;
  rowHeight?: number;
  // onScroll?: ((props: GridOnScrollProps) => any) | undefined;
  setActiveRow: (rowIndex: number) => void;
}

export const Grid = forwardRef<FixedSizeGrid, GridProps>(
  (
    {
      width = 300,
      height = 900,
      columnCount = 3,
      columnWidth = 100,
      rowHeight = 30,
      itemData,
      setActiveRow,
    }: GridProps,
    ref,
  ) => {
    const totalItems = itemData.length;
    const hasMountedRef = useRef(false);
    return (
      <FixedSizeGrid
        ref={ref}
        className="grid-container"
        width={width}
        height={height}
        columnCount={columnCount}
        rowCount={Math.ceil(totalItems / columnCount)}
        columnWidth={columnWidth}
        rowHeight={rowHeight}
        itemData={{ itemData, columnCount }} // Todo: use memo for better performance
        onScroll={({ scrollTop }) => {
          // First mounts
          if (!hasMountedRef.current) {
            hasMountedRef.current = true;
            return;
          }
          // Fix strange corner case when onScroll is triggered prematurely and overrides the value
          if (scrollTop <= 10) {
            return;
          }
          setActiveRow(scrollTop);
        }}
      >
        {Cell}
      </FixedSizeGrid>
    );
  },
);
