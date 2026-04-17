#!/usr/bin/env node

/**
 * Direct test of token fetching and search
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Load .env manually
const envPath = path.join(__dirname, '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};

envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        if (key) {
            envVars[key] = valueParts.join('=');
        }
    }
});

const CLIENT_ID = envVars['REACT_APP_SPOTIFY_CLIENT_ID'];
const CLIENT_SECRET = envVars['REACT_APP_SPOTIFY_CLIENT_SECRET'];

console.log('\n========== TOKEN TEST ==========\n');
console.log('Client ID from .env:', CLIENT_ID);
console.log('Client Secret from .env:', CLIENT_SECRET);
console.log('Client ID length:', CLIENT_ID?.length);
console.log('Client Secret length:', CLIENT_SECRET?.length);

if (!CLIENT_ID || !CLIENT_SECRET) {
    console.error('\n❌ Missing credentials');
    process.exit(1);
}

// Create Basic auth header
const basicAuth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
console.log('\nBasic Auth header (first 50 chars):', basicAuth.substring(0, 50) + '...');

// Fetch token
const tokenOptions = {
    hostname: 'accounts.spotify.com',
    port: 443,
    path: '/api/token',
    method: 'POST',
    headers: {
        'Authorization': `Basic ${basicAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
    }
};

console.log('\n📝 Fetching token...\n');

const tokenReq = https.request(tokenOptions, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        try {
            const result = JSON.parse(data);

            if (result.access_token) {
                const token = result.access_token;
                console.log('✅ Token fetched!');
                console.log('Token (first 50 chars):', token.substring(0, 50) + '...');
                console.log('Token length:', token.length);
                console.log('Expires in:', result.expires_in, 'seconds\n');

                // Now test search with this token
                testSearch(token);
            } else {
                console.error('❌ Error in response:', result);
                process.exit(1);
            }
        } catch (e) {
            console.error('❌ Parse error:', e.message);
            console.error('Response:', data);
            process.exit(1);
        }
    });
});

tokenReq.on('error', (e) => {
    console.error('❌ Token request error:', e.message);
    process.exit(1);
});

tokenReq.write('grant_type=client_credentials');
tokenReq.end();

function testSearch(token) {
    console.log('📝 Testing search with token...\n');

    const searchOptions = {
        hostname: 'api.spotify.com',
        port: 443,
        path: '/v1/search?q=drake&type=album&limit=5',
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    };

    console.log('Authorization header: Bearer ' + token.substring(0, 20) + '...');
    console.log('Path:', searchOptions.path + '\n');

    const searchReq = https.request(searchOptions, (res) => {
        let data = '';
        console.log('Response status:', res.statusCode);
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
            try {
                const result = JSON.parse(data);

                if (res.statusCode === 200) {
                    console.log('✅ Search successful!');
                    console.log('Albums found:', result.albums.items.length);
                    result.albums.items.slice(0, 3).forEach((album, i) => {
                        console.log(`  ${i + 1}. ${album.name} - ${album.artists[0].name}`);
                    });
                    console.log('\n✅ ALL TESTS PASSED!\n');
                    process.exit(0);
                } else {
                    console.error('❌ Error status:', res.statusCode);
                    console.error('Response:', result);
                    process.exit(1);
                }
            } catch (e) {
                console.error('❌ Parse error:', e.message);
                console.error('Response:', data.substring(0, 200));
                process.exit(1);
            }
        });
    });

    searchReq.on('error', (e) => {
        console.error('❌ Search request error:', e.message);
        process.exit(1);
    });

    searchReq.end();
}
