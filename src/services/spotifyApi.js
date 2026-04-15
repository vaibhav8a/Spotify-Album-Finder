import axios from 'axios';

const SPOTIFY_API_BASE_URL = 'https://api.spotify.com/v1';

let accessToken = localStorage.getItem('spotifyAccessToken');
let tokenExpiry = localStorage.getItem('spotifyTokenExpiry');

const spotifyApi = axios.create({
    baseURL: SPOTIFY_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

spotifyApi.interceptors.request.use((config) => {
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

export const getAccessToken = async () => {
    try {
        const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
        const clientSecret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;

        const response = await axios.post(
            'https://accounts.spotify.com/api/token',
            null,
            {
                params: {
                    grant_type: 'client_credentials',
                },
                headers: {
                    Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );

        accessToken = response.data.access_token;
        tokenExpiry = Date.now() + response.data.expires_in * 1000;

        localStorage.setItem('spotifyAccessToken', accessToken);
        localStorage.setItem('spotifyTokenExpiry', tokenExpiry.toString());

        return accessToken;
    } catch (error) {
        console.error('Error getting access token:', error);
        throw error;
    }
};

export const ensureValidToken = async () => {
    if (!accessToken || !tokenExpiry || Date.now() > tokenExpiry) {
        await getAccessToken();
    }
};

// Search for albums, artists, or tracks
export const searchSpotify = async (query, type = 'album', limit = 20) => {
    try {
        await ensureValidToken();
        const response = await spotifyApi.get('/search', {
            params: {
                q: query,
                type,
                limit,
                market: 'US',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error searching Spotify:', error);
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

// Get new releases
export const getNewReleases = async (limit = 20) => {
    try {
        await ensureValidToken();
        const response = await spotifyApi.get('/browse/new-releases', {
            params: {
                limit,
                country: 'US',
            },
        });
        return response.data.albums.items;
    } catch (error) {
        console.error('Error getting new releases:', error);
        throw error;
    }
};

// Get featured playlists
export const getFeaturedPlaylists = async (limit = 20) => {
    try {
        await ensureValidToken();
        const response = await spotifyApi.get('/browse/featured-playlists', {
            params: {
                limit,
                country: 'US',
            },
        });
        return response.data.playlists.items;
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
