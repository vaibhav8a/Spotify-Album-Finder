import React, { useEffect } from 'react';

export const DebugPage = () => {
    useEffect(() => {
        console.log('===== ENVIRONMENT DEBUG =====');
        console.log('REACT_APP_SPOTIFY_CLIENT_ID:', process.env.REACT_APP_SPOTIFY_CLIENT_ID);
        console.log('REACT_APP_SPOTIFY_CLIENT_SECRET:', process.env.REACT_APP_SPOTIFY_CLIENT_SECRET);
        console.log('REACT_APP_SPOTIFY_REDIRECT_URI:', process.env.REACT_APP_SPOTIFY_REDIRECT_URI);

        // Test Basic Auth encoding
        const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
        const clientSecret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;

        if (clientId && clientSecret) {
            const basicAuth = btoa(`${clientId}:${clientSecret}`);
            console.log('\nBasic Auth (first 50 chars):', basicAuth.substring(0, 50) + '...');
            console.log('Full Basic Auth:', basicAuth);

            // Try fetching token directly
            console.log('\n📝 Testing token fetch...');
            fetch('https://accounts.spotify.com/api/token', {
                method: 'POST',
                headers: {
                    'Authorization': `Basic ${basicAuth}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: 'grant_type=client_credentials'
            })
                .then(r => r.json())
                .then(data => {
                    console.log('✅ Token response:', data);

                    if (data.access_token) {
                        const token = data.access_token;
                        console.log('\n📝 Testing search with token...');
                        fetch(`https://api.spotify.com/v1/search?q=drake&type=album&limit=5`, {
                            method: 'GET',
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        })
                            .then(r => r.json())
                            .then(searchData => {
                                console.log('✅ Search response status:', searchData);
                                if (searchData.albums) {
                                    console.log('Albums found:', searchData.albums.items.length);
                                }
                            })
                            .catch(e => console.error('❌ Search error:', e));
                    }
                })
                .catch(e => console.error('❌ Token error:', e));
        }
    }, []);

    return (
        <div style={{ padding: '20px' }}>
            <h1>Debug Page</h1>
            <p>Check the console (F12) for debug information</p>
            <pre style={{ backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '4px' }}>
                Environment variables and API test results shown in console
            </pre>
        </div>
    );
};
