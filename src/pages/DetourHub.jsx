import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Database,
  Shield,
  Zap,
  Code,
} from "lucide-react";

const Principle = ({ icon: Icon, title, body }) => (
  <div className="p-6 border border-zinc-800/80 bg-card rounded-2xl hover:border-primary/30 transition-all shadow-[0_0_12px_rgba(30,144,255,0.05)] hover:shadow-[0_0_20px_rgba(30,144,255,0.15)]">
    <Icon className="text-primary mb-4" size={20} />
    <h3 className="font-display text-xs uppercase tracking-widest text-zinc-100 mb-2 font-bold">
      {title}
    </h3>
    <p className="text-[11px] text-zinc-400 uppercase leading-relaxed font-sans">
      {body}
    </p>
  </div>
);

export default function DetourHub() {
  return (
    <div className="min-h-screen bg-background text-white p-6 md:p-12">
      {/* --- NAV --- */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest text-zinc-500 hover:text-primary mb-12 font-mono"
      >
        <ArrowLeft size={12} /> Back to Hub
      </Link>

      <div className="max-w-4xl mx-auto">
        {/* --- HEADER --- */}
        <div className="mb-20">
          <h1 className="text-4xl sm:text-5xl font-display font-black uppercase tracking-tight mb-4">
            Detour <span className="text-primary">Lab</span>
          </h1>
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-highlight">
            System Status: Active // v1.0.0
          </p>
        </div>

        {/* --- CORE PRINCIPLES --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-20">
          <Principle
            icon={Database}
            title="Radical Streaming"
            body="Zero paywalls. Zero subscriptions. Sports discovery built to serve the fans."
          />
          <Principle
            icon={Code}
            title="Engineering Excellence"
            body="Clean layout, fast media indexing, and modern high-fidelity components."
          />
          <Principle
            icon={Shield}
            title="Privacy Guard"
            body="No invasive tracking. No intrusive ads. Just the pure event links."
          />
          <Principle
            icon={Zap}
            title="Live Feed"
            body="A community curated directory that updates with the latest streams."
          />
        </div>

        {/* --- CREDITS --- */}
        <div className="border-t border-zinc-800/80 pt-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-widest mb-1 text-zinc-400">
              Detour Project
            </h4>
            <p className="text-[10px] text-zinc-600 uppercase tracking-widest font-mono">
              Open Source Sports Discovery
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
