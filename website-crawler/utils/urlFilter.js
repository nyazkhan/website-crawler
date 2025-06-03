import micromatch from 'micromatch';

export function shouldIncludeUrl(url, includeGlobs, excludeGlobs) {
  if (excludeGlobs && micromatch.isMatch(url, excludeGlobs)) return false;
  if (includeGlobs && includeGlobs.length > 0) return micromatch.isMatch(url, includeGlobs);
  return true;
}