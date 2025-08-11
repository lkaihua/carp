import { memo } from 'react';
import { FixedSizeGrid } from 'react-window';
import { DisplayItem, EntryType } from '../types/proto/types';
import { Card } from '@blueprintjs/core';
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
    const filePath = serverBaseUrl + pathname + item.urlString + coverImage;
    console.log('Cover file path:', filePath);
    // TODO: use better way to determine if it's a video or image
    if (
      coverImage.toLowerCase().endsWith('.mp4') ||
      coverImage.toLowerCase().endsWith('.mov')
    ) {
      cover = (
        <video
          src={filePath}
          controls
          autoPlay={false}
          muted
          height={200}
          width="100%"
          style={{ maxHeight: '100%' }}
        />
      );
    } else {
      cover = <img src={filePath} alt="Cover" height={200} />;
    }
  }

  // TODO: preview 4 item for each folder
  // TODO: click the folder to open it, now the preview takes to much space
  return (
    <div style={style} className="cell-container">
      {cover ? (
        cover
      ) : (
        <Link to={item.urlString} className="grid-item-link">
          <span>
            {icon} {item.name}
          </span>
        </Link>
      )}
    </div>
  );
});

interface GridProps {
  width: number;
  height: number;
  itemData: DisplayItem[];
  columnCount?: number;
  // rowCount?: number;
  columnWidth?: number;
  rowHeight?: number;
}

export const Grid = ({
  width = 300,
  height = 900,
  columnCount = 3,
  columnWidth = 100,
  rowHeight = 30,
  itemData,
}: GridProps) => {
  const totalItems = itemData.length;
  return (
    <FixedSizeGrid
      className="grid-table"
      width={width}
      height={height}
      columnCount={columnCount}
      rowCount={Math.ceil(totalItems / columnCount)}
      columnWidth={columnWidth}
      rowHeight={rowHeight}
      itemData={{ itemData, columnCount }} // Todo: use memo for better performance
    >
      {Cell}
    </FixedSizeGrid>
  );
};
