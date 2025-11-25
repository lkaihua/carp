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
  Text,
  IconName,
  NonIdealState,
  NonIdealStateIconSize,
  Spinner,
  Tag,
} from '@blueprintjs/core';
import { Link, useLocation } from 'react-router-dom';
import { serverBaseUrl, usePathData } from '../../utils/usePathData';
import { match } from 'ts-pattern';
import ReactPlayer from 'react-player';

// Styles moved from Grid.css below
import { getIconForType } from '../../utils/getIconForType';
import { FlexCol } from '../FlexBoxCol/FlexBoxCol';
import { useDebouncedScrollOffset } from '../../utils/useDebouncedScrollOffset';
import { getPathMeta, joinPath } from '../../utils/path';
import { css } from '@emotion/css';
import { Video } from '../Viewer/Video';
import { FlexBox } from '../FlexBox/FlexBox';

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

const PREVIEW_FILE_LIMIT = 10 * 1024 * 1024;

export interface PreviewFile {
  type: 'video' | 'image';
  url?: string;
}
interface CellPreviewProps {
  previewFile: PreviewFile;
  link: string;
  title: string;
  icon: IconName;
}
const CellPreview = memo(function CellPreviewComponent({
  previewFile,
  link,
  title,
  icon,
}: CellPreviewProps) {
  // const videoRef = useRef<HTMLVideoElement | null>(null);
  // const handleVideoReady = () => {
  //   const video = videoRef.current;
  //   if (!video) return;

  //   const handleTimeUpdate = () => {
  //     if (video.currentTime >= VIDEO_PREVIEW_SECONDS) {
  //       video.currentTime = 0.5;
  //       video.play();
  //     }
  //   };

  //   video.addEventListener('timeupdate', handleTimeUpdate);
  // };

  let cover;
  if (previewFile.url) {
    if (previewFile.type === 'video') {
      cover = (
        // <Link to={link} className={styles.gridCoverVideoLink}>
        //   <Video src={previewFile.url} isAutoPlayOn />
        // </Link>
        <Link to={link} className={styles.coverImageContainer}>
          <FlexBox>
            <Tag className={styles.coverImageIcon} icon={icon}>
              <Text>{title}</Text>
            </Tag>
            <Video src={previewFile.url} controls={false} />
          </FlexBox>
        </Link>
      );
    } else if (previewFile.type === 'image') {
      cover = (
        <Link to={link} className={styles.coverImageContainer}>
          <FlexBox>
            <Tag className={styles.coverImageIcon} icon={icon}>
              <Text>{title}</Text>
            </Tag>
            <img
              src={previewFile.url}
              alt="Cover"
              className={styles.coverImage}
            />
          </FlexBox>
        </Link>
      );
    }
  }

  return (
    <>
      {/* <FlexCol className={styles.gridCoverTitleContainer}>
        <Link to={link}>
          <Icon icon={icon} size={16} />
          {title}
        </Link>
      </FlexCol> */}
      <FlexCol className={styles.gridCoverMediaContainer}>{cover}</FlexCol>
    </>
  );
});

const Cell = memo(function CellComponent({
  columnIndex,
  rowIndex,
  style,
  data,
}: CellProps) {
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

  const previewFile: PreviewFile | undefined = match(item)
    .with({ entryType: EntryType.ENTRY_TYPE_FOLDER }, () => {
      if (newItemData?.type == EntryType.ENTRY_TYPE_FOLDER) {
        // find the first playable video
        const maybeVideo = newItemData?.data?.coverVideos?.data.find(
          (video) => video.sizeInt <= PREVIEW_FILE_LIMIT,
        );
        if (maybeVideo) {
          return {
            type: 'video' as const,
            url: maybeVideo.url,
          };
        }

        const maybeImage = newItemData?.data?.coverImages?.data.at(0);
        if (maybeImage) {
          return {
            type: 'image' as const,
            url: maybeImage,
          };
        }

        // Todo: add support for the case that not all video / image files are able to display in <video><img> tag
        return undefined;
      }
      return undefined;
    })
    .with({ entryType: EntryType.ENTRY_TYPE_IMAGE }, () => ({
      type: 'image' as const,
      url: fullUrl,
    }))
    .with({ entryType: EntryType.ENTRY_TYPE_VIDEO }, () =>
      (item?.sizeInt ?? 0) <= PREVIEW_FILE_LIMIT
        ? {
            type: 'video' as const,
            url: fullUrl,
          }
        : undefined,
    )
    .otherwise(() => undefined);

  const icon = getIconForType(item?.entryType);
  const cover = useMemo(
    () =>
      previewFile && relativeUrl ? (
        <CellPreview
          previewFile={previewFile}
          link={relativeUrl}
          title={item.name}
          icon={icon}
        />
      ) : null,
    [previewFile, relativeUrl, item, icon],
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

export const Grid = forwardRef<FixedSizeGrid, GridProps>(function GridComponent(
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
) {
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
});

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
    /* justify-content: space-around; */
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
    /* img,
    video {
      border-radius: 4px;
      overflow: hidden;
    } */
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
    color: #444;
    padding: 5px;
    border-radius: 0;
  `,
  coverImage: css`
    /* height: 160px; */
    max-height: 100%;
    max-width: 100%;
    object-fit: contain;
  `,
};
