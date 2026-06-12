import React, { useEffect, useState, useCallback } from "react";
import { Search, Globe, Calendar, User, ArrowUpRight, Radio } from "lucide-react";

const FEEDS = [
  { id: "all", name: "All Sports", url: "https://www.espn.com/espn/rss/news" },
  { id: "football", name: "Football / Soccer", url: "https://www.skysports.com/rss/12040" },
  { id: "nba", name: "Basketball / NBA", url: "https://www.espn.com/espn/rss/nba/news" }
];

export default function NewsLanding() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFeed, setActiveFeed] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchNews = useCallback(async () => {
    setLoading(true);
    try {
      const feed = FEEDS.find(f => f.id === activeFeed) || FEEDS[0];
      const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed.url)}`);
      if (!res.ok) throw new Error("Network response was not ok");
      const data = await res.json();
      
      if (data.status === "ok" && Array.isArray(data.items)) {
        setArticles(data.items);
      } else {
        setArticles([]);
      }
    } catch (e) {
      console.error("Failed to fetch sports news:", e);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }, [activeFeed]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const filteredArticles = articles.filter(item => 
    item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Fallback image based on feed type if thumbnail is not provided
  const getFallbackImage = (item) => {
    if (item.thumbnail) return item.thumbnail;
    if (item.enclosure?.link) return item.enclosure.link;
    
    // Nice generic sports stock images
    if (activeFeed === "football") {
      return "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=500&auto=format&fit=crop&q=60";
    }
    if (activeFeed === "nba") {
      return "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=500&auto=format&fit=crop&q=60";
    }
    return "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500&auto=format&fit=crop&q=60";
  };

  return (
    <main className="min-h-screen bg-background text-zinc-100 font-sans pb-20 selection:bg-primary/30">
      {/* --- CONTROL BAR --- */}
      <div className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-zinc-800/80 p-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 items-center justify-between">
          
          {/* Feed Selection Tabs */}
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1">
            {FEEDS.map(feed => (
              <button
                key={feed.id}
                onClick={() => setActiveFeed(feed.id)}
                className={`px-5 py-2.5 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                  activeFeed === feed.id
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "bg-card hover:bg-zinc-800 text-zinc-400"
                }`}
              >
                {feed.name}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="SEARCH ARTICLES..."
              className="w-full bg-card border border-zinc-800/80 rounded-2xl pl-10 pr-4 py-2.5 text-[10px] font-mono tracking-widest focus:border-primary outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search size={14} className="absolute left-4 top-3.5 text-zinc-500" />
          </div>
        </div>
      </div>

      {/* --- HERO BRAND HEADER --- */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-8 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-[10px] font-mono uppercase tracking-[0.2em]">
          <Radio size={10} className="animate-pulse" /> Live News Feed // Free Access
        </div>
        <h1 className="text-4xl sm:text-6xl font-display font-black tracking-tight uppercase leading-none text-white">
          Sports <span className="text-primary bg-clip-text">Wire</span>
        </h1>
        <p className="text-zinc-400 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
          Real-time reports, transfer updates, and match analysis from top global sports outlets.
        </p>
      </section>

      {/* --- ARTICLES GRID --- */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            <p className="font-mono text-xs uppercase tracking-widest text-zinc-500">
              Synchronizing Live Feeds...
            </p>
          </div>
        ) : filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((item, index) => (
              <a
                key={index}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-800/80 bg-card p-5 transition-all duration-300 backdrop-blur-md shadow-[0_0_12px_rgba(30,144,255,0.03)] hover:border-primary/40 hover:shadow-[0_0_20px_rgba(30,144,255,0.1)]"
              >
                <div>
                  {/* Article Thumbnail */}
                  <div className="relative aspect-video rounded-xl overflow-hidden mb-4 border border-zinc-800/60 bg-zinc-950">
                    <img
                      src={getFallbackImage(item)}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase tracking-wider text-primary border border-primary/20">
                      {item.author || (activeFeed === "football" ? "Sky Sports" : "ESPN")}
                    </div>
                  </div>

                  {/* Article Title */}
                  <h3 className="text-base font-display font-black text-white leading-tight uppercase group-hover:text-primary transition-colors line-clamp-2 mb-2">
                    {item.title}
                  </h3>

                  {/* Article Summary */}
                  <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3 mb-6 font-sans">
                    {item.description ? item.description.replace(/<[^>]*>/g, '') : "No summary available."}
                  </p>
                </div>

                {/* Footer Metadata */}
                <div className="flex items-center justify-between pt-4 border-t border-zinc-800/60 text-[9px] font-mono uppercase text-zinc-500">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={11} />
                    {new Date(item.pubDate).toLocaleDateString([], {
                      month: "short",
                      day: "numeric",
                      year: "numeric"
                    })}
                  </span>
                  <span className="flex items-center gap-1 group-hover:text-white transition-colors">
                    Read Story <ArrowUpRight size={12} />
                  </span>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center font-mono text-xs text-zinc-500 uppercase border border-dashed border-zinc-800/80 rounded-2xl">
            No live sports news matches your query.
          </div>
        )}
      </div>
    </main>
  );
}
