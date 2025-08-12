import { IconName } from '@blueprintjs/icons';
import { EntryType } from '../types/proto/types';

export function getIconForType(type: EntryType): IconName {
  switch (type) {
    case EntryType.ENTRY_TYPE_FOLDER:
      return 'folder-close';
    case EntryType.ENTRY_TYPE_IMAGE:
      return 'media';
    case EntryType.ENTRY_TYPE_VIDEO:
      return 'video';
    case EntryType.ENTRY_TYPE_MUSIC:
      return 'music';
    case EntryType.ENTRY_TYPE_TEXT:
      return 'document';
    case EntryType.ENTRY_TYPE_DEFAULT:
    default: {
      return 'document';
    }
  }
}
