import {
  Document,
  FolderClose,
  Media,
  Music,
  Video as VideoIocn,
} from '@blueprintjs/icons';
import { EntryType } from '../types/proto/types';

export function getIconForType(type: EntryType): JSX.Element {
  switch (type) {
    case EntryType.ENTRY_TYPE_FOLDER:
      return <FolderClose />;
    case EntryType.ENTRY_TYPE_IMAGE:
      return <Media />;
    case EntryType.ENTRY_TYPE_VIDEO:
      return <VideoIocn />;
    case EntryType.ENTRY_TYPE_MUSIC:
      return <Music />;
    case EntryType.ENTRY_TYPE_TEXT:
      return <Document />;
    case EntryType.ENTRY_TYPE_DEFAULT:
    default: {
      return <Document />;
    }
  }
}
