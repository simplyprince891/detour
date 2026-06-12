import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BLOG_URL, AUTHOR_URL } from "../api";
import {
  Terminal,
  Eye,
  ArrowUpRight,
  Cpu,
  ShieldCheck,
  Zap,
  Layers,
  Fingerprint,
  Activity,
  Plus,
  Globe,
} from "lucide-react";

export default function DetourArchive() {
  const [blogs, setBlogs] = useState([]);
  const [tdds, setTdds] = useState([]);
  const [caseStudies, setCaseStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authorCache, setAuthorCache] = useState({});
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    const fetchArchive = async () => {
      try {
        const res = await fetch(BLOG_URL);
        const data = await res.json();

        const sortByInfluence = (arr) =>
          arr.sort((a, b) => (b.blog?.readers || 0) - (a.blog?.readers || 0));

        // Restore: Author Hydration & Cache Logic
        const formatted = await Promise.all(
          data.map(async (item) => {
            const authorId = item.blog?.author_id;
            let authorData = authorCache[authorId];

            if (!authorData && authorId) {
              try {
                const aRes = await fetch(`${AUTHOR_URL}/public/${authorId}`);
                const aJson = await aRes.json();
                authorData = aJson.author;
                setAuthorCache((prev) => ({ ...prev, [authorId]: authorData }));
              } catch (err) {
                authorData = {
                  name: item.authorName || "Detour",
                  role: "Architect",
                };
              }
            }
            return { ...item, author: authorData };
          })
        );

        setTdds(
          sortByInfluence(formatted.filter((item) => item.blog?.type === "tdd"))
        );
        setCaseStudies(
          sortByInfluence(
            formatted.filter((item) => item.blog?.type === "case study")
          )
        );
        setBlogs(
          sortByInfluence(
            formatted.filter(
              (item) => item.blog?.type === "blog" || !item.blog?.type
            )
          )
        );
      } catch (e) {
        console.error("ARCHIVE_SYNC_FAILURE:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchArchive();
  }, []);

  const handleShowMore = () => setVisibleCount((prev) => prev + 6);

  if (loading)
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center font-mono text-primary">
        <div className="w-48 h-[1px] bg-zinc-800 mb-4 overflow-hidden">
          <div className="w-full h-full bg-primary animate-slide-loading"></div>
        </div>
        <span className="text-[10px] tracking-[0.4em] animate-pulse uppercase">
          Booting_News_Protocol...
        </span>
      </div>
    );

  return (
    <main className="bg-background text-[#aaa] min-h-screen font-sans selection:bg-primary/30">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-background/80 backdrop-blur-2xl sticky top-0 z-[100]">
        <div className="max-w-[1600px] mx-auto px-8 py-5 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center text-white">
              <Terminal size={22} />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-white font-display font-black tracking-tighter text-2xl uppercase italic">
                Detour.
              </h1>
              <p className="text-[8px] font-mono text-highlight uppercase tracking-[0.4em]">
                Node_Active // Detour_HQ
              </p>
            </div>
          </div>
          <nav className="flex items-center gap-10 text-[10px] font-mono uppercase tracking-[0.3em]">
            <a href="#tdd" className="hover:text-white transition">
              01_Logic
            </a>
            <a href="#cs" className="hover:text-white transition">
              02_Impact
            </a>
            <a href="#logs" className="hover:text-white transition">
              03_Archive
            </a>
            <Link
              to="/authors/login"
              className="px-5 py-2.5 bg-primary text-white font-bold rounded-2xl hover:bg-highlight transition-all"
            >
              Portal
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero with Restored System Stats */}
      <section className="max-w-7xl mx-auto px-8 pt-32 pb-40 grid lg:grid-cols-2 gap-20 items-center">
        <div>
          <div className="inline-flex items-center gap-3 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 mb-8">
            <Fingerprint size={12} className="text-primary" />
            <span className="text-[9px] font-mono text-highlight uppercase tracking-widest">
              Architect_Identity_Verified
            </span>
          </div>
          <h2 className="text-6xl md:text-8xl font-display font-black text-white leading-[0.85] tracking-tight mb-10 uppercase">
            High_Output <br />{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-highlight">
              Engineering.
            </span>
          </h2>
          <p className="text-xl text-gray-400 font-light max-w-xl leading-relaxed mb-12">
            The technical ledger of Detour. System blueprints, stream routing analysis, and platform architecture updates.
          </p>
          <div className="flex items-center gap-12 border-l border-zinc-800 pl-8">
            <div>
              <p className="text-[9px] font-mono text-gray-600 uppercase mb-2 italic">
                Architecture
              </p>
              <p className="text-sm text-white font-mono uppercase tracking-tighter">
                Vite // React // Capacitor
              </p>
            </div>
            <div>
              <p className="text-[9px] font-mono text-gray-600 uppercase mb-2 italic">
                Deployment
              </p>
              <p className="text-sm text-white font-mono uppercase tracking-tighter">
                Vercel Edge Nodes
              </p>
            </div>
          </div>
        </div>

        {/* Restored: Hero Interactive Build Card */}
        <div className="hidden lg:block relative">
          <div className="absolute inset-0 bg-primary/10 blur-[120px] rounded-full"></div>
          <div className="relative border border-zinc-800 bg-card p-10 backdrop-blur-sm rounded-2xl shadow-lg">
            <div className="flex justify-between items-center mb-16">
              <Cpu className="text-primary" size={32} />
              <div className="text-right">
                <p className="text-[10px] font-mono text-gray-500 uppercase">
                  System_Build
                </p>
                <p className="text-xs text-white font-mono">v4.2.1_STABLE</p>
              </div>
            </div>
            <div className="space-y-6">
              <div className="h-[1px] w-full bg-zinc-800 overflow-hidden">
                <div className="h-full bg-primary w-full animate-pulse"></div>
              </div>
              <div className="flex justify-between text-[10px] font-mono text-primary uppercase tracking-widest">
                <span>EDGE_ENCRYPTION</span>
                <span className="flex items-center gap-2">
                  <Globe size={10} /> PUBLIC_NODE
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 01: TDD */}
      <section
        id="tdd"
        className="max-w-[1600px] mx-auto px-8 py-24 border-t border-zinc-800"
      >
        <div className="flex items-center gap-4 mb-16">
          <ShieldCheck className="text-primary" size={24} />
          <h3 className="text-white text-xl font-display font-bold tracking-tight italic uppercase">
            01 // News_Vault
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tdds.length > 0 ? (
            tdds.map((item) => (
              <Link
                key={item.blog.id}
                to={`/blogs/${item.blog.id}`}
                className="group p-10 bg-card border border-zinc-800 rounded-2xl hover:border-primary/50 transition-all flex flex-col justify-between aspect-square shadow-md hover:shadow-lg"
              >
                <Zap size={20} className="text-primary mb-6" />
                <h4 className="text-2xl font-display font-bold text-white group-hover:text-highlight transition-colors leading-tight">
                  {item.blog.title}
                </h4>
                <div className="flex justify-between items-center text-[10px] font-mono uppercase text-gray-500">
                  <span>
                    {item.author?.name || item.authorName} //{" "}
                    {item.author?.role || "CONTRIBUTOR"}
                  </span>
                  <ArrowUpRight size={16} />
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-3 py-24 border border-dashed border-zinc-800 rounded-2xl flex flex-col items-center justify-center opacity-30">
              <LockIcon size={30} className="mb-4" />
              <p className="font-mono text-[10px] uppercase tracking-[0.5em]">
                Archive_Empty // No_Articles_Found
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Section 02: Case Studies */}
      <section
        id="cs"
        className="max-w-[1600px] mx-auto px-8 py-24 border-t border-zinc-800"
      >
        <div className="flex items-center gap-4 mb-16">
          <Layers className="text-white" size={24} />
          <h3 className="text-white text-xl font-display font-bold tracking-tight italic uppercase">
            02 // Impact_Analysis
          </h3>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {caseStudies.length > 0 ? (
            caseStudies.map((item) => (
              <Link
                key={item.blog.id}
                to={`/blogs/${item.blog.id}`}
                className="group relative overflow-hidden rounded-[2.5rem] bg-card border border-zinc-800 aspect-[16/9]"
              >
                <img
                  src={item.blog.image_url}
                  className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700"
                  alt="cs"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent p-12 flex flex-col justify-end">
                  <h4 className="text-3xl font-display font-bold text-white mb-6 max-w-md">
                    {item.blog.title}
                  </h4>
                  <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center group-hover:translate-x-2 transition-transform">
                    <ArrowUpRight size={24} />
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-2 py-32 bg-card rounded-2xl border border-zinc-800 flex items-center justify-center font-mono text-[10px] uppercase tracking-widest text-gray-600">
              PENDING_MARKET_REVIEW
            </div>
          )}
        </div>
      </section>

      {/* Section 03: General Archive with Show More */}
      <section
        id="logs"
        className="max-w-[1600px] mx-auto px-8 py-24 border-t border-zinc-800 mb-20"
      >
        <div className="flex items-center gap-4 mb-16">
          <Activity className="text-gray-400" size={24} />
          <h3 className="text-white text-xl font-display font-bold tracking-tight italic uppercase">
            03 // General_Archive
          </h3>
        </div>
        <div className="space-y-4">
          {blogs.slice(0, visibleCount).map((item, index) => (
            <Link
              key={item.blog.id}
              to={`/blogs/${item.blog.id}`}
              className="group flex items-center justify-between p-8 bg-card border border-zinc-800 rounded-2xl hover:bg-card/80 transition-all shadow-md hover:shadow-lg"
            >
              <div className="flex items-center gap-12">
                <span className="text-[10px] font-mono text-gray-750 italic">
                  #{index + 1}
                </span>
                <h4 className="text-xl font-display font-bold text-white">
                  {item.blog.title}
                </h4>
              </div>
              <div className="flex items-center gap-10">
                <div className="hidden md:flex items-center gap-2 text-[10px] font-mono uppercase text-gray-500">
                  <Eye size={12} className="text-primary" />
                  <span>{item.blog.readers}</span>
                </div>
                <ArrowUpRight
                  size={18}
                  className="text-gray-700 group-hover:text-white transition-colors"
                />
              </div>
            </Link>
          ))}
        </div>

        {blogs.length > visibleCount && (
          <div className="mt-20 flex justify-center">
            <button
              onClick={handleShowMore}
              className="group flex items-center gap-6 px-10 py-5 border border-zinc-800 rounded-2xl hover:bg-white hover:text-black transition-all duration-500 text-[10px] font-mono uppercase tracking-[0.4em]"
            >
              <Plus
                size={16}
                className="group-hover:rotate-90 transition-transform duration-500"
              />
              Synchronize_Remaining_News ({blogs.length - visibleCount})
            </button>
          </div>
        )}
      </section>

      <footer className="max-w-[1600px] mx-auto px-8 py-20 border-t border-zinc-800 flex flex-col md:flex-row justify-between items-center text-[9px] font-mono uppercase tracking-[0.4em] text-gray-650">
        <p>© 2026 Detour. Built by Abdur.</p>
        <p>System_Status: 100%_OPERATIONAL</p>
      </footer>
    </main>
  );
}

// Minimalist Lock Icon helper for empty states
const LockIcon = ({ size, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);
