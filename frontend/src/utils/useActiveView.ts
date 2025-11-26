import { useLocalStorage } from "usehooks-ts";

export type ViewType = 'list' | 'grid';

export const useActiveView = () => useLocalStorage<ViewType>('ActiveView', 'list');