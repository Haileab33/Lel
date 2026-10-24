import { useState, useEffect, useRef } from "react";
import { content } from "@/lib/content";
import { Sparkles, Heart, RefreshCw, Copy, Check, Star, BookmarkCheck, BookOpen, X } from "lucide-react";

interface LoveReason {
  id: number;
  type: string;
  text: string;
}

export function LoveJar() {
  const reasons: LoveReason[] = content.loveJar.reasons;

  const [currentReason, setCurrentReason] = useState<LoveReason | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);
  const [unlockedIds, setUnlockedIds] = useState<number[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [copied, setCopied] = useState(false);
  const [showAllModal, setShowAllModal] = useState(false);

  // Load unlocked and favorites from localStorage
  useEffect(() => {
    try {
      const savedUnlocked = localStorage.getItem("love-jar-unlocked-v1");
      if (savedUnlocked) {
        setUnlockedIds(JSON.parse(savedUnlocked));
      }
      const savedFavs = localStorage.getItem("love-jar-favorites-v1");
      if (savedFavs) {
        setFavorites(JSON.parse(savedFavs));
      }
    } catch {
      // Fallback
    }
  }, []);

  const drawReason = () => {
    if (isShaking || isRevealing) return;

    setIsShaking(true);
    setTimeout(() => {
      setIsShaking(false);
      setIsRevealing(true);

      // Choose a random reason (prefer unseen if possible)
      const unseen = reasons.filter((r) => !unlockedIds.includes(r.id));
      const pool = unseen.length > 0 ? unseen : reasons;
      const picked = pool[Math.floor(Math.random() * pool.length)];

      setCurrentReason(picked);

      // Update unlocked list
      if (!unlockedIds.includes(picked.id)) {
        const nextUnlocked = [...unlockedIds, picked.id];
        setUnlockedIds(nextUnlocked);
        localStorage.setItem("love-jar-unlocked-v1", JSON.stringify(nextUnlocked));
      }

      setTimeout(() => {
        setIsRevealing(false);
      }, 500);
    }, 600);
  };

  const toggleFavorite = (id: number) => {
    let nextFavs: number[];
    if (favorites.includes(id)) {
      nextFavs = favorites.filter((favId) => favId !== id);
    } else {
      nextFavs = [...favorites, id];
    }
    setFavorites(nextFavs);
    localStorage.setItem("love-jar-favorites-v1", JSON.stringify(nextFavs));
  };

  const copyText = (text: string) => {
    navigator.clipboard.writeText(`"${text}" — for Lel, always ❤️`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isFavorite = currentReason ? favorites.includes(currentReason.id) : false;

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "funny":
        return { label: "Silly & Playful 🤭", color: "bg-amber-100 text-amber-800 border-amber-200" };
      case "romantic":
        return { label: "Deep From My Heart 💍", color: "bg-rose-100 text-rose-800 border-rose-200" };
      case "sweet":
      default:
        return { label: "Sweet Little Things 🌸", color: "bg-pink-100 text-pink-800 border-pink-200" };
    }
  };

  return (
    <div className="space-y-8 sm:space-y-12">
      <div className="mx-auto max-w-4xl text-center">
        {/* Progress tracker */}
        <div className="mx-auto mb-6 flex max-w-xs items-center justify-between rounded-full bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary sm:mb-8 sm:max-w-sm sm:text-sm">
          <span className="flex items-center gap-1.5">
            <Sparkles className="h-4 w-4" />
            <span>Unlocked</span>
          </span>
          <span className="font-bold">
            {unlockedIds.length} of {reasons.length} Reasons
          </span>
        </div>

        {/* The Virtual Jar Showcase */}
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-12">
          {/* Glass Jar Graphic & Button */}
          <div className="flex flex-col items-center">
            <div
              onClick={drawReason}
              className={`group relative cursor-pointer select-none transition-transform duration-300 ${
                isShaking ? "animate-bounce" : "hover:scale-105 active:scale-95"
              }`}
            >
              {/* Floating decorative sparkles around jar */}
              <div className="pointer-events-none absolute -inset-6 animate-pulse opacity-70">
                <span className="absolute top-2 left-4 text-xl">✨</span>
                <span className="absolute top-10 right-2 text-base">💖</span>
                <span className="absolute bottom-4 left-6 text-sm">🌸</span>
                <span className="absolute bottom-6 right-8 text-lg">✨</span>
              </div>

              {/* Handcrafted Glass Jar SVG */}
              <svg viewBox="0 0 160 210" className="h-56 w-44 drop-shadow-xl sm:h-64 sm:w-52">
                <defs>
                  {/* Glass gradient */}
                  <linearGradient id="jarGlass" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="rgba(255, 255, 255, 0.75)" />
                    <stop offset="35%" stopColor="rgba(253, 232, 238, 0.45)" />
                    <stop offset="70%" stopColor="rgba(255, 255, 255, 0.25)" />
                    <stop offset="100%" stopColor="rgba(244, 219, 226, 0.6)" />
                  </linearGradient>

                  {/* Cork stopper gradient */}
                  <linearGradient id="corkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#C89666" />
                    <stop offset="50%" stopColor="#E2B488" />
                    <stop offset="100%" stopColor="#AF7E50" />
                  </linearGradient>

                  {/* Ribbon gradient */}
                  <linearGradient id="ribbonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#D9777F" />
                    <stop offset="100%" stopColor="#BE123C" />
                  </linearGradient>
                </defs>

                {/* Cork Stopper Top */}
                <path d="M48 24 L112 24 L106 40 L54 40 Z" fill="url(#corkGrad)" stroke="#8C5832" strokeWidth="1.5" />
                <ellipse cx="80" cy="24" rx="32" ry="6" fill="#D9A574" stroke="#8C5832" strokeWidth="1.5" />

                {/* Jar Lip / Neck */}
                <rect x="50" y="40" width="60" height="12" rx="4" fill="rgba(255, 255, 255, 0.85)" stroke="#D4A5A5" strokeWidth="1.5" />

                {/* Jar Body */}
                <path
                  d="M50 52 C30 54, 22 75, 22 100 L22 180 C22 198, 38 204, 80 204 C122 204, 138 198, 138 180 L138 100 C138 75, 130 54, 110 52 Z"
                  fill="url(#jarGlass)"
                  stroke="#E8B4B8"
                  strokeWidth="2"
                />

                {/* Highlights on Glass */}
                <path
                  d="M32 90 L32 175 C32 188, 42 194, 60 196"
                  stroke="rgba(255, 255, 255, 0.85)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M128 95 L128 150"
                  stroke="rgba(255, 255, 255, 0.5)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="none"
                />

                {/* Colorful Floating Origami Notes inside Jar */}
                <g className="transition-transform duration-500">
                  {/* Folded paper slip 1 */}
                  <path d="M42 145 L62 135 L68 155 L48 165 Z" fill="#F472B6" opacity="0.85" />
                  {/* Folded paper slip 2 */}
                  <path d="M85 150 L108 140 L115 160 L92 170 Z" fill="#FB7185" opacity="0.9" />
                  {/* Folded paper slip 3 */}
                  <path d="M60 170 L82 165 L80 185 L58 190 Z" fill="#FBBF24" opacity="0.85" />
                  {/* Folded paper slip 4 */}
                  <path d="M50 115 L70 110 L75 130 L55 135 Z" fill="#A78BFA" opacity="0.8" />
                  {/* Folded paper slip 5 */}
                  <path d="M88 120 L112 115 L118 135 L94 140 Z" fill="#FDA4AF" opacity="0.9" />
                  {/* Paper heart in middle */}
                  <path
                    d="M80 135 C80 128, 70 124, 66 130 C62 136, 68 145, 80 155 C92 145, 98 136, 94 130 C90 124, 80 128, 80 135 Z"
                    fill="#E11D48"
                    opacity="0.95"
                  />
                  {/* Paper heart bottom */}
                  <path
                    d="M65 165 C65 160, 58 157, 55 162 C52 167, 56 174, 65 182 C74 174, 78 167, 75 162 C72 157, 65 160, 65 165 Z"
                    fill="#F43F5E"
                    opacity="0.85"
                  />
                </g>

                {/* Tied Ribbon around Neck */}
                <rect x="46" y="50" width="68" height="6" rx="2" fill="url(#ribbonGrad)" />
                {/* Hanging Heart Label */}
                <line x1="80" y1="56" x2="80" y2="76" stroke="#9F1239" strokeWidth="1.5" />
                <g transform="translate(68, 76)">
                  <rect x="0" y="0" width="24" height="20" rx="4" fill="#FFF9F6" stroke="#E8B4B8" strokeWidth="1" />
                  <text x="12" y="14" fontSize="11" textAnchor="middle" fill="#D9777F">
                    💌
                  </text>
                </g>
              </svg>
            </div>

            {/* Action Buttons */}
            <div className="mt-5 flex flex-col items-center gap-3 sm:mt-6">
              <button
                onClick={drawReason}
                disabled={isShaking || isRevealing}
                className="flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-soft transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-60"
              >
                <Sparkles className="h-4 w-4" />
                <span>{currentReason ? "Draw Another Reason 🔀" : content.loveJar.buttonLabel}</span>
              </button>

              {unlockedIds.length > 0 && (
                <button
                  onClick={() => setShowAllModal(true)}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition underline underline-offset-4"
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>View all unlocked ({unlockedIds.length})</span>
                </button>
              )}
            </div>
          </div>

          {/* Revealed Love Note Card */}
          <div className="flex flex-col items-center justify-center">
            {currentReason ? (
              <div
                className={`glass relative w-full max-w-md rounded-3xl border-2 border-primary/30 p-6 shadow-soft transition-all duration-500 sm:p-8 ${
                  isRevealing ? "scale-90 opacity-0" : "scale-100 opacity-100 animate-fade-rise"
                }`}
              >
                {/* Top Bar with Badge & Actions */}
                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                  <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold sm:text-xs ${
                      getTypeBadge(currentReason.type).color
                    }`}
                  >
                    {getTypeBadge(currentReason.type).label}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleFavorite(currentReason.id)}
                      title={isFavorite ? "Remove favorite" : "Save as favorite"}
                      className={`rounded-full p-1.5 transition active:scale-90 ${
                        isFavorite ? "text-amber-500 bg-amber-50" : "text-muted-foreground hover:text-amber-500 hover:bg-muted/60"
                      }`}
                    >
                      <Star className={`h-4 w-4 ${isFavorite ? "fill-amber-400" : ""}`} />
                    </button>

                    <button
                      onClick={() => copyText(currentReason.text)}
                      title="Copy note"
                      className="rounded-full p-1.5 text-muted-foreground transition hover:text-primary hover:bg-muted/60 active:scale-90"
                    >
                      {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Reason Text Body */}
                <div className="py-6 sm:py-8">
                  <p className="font-handwriting text-3xl font-bold text-primary sm:text-4xl">Reason #{currentReason.id}</p>
                  <p className="mt-3 font-handwriting text-2xl font-medium leading-relaxed text-foreground sm:text-3xl tracking-wide">
                    "{currentReason.text}"
                  </p>
                </div>

                {/* Footer Signature */}
                <div className="flex items-center justify-between border-t border-border/60 pt-3 text-xs text-muted-foreground">
                  <span>Forever yours</span>
                  <span className="font-handwriting text-2xl font-bold text-primary sm:text-3xl">— {content.couple.yourName} ♥</span>
                </div>
              </div>
            ) : (
              /* Empty state before first draw */
              <div className="glass flex w-full max-w-md flex-col items-center justify-center rounded-3xl border border-dashed border-primary/40 p-8 text-center shadow-soft sm:p-12">
                <span className="text-4xl sm:text-5xl">💌</span>
                <h4 className="mt-3 font-handwriting text-3xl font-bold text-foreground sm:text-4xl">The Love Jar Is Waiting</h4>
                <p className="mt-2 text-xs text-muted-foreground sm:text-sm">
                  Inside this jar are {reasons.length} handwritten reasons why you are the love of my life. Tap the jar to pull out your first note!
                </p>
                <button
                  onClick={drawReason}
                  className="mt-5 rounded-full bg-primary/10 px-5 py-2 text-xs font-semibold text-primary transition hover:bg-primary hover:text-white"
                >
                  Reach into the jar ✨
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal: View All Unlocked Notes */}
      {showAllModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-rise">
          <div className="glass max-h-[85vh] w-full max-w-2xl overflow-hidden rounded-3xl shadow-2xl border-primary/30 flex flex-col">
            <div className="flex items-center justify-between border-b border-border/60 p-5 sm:p-6">
              <div>
                <h3 className="font-display text-xl font-bold sm:text-2xl">Your Unlocked Love Notes 💌</h3>
                <p className="text-xs text-muted-foreground">
                  You've revealed {unlockedIds.length} of {reasons.length} notes ({favorites.length} starred)
                </p>
              </div>
              <button
                onClick={() => setShowAllModal(false)}
                className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-3.5">
              {unlockedIds.length === 0 ? (
                <p className="text-center text-xs text-muted-foreground py-8">No notes drawn yet. Shake the jar!</p>
              ) : (
                reasons
                  .filter((r) => unlockedIds.includes(r.id))
                  .map((r) => {
                    const isFav = favorites.includes(r.id);
                    return (
                      <div
                        key={r.id}
                        className="glass rounded-2xl p-4 border border-border/70 flex items-start justify-between gap-3 shadow-xs hover:border-primary/40 transition"
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-bold text-primary">#{r.id}</span>
                            <span
                              className={`rounded-full px-2 py-0.2 text-[9px] font-medium border ${
                                getTypeBadge(r.type).color
                              }`}
                            >
                              {r.type}
                            </span>
                          </div>
                          <p className="font-handwriting text-xl font-medium leading-relaxed text-foreground/90 sm:text-2xl">"{r.text}"</p>
                        </div>
                        <button
                          onClick={() => toggleFavorite(r.id)}
                          className={`shrink-0 p-1 rounded-full transition ${
                            isFav ? "text-amber-500" : "text-muted-foreground/50 hover:text-amber-400"
                          }`}
                        >
                          <Star className={`h-4 w-4 ${isFav ? "fill-amber-400" : ""}`} />
                        </button>
                      </div>
                    );
                  })
              )}
            </div>

            <div className="border-t border-border/60 p-4 text-center bg-muted/20">
              <button
                onClick={() => setShowAllModal(false)}
                className="rounded-full bg-primary px-6 py-2 text-xs font-semibold text-white shadow-sm transition hover:opacity-95"
              >
                Close Jar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
