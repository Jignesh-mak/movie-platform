// Run this with: node testTmdb.js
// It will tell you exactly what's wrong
require('dotenv').config();
const https = require('https');
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

const key = process.env.TMDB_API_KEY;
console.log('TMDB_API_KEY loaded:', key ? `YES (${key.substring(0,6)}...)` : 'NO - CHECK YOUR .env FILE!');

if (!key) {
  console.log('\n❌ Fix: Create backend/.env with TMDB_API_KEY=your_key_here');
  process.exit(1);
}

const url = `https://api.themoviedb.org/3/movie/popular?api_key=${key}&language=en-US&page=1`;
console.log('\nTesting connection to TMDB...');

const req = https.get(url, { family: 4, timeout: 10000 }, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    if (res.statusCode === 200) {
      const parsed = JSON.parse(data);
      console.log(`✅ SUCCESS! Got ${parsed.results?.length} movies. TMDB is working!`);
    } else {
      console.log(`❌ TMDB returned ${res.statusCode}:`, data);
    }
  });
});

req.on('timeout', () => {
  console.log('❌ TIMEOUT - TMDB is blocked on your network.');
  console.log('\nSolution: Use a VPN, or set HTTP_PROXY in your .env');
  req.destroy();
});

req.on('error', (e) => {
  console.log('❌ Connection error:', e.message);
  if (e.code === 'ETIMEDOUT' || e.code === 'ECONNREFUSED') {
    console.log('\nYour network is blocking themoviedb.org.');
    console.log('Options:');
    console.log('  1. Use a VPN');
    console.log('  2. Set HTTP_PROXY=http://your-proxy:port in backend/.env');
  }
});
