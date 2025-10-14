import {
  forwardRef,
  memo,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
} from 'react';
import { FixedSizeGrid, GridOnScrollProps } from 'react-window';
import { DisplayItem, EntryType } from '../../types/proto/types';
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
import { serverBaseUrl, usePathData } from '../../utils/usePathData';
import { match } from 'ts-pattern';
import ReactPlayer from 'react-player';

// Styles moved from Grid.css below
import { getIconForType } from '../../utils/getIconForType';
import { BoxCol } from '../BoxCol/BoxCol';
import { useDebouncedScrollOffset } from '../../utils/useDebouncedScrollOffset';
import { getPathMeta, joinPath } from '../../utils/path';
import { css } from '@emotion/css';

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
          video.currentTime = 0.5;
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
        <Link to={previewFilePath} className={styles.gridCoverVideoLink}>
          {/* <video
            ref={videoRef}
            src={serverBaseUrl + previewFilePath}
            controls={false}
            autoPlay={false}
            loop={false}
            playsInline
            muted
            height={160}
            width="100%"
            style={{ maxHeight: '100%' }}
            // onLoadedMetadata={handleVideoReady}
          /> */}
          {/* <ReactPlayer
            // todo: get this src correct
            src={joinPath(serverBaseUrl, previewFilePath)}
            controls={true}
            style={{ height: '100%' }}
            muted={false}
            autoPlay={false}
          /> */}
          <EntityTitle
            ellipsize
            title={getPathMeta(previewFilePath).fileName || ''}
            icon="video"
            className={styles.gridCoverTitle}
          />
        </Link>
      );
    } else {
      cover = (
        <Link to={previewFilePath} className={styles.coverImageContainer}>
          <Icon icon="eye-open" size={16} className={styles.coverImageIcon} />
          <img
            src={joinPath(serverBaseUrl, previewFilePath)}
            alt="Cover"
            className={styles.coverImage}
          />
        </Link>
      );
    }

    return (
      <>
        <BoxCol className={styles.gridCoverMediaContainer}>{cover}</BoxCol>
        <BoxCol className={styles.gridCoverTitleContainer}>
          <Link to={linkFilePath}>
            <EntityTitle
              ellipsize
              title={linkTitle}
              icon={linkIcon ?? 'folder-close'}
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
  const relativeUrl = item?.relativeUrl;
  const fullUrl = item?.fullUrl;

  // console.log(relativeUrl, fullUrl, item?.urlString);

  // Request the metadata only if the target is FOLDER
  const {
    data: newItemData,
    isLoading,
    error,
  } = usePathData(isFolder ? relativeUrl : null);

  const previewFilePath = match(item)
    .with({ entryType: EntryType.ENTRY_TYPE_FOLDER }, (folder) =>
      newItemData?.type == EntryType.ENTRY_TYPE_FOLDER &&
      (newItemData?.folder?.coverImages?.data ?? []).length > 0
        ? joinPath(relativeUrl, newItemData?.folder?.coverImages?.data.at(0))
        : '',
    )
    .with({ entryType: EntryType.ENTRY_TYPE_IMAGE }, () => relativeUrl)
    .with({ entryType: EntryType.ENTRY_TYPE_VIDEO }, () => relativeUrl)
    .otherwise(() => '');

  const icon = getIconForType(item?.entryType);
  const cover = useMemo(
    () =>
      previewFilePath && (
        <CellPreview
          previewFilePath={previewFilePath}
          linkFilePath={relativeUrl}
          linkTitle={item?.firstName}
          linkIcon={icon}
        />
      ),
    [previewFilePath, relativeUrl, item, icon],
  );

  if (!item) {
    return null;
  }

  const content = (
    <EntityTitle
      className={styles.gridItemEntityTitle}
      title={item.firstName}
      subtitle={isFolder ? '' : item.lastName}
      ellipsize
    />
  );

  const fallback = (
    <NonIdealState
      className={styles.gridItemTitle}
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
    <div style={style} className={styles.cellContainer}>
      {isLoading ? (
        <Spinner />
      ) : cover ? (
        <div className={styles.coverContainer}>{cover}</div>
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
  onItemsRendered?: () => void;
  setActiveVerticalPos?: (rowIndex: number) => void;
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

    const { handleScroll } = useDebouncedScrollOffset((offset) => {
      // console.log('Grid scroll finished at:', offset);
      setActiveVerticalPos?.(offset);
    });

    return (
      <FixedSizeGrid
        ref={ref}
        className={styles.gridContainer}
        width={width}
        height={height}
        columnCount={columnCount}
        rowCount={Math.ceil(totalItems / columnCount)}
        columnWidth={columnWidth}
        rowHeight={rowHeight}
        itemData={{ itemData, columnCount }} // Todo: use memo for better performance
        onItemsRendered={() => onItemsRendered?.()}
        onScroll={({ scrollTop }) => handleScroll(scrollTop)}
      >
        {Cell}
      </FixedSizeGrid>
    );
  },
);

const styles = {
  gridContainer: css`
    width: 100%;
    table-layout: fixed;
  `,
  gridCoverTitle: css`
    justify-content: center;
  `,
  gridItemEntityTitle: css`
    font-size: 14px;
    font-weight: normal;
  `,
  cellContainer: css`
    border-right: 1px solid var(--bp3-border-color, #d8dde6);
    border-bottom: 1px solid var(--bp3-border-color, #d8dde6);
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  `,
  coverContainer: css`
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
    justify-content: space-around;
  `,
  gridItemTitle: css`
    padding: 5px;
    pointer-events: none;
    .bp6-non-ideal-state-text {
      max-width: 100%;
    }
    .grid-item-entity-title {
      font-size: 14px;
      font-weight: normal;
    }
    .grid-item-link {
      pointer-events: auto;
      .bp6-entity-title-title-and-tags {
        justify-content: center;
      }
    }
  `,
  gridCoverMediaContainer: css`
    align-items: center;
    img,
    video {
      border-radius: 4px;
      overflow: hidden;
    }
  `,
  gridCoverTitleContainer: css`
    padding-inline: 5px;
    .grid-cover-title {
      justify-content: center;
    }
  `,
  gridCoverVideoLink: css`
    display: flex;
  `,
  coverImageContainer: css`
    display: flex;
    position: relative;
    background-color: aliceblue;
  `,
  coverImageIcon: css`
    position: absolute;
    top: 0;
    right: 0;
    z-index: 10;
    background: rgba(255, 255, 255, 0.5);
    padding: 5px;
    border-radius: 0 3px 0 3px;
  `,
  coverImage: css`
    /* height: 160px; */
    max-height: 100%;
    max-width: 100%;
    object-fit: contain;
  `,
};
