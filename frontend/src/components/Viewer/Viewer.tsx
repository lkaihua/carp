import React, { memo } from 'react';
import { Photo } from './Photo';
import { Video } from './Video';
import { PathData, usePathData } from '../../utils/usePathData';
import { EntryType } from '../../types/proto/types';
import { NonIdealState } from '@blueprintjs/core';
import { LoadingBoundary } from '../LoadingBoundary/LoadingBoundary';
import { match } from 'ts-pattern';
import { data } from 'react-router-dom';
import { Drawer } from '../Drawer/Drawer';
import { Media as MediaIcon, Video as VideoIcon } from '@blueprintjs/icons';

interface ViewerProps {
  file?: string;
  parentFolderPath: string;
}

export const Viewer: React.FC<ViewerProps> = memo(
  ({ file, parentFolderPath }) => {
    // fetch file meta
    const { data, isLoading, error } = usePathData(file);

    if (!file) {
      return null;
    }

    // console.log('Viewer data', { file, data, isLoading, error });

    const content = match(data)
      .with({ type: EntryType.ENTRY_TYPE_VIDEO }, (video) => (
        <Video src={video.url} />
      ))
      .with({ type: EntryType.ENTRY_TYPE_IMAGE }, (image) => (
        <Photo src={image.url} />
      ))
      .otherwise(() => null);

    const icon = match(data)
      .with({ type: EntryType.ENTRY_TYPE_VIDEO }, () => <VideoIcon />)
      .with({ type: EntryType.ENTRY_TYPE_IMAGE }, (image) => <MediaIcon />)
      .otherwise(() => null);

    return (
      <Drawer src={file} onCloseNavigateTo={parentFolderPath} icon={icon}>
        <LoadingBoundary isLoading={isLoading} error={error}>
          {content}
        </LoadingBoundary>
      </Drawer>
    );
  },
);
