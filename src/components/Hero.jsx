import React from "react";
import { Link } from "react-router-dom";
import {
  Zap,
  Download,
  Play,
  Film,
  Newspaper,
  Heart,
  ArrowUpRight,
} from "lucide-react";

export default function Hero() {
  const primaryBento = [
    {
      to: "/matches",
      title: "Live Sports Arena",
      description:
        "Watch live football, basketball, and global matches. Fast streams, updated in real time so you never miss a goal.",
      icon: <Play className="text-primary fill-primary/10" size={22} />,
      tag: "Live Now",
      badgeClass: "border-primary/20 bg-primary/5 text-primary",
      hoverColor:
        "hover:border-primary/40 hover:shadow-[0_0_30px_rgba(30,144,255,0.1)]",
    },
    {
      to: "/movies",
      title: "Highlights Lounge",
      description:
        "A clean collection of free sports highlights and replays. High-quality streaming with zero ads and zero tracking.",
      icon: <Film className="text-highlight fill-highlight/10" size={22} />,
      tag: "HD Stream",
      badgeClass: "border-highlight/20 bg-highlight/5 text-highlight",
      hoverColor:
        "hover:border-highlight/40 hover:shadow-[0_0_30px_rgba(0,212,255,0.1)]",
    },
  ];

  const secondaryBento = [
    {
      to: "/blogs",
      title: "Latest News",
      description:
        "Read helpful guides, development updates, and sports analysis from the team.",
      icon: (
        <Newspaper
          className="text-zinc-400 group-hover:text-primary transition-colors"
          size={18}
        />
      ),
      tag: "News",
    },
    {
      to: "/about",
      title: "Detour Lab",
      description:
        "Why we built this platform, our simple code philosophy, and how it all works.",
      icon: (
        <Heart
          className="text-zinc-400 group-hover:text-primary transition-colors"
          size={18}
        />
      ),
      tag: "About Us",
    },
  ];

  return (
    <section className="relative w-full py-12 md:py-16 px-4 sm:px-6 lg:px-8 overflow-hidden text-zinc-100 bg-background">
      {/* Soft Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] bg-gradient-to-b from-primary/[0.05] via-transparent to-transparent blur-[120px] rounded-full pointer-events-none z-0" />

      <div className="max-w-6xl w-full mx-auto space-y-12 md:space-y-14 relative z-10">
        {/* Main Branding Header */}
        <div className="text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-[10px] font-mono uppercase tracking-[0.2em] shadow-inner">
            <Zap size={10} className="animate-pulse" /> Detour Active // Online
          </div>

          {/* Overhauled Title: Scaled perfectly for mobile & consistent with layout */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-black tracking-tight uppercase max-w-4xl mx-auto leading-tight">
            Your <span className="text-primary bg-clip-text">Detour</span> to Live Sport.
          </h1>

          <p className="text-zinc-400 max-w-xl mx-auto text-sm sm:text-base font-sans leading-relaxed">
            Stream football, basketball, and more — no delays, no distractions.
          </p>
        </div>

        {/* Navigation Grid */}
        <div className="space-y-4">
          {/* Main Cards: Sports and Movies side-by-side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {primaryBento.map((item, index) => (
              <Link
                key={index}
                to={item.to}
                className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-800/80/80 bg-card p-6 sm:p-8 md:p-10 transition-all duration-300 backdrop-blur-md shadow-[0_0_12px_rgba(30,144,255,0.05)] ${item.hoverColor}`}
              >
                <div className="flex justify-between items-start mb-12 sm:mb-16">
                  <div className="p-3 bg-card/80 border border-zinc-800/80 rounded-2xl group-hover:bg-zinc-800 transition-colors duration-300 shadow-md">
                    {item.icon}
                  </div>
                  <span
                    className={`text-[9px] font-mono border px-2 py-0.5 rounded uppercase tracking-wider font-bold shadow-inner ${item.badgeClass}`}
                  >
                    {item.tag}
                  </span>
                </div>

                <div className="space-y-3">
                  <h2 className="text-xl sm:text-2xl font-display font-black text-white tracking-tight uppercase flex items-center gap-2">
                    {item.title}
                    <ArrowUpRight
                      size={16}
                      className="opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-300 text-primary"
                    />
                  </h2>
                  <p className="text-xs text-zinc-400 leading-relaxed max-w-md">
                    {item.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* Secondary Cards: Blogs and About Us */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {secondaryBento.map((item, index) => (
              <Link
                key={index}
                to={item.to}
                className="group flex items-center justify-between p-5 rounded-2xl border border-zinc-800/80/80 bg-card/60 hover:bg-card hover:border-zinc-700 transition-all duration-300 backdrop-blur-sm shadow-[0_0_12px_rgba(30,144,255,0.02)]"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="p-2 bg-card/40 border border-zinc-800/80 rounded-2xl group-hover:border-zinc-700 transition-colors flex-shrink-0">
                    {item.icon}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs font-bold text-zinc-355 group-hover:text-white transition-colors uppercase tracking-wide">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-zinc-500 line-clamp-1 mt-0.5 max-w-sm">
                      {item.description}
                    </p>
                  </div>
                </div>
                <span className="text-[9px] font-mono border border-zinc-800/80 px-2 py-0.5 rounded text-zinc-400 uppercase tracking-wider bg-background/40 flex-shrink-0 ml-2">
                  {item.tag}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4 border-t border-zinc-800/80/40">
          <Link
            to="/matches"
            className="w-full sm:w-auto px-10 py-3.5 rounded-2xl bg-primary text-white font-display font-bold text-sm uppercase tracking-wider hover:bg-highlight transition-all duration-200 active:scale-95 text-center shadow-lg shadow-primary/20"
          >
            Watch Now
          </Link>

          <a
            href="https://razorsports-backend.vercel.app/detour.apk"
            className="group flex items-center justify-center gap-2.5 font-mono text-[10px] text-zinc-500 hover:text-zinc-300 transition-colors uppercase tracking-widest w-full sm:w-auto"
          >
            <Download
              size={13}
              className="group-hover:animate-bounce text-primary"
            />
            Download Android App
          </a>
        </div>
      </div>
    </section>
  );
}
