import { useState, useCallback } from "react";
import * as commentService from "@/features/comments/services/commentService";
import { IComment } from "../types";
import { usePostStore } from "@/services/usePostStore";

export const useComments = (postId: string) => {
  const [comments, setComments] = useState<IComment[]>([]);
  const [repliesMap, setRepliesMap] = useState<Record<string, IComment[]>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activePageMap, setActivePageMap] = useState<Record<string, number>>(
    {}
  );
  const [hasMoreRepliesMap, setHasMoreRepliesMap] = useState<
    Record<string, boolean>
  >({});

  const updateCommentsCount = usePostStore(
    (state) => state.updateCommentsCount
  );

  const fetchMainComments = useCallback(
    async (page: number = 1) => {
      setIsLoading(true);
      try {
        const response = await commentService.getMainComments(postId, page);
        if (page === 1) {
          setComments(response.data);
        } else {
          setComments((prev) => [...prev, ...response.data]);
        }
      } catch (error) {
        console.error("Failed fetching parent comments:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [postId]
  );

  const fetchNextReplies = useCallback(
    async (commentId: string) => {
      const currentPage = activePageMap[commentId] || 0;
      const nextPage = currentPage + 1;
      try {
        const response = await commentService.getSubReplies(
          commentId,
          nextPage,
          5
        );

        setRepliesMap((prev) => {
          const existing = prev[commentId] || [];
          const filteredNew = response.data.filter(
            (newReply) => !existing.some((r) => r._id === newReply._id)
          );
          return { ...prev, [commentId]: [...existing, ...filteredNew] };
        });

        setActivePageMap((prev) => ({ ...prev, [commentId]: nextPage }));
        setHasMoreRepliesMap((prev) => ({
          ...prev,
          [commentId]: response.hasMore,
        }));
      } catch (error) {
        console.error("Error patching lazy load replies:", error);
      }
    },
    [activePageMap]
  );

  const addComment = useCallback(
    async (
      text: string,
      parentId: string | null = null,
      replyToUserId: string | null = null
    ) => {
      try {
        const response = await commentService.createComment({
          postId,
          text,
          parentId,
          replyToUser: replyToUserId,
        });
        const newComment = response.data;

        if (parentId) {
          setRepliesMap((prev) => ({
            ...prev,
            [parentId]: [...(prev[parentId] || []), newComment],
          }));

          setComments((prev) =>
            prev.map((c) =>
              c._id === parentId
                ? { ...c, repliesCount: c.repliesCount + 1 }
                : c
            )
          );
        } else {
          setComments((prev) => [newComment, ...prev]);
        }
        updateCommentsCount(postId, 1);
      } catch (error) {
        console.error("Failed adding comment matrix node:", error);
      }
    },
    [postId, updateCommentsCount]
  );

  const toggleLike = useCallback(
    async (commentId: string, isReply: boolean, currentUserId: string) => {
      if (isReply) {
        setRepliesMap((prev) => {
          const updated = { ...prev };
          for (const key in updated) {
            updated[key] = updated[key].map((r) => {
              if (r._id === commentId) {
                const liked = r.likes.includes(currentUserId);
                return {
                  ...r,
                  likes: liked
                    ? r.likes.filter((id) => id !== currentUserId)
                    : [...r.likes, currentUserId],
                  likesCount: liked ? r.likesCount - 1 : r.likesCount + 1,
                };
              }
              return r;
            });
          }
          return updated;
        });
      } else {
        setComments((prev) =>
          prev.map((c) => {
            if (c._id === commentId) {
              const liked = c.likes.includes(currentUserId);
              return {
                ...c,
                likes: liked
                  ? c.likes.filter((id) => id !== currentUserId)
                  : [...c.likes, currentUserId],
                likesCount: liked ? c.likesCount - 1 : c.likesCount + 1,
              };
            }
            return c;
          })
        );
      }
      try {
        await commentService.toggleCommentLike(commentId);
      } catch (error) {
        console.error(
          "Failed syncing lake payload state to cluster server:",
          error
        );
      }
    },
    []
  );

  const removeComment = useCallback(
    async (commentId: string, parentId: string | null = null) => {
      try {
        await commentService.deleteComment(commentId);
        if (parentId) {
          setRepliesMap((prev) => ({
            ...prev,
            [parentId]: (prev[parentId] || []).filter(
              (r) => r._id !== commentId
            ),
          }));
          setComments((prev) =>
            prev.map((c) =>
              c._id === parentId
                ? { ...c, repliesCount: Math.max(0, c.repliesCount - 1) }
                : c
            )
          );
        } else {
          setComments((prev) => prev.filter((c) => c._id !== commentId));
          setRepliesMap((prev) => {
            const u = { ...prev };
            delete u[commentId];
            return u;
          });
        }
        updateCommentsCount(postId, -1);
      } catch (error) {
        console.error("Deletion route failed executing transactions:", error);
      }
    },
    [postId, updateCommentsCount]
  );

  const editComment = useCallback(
    async (
      commentId: string,
      newText: string,
      parentId: string | null = null
    ) => {
      try {
        const response = await commentService.updateComment(commentId, newText);
        if (parentId) {
          setRepliesMap((prev) => ({
            ...prev,
            [parentId]: (prev[parentId] || []).map((r) =>
              r._id === commentId ? response.data : r
            ),
          }));
        } else {
          setComments((prev) =>
            prev.map((c) => (c._id === commentId ? response.data : c))
          );
        }
      } catch (error) {
        console.error("Content editor modifier stream failed:", error);
      }
    },
    []
  );

  return {
    comments,
    repliesMap,
    isLoading,
    hasMoreRepliesMap,
    fetchMainComments,
    fetchNextReplies,
    addComment,
    toggleLike,
    removeComment,
    editComment,
  };
};
