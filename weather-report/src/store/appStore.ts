import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ActiveTab = 'weather' | 'news';

interface AppState {
  // Tab navigation
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;

  // Weather state
  selectedCity: string | null;
  unavailableCities: string[]; // Cities currently being prepared (no report yet)
  setSelectedCity: (city: string | null) => void;
  addUnavailableCity: (city: string) => void;
  clearPreparingCity: (city: string) => void;
  removeCity: (city: string) => void;

  // News state
  selectedSubreddit: string | null;
  unavailableSubreddits: string[]; // Subreddits currently being prepared
  setSelectedSubreddit: (subreddit: string | null) => void;
  addUnavailableSubreddit: (subreddit: string) => void;
  clearPreparingSubreddit: (subreddit: string) => void;
  removeSubreddit: (subreddit: string) => void;

  // Theme
  theme: 'light' | 'dark' | 'auto';
  setTheme: (theme: 'light' | 'dark' | 'auto') => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Tab navigation
      activeTab: 'weather',
      setActiveTab: (tab) => set({ activeTab: tab }),

      // Weather state
      selectedCity: null,
      unavailableCities: [],
      setSelectedCity: (city) => set({ selectedCity: city }),
      addUnavailableCity: (city) =>
        set((state) => {
          if (state.unavailableCities.some((c) => c.toLowerCase() === city.toLowerCase())) {
            return state;
          }
          return { unavailableCities: [...state.unavailableCities, city] };
        }),
      clearPreparingCity: (city) =>
        set((state) => ({
          unavailableCities: state.unavailableCities.filter(
            (c) => c.toLowerCase() !== city.toLowerCase()
          ),
        })),
      removeCity: (city) =>
        set((state) => ({
          unavailableCities: state.unavailableCities.filter(
            (c) => c.toLowerCase() !== city.toLowerCase()
          ),
          selectedCity:
            state.selectedCity?.toLowerCase() === city.toLowerCase() ? null : state.selectedCity,
        })),

      // News state
      selectedSubreddit: null,
      unavailableSubreddits: [],
      setSelectedSubreddit: (subreddit) => set({ selectedSubreddit: subreddit }),
      addUnavailableSubreddit: (subreddit) =>
        set((state) => {
          if (
            state.unavailableSubreddits.some((s) => s.toLowerCase() === subreddit.toLowerCase())
          ) {
            return state;
          }
          return { unavailableSubreddits: [...state.unavailableSubreddits, subreddit] };
        }),
      clearPreparingSubreddit: (subreddit) =>
        set((state) => ({
          unavailableSubreddits: state.unavailableSubreddits.filter(
            (s) => s.toLowerCase() !== subreddit.toLowerCase()
          ),
        })),
      removeSubreddit: (subreddit) =>
        set((state) => ({
          unavailableSubreddits: state.unavailableSubreddits.filter(
            (s) => s.toLowerCase() !== subreddit.toLowerCase()
          ),
          selectedSubreddit:
            state.selectedSubreddit?.toLowerCase() === subreddit.toLowerCase()
              ? null
              : state.selectedSubreddit,
        })),

      // Theme
      theme: 'auto',
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'weather-app-storage',
    }
  )
);
