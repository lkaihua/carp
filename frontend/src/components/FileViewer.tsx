import React from 'react';
import { Photo } from './Photo';
import { Video } from './Video';
import { PathData } from '../utils/usePathData';
import { EntryType } from '../types/proto/types';

interface FileViewerProps {
  data: PathData;
  parentFolderPath: string;
}

export const FileViewer: React.FC<FileViewerProps> = ({
  data,
  parentFolderPath,
}) => {
  switch (data.type) {
    case EntryType.ENTRY_TYPE_VIDEO:
      return <Video src={data.url} parentFolderPath={parentFolderPath} />;
    case EntryType.ENTRY_TYPE_IMAGE:
      return <Photo src={data.url} parentFolderPath={parentFolderPath} />;
    default:
      return null;
  }
};
