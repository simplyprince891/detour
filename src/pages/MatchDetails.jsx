import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Monitor,
  Globe,
  ShieldCheck,
  Zap,
  ArrowLeft,
  Play,
  Info,
} from "lucide-react";
import BASE_URL from "../api";
import detour_bg from "../assets/detour_bg.jpeg";

const MatchDetails = () => {
  const { id } = useParams();
  const [matchDetails, setMatchDetails] = useState(null);
  const [streams, setStreams] = useState([]);
  const [selectedStreamIndex, setSelectedStreamIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedMatches, setRelatedMatches] = useState([]);

  // Premium background blend mimicking pitch floodlights piercing dark stadium concrete
  const backgroundStyle = useMemo(
    () => ({
      backgroundImage: `linear-gradient(to bottom, rgba(9, 9, 11, 0.88), rgba(9, 9, 11, 0.99)), url(${detour_bg})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundAttachment: "fixed",
    }),
    []
  );

  const fetchMatchDetails = useCallback(async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${BASE_URL}/api/matches/${id}`, {
        signal: controller.signal,
      });
      if (!res.ok) throw new Error("Connection failed.");
      const match = await res.json();
      if (!match?.id) {
        setError("Match details are currently unavailable.");
        setLoading(false);
        return;
      }

      setMatchDetails(match);

      if (match.sources?.length > 0) {
        const results = await Promise.all(
          match.sources.map(async (src) => {
            try {
              const streamController = new AbortController();
              const streamTimeoutId = setTimeout(() => streamController.abort(), 8000);
              const r = await fetch(
                `${BASE_URL}/api/streams/${src.source}/${src.id}`,
                { signal: streamController.signal }
              );
              clearTimeout(streamTimeoutId);
              return r.ok ? await r.json() : null;
            } catch {
              return null;
            }
          })
        );
        const valid = results
          .filter((r) => Array.isArray(r))
          .flat()
          .filter((s) => s?.embedUrl);
        setStreams(valid);
        if (valid.length > 0) setSelectedStreamIndex(0);
      }
    } catch (err) {
      if (err.name === "AbortError") {
        setError("Synchronization request timed out.");
      } else {
        setError("Failed to synchronize video feeds.");
      }
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchMatchDetails();
  }, [fetchMatchDetails]);

  useEffect(() => {
    if (!matchDetails) return;
    const fetchRelated = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/matches/live/popular`);
        const data = await res.json();
        const related = data
          .filter(
            (m) =>
              m.category === matchDetails.category && m.id !== matchDetails.id
          )
          .slice(0, 6);
        setRelatedMatches(related);
      } catch (err) {
        console.error(err);
      }
    };
    fetchRelated();
  }, [matchDetails]);

  if (loading)
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-4">
        <Zap className="text-primary animate-pulse" size={32} />
        <p className="font-mono text-[11px] uppercase tracking-widest text-zinc-500">
          Loading Media Player...
        </p>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-4 px-4 text-center">
        <Info className="text-zinc-600" size={32} />
        <p className="font-mono text-xs uppercase tracking-wider text-zinc-400">
          {error}
        </p>
        <p className="text-[11px] text-zinc-500 max-w-xs leading-relaxed">
          If connection errors persist, your mobile carrier might be blocking the stream. Try using a VPN or set your Private DNS to <span className="text-primary font-bold">1.1.1.1</span>.
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => fetchMatchDetails()}
            className="px-5 py-2.5 bg-zinc-800 text-zinc-200 rounded-xl text-[11px] font-mono uppercase tracking-wider hover:bg-zinc-700 hover:text-white transition duration-200"
          >
            Retry
          </button>
          <Link
            to="/matches"
            className="px-5 py-2.5 bg-primary/10 text-primary border border-primary/20 rounded-xl text-[11px] font-mono uppercase tracking-wider hover:bg-primary/20 transition duration-200"
          >
            Return to Matches
          </Link>
        </div>
      </div>
    );

  return (
    <div
      className="relative min-h-screen text-zinc-100 pb-20 selection:bg-primary selection:text-black overflow-x-hidden"
      style={backgroundStyle}
    >
      {/* Stadium Ambient Floodlight Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[350px] bg-gradient-to-b from-primary/5 to-transparent blur-[140px] pointer-events-none z-0" />

      {/* Top Navigation */}
      <nav className="relative p-6 max-w-[1600px] mx-auto px-4 lg:px-8 z-10">
        <Link
          to="/matches"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-100 transition-colors font-mono text-[11px] uppercase tracking-wider"
        >
          <ArrowLeft size={14} /> Back to Matches
        </Link>
      </nav>

      <div className="relative max-w-[1600px] mx-auto px-4 lg:px-8 z-10">
        <div className="flex flex-col xl:flex-row gap-8">
          {/* LEFT: PLAYER & FEED SELECTION */}
          <div className="flex-grow space-y-8">
            {/* The Main Stage (Video Frame) */}
            <div className="relative group">
              {/* Dynamic Aura behind the match screen */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/10 via-zinc-500/5 to-primary/10 blur-xl opacity-50 transition-opacity duration-500 group-hover:opacity-70" />
              <div className="relative aspect-video bg-background rounded-2xl overflow-hidden border border-zinc-800/80/60 shadow-2xl shadow-black/80">
                {streams.length > 0 ? (
                  <iframe
                    src={streams[selectedStreamIndex]?.embedUrl?.replace("embed.st", "streamfree.top")?.replace("streamed.pk", "streamfree.top")}
                    allowFullScreen
                    className="w-full h-full border-0"
                    title="Live Match Stream"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-500 space-y-4 bg-background/90 px-6 text-center">
                    <Info size={36} className="opacity-30 text-zinc-400" />
                    <p className="font-mono text-xs uppercase tracking-widest opacity-60">
                      No Live Streams Available
                    </p>
                    <p className="text-[11px] text-zinc-600 max-w-sm leading-relaxed">
                      If stream servers do not load, your mobile carrier may be blocking the domain. Try using a VPN or set your Private DNS to <span className="text-primary font-bold">1.1.1.1</span>.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Match Information Bar */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 py-6 border-b border-zinc-800/80/60 backdrop-blur-sm px-2">
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white">
                    {matchDetails?.teams?.home?.name}
                  </h3>
                </div>
                <div className="px-3 py-1 rounded-md bg-card/80 border border-zinc-800/80 font-mono text-[10px] text-primary font-bold shadow-inner">
                  VS
                </div>
                <div className="text-left">
                  <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white">
                    {matchDetails?.teams?.away?.name}
                  </h3>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                    Stream Optimization
                  </span>
                  <span className="text-xs font-bold text-primary">
                    Adaptive HD 1080p
                  </span>
                </div>
              </div>
            </div>

            {/* Stream Selection Area */}
            <div className="space-y-4">
              <h4 className="font-mono text-[11px] text-zinc-500 uppercase tracking-widest px-1">
                Select Stream Server
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {streams.map((stream, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedStreamIndex(index)}
                    className={`flex items-center justify-between p-4 rounded-2xl border backdrop-blur-md transition-all duration-200 ${
                      selectedStreamIndex === index
                        ? "bg-zinc-100 text-zinc-950 border-zinc-100 shadow-lg"
                        : "bg-background/40 border-zinc-800/80/80 text-zinc-400 hover:border-zinc-700 hover:text-zinc-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded ${
                          selectedStreamIndex === index
                            ? "bg-background/10"
                            : "bg-background"
                        }`}
                      >
                        <Play
                          size={12}
                          className={
                            selectedStreamIndex === index
                              ? "fill-zinc-950 text-zinc-950"
                              : "text-zinc-400"
                          }
                        />
                      </div>
                      <div className="text-left">
                        <p className="text-[11px] font-bold uppercase tracking-tight">
                          Server #{index + 1}
                        </p>
                        <p className="text-[10px] font-mono opacity-75 uppercase tracking-wide mt-0.5">
                          {stream.language || "English"} •{" "}
                          {stream.source || "CDN"}
                        </p>
                      </div>
                    </div>
                    {stream.hd && (
                      <ShieldCheck
                        size={14}
                        className={
                          selectedStreamIndex === index
                            ? "text-zinc-950"
                            : "text-primary"
                        }
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: SIDEBAR (Related Broadcasts) */}
          <div className="xl:w-[380px] space-y-6 flex-shrink-0">
            <div className="bg-background/40 border border-zinc-800/80/80 rounded-2xl p-6 backdrop-blur-md">
              <h3 className="font-mono text-[11px] text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Monitor size={14} /> Other Live Events
              </h3>

              {relatedMatches.length > 0 ? (
                <div className="space-y-2">
                  {relatedMatches.map((m) => (
                    <Link
                      key={m.id}
                      to={`/matches/${m.id}`}
                      className="flex items-center justify-between p-3 rounded-2xl hover:bg-card/40 border border-transparent hover:border-zinc-800/80/60 transition-all group"
                    >
                      <div className="space-y-1">
                        <p className="text-[11px] font-bold text-zinc-300 uppercase group-hover:text-primary transition-colors">
                          {m.teams?.home?.name}{" "}
                          <span className="text-zinc-600 mx-1 font-normal lowercase">
                            vs
                          </span>{" "}
                          {m.teams?.away?.name}
                        </p>
                        <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">
                          {new Date(m.date).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-wide py-2">
                  No other matches in this category
                </p>
              )}
            </div>

            {/* Edge Performance Card */}
            <div className="p-5 rounded-2xl border border-zinc-800/80/80 bg-background/20 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <Globe size={13} className="text-primary" />
                <span className="text-[10px] font-mono text-zinc-400 uppercase font-bold tracking-wider">
                  Network Performance
                </span>
              </div>
              <p className="text-[10px] text-zinc-500 leading-relaxed font-mono">
                Traffic is automatically balanced across regional CDN edges to
                ensure optimal buffer speeds and low latency playback.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchDetails;
