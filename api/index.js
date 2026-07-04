const https = require('https');

let cachedStreams = null;
let lastCacheTime = 0;
const CACHE_TTL = 60000; // 60 seconds cache as requested by streamfree docs

function fetchJSON(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'streamfree.top',
      path: path,
      method: 'GET',
      headers: {
        'Referer': 'https://streamfree.top',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.setTimeout(15000, () => { req.destroy(); reject(new Error('timeout')); });
    req.end();
  });
}

async function getAllStreams() {
  const now = Date.now();
  if (cachedStreams && (now - lastCacheTime < CACHE_TTL)) {
    return cachedStreams;
  }
  const data = await fetchJSON('/api/v1/streams');
  cachedStreams = data?.streams || [];
  lastCacheTime = Date.now();
  return cachedStreams;
}

function mapStreamToMatch(s) {
  return {
    id: s.stream_key,
    title: s.name,
    category: s.category,
    league: s.league,
    date: (s.match_timestamp || 0) * 1000,
    poster: s.thumbnail_url || undefined,
    popular: true,
    teams: parseTeams(s.name),
    sources: [{ source: s.category, id: s.stream_key }]
  };
}

function parseTeams(name) {
  if (!name) return { home: { name: 'TBD' }, away: { name: 'TBD' } };
  const parts = name.split(/ vs\.? /i);
  return {
    home: { name: parts[0]?.trim() || 'TBD' },
    away: { name: parts[1]?.trim() || 'TBD' }
  };
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const url = req.url || '';

  try {
    // GET /api/sports — list categories
    if (url.includes('/api/sports')) {
      const data = await fetchJSON('/api/v1/categories');
      const categories = (data?.categories || []).map(c => ({
        id: c,
        name: c.charAt(0).toUpperCase() + c.slice(1)
      }));
      return res.status(200).json(categories);
    }

    // GET /api/matches/live/popular or /api/matches/today/popular
    if (url.includes('/api/matches/live/popular') || url.includes('/api/matches/today/popular')) {
      const streams = await getAllStreams();
      const matches = streams.map(s => mapStreamToMatch(s));
      return res.status(200).json(matches);
    }

    // GET /api/matches/:id
    if (url.match(/\/api\/matches\/[^/]+$/)) {
      const matchId = url.split('/api/matches/').pop()?.split('?')[0];
      // Try direct lookup first
      try {
        const stream = await fetchJSON(`/api/v1/streams/${matchId}`);
        if (stream && stream.stream_key) {
          return res.status(200).json(mapStreamToMatch(stream));
        }
      } catch (e) { /* fall through to search all */ }

      // Fallback: search in all streams
      const streams = await getAllStreams();
      const found = streams.find(s => s.stream_key === matchId);
      if (found) {
        return res.status(200).json(mapStreamToMatch(found));
      }
      return res.status(404).json({ error: 'Match not found' });
    }

    // GET /api/streams/:source/:id
    if (url.match(/\/api\/streams\/[^/]+\/[^/]+/)) {
      const parts = url.split('/api/streams/').pop()?.split('/');
      if (parts && parts.length >= 2) {
        const source = parts[0];
        const id = parts[1]?.split('?')[0];
        return res.status(200).json([{
          id: id,
          streamNo: 1,
          language: 'English',
          hd: true,
          embedUrl: `https://streamfree.top/embed/${source}/${id}`,
          source: source
        }]);
      }
    }

    return res.status(404).json({ error: 'Route not found' });
  } catch (e) {
    console.error('API Error:', e);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
