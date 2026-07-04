const https = require('https');

let cachedStreams = null;
let lastCacheTime = 0;

function fetchStreamfreeData() {
  return new Promise((resolve, reject) => {
    const now = Date.now();
    if (cachedStreams && (now - lastCacheTime < 30000)) {
      return resolve(cachedStreams);
    }
    
    const options = {
      hostname: 'streamfree.top',
      path: '/streams',
      method: 'GET',
      headers: {
        'Referer': 'https://streamfree.top',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          cachedStreams = json?.streams || {};
          lastCacheTime = Date.now();
          resolve(cachedStreams);
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', (e) => { reject(e); });
    req.end();
  });
}

function mapStreamToMatch(s, category) {
  const id = s.stream_key || s.id;
  return {
    id: id,
    title: s.name,
    category: category,
    date: (s.match_timestamp || 0) * 1000,
    poster: s.thumbnail_url ? (s.thumbnail_url.startsWith('http') ? s.thumbnail_url : `https://streamfree.top${s.thumbnail_url}`) : undefined,
    popular: (s.viewers || 0) >= 100,
    teams: {
      home: {
        name: s.team1?.name,
        badge: s.team1?.logo
      },
      away: {
        name: s.team2?.name,
        badge: s.team2?.logo
      }
    },
    sources: [{ source: category, id: id }]
  };
}

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Parse path and query
  const url = req.url || '';

  try {
    if (url.includes("/api/sports")) {
      const streams = await fetchStreamfreeData();
      const sports = Object.keys(streams).map(k => ({
        id: k,
        name: k.charAt(0).toUpperCase() + k.slice(1)
      }));
      res.status(200).json(sports);
      return;
    }

    if (url.includes("/api/matches/live/popular") || url.includes("/api/matches/today/popular")) {
      const streams = await fetchStreamfreeData();
      const matches = [];
      Object.entries(streams).forEach(([cat, list]) => {
        if (Array.isArray(list)) {
          list.forEach(s => {
            matches.push(mapStreamToMatch(s, cat));
          });
        }
      });
      const filtered = url.includes("/live/popular") ? matches.filter(m => m.popular) : matches;
      res.status(200).json(filtered);
      return;
    }

    if (url.includes("/api/matches/")) {
      const matchId = url.split("/api/matches/").pop()?.split("?")[0];
      const streams = await fetchStreamfreeData();
      let foundMatch = null;
      for (const [cat, list] of Object.entries(streams)) {
        if (Array.isArray(list)) {
          const found = list.find(s => (s.stream_key || s.id) === matchId);
          if (found) {
            foundMatch = mapStreamToMatch(found, cat);
            break;
          }
        }
      }
      if (foundMatch) {
        res.status(200).json(foundMatch);
      } else {
        res.status(404).json({ error: "Match not found" });
      }
      return;
    }

    if (url.includes("/api/streams/")) {
      const parts = url.split("/api/streams/").pop()?.split("/");
      if (parts && parts.length >= 2) {
        const source = parts[0];
        const id = parts[1];
        res.status(200).json([{
          id: id,
          streamNo: 1,
          language: "English",
          hd: true,
          embedUrl: `https://streamfree.top/embed/${source}/${id}`,
          source: source
        }]);
        return;
      }
    }

    res.status(404).json({ error: "Route not found" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
