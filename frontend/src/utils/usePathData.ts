import { useQuery } from '@tanstack/react-query';
import { FolderContentData } from '../types/proto/types';
import { isIOS } from 'react-device-detect';

// TODO: the server port name should coming from an env variable.
const serverPort = 8100;
export const serverBaseUrl = `//${window.location.hostname}:${serverPort}`;

interface pathData {
  data?: {
    type: 'json' | 'video' | 'image';
    folder?: FolderContentData;
    url?: string;
  };
  isLoading: boolean;
  error?: Error;
}

export function usePathData(pathname: string): pathData {
  const { data, isLoading, error } = useQuery({
    queryKey: ['list', pathname],
    queryFn: async () => {
      const baseUrl = `${serverBaseUrl}${pathname}`;

      let headRes: Response;
      try {
        headRes = await fetch(baseUrl, { method: 'HEAD' });
      } catch (err) {
        throw new Error(`HEAD request failed: ${err}`);
      }

      if (!headRes.ok) {
        throw new Error(`HEAD request failed with status ${headRes.status}`);
      }

      const contentType = headRes.headers.get('Content-Type') || '';
      // console.log("Content-Type:", contentType);

      // Handle JSON
      if (contentType.includes('application/json')) {
        try {
          const jsonRes = await fetch(baseUrl);
          if (!jsonRes.ok) {
            throw new Error(`GET request failed with status ${jsonRes.status}`);
          }
          const result = await jsonRes.json();
          return { type: 'json' as const, folder: result };
        } catch (err) {
          throw new Error(`Failed to fetch or parse JSON: ${err}`);
        }
      }

      // for (const [key, value] of headRes.headers.entries()) {
      //   console.log(`${key}: ${value}`);
      // }

      if (contentType.startsWith('video/') || contentType.includes('mpegurl')) {
        return { type: 'video' as const, url: baseUrl };
      }
      if (contentType.startsWith('image/')) {
        return { type: 'image' as const, url: baseUrl };
      }

      // iOS specific handling
      if (isIOS) {
        if (contentType.startsWith('application/octet-stream')) {
          // Check if the file is an image based on the extension
          const extension = pathname.split('.').pop()?.toLowerCase();
          if (extension === 'heic' || extension === 'heif') {
            return { type: 'image' as const, url: baseUrl };
          }
        }
      }

      if (!!contentType) {
        throw new Error(`Unsupported content type: ${contentType} `);
      }
      throw new Error('No content found');
    },
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return { data, isLoading, error };
}
