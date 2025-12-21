import { forwardRef, memo, useMemo, useState } from 'react';
import { FixedSizeGrid } from 'react-window';
import { DisplayItem, EntryType } from '../../types/proto/types';
import {
  EntityTitle,
  Text,
  IconName,
  NonIdealState,
  NonIdealStateIconSize,
  Spinner,
  Tag,
  Button,
  ButtonGroup,
  Icon,
  Colors,
} from '@blueprintjs/core';
import { Link } from 'react-router-dom';
import { usePathData } from '../../utils/usePathData';
import { match } from 'ts-pattern';

// Styles moved from Grid.css below
import { getIconForType } from '../../utils/getIconForType';
import { FlexCol } from '../FlexBoxCol/FlexBoxCol';
import { useDebouncedScrollOffset } from '../../utils/useDebouncedScrollOffset';

import { css } from '@emotion/css';
import { FlexBox } from '../FlexBox/FlexBox';
import { useCellMediaRatio } from '../../utils/useCellMediaRatio';
import { LazyVideo } from './LazyVideo';

interface CellProps {
  columnIndex: number;
  rowIndex: number;
  style: React.CSSProperties;
  data: {
    itemData: DisplayItem[];
    columnCount: number;
    isSquare: boolean;
  };
}

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
  isSquare: boolean;
}
const CellPreview = memo(function CellPreviewComponent({
  previewFile,
  link,
  title,
  icon,
  isSquare,
}: CellPreviewProps) {
  let cover;
  if (previewFile.url) {
    if (previewFile.type === 'video') {
      cover = (
        <Link to={link} className={styles.coverImageContainer}>
          <FlexBox className={styles.coverBody}>
            <Tag className={styles.coverImageIcon} icon={icon}>
              <Text>{title}</Text>
            </Tag>
            <LazyVideo
              src={previewFile.url}
              controls={false}
              isSquare={isSquare}
            />
          </FlexBox>
        </Link>
      );
    } else if (previewFile.type === 'image') {
      cover = (
        <Link to={link} className={styles.coverImageContainer}>
          <FlexBox className={styles.coverBody}>
            <Tag className={styles.coverImageIcon} icon={icon}>
              <Text>{title}</Text>
            </Tag>
            <img
              src={previewFile.url}
              alt="Cover"
              className={styles.coverImage(isSquare)}
            />
          </FlexBox>
        </Link>
      );
    }
  }

  return <FlexCol className={styles.gridCoverMediaContainer}>{cover}</FlexCol>;
});

const Cell = memo(function CellComponent({
  columnIndex,
  rowIndex,
  style,
  data,
}: CellProps) {
  const { itemData, columnCount, isSquare } = data;

  // Calculate the 1D index from row/column
  const index = rowIndex * columnCount + columnIndex;
  const item = itemData?.at(index);
  const isFolder = item?.entryType === EntryType.ENTRY_TYPE_FOLDER;
  const relativeUrl = item?.relativeUrl;
  const fullUrl = item?.fullUrl;

  // Request the metadata only if the target is FOLDER
  const { data: newItemData, isLoading } = usePathData(
    isFolder ? relativeUrl : null,
  );

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
          isSquare={isSquare}
        />
      ) : null,
    [previewFile, relativeUrl, item, icon, isSquare],
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
      icon={<Icon icon={icon} size={32} color={Colors.BLACK} />}
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
  isSquare?: boolean;
  onItemsRendered?: () => void;
  onScrollFinish?: (rowIndex: number) => void;
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
    onScrollFinish,
  }: GridProps,
  ref,
) {
  const totalItems = itemData.length;

  const { handleScroll } = useDebouncedScrollOffset((offset) => {
    // console.log('Grid scroll finished at:', offset);
    onScrollFinish?.(offset);
  });

  const [ratio] = useCellMediaRatio();
  const isSquare = ratio === 'square';

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
      itemData={{ itemData, columnCount, isSquare }} // Todo: use memo for better performance
      onItemsRendered={() => onItemsRendered?.()}
      onScroll={({ scrollTop }) => handleScroll(scrollTop)}
    >
      {Cell}
    </FixedSizeGrid>
  );
});

const styles = {
  container: css`
    height: 100%;
    width: 100%;
  `,
  toolbar: css`
    height: 40px;
    padding: 5px;
    justify-content: flex-end;
    border-bottom: 1px solid var(--bp3-border-color, #d8dde6);
  `,
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
    width: 100%;
    overflow: hidden;
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
    width: 100%;
    height: 100%;
    align-items: center;
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
    width: 100%;
    height: 100%;
  `,
  coverBody: css`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
    overflow: hidden;
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
  coverImage: (isSquare: boolean) => css`
    max-height: 100%;
    max-width: 100%;
    object-fit: ${isSquare ? 'cover' : 'contain'};
    width: ${isSquare ? '100%' : 'auto'};
    height: ${isSquare ? '100%' : 'auto'};
  `,
};
