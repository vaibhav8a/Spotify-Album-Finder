import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useFavoritesStore = create(
    persist(
        (set, get) => ({
            favorites: [],

            addFavorite: (album) => {
                set((state) => {
                    const exists = state.favorites.some((fav) => fav.id === album.id);
                    if (exists) return state;
                    return { favorites: [...state.favorites, album] };
                });
            },

            removeFavorite: (albumId) => {
                set((state) => ({
                    favorites: state.favorites.filter((fav) => fav.id !== albumId),
                }));
            },

            isFavorite: (albumId) => {
                return get().favorites.some((fav) => fav.id === albumId);
            },

            clearFavorites: () => set({ favorites: [] }),
        }),
        {
            name: 'albumix-favorites',
            storage: localStorage,
        }
    )
);

export const useRecentlySearchedStore = create(
    persist(
        (set, get) => ({
            recentSearches: [],

            addSearch: (query) => {
                set((state) => {
                    const filtered = state.recentSearches.filter((q) => q !== query);
                    return { recentSearches: [query, ...filtered].slice(0, 10) };
                });
            },

            clearSearches: () => set({ recentSearches: [] }),
        }),
        {
            name: 'albumix-recent-searches',
            storage: localStorage,
        }
    )
);

export const useRecentlyViewedStore = create(
    persist(
        (set, get) => ({
            recentlyViewed: [],

            addViewed: (album) => {
                set((state) => {
                    const filtered = state.recentlyViewed.filter((a) => a.id !== album.id);
                    return { recentlyViewed: [album, ...filtered].slice(0, 20) };
                });
            },

            clearViewed: () => set({ recentlyViewed: [] }),
        }),
        {
            name: 'albumix-recently-viewed',
            storage: localStorage,
        }
    )
);
