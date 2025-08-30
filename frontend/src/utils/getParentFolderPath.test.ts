import { describe, expect, it } from 'vitest';
import { getParentFolderPath } from './getParentFolderPath';

describe('getParentFolderPath', () => {
  it('should return parent path for multiple segments', () => {
    expect(getParentFolderPath(['a', 'b', 'c'])).toBe('/a/b/');
    expect(getParentFolderPath(['a', 'b', 'c.mp4'])).toBe('/a/b/');
  });

  it('should return root for single segment', () => {
    expect(getParentFolderPath(['a'])).toBe('/');
  });

  it('should return root for empty segments', () => {
    expect(getParentFolderPath([])).toBe('/');
  });
});
