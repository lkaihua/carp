import { forwardRef, memo, useEffect, useLayoutEffect, useRef } from 'react';
import { FixedSizeGrid, GridOnScrollProps } from 'react-window';
import { DisplayItem, EntryType } from '../types/proto/types';
import {
  Card,
  EntityTitle,
  Icon,
  IconName,
  NonIdealState,
  NonIdealStateIconSize,
  Spinner,
} from '@blueprintjs/core';
import { Link, useLocation } from 'react-router-dom';
import { serverBaseUrl, usePathData } from '../utils/usePathData';
import { match } from 'ts-pattern';

import './Grid.css';
import { getIconForType } from '../utils/getIconForType';
import { BoxCol } from './BoxCol';

interface CellProps {
  columnIndex: number;
  rowIndex: number;
  style: React.CSSProperties;
  data: {
    itemData: DisplayItem[];
    columnCount: number;
  };
}

const VIDEO_PREVIEW_SECONDS = 5;

interface CellPreviewProps {
  previewFilePath: string;
  linkFilePath: string;
  linkTitle: string;
  linkIcon?: IconName;
}
const CellPreview = memo(
  ({
    previewFilePath,
    linkFilePath,
    linkTitle,
    linkIcon,
  }: CellPreviewProps) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const handleVideoReady = () => {
      const video = videoRef.current;
      if (!video) return;

      const handleTimeUpdate = () => {
        if (video.currentTime >= VIDEO_PREVIEW_SECONDS) {
          video.currentTime = 0;
          video.play();
        }
      };

      video.addEventListener('timeupdate', handleTimeUpdate);
    };

    // TODO: use better way to determine if it's a video or image
    let cover;
    if (
      previewFilePath.toLowerCase().endsWith('.mp4') ||
      previewFilePath.toLowerCase().endsWith('.mov')
    ) {
      cover = (
        <Link to={previewFilePath} className="grid-cover-video-link">
          <video
            ref={videoRef}
            src={serverBaseUrl + previewFilePath}
            controls={false}
            autoPlay
            loop={false}
            playsInline
            muted
            height={160}
            width="100%"
            style={{ maxHeight: '100%' }}
            onLoadedMetadata={handleVideoReady}
          />
        </Link>
      );
    } else {
      cover = (
        <Link to={previewFilePath} className="grid-cover-image-link">
          <img src={serverBaseUrl + previewFilePath} alt="Cover" height={160} />
        </Link>
      );
    }

    return (
      <>
        <BoxCol className="grid-cover-media-container">{cover}</BoxCol>
        <BoxCol className="grid-cover-title-container">
          <Link to={linkFilePath}>
            <EntityTitle
              ellipsize
              title={linkTitle}
              icon={linkIcon ?? 'folder-close'}
              className="grid-cover-title"
            />
          </Link>
        </BoxCol>
      </>
    );
  },
);

const Cell = memo(({ columnIndex, rowIndex, style, data }: CellProps) => {
  const { itemData, columnCount } = data;

  // Calculate the 1D index from row/column
  const index = rowIndex * columnCount + columnIndex;
  const item = itemData?.at(index);
  const isFolder = item?.entryType === EntryType.ENTRY_TYPE_FOLDER;

  const filePath = item?.fullUrl;

  // Request the metadata only if the target is FOLDER
  const {
    data: newItemData,
    isLoading,
    error,
  } = usePathData(isFolder ? filePath : undefined);

  // console.log('item', item);
  if (!item) {
    return null;
  }
  const previewFilePath = match(item.entryType)
    .with(EntryType.ENTRY_TYPE_FOLDER, () =>
      newItemData?.type == EntryType.ENTRY_TYPE_FOLDER &&
      newItemData?.folder?.coverImage?.length > 0
        ? filePath + newItemData.folder.coverImage.at(0)
        : '',
    )
    .with(EntryType.ENTRY_TYPE_IMAGE, () => filePath)
    .with(EntryType.ENTRY_TYPE_VIDEO, () => filePath)
    .otherwise(() => '');

  const icon = getIconForType(item.entryType);
  const cover = previewFilePath ? (
    <CellPreview
      previewFilePath={previewFilePath}
      linkFilePath={filePath}
      linkTitle={item.firstName}
      linkIcon={icon}
    />
  ) : null;

  const content = (
    <EntityTitle
      className="grid-item-entity-title"
      title={item.firstName}
      subtitle={isFolder ? '' : item.lastName}
      ellipsize
    />
  );

  const fallback = (
    <NonIdealState
      className="grid-item-title"
      iconSize={NonIdealStateIconSize.STANDARD}
      icon={icon}
      title={
        item.urlString ? (
          <Link to={item.urlString} className="grid-item-link">
            {content}
          </Link>
        ) : (
          content
        )
      }
    />
  );

  // TODO: click the folder to open it, now the preview takes to much space
  return (
    <div style={style} className="cell-container">
      {isLoading ? (
        <Spinner />
      ) : cover ? (
        <div className="cover-container">{cover}</div>
      ) : (
        fallback
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
  onItemsRendered: () => void;
  setActiveVerticalPos: (rowIndex: number) => void;
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
      onItemsRendered,
      setActiveVerticalPos,
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
        onItemsRendered={() => onItemsRendered()}
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
          setActiveVerticalPos(scrollTop);
        }}
      >
        {Cell}
      </FixedSizeGrid>
    );
  },
);
