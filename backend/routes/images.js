const express = require('express');
const router = express.Router();
const https = require('https');

// Seed map: maps our fake "paths" like /galaxy1-poster.jpg to picsum seeds
const SEED_MAP = {
  // Movies - posters (2:3 ratio)
  'galaxy1-poster': { seed: 'galaxy', w: 300, h: 450 },
  'heist1-poster': { seed: 'city', w: 300, h: 450 },
  'kingdom1-poster': { seed: 'castle', w: 300, h: 450 },
  'neon1-poster': { seed: 'neon', w: 300, h: 450 },
  'ocean1-poster': { seed: 'ocean', w: 300, h: 450 },
  'crimson1-poster': { seed: 'dark', w: 300, h: 450 },
  'phoenix1-poster': { seed: 'fire', w: 300, h: 450 },
  'silent1-poster': { seed: 'silence', w: 300, h: 450 },
  'grand1-poster': { seed: 'theater', w: 300, h: 450 },
  'iron1-poster': { seed: 'iron', w: 300, h: 450 },
  'whisper1-poster': { seed: 'forest', w: 300, h: 450 },
  'quantum1-poster': { seed: 'quantum', w: 300, h: 450 },
  'burning1-poster': { seed: 'fire2', w: 300, h: 450 },
  'stardust1-poster': { seed: 'stars', w: 300, h: 450 },
  'war1-poster': { seed: 'war', w: 300, h: 450 },
  'love1-poster': { seed: 'rain', w: 300, h: 450 },
  'dark1-poster': { seed: 'shadow', w: 300, h: 450 },
  'samurai1-poster': { seed: 'japan', w: 300, h: 450 },
  'velocity1-poster': { seed: 'speed', w: 300, h: 450 },
  'arctic1-poster': { seed: 'snow', w: 300, h: 450 },
  'algo1-poster': { seed: 'tech', w: 300, h: 450 },
  'ember1-poster': { seed: 'autumn', w: 300, h: 450 },
  'titan1-poster': { seed: 'giant', w: 300, h: 450 },
  'glass1-poster': { seed: 'mirror', w: 300, h: 450 },
  'desert1-poster': { seed: 'desert', w: 300, h: 450 },
  'northern1-poster': { seed: 'aurora', w: 300, h: 450 },
  'phantom1-poster': { seed: 'drone', w: 300, h: 450 },
  'inherit1-poster': { seed: 'mansion', w: 300, h: 450 },
  'supernova1-poster': { seed: 'space2', w: 300, h: 450 },
  'wolves1-poster': { seed: 'wolf', w: 300, h: 450 },
  'valley1-poster': { seed: 'valley', w: 300, h: 450 },
  'zero1-poster': { seed: 'clock', w: 300, h: 450 },
  'painter1-poster': { seed: 'art', w: 300, h: 450 },
  'frost1-poster': { seed: 'ice', w: 300, h: 450 },
  'blue1-poster': { seed: 'deep', w: 300, h: 450 },
  // TV - posters
  'tv1-poster': { seed: 'empire', w: 300, h: 450 },
  'tv2-poster': { seed: 'squad', w: 300, h: 450 },
  'tv3-poster': { seed: 'hospital', w: 300, h: 450 },
  'tv4-poster': { seed: 'cyber', w: 300, h: 450 },
  'tv5-poster': { seed: 'family', w: 300, h: 450 },
  'tv6-poster': { seed: 'crown', w: 300, h: 450 },
  'tv7-poster': { seed: 'underwater', w: 300, h: 450 },
  'tv8-poster': { seed: 'road', w: 300, h: 450 },
  'tv9-poster': { seed: 'academy', w: 300, h: 450 },
  'tv10-poster': { seed: 'cartel', w: 300, h: 450 },
  'tv11-poster': { seed: 'office', w: 300, h: 450 },
  'tv12-poster': { seed: 'building', w: 300, h: 450 },
  'tv13-poster': { seed: 'robot', w: 300, h: 450 },
  'tv14-poster': { seed: 'kitchen', w: 300, h: 450 },
  'tv15-poster': { seed: 'oracle', w: 300, h: 450 },
};

// Get image dimensions from path type
const getDimensions = (filename) => {
  if (filename.includes('backdrop')) return { w: 1280, h: 720 };
  if (filename.includes('profile')) return { w: 185, h: 278 };
  return { w: 300, h: 450 }; // poster default
};

// Serve images by proxying picsum.photos with consistent seeds
router.get('/:size/*', (req, res) => {
  const size = req.params.size; // e.g. w500, w300, w1280, original
  const filePath = req.params[0]; // e.g. galaxy1-poster.jpg

  const filename = filePath.replace('.jpg', '').replace('.png', '');
  const mapped = SEED_MAP[filename];
  const dims = getDimensions(filename);

  // Use the mapped seed or generate one from the filename
  const seed = mapped ? mapped.seed : filename.replace(/[^a-z0-9]/gi, '');
  const w = dims.w;
  const h = dims.h;

  const picsumUrl = `https://picsum.photos/seed/${seed}/${w}/${h}`;

  https.get(picsumUrl, { timeout: 8000 }, (picsumRes) => {
    // Follow redirects (picsum redirects to unsplash CDN)
    if (picsumRes.statusCode === 301 || picsumRes.statusCode === 302) {
      const redirectUrl = picsumRes.headers.location;
      https.get(redirectUrl, { timeout: 8000 }, (imgRes) => {
        res.set('Content-Type', 'image/jpeg');
        res.set('Cache-Control', 'public, max-age=86400');
        imgRes.pipe(res);
      }).on('error', () => res.redirect(`https://placehold.co/${w}x${h}/1a2235/e63946?text=${encodeURIComponent(seed)}`));
      return;
    }
    res.set('Content-Type', 'image/jpeg');
    res.set('Cache-Control', 'public, max-age=86400');
    picsumRes.pipe(res);
  }).on('error', () => {
    res.redirect(`https://placehold.co/${w}x${h}/1a2235/e63946?text=Image`);
  });
});

module.exports = router;
