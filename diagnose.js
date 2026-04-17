#!/usr/bin/env node

/**
 * Simple Spotify API diagnostics tool
 * Tests each part of the API flow step by step
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Load .env
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

console.log('\n🔍 SPOTIFY API DIAGNOSTICS\n');
console.log('Client ID:', CLIENT_ID ? '✓' : '✗');
console.log('Client Secret:', CLIENT_SECRET ? '✓' : '✗');

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('\n❌ Missing credentials');
  process.exit(1);
}

// Test 1: Token
console.log('\n📝 STEP 1: Get Access Token\n');

const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

const tokenOptions = {
  hostname: 'accounts.spotify.com',
  port: 443,
  path: '/api/token',
  method: 'POST',
  headers: {
    'Authorization': `Basic ${auth}`,
    'Content-Type': 'application/x-www-form-urlencoded',
    'User-Agent': 'Node.js Test'
  }
};

console.log('Request Details:');
console.log('  URL: https://accounts.spotify.com/api/token');
console.log('  Method: POST');
console.log('  Auth Header: Basic ' + auth.substring(0, 20) + '...\n');

const tokenReq = https.request(tokenOptions, (res) => {
  let data = '';
  console.log('Response Status:', res.statusCode);
  console.log('Response Headers:', Object.keys(res.headers).join(', ') + '\n');

  res.on('data', chunk => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const result = JSON.parse(data);

      if (result.access_token) {
        console.log('✅ Token received!\n');
        console.log('Token (first 30 chars):', result.access_token.substring(0, 30) + '...');
        console.log('Expires in:', result.expires_in, 'seconds');
        console.log('Token type:', result.token_type, '\n');

        // Now test search
        testSearch(result.access_token);
      } else {
        console.error('❌ No token in response!');
        console.log('Response:', result);
        process.exit(1);
      }
    } catch (e) {
      console.error('❌ Failed to parse response');
      console.log('Raw response:', data);
      process.exit(1);
    }
  });
});

tokenReq.on('error', (e) => {
  console.error('❌ Request failed:', e.message);
  process.exit(1);
});

tokenReq.write('grant_type=client_credentials');
tokenReq.end();

// Test 2: Search
function testSearch(token) {
  console.log('📝 STEP 2: Search for "Drake"\n');

  const searchOptions = {
    hostname: 'api.spotify.com',
    port: 443,
    path: '/v1/search?q=drake&type=artist&limit=1',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'User-Agent': 'Node.js Test'
    }
  };

  console.log('Request Details:');
  console.log('  URL: https://api.spotify.com/v1/search?q=drake&type=artist&limit=1');
  console.log('  Method: GET');
  console.log('  Auth Header: Bearer ' + token.substring(0, 20) + '...\n');

  const searchReq = https.request(searchOptions, (res) => {
    let data = '';
    console.log('Response Status:', res.statusCode);
    console.log('Response Headers:', Object.keys(res.headers).join(', ') + '\n');

    res.on('data', chunk => {
      data += chunk;
    });

    res.on('end', () => {
      try {
        const result = JSON.parse(data);

        if (result.error) {
          console.error('❌ API Error:');
          console.log('  Status:', result.error.status);
          console.log('  Message:', result.error.message);
          process.exit(1);
        }

        if (result.artists?.items?.length > 0) {
          console.log('✅ Search successful!\n');
          const artist = result.artists.items[0];
          console.log('Artist:', artist.name);
          console.log('ID:', artist.id);
          console.log('Genres:', artist.genres.join(', ') || 'None');
          console.log('Followers:', artist.followers.total, '\n');

          // Now test new releases
          testNewReleases(token);
        } else {
          console.error('❌ No artists found');
          process.exit(1);
        }
      } catch (e) {
        console.error('❌ Failed to parse search response');
        console.log('Raw response:', data.substring(0, 200));
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

// Test 3: New Releases
function testNewReleases(token) {
  console.log('📝 STEP 3: Get New Releases\n');

  const releasesOptions = {
    hostname: 'api.spotify.com',
    port: 443,
    path: '/v1/browse/new-releases?limit=3',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'User-Agent': 'Node.js Test'
    }
  };

  console.log('Request Details:');
  console.log('  URL: https://api.spotify.com/v1/browse/new-releases?limit=3');
  console.log('  Method: GET');
  console.log('  Auth Header: Bearer ' + token.substring(0, 20) + '...\n');

  const releasesReq = https.request(releasesOptions, (res) => {
    let data = '';
    console.log('Response Status:', res.statusCode);
    console.log('Response Headers:', Object.keys(res.headers).join(', ') + '\n');

    res.on('data', chunk => {
      data += chunk;
    });

    res.on('end', () => {
      try {
        const result = JSON.parse(data);

        if (result.error) {
          console.error('❌ API Error:');
          console.log('  Status:', result.error.status);
          console.log('  Message:', result.error.message);
          process.exit(1);
        }

        if (result.albums?.items?.length > 0) {
          console.log('✅ New releases retrieved!\n');
          console.log('Total albums available:', result.albums.total);
          console.log('\nFirst 3 albums:');
          result.albums.items.slice(0, 3).forEach((album, i) => {
            console.log(`  ${i + 1}. ${album.name}`);
            console.log(`     Artists: ${album.artists.map(a => a.name).join(', ')}`);
            console.log(`     Release: ${album.release_date}`);
          });

          console.log('\n✅ ALL TESTS PASSED! Your Spotify API is working!\n');
          process.exit(0);
        } else {
          console.error('❌ No albums found');
          process.exit(1);
        }
      } catch (e) {
        console.error('❌ Failed to parse releases response');
        console.log('Raw response:', data.substring(0, 200));
        process.exit(1);
      }
    });
  });

  releasesReq.on('error', (e) => {
    console.error('❌ New releases request failed:', e.message);
    process.exit(1);
  });

  releasesReq.end();
}
