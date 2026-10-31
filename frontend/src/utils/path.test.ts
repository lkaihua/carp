import { describe, expect, it } from 'vitest';

import { getPathMeta, toShareApiPath } from './path';

describe('toShareApiPath', () => {
  it('maps React pages to shared content, including nested paths', () => {
    expect(toShareApiPath('/~/')).toBe('/api/share/');
    expect(toShareApiPath('/~/photos/cat.jpg')).toBe('/api/share/photos/cat.jpg');
  });
});

describe('getPathMeta', () => {
  it('should return correct folderPath and fileName for file paths', () => {
    const { folderPath, fileName } = getPathMeta('/folder/folder2/file.jpg');
    expect(folderPath).toBe('/folder/folder2/');
    expect(fileName).toBe('file.jpg');
  });

  it('should return correct folderPath and fileName for folder paths', () => {
    const { folderPath, fileName } = getPathMeta('/folder/folder2/');
    expect(folderPath).toBe('/folder/folder2/');
    expect(fileName).toBeNull();
  });

  it('should handle root level files correctly', () => {
    const { folderPath, fileName } = getPathMeta('file.mp3');
    expect(folderPath).toBe('/');
    expect(fileName).toBe('file.mp3');
  });

  it('should handle root level folders correctly', () => {
    const { folderPath, fileName } = getPathMeta('/');
    expect(folderPath).toBe('/');
    expect(fileName).toBeNull();
  });

  it('should handle empty paths correctly', () => {
    const { folderPath, fileName } = getPathMeta('');
    expect(folderPath).toBe('/');
    expect(fileName).toBeNull();
  });
});
