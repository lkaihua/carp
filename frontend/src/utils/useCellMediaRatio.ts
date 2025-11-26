import { useLocalStorage } from "usehooks-ts";

export type RatioType = 'square' | 'ratio';

export const useCellMediaRatio = () => useLocalStorage<RatioType>('CellMediaRatio', 'square');  