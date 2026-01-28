import { toggleLikeComment } from "./like-comment";

/**
 * @deprecated Use toggleLikeComment instead. The API now uses a toggle approach
 * where POST /comments/{id}/like toggles the like state.
 */
export const unlikeComment = toggleLikeComment;
