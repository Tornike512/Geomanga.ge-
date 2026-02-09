/**
 * Known manga IDs that claim English availability in metadata
 * but have no actual English chapters available.
 *
 * These manga are filtered out from all MangaDex lists to prevent
 * showing manga that users cannot read.
 */
export const BLOCKED_MANGA_IDS = [
  "aa6c76f7-5f5f-46b6-a800-911145f81b9b", // Metadata shows EN but no EN chapters exist
];
