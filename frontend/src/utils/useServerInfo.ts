import { useQuery } from '@tanstack/react-query';
import { serverBaseUrl } from './usePathData';
import { INFO_API_PREFIX } from '../constants/routes';

export type ServerInfo = {
  ipAddress: string;
  startTime: string;
  localFolder: string;
};

export function useServerInfo() {
  return useQuery<ServerInfo, Error>({
    queryKey: ['serverInfo'],
    queryFn: async () => {
      const response = await fetch(`${serverBaseUrl}${INFO_API_PREFIX}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch server info: ${response.status}`);
      }
      return response.json();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}
