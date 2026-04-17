const SPOTIFY_API_BASE_URL = 'https://api.spotify.com/v1';
const TOKEN_API_URL = 'https://accounts.spotify.com/api/token';

let cachedToken = null;
let tokenExpiry = null;
let tokenPromise = null;

const getStoredToken = () => {
    try {
        return localStorage.getItem('spotifyAccessToken');
    } catch {
        return null;
    }
};

export const getAccessToken = async () => {
    if (tokenPromise) {
        return tokenPromise;
    }

    try {
        const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
        const clientSecret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;

        if (!clientId || !clientSecret) {
            throw new Error('Missing Spotify credentials');
        }

        console.log('🔐 Fetching new access token...');

        tokenPromise = (async () => {
            const response = await fetch(TOKEN_API_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: 'grant_type=client_credentials'
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error_description || 'Failed to get token');
            }

            cachedToken = data.access_token;
            tokenExpiry = Date.now() + data.expires_in * 1000;

            console.log('✅ Token obtained, expires in:', data.expires_in, 's');

            try {
                localStorage.setItem('spotifyAccessToken', cachedToken);
                localStorage.setItem('spotifyTokenExpiry', tokenExpiry.toString());
            } catch (e) {
                console.warn('Could not store token', e);
            }

            return cachedToken;
        })();

        const token = await tokenPromise;
        tokenPromise = null;
        return token;
    } catch (error) {
        console.error('❌ Token error:', error.message);
        tokenPromise = null;
        throw error;
    }
};

export const ensureValidToken = async () => {
    if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
        console.log('✓ Using cached token, expires in:', Math.round((tokenExpiry - Date.now()) / 1000), 's');
        return;
    }

    const storedToken = getStoredToken();
    const storedExpiry = localStorage.getItem('spotifyTokenExpiry');

    if (storedToken && storedExpiry && Date.now() < parseInt(storedExpiry)) {
        cachedToken = storedToken;
        tokenExpiry = parseInt(storedExpiry);
        console.log('✓ Restored token from storage');
        return;
    }

    console.log('⏳ Fetching new token...');
    await getAccessToken();
};

const buildQueryString = (params) => {
    const searchParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
        searchParams.append(key, params[key]);
    });
    return searchParams.toString();
};

export const searchSpotify = async (query, type = 'album', limit = 20) => {
    try {
        console.log('🔍 Searching for:', query);
        await ensureValidToken();

        console.log('Token check - cachedToken exists:', !!cachedToken);
        console.log('Token value (first 20 chars):', cachedToken ? cachedToken.substring(0, 20) : 'NULL');
        console.log('Token starts with BQ:', cachedToken && cachedToken.startsWith('BQ'));

        const params = { q: query, type, limit, market: 'US' };
        const url = `${SPOTIFY_API_BASE_URL}/search?${buildQueryString(params)}`;

        console.log('📡 Request URL:', url);
        console.log('📡 Authorization header will be: Bearer ' + (cachedToken ? cachedToken.substring(0, 20) + '...' : 'NULL'));

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${cachedToken}`,
                'Accept': 'application/json',
            }
        });

        console.log('📡 Response status:', response.status);

        const data = await response.json();

        if (!response.ok) {
            console.error('❌ Search error:', response.status);
            console.error('Error response:', data);
            if (data.error) {
                console.error('Error message:', data.error.message);
                console.error('Error status:', data.error.status);
            }
            throw new Error(`Search failed: ${response.status}`);
        }

        console.log('✅ Search found:', data[type + 's'].items.length, 'results');
        return data;
    } catch (error) {
        console.error('❌ Error:', error.message);
        throw error;
    }
};

export const getAlbumDetails = async (albumId) => {
    try {
        await ensureValidToken();
        const url = `${SPOTIFY_API_BASE_URL}/albums/${albumId}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${cachedToken}`,
                'Accept': 'application/json',
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(`Failed: ${response.status}`);
        }

        return data;
    } catch (error) {
        console.error('Error getting album:', error);
        throw error;
    }
};

export const getAlbumTracks = async (albumId) => {
    try {
        await ensureValidToken();
        const params = { limit: 50 };
        const url = `${SPOTIFY_API_BASE_URL}/albums/${albumId}/tracks?${buildQueryString(params)}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${cachedToken}`,
                'Accept': 'application/json',
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(`Failed: ${response.status}`);
        }

        return data.items;
    } catch (error) {
        console.error('Error getting tracks:', error);
        throw error;
    }
};

export const getArtistDetails = async (artistId) => {
    try {
        await ensureValidToken();
        const url = `${SPOTIFY_API_BASE_URL}/artists/${artistId}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${cachedToken}`,
                'Accept': 'application/json',
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(`Failed: ${response.status}`);
        }

        return data;
    } catch (error) {
        console.error('Error getting artist:', error);
        throw error;
    }
};

export const getArtistAlbums = async (artistId, limit = 10) => {
    try {
        await ensureValidToken();
        const params = { limit, include_groups: 'album,single', market: 'US' };
        const url = `${SPOTIFY_API_BASE_URL}/artists/${artistId}/albums?${buildQueryString(params)}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${cachedToken}`,
                'Accept': 'application/json',
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(`Failed: ${response.status}`);
        }

        return data.items;
    } catch (error) {
        console.error('Error getting albums:', error);
        throw error;
    }
};

export const getNewReleases = async (limit = 20) => {
    try {
        console.log('📚 Getting new releases...');
        await ensureValidToken();

        try {
            console.log('Trying browse endpoint...');
            const params = { limit, country: 'US' };
            const url = `${SPOTIFY_API_BASE_URL}/browse/new-releases?${buildQueryString(params)}`;

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${cachedToken}`,
                    'Accept': 'application/json',
                }
            });

            const data = await response.json();

            if (response.ok) {
                console.log('✅ Browse success, found:', data.albums.items.length, 'albums');
                return data.albums.items;
            }

            throw new Error(`Browse failed: ${response.status}`);
        } catch (browseError) {
            console.log('Browse failed, using fallback search...');
            const searchTerms = ['album', '2024', 'new'];
            const term = searchTerms[Math.floor(Math.random() * searchTerms.length)];

            const params = { q: term, type: 'album', limit, market: 'US' };
            const url = `${SPOTIFY_API_BASE_URL}/search?${buildQueryString(params)}`;

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${cachedToken}`,
                    'Accept': 'application/json',
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(`Search failed: ${response.status}`);
            }

            console.log('✅ Search found:', data.albums.items.length, 'albums');
            return data.albums.items;
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
        throw error;
    }
};

export const getFeaturedPlaylists = async (limit = 20) => {
    try {
        await ensureValidToken();

        try {
            const params = { limit, country: 'US' };
            const url = `${SPOTIFY_API_BASE_URL}/browse/featured-playlists?${buildQueryString(params)}`;

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${cachedToken}`,
                    'Accept': 'application/json',
                }
            });

            const data = await response.json();

            if (response.ok) {
                return data.playlists.items;
            }

            throw new Error(`Browse failed: ${response.status}`);
        } catch (browseError) {
            const params = { q: 'playlist', type: 'playlist', limit, market: 'US' };
            const url = `${SPOTIFY_API_BASE_URL}/search?${buildQueryString(params)}`;

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${cachedToken}`,
                    'Accept': 'application/json',
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(`Search failed: ${response.status}`);
            }

            return data.playlists.items;
        }
    } catch (error) {
        console.error('Error getting playlists:', error);
        throw error;
    }
};
