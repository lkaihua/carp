import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { EntryType, FolderContentData } from '../types/proto/types';
import { isIOS } from 'react-device-detect';

// TODO: the server port name should coming from an env variable.
// Need to resolve this two-port issue sooner or later. Now there are two ports:
// Dev - 5173 for vite dev, 8100 for the backend server
// Production - 8000 for all
//   - https://192.168.1.1:8000/index.html
//   - https://192.168.1.1:8000/favicon.ico
//   - https://192.168.1.1:8000/main.js
//   - https://192.168.1.1:8000/~/example_folder/ - folder meta
//   - https://192.168.1.1:8000/~/example_folder/test.mp4 - file raw

const serverPort = 8100;
const serverProtocol = 'http://';
export const serverBaseUrl = `${serverProtocol}${window.location.hostname}:${serverPort}`;

export type FolderData = {
  type: EntryType.ENTRY_TYPE_FOLDER;
  data: FolderContentData;
};

export type PathData =
  | FolderData
  | {
      type: EntryType.ENTRY_TYPE_VIDEO;
      url: string;
    }
  | {
      type: EntryType.ENTRY_TYPE_IMAGE;
      url: string;
    };

export function usePathData(
  relativePath?: string | null,
  options?: Omit<UseQueryOptions<PathData, Error>, 'queryKey' | 'queryFn'>,
) {
  return useQuery<PathData, Error>({
    queryKey: ['list', relativePath],
    queryFn: async () => {

      // todo: we can get rid of the server base url I think with fullUrl passed back
      // only for the first folder request, we need to use the server base url actually

      const baseUrl = relativePath?.startsWith('http')
        ? relativePath
        : new URL(relativePath ?? '', serverBaseUrl).href;

      let headRes: Response;

      // Important: use HEAD before the real fetch
      try {
        headRes = await fetch(baseUrl, { method: 'HEAD' });
      } catch (err) {
        throw new Error(`HEAD request failed: ${err}`);
      }

      if (!headRes.ok) {
        throw new Error(`HEAD request failed with status ${headRes.status}`);
      }

      const contentType = headRes.headers.get('Content-Type') || '';

      if (contentType.includes('application/json')) {
        try {
          const jsonRes = await fetch(baseUrl);
          if (!jsonRes.ok) {
            throw new Error(`GET request failed with status ${jsonRes.status}`);
          }
          const result = await jsonRes.json();
          return {
            type: EntryType.ENTRY_TYPE_FOLDER,
            data: result,
          } as const;
        } catch (err) {
          throw new Error(`Failed to fetch or parse JSON: ${err}`);
        }
      }
      if (contentType.startsWith('video') || contentType.includes('mpegurl')) {
        return {
          type: EntryType.ENTRY_TYPE_VIDEO,
          url: baseUrl,
        } as const;
      }
      if (contentType.startsWith('image')) {
        return {
          type: EntryType.ENTRY_TYPE_IMAGE,
          url: baseUrl,
        } as const;
      }
      if (isIOS) {
        if (contentType.startsWith('application/octet-stream')) {
          // Check if the file is an image based on the extension
          const extension = relativePath?.split('.').pop()?.toLowerCase();
          if (extension === 'heic' || extension === 'heif') {
            return {
              type: EntryType.ENTRY_TYPE_IMAGE,
              url: baseUrl,
            } as const;
          }
        }
      }

      if (contentType) {
        throw new Error(`Unsupported content type: ${contentType} `);
      }
      throw new Error('No content found');
    },
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!relativePath,
    ...options,
  });
}
