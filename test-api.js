#!/usr/bin/env node

// This script tests if the Spotify API is working with your credentials

const https = require('https');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env file
const envPath = path.join(__dirname, '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};

envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
        envVars[key.trim()] = value.trim();
    }
});

const CLIENT_ID = envVars['REACT_APP_SPOTIFY_CLIENT_ID'];
const CLIENT_SECRET = envVars['REACT_APP_SPOTIFY_CLIENT_SECRET'];

console.log('🔍 Testing Spotify API...\n');
console.log('Client ID:', CLIENT_ID ? '✓ Found' : '✗ Missing');
console.log('Client Secret:', CLIENT_SECRET ? '✓ Found' : '✗ Missing');

if (!CLIENT_ID || !CLIENT_SECRET) {
    console.error('\n❌ Missing credentials in .env file');
    process.exit(1);
}

// Test 1: Get Access Token
console.log('\n📝 Test 1: Fetching Access Token...');
const credentials = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

const tokenOptions = {
    hostname: 'accounts.spotify.com',
    path: '/api/token',
    method: 'POST',
    headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
    }
};

const tokenReq = https.request(tokenOptions, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        try {
            const parsed = JSON.parse(data);
            if (parsed.access_token) {
                console.log('✅ Token received:', parsed.access_token.substring(0, 20) + '...');
                console.log('   Expires in:', parsed.expires_in, 'seconds\n');

                // Test 2: Search API
                testSearchAPI(parsed.access_token);
            } else {
                console.error('❌ No token in response:', parsed);
                process.exit(1);
            }
        } catch (e) {
            console.error('❌ Error parsing token response:', e.message);
            process.exit(1);
        }
    });
});

tokenReq.on('error', (e) => {
    console.error('❌ Token request failed:', e.message);
    process.exit(1);
});

tokenReq.write('grant_type=client_credentials');
tokenReq.end();

// Test 2: Search for Drake
function testSearchAPI(token) {
    console.log('📝 Test 2: Searching for "Drake"...');

    const searchOptions = {
        hostname: 'api.spotify.com',
        path: '/v1/search?q=drake&type=artist&limit=1',
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };

    const searchReq = https.request(searchOptions, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
            try {
                const parsed = JSON.parse(data);
                if (parsed.artists && parsed.artists.items.length > 0) {
                    console.log('✅ Search successful!');
                    const artist = parsed.artists.items[0];
                    console.log('   Artist:', artist.name);
                    console.log('   ID:', artist.id);
                    console.log('   URL:', artist.external_urls.spotify);

                    // Test 3: Get New Releases
                    testNewReleases(token);
                } else if (parsed.error) {
                    console.error('❌ API Error:', parsed.error.message);
                    process.exit(1);
                } else {
                    console.error('❌ Unexpected response:', parsed);
                    process.exit(1);
                }
            } catch (e) {
                console.error('❌ Error parsing search response:', e.message);
                console.error('   Response:', data);
                process.exit(1);
            }
        });
    });

    searchReq.on('error', (e) => {
        console.error('❌ Search request failed:', e.message);
        process.exit(1);
    });

    searchReq.end();
}

// Test 3: Get New Releases
function testNewReleases(token) {
    console.log('\n📝 Test 3: Getting new releases...');

    const releasesOptions = {
        hostname: 'api.spotify.com',
        path: '/v1/browse/new-releases?limit=5',
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };

    const releasesReq = https.request(releasesOptions, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
            try {
                const parsed = JSON.parse(data);
                if (parsed.albums && parsed.albums.items.length > 0) {
                    console.log('✅ New releases retrieved!');
                    console.log('   Total albums available:', parsed.albums.total);
                    parsed.albums.items.slice(0, 3).forEach((album, i) => {
                        console.log(`   ${i + 1}. ${album.name} - ${album.artists[0].name}`);
                    });

                    console.log('\n✅ ALL TESTS PASSED! Your API is working correctly!\n');
                    process.exit(0);
                } else if (parsed.error) {
                    console.error('❌ API Error:', parsed.error.message);
                    console.error('   Status:', parsed.error.status);
                    process.exit(1);
                } else {
                    console.error('❌ Unexpected response:', parsed);
                    process.exit(1);
                }
            } catch (e) {
                console.error('❌ Error parsing releases response:', e.message);
                console.error('   Response:', data);
                process.exit(1);
            }
        });
    });

    releasesReq.on('error', (e) => {
        console.error('❌ Releases request failed:', e.message);
        process.exit(1);
    });

    releasesReq.end();
}
