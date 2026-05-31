import { create } from "zustand";
import { settingsService } from "../features/settings/services/settingsService";

export interface SavedPost {
  _id: string;
  user: any;
  title: string;
  prepTime: string;
  instructions: string;
  ingredients: string[];
  nutritionList: { label: string; value: string }[];
  benefitsList: { label: string; value: string }[];
  mediaUrls: string[];
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  createdAt: string;
  updatedAt: string;
  isSaved?: boolean;
}

interface SavedPostsState {
  savedPosts: SavedPost[];
  loading: boolean;
  error: string | null;

  setSavedPosts: (posts: SavedPost[]) => void;
  fetchSavedPosts: () => Promise<void>;
  toggleSaveOptimistic: (postId: string) => Promise<void>;
  clearCache: () => void;
  removePostFromSaved: (postId: string) => void;
}

export const useSavedPostsStore = create<SavedPostsState>((set, get) => ({
  savedPosts: [],
  loading: false,
  error: null,

  setSavedPosts: (posts) => set({ savedPosts: posts }),

  fetchSavedPosts: async () => {
    try {
      set({ loading: true, error: null });
      const response = await settingsService.getSavedPosts();
      set({ savedPosts: response.savedPosts });
    } catch (err: any) {
      set({ error: err.message || "Failed to fetch saved recipes" });
    } finally {
      set({ loading: false });
    }
  },

  clearCache: () => {
    set({ savedPosts: [], error: null });
    console.log(
      "🧼 SAVED_POSTS_STORE_CACHE PURGED: Successfully swapped context!",
    );
  },

  removePostFromSaved: (postId: string) => {
    set((state) => ({
      savedPosts: state.savedPosts.filter((post) => post._id !== postId),
    }));
  },

  toggleSaveOptimistic: async (postId: string) => {
    const previousSavedPosts = get().savedPosts;

    const isCurrentlySaved = previousSavedPosts.some(
      (post) => post._id === postId,
    );

    const updatedSavedPosts = isCurrentlySaved
      ? previousSavedPosts.filter((post) => post._id !== postId)
      : previousSavedPosts;

    set({ savedPosts: updatedSavedPosts });

    try {
      const serverResponse = await settingsService.toggleSavePost(postId);

      if (serverResponse && serverResponse.success) {
        if (serverResponse.isSaved) {
          set((state) => ({
            savedPosts: [...state.savedPosts].map((post) => ({
              ...post,
              isSaved: post._id === postId ? true : post.isSaved,
            })),
          }));
        }
      }
    } catch (error) {
      console.error(
        "❌ SAVE_SYNC_CRITICAL_ERROR: Rolling back client state store.",
        error,
      );
      set({ savedPosts: previousSavedPosts });
    }
  },
}));
