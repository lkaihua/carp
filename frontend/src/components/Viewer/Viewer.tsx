import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import { Photo } from './Photo';
import { Video } from './Video';
import { FolderData, PathData, usePathData } from '../../utils/usePathData';
import { EntryType } from '../../types/proto/types';
import { Button, NonIdealState } from '@blueprintjs/core';
import { LoadingBoundary } from '../LoadingBoundary/LoadingBoundary';
import { match } from 'ts-pattern';
import { data } from 'react-router-dom';
import { Drawer } from '../Drawer/Drawer';
import { Media as MediaIcon, Video as VideoIcon } from '@blueprintjs/icons';
import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { css } from '@emotion/css';

interface ViewerProps {
  fileName: string | null;
  filePath: string | null;
  parentFolderPath?: string;
  parentFolderData?: FolderData;
}

interface MediaItem {
  src: string;
  entryType?: EntryType;
  filename?: string;
}

export const Viewer: React.FC<ViewerProps> = memo(
  ({ fileName, filePath, parentFolderPath, parentFolderData }) => {
    // fetch file meta

    // todo: we can either use the parent folder data to know the file type
    // or fetch the file meta directly
    // there is no need to fetch both
    // it's possible that we only have the file path passed in
    // and we only preview it without loading the parent folder data
    // as the playlist / carousel.
    const { data, isLoading, error } = usePathData(filePath);

    // console.log('Viewer data', { file, data, isLoading, error });
    console.log('fileName', fileName);
    console.log('data', data);
    console.log('parentFolderData', parentFolderData);

    const Content = ({ item }: { item: MediaItem }) =>
      match(item)
        .with({ entryType: EntryType.ENTRY_TYPE_VIDEO }, (video) => (
          <Video src={video.src} />
        ))
        .with({ entryType: EntryType.ENTRY_TYPE_IMAGE }, (image) => (
          <Photo src={image.src} />
        ))
        .otherwise(() => null);

    const icon = match(data)
      .with({ type: EntryType.ENTRY_TYPE_VIDEO }, () => <VideoIcon />)
      .with({ type: EntryType.ENTRY_TYPE_IMAGE }, () => <MediaIcon />)
      .otherwise(() => null);

    // from the parent folder data, find the current active index,
    // create prev/next buttons to navigate the url
    // and make sure the folder list does not get re-rendered

    // const myImages: MediaItem[] = useMemo(() => {
    //   return (
    //     parentFolderData?.folder.displayItems?.data.reduce<MediaItem[]>(
    //       (acc, item) => {
    //         if (
    //           item.entryType === EntryType.ENTRY_TYPE_IMAGE ||
    //           item.entryType === EntryType.ENTRY_TYPE_VIDEO
    //         ) {
    //           acc.push({
    //             src: item.fullUrl,
    //             filename: item.firstName,
    //             entryType: item.entryType,
    //           });
    //         }
    //         return acc;
    //       },
    //       [],
    //     ) ?? []
    //   );
    // }, [parentFolderData]);

    if (!fileName) {
      return null;
    }

    return (
      <Drawer src={fileName} onCloseNavigateTo={parentFolderPath} icon={icon}>
        <LoadingBoundary isLoading={isLoading} error={error}>
          {data?.url && (
            <Content
              item={{
                src: data.url,
                entryType: data?.type,
                filename: fileName,
              }}
            />
          )}
        </LoadingBoundary>
      </Drawer>
    );
  },
);

const styles = {
  swiper: css`
    width: 100%;
    max-height: 500px;
  `,
  swiperSlide: css`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  `,
};
