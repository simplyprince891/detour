import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Global Fetch Interceptor to bypass CORS and route matches/streams natively to streamfree.top
const originalFetch = window.fetch;
let cachedStreamsPromise = null;
let lastCacheTime = 0;

async function fetchStreamfreeData() {
  const now = Date.now();
  if (cachedStreamsPromise && (now - lastCacheTime < 30000)) {
    return cachedStreamsPromise;
  }
  lastCacheTime = now;
  cachedStreamsPromise = (async () => {
    try {
      const res = await originalFetch("https://api.allorigins.win/raw?url=https://streamfree.top/streams");
      if (!res.ok) throw new Error("CORS Proxy failed");
      const data = await res.json();
      return data?.streams || {};
    } catch (e) {
      console.error("Failed to fetch streamfree:", e);
      return {};
    }
  })();
  return cachedStreamsPromise;
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

window.fetch = async function (input, init) {
  const url = typeof input === "string" ? input : input.url;

  if (url.includes("/api/sports")) {
    const streams = await fetchStreamfreeData();
    const sports = Object.keys(streams).map(k => ({
      id: k,
      name: k.charAt(0).toUpperCase() + k.slice(1)
    }));
    return new Response(JSON.stringify(sports), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
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
    return new Response(JSON.stringify(filtered), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
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
      return new Response(JSON.stringify(foundMatch), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    } else {
      return new Response(JSON.stringify({ error: "Match not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }
  }

  if (url.includes("/api/streams/")) {
    const parts = url.split("/api/streams/").pop()?.split("/");
    if (parts && parts.length >= 2) {
      const source = parts[0];
      const id = parts[1];
      return new Response(JSON.stringify([{
        id: id,
        streamNo: 1,
        language: "English",
        hd: true,
        embedUrl: `https://streamfree.top/embed/${source}/${id}`,
        source: source
      }]), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }
  }

  return originalFetch(input, init);
};

// Dynamically add the favicon to the head
const link = document.createElement("link");
link.rel = "icon";
link.type = "image/svg+xml";
link.href = "/detour-logo.svg"; // Use the detour logo
document.head.appendChild(link);

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
