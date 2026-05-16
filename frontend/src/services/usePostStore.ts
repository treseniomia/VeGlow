import { create } from "zustand";
import { homeService } from "../features/home/services/homeService";

interface PostState {
  posts: any[];
  currentPost: any | null;
  loading: boolean;
  error: string | null;

  setPosts: (posts: any[]) => void;
  fetchAllPosts: () => Promise<void>;
  fetchPostById: (id: string) => Promise<void>;
  toggleLikeOptimistic: (postId: string) => Promise<void>;
  clearCache: () => void;
}

export const usePostStore = create<PostState>((set, get) => ({
  posts: [],
  currentPost: null,
  loading: false,
  error: null,

  setPosts: (posts) => set({ posts }),

  fetchAllPosts: async () => {
    try {
      set({ loading: true, error: null });
      const data = await homeService.getAllPosts();
      set({ posts: data });
    } catch (err: any) {
      set({ error: err.message || "Failed to fetch posts" });
    } finally {
      set({ loading: false });
    }
  },

  fetchPostById: async (id: string) => {
    try {
      set({ loading: true, error: null });
      const data = await homeService.getPostById(id);
      set({ currentPost: data });
    } catch (err: any) {
      set({ error: "Failed to load recipe details." });
    } finally {
      set({ loading: false });
    }
  },

  clearCache: () => {
    set({ posts: [], currentPost: null, error: null });
    console.log("🧼 POST_STORE CACHE PURGED: Successfully swapped context!");
  },

  toggleLikeOptimistic: async (postId: string) => {
    const previousPosts = get().posts;
    const previousCurrentPost = get().currentPost;

    const updatedPosts = previousPosts.map((post) => {
      if (post._id === postId) {
        const nextIsLiked = !post.isLiked;
        return {
          ...post,
          isLiked: nextIsLiked,
          likesCount: nextIsLiked
            ? (post.likesCount || 0) + 1
            : Math.max(0, (post.likesCount || 0) - 1),
        };
      }
      return post;
    });

    let updatedCurrentPost = previousCurrentPost;
    if (previousCurrentPost && previousCurrentPost._id === postId) {
      const nextIsLiked = !previousCurrentPost.isLiked;
      updatedCurrentPost = {
        ...previousCurrentPost,
        isLiked: nextIsLiked,
        likesCount: nextIsLiked
          ? (previousCurrentPost.likesCount || 0) + 1
          : Math.max(0, (previousCurrentPost.likesCount || 0) - 1),
      };
    }

    set({ posts: updatedPosts, currentPost: updatedCurrentPost });

    try {
      const serverResponse = await homeService.toggleLike(postId);

      if (serverResponse && serverResponse.success) {
        set((state) => ({
          posts: state.posts.map((p) =>
            p._id === postId
              ? {
                  ...p,
                  isLiked: serverResponse.isLiked,
                  likesCount: serverResponse.likesCount,
                }
              : p
          ),
          currentPost:
            state.currentPost && state.currentPost._id === postId
              ? {
                  ...state.currentPost,
                  isLiked: serverResponse.isLiked,
                  likesCount: serverResponse.likesCount,
                }
              : state.currentPost,
        }));
      }
    } catch (error) {
      console.error(
        "❌ LIKE_SYNC_CRITICAL_ERROR: Rolling back client state store.",
        error
      );
      set({ posts: previousPosts, currentPost: previousCurrentPost });
    }
  },
}));
