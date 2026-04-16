import axios from 'axios';

const SPOTIFY_API_BASE_URL = 'https://api.spotify.com/v1';
const TOKEN_API_URL = 'https://accounts.spotify.com/api/token';

let cachedToken = null;
let tokenExpiry = null;
let tokenPromise = null; // To handle concurrent token requests

// Helper to get token with fallback to localStorage
const getStoredToken = () => {
    try {
        return localStorage.getItem('spotifyAccessToken');
    } catch {
        return null;
    }
};

// Create axios instance
const spotifyApi = axios.create({
    baseURL: SPOTIFY_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor that ensures token is present
spotifyApi.interceptors.request.use((config) => {
    // Get the latest token from cache or localStorage
    let token = cachedToken || getStoredToken();

    if (!token) {
        console.warn('⚠️ WARNING: No token available for request!');
    } else {
        config.headers['Authorization'] = `Bearer ${token}`;
        console.log('✓ Token attached to request:', token.substring(0, 20) + '...');
    }
    return config;
});

// Add response interceptor to handle 401 errors and refresh token
spotifyApi.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If we get a 401 (Unauthorized), try to refresh token and retry
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            console.log('🔄 Token expired (401), refreshing...');

            try {
                await getAccessToken();
                // Retry the original request with new token
                let newToken = cachedToken;
                originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                return spotifyApi(originalRequest);
            } catch (refreshError) {
                console.error('❌ Failed to refresh token:', refreshError.message);
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export const getAccessToken = async () => {
    // If a token fetch is already in progress, wait for it
    if (tokenPromise) {
        return tokenPromise;
    }

    try {
        const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
        const clientSecret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;

        console.log('🔐 Fetching new access token...');

        tokenPromise = axios.post(
            TOKEN_API_URL,
            'grant_type=client_credentials',
            {
                headers: {
                    Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );

        const response = await tokenPromise;

        cachedToken = response.data.access_token;
        tokenExpiry = Date.now() + response.data.expires_in * 1000;

        console.log('✅ Access token obtained successfully, expires in:', response.data.expires_in, 's');

        // Store to localStorage
        try {
            localStorage.setItem('spotifyAccessToken', cachedToken);
            localStorage.setItem('spotifyTokenExpiry', tokenExpiry.toString());
        } catch (e) {
            console.warn('Could not store token in localStorage', e);
        }

        tokenPromise = null;
        return cachedToken;
    } catch (error) {
        console.error('❌ Error getting access token:', error.response?.data || error.message);
        tokenPromise = null;
        throw error;
    }
};

export const ensureValidToken = async () => {
    // Check if we have a valid cached token
    if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
        console.log('✓ Using cached token, expires in:', Math.round((tokenExpiry - Date.now()) / 1000), 's');
        return;
    }

    // Check localStorage as fallback
    const storedToken = getStoredToken();
    const storedExpiry = localStorage.getItem('spotifyTokenExpiry');

    if (storedToken && storedExpiry && Date.now() < parseInt(storedExpiry)) {
        cachedToken = storedToken;
        tokenExpiry = parseInt(storedExpiry);
        console.log('✓ Restored token from localStorage, expires in:', Math.round((tokenExpiry - Date.now()) / 1000), 's');
        return;
    }

    // Need a new token
    console.log('⏳ Token invalid or missing, fetching new one...');
    await getAccessToken();
};

// Search for albums, artists, or tracks
export const searchSpotify = async (query, type = 'album', limit = 20) => {
    try {
        console.log('🔍 Searching for:', query);
        await ensureValidToken();
        console.log('📡 Making API request to /search');
        const response = await spotifyApi.get('/search', {
            params: {
                q: query,
                type,
                limit,
                market: 'US',
            },
        });
        console.log('✅ Search successful, found:', response.data[type + 's'].items.length, type + 's');
        return response.data;
    } catch (error) {
        console.error('❌ Error searching Spotify:', error.response?.status, error.response?.data || error.message);
        console.error('Headers were:', error.config?.headers);
        throw error;
    }
};

// Get album details
export const getAlbumDetails = async (albumId) => {
    try {
        await ensureValidToken();
        const response = await spotifyApi.get(`/albums/${albumId}`);
        return response.data;
    } catch (error) {
        console.error('Error getting album details:', error);
        throw error;
    }
};

// Get album tracks
export const getAlbumTracks = async (albumId) => {
    try {
        await ensureValidToken();
        const response = await spotifyApi.get(`/albums/${albumId}/tracks`, {
            params: {
                limit: 50,
            },
        });
        return response.data.items;
    } catch (error) {
        console.error('Error getting album tracks:', error);
        throw error;
    }
};

// Get artist details
export const getArtistDetails = async (artistId) => {
    try {
        await ensureValidToken();
        const response = await spotifyApi.get(`/artists/${artistId}`);
        return response.data;
    } catch (error) {
        console.error('Error getting artist details:', error);
        throw error;
    }
};

// Get artist's top albums
export const getArtistAlbums = async (artistId, limit = 10) => {
    try {
        await ensureValidToken();
        const response = await spotifyApi.get(`/artists/${artistId}/albums`, {
            params: {
                limit,
                include_groups: 'album,single',
                market: 'US',
            },
        });
        return response.data.items;
    } catch (error) {
        console.error('Error getting artist albums:', error);
        throw error;
    }
};

// Get new releases - using artist search as fallback
export const getNewReleases = async (limit = 20) => {
    try {
        console.log('ensureValidToken called...');
        await ensureValidToken();
        console.log('Token available:', cachedToken ? 'Yes' : 'No');

        // Try browse endpoint first
        try {
            console.log('Trying browse endpoint...');
            const response = await spotifyApi.get('/browse/new-releases', {
                params: {
                    limit,
                    country: 'US',
                },
            });
            console.log('Browse endpoint success, found albums:', response.data.albums.items.length);
            return response.data.albums.items;
        } catch (browseError) {
            // Fallback to search for popular albums using common terms
            console.log('Browse endpoint failed with error:', browseError.message);
            console.log('Falling back to search...');
            const searchTerms = ['2024', 'album', 'latest'];
            const randomTerm = searchTerms[Math.floor(Math.random() * searchTerms.length)];
            console.log('Searching for:', randomTerm);
            const response = await spotifyApi.get('/search', {
                params: {
                    q: randomTerm,
                    type: 'album',
                    limit,
                    market: 'US',
                },
            });
            console.log('Search successful, found albums:', response.data.albums.items.length);
            return response.data.albums.items;
        }
    } catch (error) {
        console.error('Error getting new releases:', error.response?.data || error.message);
        console.error('Full error:', error);
        throw error;
    }
};

// Get featured playlists
export const getFeaturedPlaylists = async (limit = 20) => {
    try {
        await ensureValidToken();

        // Try browse endpoint first
        try {
            const response = await spotifyApi.get('/browse/featured-playlists', {
                params: {
                    limit,
                    country: 'US',
                },
            });
            return response.data.playlists.items;
        } catch (browseError) {
            // Fallback to search for popular playlists
            console.log('Browse featured playlists failed, falling back');
            const response = await spotifyApi.get('/search', {
                params: {
                    q: 'playlist',
                    type: 'playlist',
                    limit,
                    market: 'US',
                },
            });
            return response.data.playlists.items;
        }
    } catch (error) {
        console.error('Error getting featured playlists:', error);
        throw error;
    }
};

// Get recommendations
export const getRecommendations = async (seedArtists, seedTracks, limit = 20) => {
    try {
        await ensureValidToken();
        const response = await spotifyApi.get('/recommendations', {
            params: {
                seed_artists: seedArtists,
                seed_tracks: seedTracks,
                limit,
                market: 'US',
            },
        });
        return response.data.tracks;
    } catch (error) {
        console.error('Error getting recommendations:', error);
        throw error;
    }
};

// Get several albums
export const getMultipleAlbums = async (albumIds) => {
    try {
        await ensureValidToken();
        const response = await spotifyApi.get('/albums', {
            params: {
                ids: albumIds.join(','),
                market: 'US',
            },
        });
        return response.data.albums;
    } catch (error) {
        console.error('Error getting multiple albums:', error);
        throw error;
    }
};

export default spotifyApi;
