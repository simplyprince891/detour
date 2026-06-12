import React from "react";
import { Outlet, NavLink, Link } from "react-router-dom";
import { Home, Trophy, Film, MessageSquare, BookOpen } from "lucide-react";

const Layout = () => {
  const navItems = [
    { path: "/", icon: <Home size={20} />, label: "Hub" },
    { path: "/matches", icon: <Trophy size={20} />, label: "Live Now" },
    { path: "/movies", icon: <Film size={20} />, label: "Highlights" },
    { path: "/blogs", icon: <BookOpen size={20} />, label: "News" },
    { path: "/about", icon: <MessageSquare size={20} />, label: "Detour Lab" },
  ];

  return (
    <div className="min-h-screen bg-background text-white font-sans selection:bg-primary selection:text-black">
      {/* 1. Premium Expanding Desktop Sidebar */}
      <aside className="fixed left-0 top-0 hidden h-full w-20 hover:w-52 flex-col items-start px-4 border-r border-zinc-800/80 bg-background py-8 md:flex z-50 transition-all duration-300 ease-in-out group/sidebar shadow-2xl">
        {/* Dynamic Brand Lockup */}
        <Link
          to="/"
          className="mb-12 w-full flex items-center justify-center group-hover/sidebar:justify-start transition-all duration-300 flex-shrink-0 gap-2"
        >
          <img src="/detour-logo.svg" className="h-11 w-11 flex-shrink-0 transition-all group-hover:scale-105" alt="Detour" />
          <span className="opacity-0 max-w-0 overflow-hidden whitespace-nowrap font-display font-black tracking-tight text-white uppercase text-sm transition-all duration-300 ease-in-out group-hover/sidebar:opacity-100 group-hover/sidebar:max-w-xs">
            DETOUR
          </span>
        </Link>

        {/* Dynamic Navigation Options */}
        <nav className="flex flex-col gap-4 w-full">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `p-3 rounded-2xl transition-all duration-200 border flex items-center w-full min-w-0 ${
                  isActive
                    ? "text-primary border-primary/20 bg-primary/5 shadow-inner font-bold"
                    : "text-zinc-500 border-transparent hover:text-highlight hover:bg-white/5"
                }`
              }
            >
              <div className="flex h-5 w-5 items-center justify-center flex-shrink-0 mx-auto group-hover/sidebar:mx-0 transition-all duration-300">
                {item.icon}
              </div>
              <span className="opacity-0 max-w-0 overflow-hidden whitespace-nowrap font-display text-[11px] uppercase tracking-widest transition-all duration-300 ease-in-out group-hover/sidebar:opacity-100 group-hover/sidebar:max-w-xs group-hover/sidebar:ml-3">
                {item.label}
              </span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* 2. Main Site Stage */}
      <div className="relative flex flex-col min-h-screen md:pl-20">
        {/* Persistent Responsive App Header */}
        <header className="flex h-16 items-center justify-between px-4 sm:px-6 border-b border-zinc-800/80 bg-background/80 backdrop-blur-md sticky top-0 z-40 gap-2">
          <Link
            to="/"
            className="flex items-center gap-2 min-w-0 group flex-shrink-0"
          >
            <img src="/detour-logo.svg" className="h-9 w-9 transition-all group-hover:scale-105" alt="Detour" />
            <span className="text-lg sm:text-2xl font-display font-black tracking-tight text-white uppercase whitespace-nowrap">
              DETOUR
            </span>
          </Link>

          {/* Right Status Panel */}
          <div className="flex items-center gap-3 flex-shrink-0 font-mono text-[10px] text-zinc-500 uppercase tracking-wider">
            <span className="text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20 hidden xs:inline-block">
              online
            </span>
            <div className="h-8 w-8 rounded-2xl border border-zinc-800/80 bg-card flex items-center justify-center text-zinc-200 font-bold uppercase shadow-sm">
              V3
            </div>
          </div>
        </header>

        {/* Dynamic Inner Component Workspace */}
        <main className="flex-grow p-4 md:p-8 pb-24 md:pb-8 bg-background">
          <Outlet />
        </main>

        {/* Clean Footer Disclaimer */}
        <footer className="px-6 py-6 border-t border-zinc-800/80 bg-[#060A14]">
          <div className="max-w-4xl text-zinc-500 hover:text-zinc-400 transition-colors duration-200">
            <p className="font-mono text-[10px] leading-relaxed uppercase tracking-wider">
              [note]: this platform does not store or host any media files
              locally. all content is indexed via public networks. &copy;{" "}
              {new Date().getFullYear()} Detour. Built by Abdur.
            </p>
          </div>
        </footer>
      </div>

      {/* 3. Mobile Navigation Dock */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 w-full items-center justify-around border-t border-zinc-800/80 bg-background/95 backdrop-blur-md md:hidden px-2 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-14 h-12 rounded-2xl transition-all duration-200 ${
                isActive
                  ? "text-primary font-bold"
                  : "text-zinc-500 hover:text-highlight"
              }`
            }
          >
            {item.icon}
            <span className="text-[9px] font-mono mt-0.5 tracking-tight uppercase">
              {item.label}
            </span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Layout;
