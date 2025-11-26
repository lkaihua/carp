import React, { memo } from 'react';
import { Photo } from './Photo';
import { Video } from './Video';
import { usePathData } from '../../utils/usePathData';
import { EntryType, FolderContentData } from '../../types/proto/types';

import { LoadingBoundary } from '../LoadingBoundary/LoadingBoundary';
import { match } from 'ts-pattern';

import { Drawer } from '../Drawer/Drawer';
import { Media as MediaIcon, Video as VideoIcon } from '@blueprintjs/icons';


interface ViewerProps {
  filePath: string | null;
  fileName: string | null;
  parentFolderPath?: string;
  parentFolderData?: FolderContentData;
}

interface MediaItem {
  src: string;
  entryType?: EntryType;
  filename?: string;
}

const Content = ({ item }: { item: MediaItem }) =>
  match(item)
    .with({ entryType: EntryType.ENTRY_TYPE_VIDEO }, (video) => (
      <Video src={video.src} autoPlay={true}/>
    ))
    .with({ entryType: EntryType.ENTRY_TYPE_IMAGE }, (image) => (
      <Photo src={image.src} />
    ))
    .otherwise(() => null);

export const Viewer: React.FC<ViewerProps> = memo(function ViewComponent({
  fileName,
  filePath,
  parentFolderPath,
  parentFolderData,
}) {
  // fetch file meta

  // todo: we can either use the parent folder data to know the file type
  // or fetch the file meta directly
  // there is no need to fetch both
  //
  // it's possible that we only have the file path passed in
  // and we only preview it without loading the parent folder data
  // as the playlist / carousel.

  // in order to have prev/next navigation, we need the parent folder data anyway

  const { data, isLoading, error } = usePathData(filePath);

  console.log('fileName', fileName);
  console.log('filePath', filePath);
  console.log('data', data);
  console.log('parentFolderData', parentFolderData);

  // todo: based on fileName and parentFolderData
  // we can find the index of the current file
  // and the create prev/next navigation to the prev and next file

  const icon = match(data)
    .with({ type: EntryType.ENTRY_TYPE_VIDEO }, () => <VideoIcon />)
    .with({ type: EntryType.ENTRY_TYPE_IMAGE }, () => <MediaIcon />)
    .otherwise(() => null);

  // from the parent folder data, find the current active index,
  // create prev/next buttons to navigate the url
  // the single source of truth is the URL path.

  if (!fileName || data?.type == EntryType.ENTRY_TYPE_FOLDER) {
    return null;
  }

  return (
    <Drawer
      src={fileName}
      filePath={data?.url}
      onCloseNavigateTo={parentFolderPath}
      icon={icon}
    >
      {!!fileName && (
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
      )}
    </Drawer>
  );
});


