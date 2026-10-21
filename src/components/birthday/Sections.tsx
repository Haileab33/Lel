import { useEffect, useRef, useState, type ReactNode } from "react";
import { content } from "@/lib/content";
import { Play, Pause, Volume2, VolumeX, Music, ChevronRight, ChevronLeft, Heart, X, Sparkles, RefreshCw } from "lucide-react";

export function Section({
  id,
  eyebrow,
  title,
  lede,
  children,
  className = "",
}: {
  id: string;
  eyebrow: string;
  title: string;
  lede?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`mx-auto max-w-6xl scroll-mt-20 px-4 py-12 sm:px-6 sm:py-24 ${className}`}>
      <div className="mb-8 text-center animate-fade-rise sm:mb-12">
        <p className="font-script text-2xl text-primary sm:text-4xl">{eyebrow}</p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight text-foreground sm:text-5xl">{title}</h2>
        {lede && <p className="mx-auto mt-2 max-w-xl text-xs text-muted-foreground sm:mt-3 sm:text-base">{lede}</p>}
        <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-gold sm:mt-4 sm:w-20" />
      </div>
      {children}
    </section>
  );
}

export function Petals() {
  const petals = ["🌸", "🌹", "💖", "✨", "🌺", "🌸", "💕"];
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {Array.from({ length: 12 }).map((_, i) => (
        <span
          key={i}
          className="animate-petal absolute text-base sm:text-2xl"
          style={{
            left: `${(i * 8 + 4) % 95}%`,
            animationDelay: `${(i * 0.9) % 7}s`,
            animationDuration: `${10 + (i % 6)}s`,
          }}
        >
          {petals[i % petals.length]}
        </span>
      ))}
    </div>
  );
}

export function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total > 0) {
        setProgress((window.scrollY / total) * 100);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-50 h-1 bg-border/40">
      <div className="h-full bg-gradient-to-r from-primary via-accent to-primary transition-all duration-150" style={{ width: `${progress}%` }} />
    </div>
  );
}

export function Gate({ onOpen }: { onOpen: () => void }) {
  const [pass, setPass] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [err, setErr] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pass.trim().toLowerCase() === content.privacy.password.toLowerCase()) {
      sessionStorage.setItem("unlocked", "1");
      window.dispatchEvent(new CustomEvent("start-bg-music"));
      onOpen();
    } else {
      setErr(true);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-romance px-4 py-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(217,119,127,0.15)_0,transparent_70%)] animate-pulse-glow" />
      <form onSubmit={handleSubmit} className="glass relative z-10 w-full max-w-md rounded-3xl p-6 text-center shadow-soft animate-fade-rise sm:p-8">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-2xl text-primary sm:h-16 sm:w-16 sm:text-3xl">
          💌
        </div>
        <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-accent sm:mt-4 sm:text-xs">{content.privacy.title}</p>
        <h1 className="mt-1 font-display text-2xl font-bold text-foreground sm:text-3xl">For {content.couple.herName}</h1>
        <p className="mt-2 text-xs text-muted-foreground sm:text-sm">{content.privacy.sub}</p>

        <div className="mt-5 space-y-3 sm:mt-6">
          <input
            type="password"
            value={pass}
            onChange={(e) => {
              setPass(e.target.value);
              setErr(false);
            }}
            placeholder="enter password"
            className="w-full rounded-2xl border border-border bg-background/80 px-4 py-3 text-center text-base outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 sm:text-sm"
          />
          {err && <p className="text-xs text-destructive">{content.privacy.wrongMsg}</p>}
          <button type="submit" className="w-full rounded-2xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-sm transition active:scale-98 hover:opacity-95">
            Unlock My Gift 💖
          </button>
        </div>

        <div className="mt-5 border-t border-border/50 pt-4 sm:mt-6">
          <button
            type="button"
            onClick={() => setShowHint(!showHint)}
            className="text-xs text-muted-foreground underline-offset-4 hover:underline"
          >
            {showHint ? "Hide hint" : "Need a hint?"}
          </button>
          {showHint && <p className="mt-2 rounded-xl bg-muted/60 p-3 text-xs italic text-foreground/80">{content.privacy.hint}</p>}
        </div>
      </form>
    </div>
  );
}

export function TimeTogether() {
  const [elapsed, setElapsed] = useState<{ years: number; months: number; days: number } | null>(null);

  useEffect(() => {
    const calculateTime = () => {
      const start = new Date(2023, 4, 18, 0, 0, 0); // May 18, 2023 (Month index 4 = May)
      const now = new Date();

      let years = now.getFullYear() - start.getFullYear();
      let months = now.getMonth() - start.getMonth();
      let days = now.getDate() - start.getDate();

      if (days < 0) {
        const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        days += prevMonth.getDate();
        months--;
      }

      if (months < 0) {
        months += 12;
        years--;
      }

      setElapsed({
        years: Math.max(0, years),
        months: Math.max(0, months),
        days: Math.max(0, days),
      });
    };

    calculateTime();
    const t = setInterval(calculateTime, 1000);
    return () => clearInterval(t);
  }, []);

  const parts = [
    ["Years", elapsed?.years],
    ["Months", elapsed?.months],
    ["Days", elapsed?.days],
  ] as const;

  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-sm sm:max-w-md mx-auto">
      {parts.map(([l, v]) => (
        <div key={l} className="glass rounded-2xl px-2 py-2.5 text-center shadow-soft sm:px-5 sm:py-4 transition hover:scale-[1.02]">
          <div className="font-display text-2xl font-bold text-gold-shine sm:text-4xl">
            {v === undefined ? "--" : String(v)}
          </div>
          <div className="mt-0.5 text-[8px] uppercase tracking-[0.18em] text-muted-foreground sm:text-xs">{l}</div>
        </div>
      ))}
    </div>
  );
}

export function Countdown() {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  // Dynamic calculation for next upcoming May 18 anniversary
  const getNextAnniversary = () => {
    const current = new Date();
    let nextAnniv = new Date(current.getFullYear(), 4, 18, 0, 0, 0);
    if (current.getTime() >= nextAnniv.getTime()) {
      nextAnniv = new Date(current.getFullYear() + 1, 4, 18, 0, 0, 0);
    }
    return nextAnniv.getTime();
  };

  const target = getNextAnniversary();
  const diff = Math.max(0, target - (now ?? target));
  const parts = [
    ["Days", Math.floor(diff / 864e5)],
    ["Hours", Math.floor(diff / 36e5) % 24],
    ["Minutes", Math.floor(diff / 6e4) % 60],
    ["Seconds", Math.floor(diff / 1e3) % 60],
  ] as const;

  return (
    <div className="grid grid-cols-4 gap-1.5 sm:gap-4">
      {parts.map(([l, v]) => (
        <div key={l} className="glass rounded-2xl px-1.5 py-2.5 text-center shadow-soft sm:px-5 sm:py-4">
          <div className="font-display text-xl font-bold text-gold-shine sm:text-4xl">{now === null ? "--" : String(v).padStart(2, "0")}</div>
          <div className="mt-0.5 text-[8px] uppercase tracking-[0.15em] text-muted-foreground sm:text-xs">{l}</div>
        </div>
      ))}
    </div>
  );
}

export function Gallery() {
  const [activeChapter, setActiveChapter] = useState("All");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const photos = content.gallery.photos;
  const chapters = ["All", ...Array.from(new Set(photos.map((p) => p.chapter)))];

  const filteredPhotos = activeChapter === "All" ? photos : photos.filter((p) => p.chapter === activeChapter);

  const handleSurprise = () => {
    const randomIndex = Math.floor(Math.random() * photos.length);
    setOpenIndex(randomIndex);
  };

  useEffect(() => {
    if (openIndex === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenIndex(null);
      if (e.key === "ArrowRight") setOpenIndex((i) => ((i ?? 0) + 1) % photos.length);
      if (e.key === "ArrowLeft") setOpenIndex((i) => ((i ?? 0) - 1 + photos.length) % photos.length);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [openIndex, photos.length]);

  return (
    <>
      {/* Horizontally touch-scrollable filter chips on mobile */}
      <div className="no-scrollbar mb-6 flex items-center gap-2 overflow-x-auto pb-2 text-nowrap sm:mb-8 sm:justify-center">
        {chapters.map((c) => (
          <button
            key={c}
            onClick={() => setActiveChapter(c)}
            className={`shrink-0 rounded-full px-4 py-2 text-xs font-medium transition active:scale-95 ${
              activeChapter === c ? "bg-primary text-primary-foreground shadow-sm" : "bg-card hover:bg-muted text-muted-foreground border border-border/60"
            }`}
          >
            {c}
          </button>
        ))}
        <button
          onClick={handleSurprise}
          className="shrink-0 flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-4 py-2 text-xs font-medium text-accent hover:bg-accent/20 active:scale-95"
        >
          <Sparkles className="h-3.5 w-3.5" /> Surprise me
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
        {filteredPhotos.map((p) => {
          const globalIdx = photos.findIndex((x) => x.src === p.src);
          return (
            <button
              key={p.src}
              onClick={() => setOpenIndex(globalIdx)}
              className={`tone-${p.tone} group relative block w-full overflow-hidden rounded-3xl border p-2 text-left shadow-soft transition active:scale-[0.99] sm:hover:-translate-y-1`}
            >
              <div className="relative overflow-hidden rounded-2xl aspect-[4/3] sm:aspect-[3/4]">
                <img src={p.src} alt={p.alt} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-700 sm:group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 sm:opacity-0 sm:transition-opacity sm:duration-300 sm:group-hover:opacity-100" />
                <span className="absolute bottom-2.5 left-3 right-3 text-xs italic text-white leading-tight">
                  {p.caption}
                </span>
              </div>
              <div className="px-2 pt-2 pb-0.5 flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{p.chapter}</span>
                <span className="text-xs">💖</span>
              </div>
            </button>
          );
        })}
      </div>

      {openIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 sm:p-6 backdrop-blur-md animate-in fade-in" onClick={() => setOpenIndex(null)}>
          <figure className="relative max-h-[90vh] w-full max-w-3xl rounded-3xl bg-card p-4 shadow-2xl overflow-y-auto sm:p-6" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setOpenIndex(null)}
              className="absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground hover:bg-primary hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="max-h-[55vh] sm:max-h-[65vh] overflow-hidden rounded-2xl bg-black">
              <img src={photos[openIndex]!.src} alt={photos[openIndex]!.alt} className="max-h-[55vh] sm:max-h-[65vh] w-full object-contain" />
            </div>
            <figcaption className="mt-3 text-center font-display text-lg italic text-foreground sm:mt-4 sm:text-2xl">
              "{photos[openIndex]!.caption}"
            </figcaption>
            <div className="mt-1 text-center text-[10px] text-muted-foreground uppercase tracking-widest sm:text-xs">
              {photos[openIndex]!.chapter} • {openIndex + 1} of {photos.length}
            </div>
            <div className="mt-4 flex justify-center gap-2 sm:gap-3">
              <button className="rounded-full bg-muted px-4 py-2 text-xs font-medium hover:bg-primary hover:text-white active:scale-95" onClick={() => setOpenIndex((openIndex - 1 + photos.length) % photos.length)}>
                ‹ Prev
              </button>
              <button className="rounded-full bg-primary px-5 py-2 text-xs font-semibold text-white shadow-sm hover:opacity-90 active:scale-95" onClick={() => setOpenIndex(null)}>
                Close
              </button>
              <button className="rounded-full bg-muted px-4 py-2 text-xs font-medium hover:bg-primary hover:text-white active:scale-95" onClick={() => setOpenIndex((openIndex + 1) % photos.length)}>
                Next ›
              </button>
            </div>
          </figure>
        </div>
      )}
    </>
  );
}

export function Timeline() {
  const [active, setActive] = useState(0);

  return (
    <div className="relative mx-auto max-w-4xl">
      {/* Vertical timeline line positioned left on mobile, center on desktop */}
      <div className="absolute left-4 top-0 h-full w-0.5 bg-gradient-to-b from-primary via-accent to-primary sm:left-1/2 sm:-translate-x-1/2" />
      <div className="space-y-6 sm:space-y-8">
        {content.timeline.milestones.map((m, i) => (
          <div
            key={i}
            onClick={() => setActive(i)}
            className={`group relative flex flex-col sm:flex-row ${i % 2 === 0 ? "sm:flex-row-reverse" : ""} cursor-pointer`}
          >
            <div className="flex items-center pl-9 sm:w-1/2 sm:pl-0 sm:pr-8 sm:group-[]:even:pl-8 sm:group-[]:even:pr-0">
              <div
                className={`w-full rounded-3xl p-5 transition-all duration-300 sm:p-6 ${
                  active === i ? "glass shadow-soft border-primary/40 ring-1 ring-primary/20" : "bg-card/80 hover:bg-card border border-border"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold text-primary sm:px-3 sm:py-1 sm:text-[11px]">{m.date}</span>
                  {m.artifact && <span className="text-xs">📸</span>}
                </div>
                <h3 className="mt-2 font-display text-xl font-bold text-foreground sm:text-2xl">{m.title}</h3>
                <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed sm:text-sm">{m.body}</p>

                {m.artifact && (
                  <div className="mt-3 overflow-hidden rounded-xl aspect-[16/9] border border-border/50 bg-muted/30">
                    <img
                      src={m.artifact}
                      alt={m.title}
                      loading="lazy"
                      decoding="async"
                      className={`h-full w-full object-cover ${m.objectPosition || "object-top"}`}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="absolute left-4 top-6 flex h-4 w-4 -translate-x-1/2 items-center justify-center rounded-full bg-white ring-4 ring-primary/30 sm:left-1/2">
              <div className={`h-2.5 w-2.5 rounded-full ${active === i ? "bg-primary scale-125" : "bg-accent"}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Media() {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement | null }>({});

  const toggleVoiceNote = (id: string) => {
    const audio = audioRefs.current[id];
    if (!audio) return;

    if (playingId === id) {
      audio.pause();
      setPlayingId(null);
    } else {
      // Pause any previously playing voice note
      if (playingId && audioRefs.current[playingId]) {
        audioRefs.current[playingId]?.pause();
        try {
          audioRefs.current[playingId]!.currentTime = 0;
        } catch {
          // ignore
        }
      }
      // Autopause background music when voice note plays
      window.dispatchEvent(new CustomEvent("pause-bg-music"));
      setPlayingId(id);
      audio.play().catch((err) => {
        console.error("Playback error:", err);
        setPlayingId(null);
      });
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-3 sm:space-y-4">
      {content.media.voiceNotes.map((note) => (
        <div key={note.id} className="glass rounded-3xl p-4 shadow-soft transition hover:border-primary/40 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <span className="text-[9px] font-semibold uppercase tracking-widest text-primary sm:text-[10px]">{note.when}</span>
              <h4 className="truncate font-display text-lg font-bold text-foreground sm:text-xl">{note.title}</h4>
            </div>
            <button
              onClick={() => toggleVoiceNote(note.id)}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm active:scale-95 hover:opacity-90 sm:h-12 sm:w-12"
            >
              {playingId === note.id ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
            </button>
          </div>

          <audio
            ref={(el) => (audioRefs.current[note.id] = el)}
            onEnded={() => setPlayingId(null)}
            onPause={() => {
              if (playingId === note.id) setPlayingId(null);
            }}
            preload="metadata"
            className="hidden"
          >
            <source src={note.src} type="audio/mpeg" />
            <source src={note.src.replace(".mp3", ".ogg")} type="audio/ogg" />
          </audio>

          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground border-t border-border/40 pt-2.5">
            <span>Duration: {note.duration}</span>
            <span className="text-[11px] font-medium text-primary/70">Audio note 🎧</span>
          </div>
        </div>
      ))}
    </div>
  );
}

type MemoryItem = {
  id: string;
  kicker: string;
  title: string;
  body: string;
  tone: string;
  fastener: "tape" | "clip" | "pin" | "corner";
  img?: string;
};

export function Scrapbook() {
  const [pages, setPages] = useState<MemoryItem[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [kicker, setKicker] = useState("Memory");
  const [img, setImg] = useState<string | undefined>();

  useEffect(() => {
    const saved = localStorage.getItem("scrapbook-combined-v5");
    if (saved) {
      try {
        const parsed: MemoryItem[] = JSON.parse(saved);
        setPages(parsed);
        return;
      } catch {
        /* fallback to defaults */
      }
    }
    // Migrate any custom-added items from v4 if they exist
    const oldSaved = localStorage.getItem("scrapbook-combined-v4");
    if (oldSaved) {
      try {
        const parsed: MemoryItem[] = JSON.parse(oldSaved);
        const customItems = parsed.filter(
          (item) => item.id && !content.scrapbook.pages.some((p) => p.title === item.title) && item.title !== "The keychain" && item.title !== "The first message — April 9" && item.title !== "Our song — July 18"
        );
        if (customItems.length > 0) {
          const merged = [...(content.scrapbook.pages as MemoryItem[]), ...customItems];
          setPages(merged);
          localStorage.setItem("scrapbook-combined-v5", JSON.stringify(merged));
          return;
        }
      } catch {
        /* ignore */
      }
    }
    setPages(content.scrapbook.pages as MemoryItem[]);
    localStorage.setItem("scrapbook-combined-v5", JSON.stringify(content.scrapbook.pages));
  }, []);

  const savePages = (newPages: MemoryItem[]) => {
    setPages(newPages);
    localStorage.setItem("scrapbook-combined-v5", JSON.stringify(newPages));
  };

  const handleImage = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImg(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newItem: MemoryItem = {
      id: String(Date.now()),
      kicker,
      title,
      body,
      tone: "cream",
      fastener: "tape",
      img,
    };

    savePages([newItem, ...pages]);
    setTitle("");
    setBody("");
    setImg(undefined);
  };

  const rotations = ["-rotate-1", "rotate-1", "rotate-1", "-rotate-1"];

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_2fr] sm:gap-8">
      <form onSubmit={handleSubmit} className="glass h-fit space-y-3.5 rounded-3xl p-5 shadow-soft sm:p-6">
        <h3 className="font-display text-xl font-bold sm:text-2xl">Add a memory 📌</h3>
        <div>
          <label className="text-xs font-medium text-muted-foreground">Category / Tag</label>
          <input
            value={kicker}
            onChange={(e) => setKicker(e.target.value)}
            placeholder="e.g. Ticket stub, Photo, Note"
            className="mt-1 w-full rounded-xl border border-border bg-background/60 px-3.5 py-2.5 text-base outline-none focus:ring-2 focus:ring-primary/20 sm:text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title of this memory"
            maxLength={60}
            required
            className="mt-1 w-full rounded-xl border border-border bg-background/60 px-3.5 py-2.5 text-base outline-none focus:ring-2 focus:ring-primary/20 sm:text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground">Little details</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="What made this moment special?"
            rows={3}
            className="mt-1 w-full rounded-xl border border-border bg-background/60 px-3.5 py-2.5 text-base outline-none focus:ring-2 focus:ring-primary/20 sm:text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground">Attach Image (Optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImage(e.target.files?.[0])}
            className="mt-1 w-full text-xs text-muted-foreground file:mr-3 file:rounded-full file:border-0 file:bg-primary/10 file:px-4 file:py-1.5 file:text-xs file:font-semibold file:text-primary hover:file:bg-primary/20"
          />
        </div>
        <button type="submit" className="w-full rounded-2xl bg-primary py-3 text-sm font-semibold text-white shadow-sm active:scale-98 hover:opacity-90">
          Pin to Scrapbook ✨
        </button>
      </form>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
        {pages.map((p, i) => (
          <div
            key={p.id || i}
            className={`tone-${p.tone || "cream"} fastener-${p.fastener || "tape"} relative rounded-2xl border p-4 shadow-polaroid transition hover:rotate-0 hover:scale-[1.01] sm:p-5 ${
              rotations[i % rotations.length]
            }`}
          >
            {p.img && (
              <div className="mb-3 overflow-hidden rounded-xl border border-black/10 aspect-[4/3]">
                <img src={p.img} alt={p.title} loading="lazy" decoding="async" className="h-full w-full object-cover" />
              </div>
            )}
            <span className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground sm:text-[10px]">{p.kicker}</span>
            <h4 className="font-display text-xl font-bold text-foreground sm:text-2xl">{p.title}</h4>
            <p className="mt-1 text-xs text-foreground/80 leading-relaxed sm:text-sm">{p.body}</p>

            <button
              onClick={() => savePages(pages.filter((_, idx) => idx !== i))}
              className="mt-3 text-[11px] text-muted-foreground hover:text-destructive underline"
            >
              remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CountdownSection() {
  return (
    <div className="space-y-6 sm:space-y-10">
      <div className="glass mx-auto max-w-xl rounded-3xl p-5 text-center shadow-soft sm:p-8">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-primary sm:text-xs">{content.countdown.primaryLabel}</p>
        <div className="mt-3 sm:mt-4">
          <Countdown />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 sm:gap-4">
        {content.countdown.events.map((ev, i) => (
          <div key={i} className="glass rounded-2xl p-4 text-left shadow-soft hover:border-primary/40 transition">
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold text-primary">{ev.date}</span>
            <h4 className="mt-2 font-display text-lg font-bold text-foreground sm:text-xl">{ev.label}</h4>
            <p className="mt-1 text-xs text-muted-foreground">{ev.note}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function QuotesAndLetter() {
  return (
    <div className="space-y-10 sm:space-y-16">
      {/* Quotes Grid */}
      <div>
        <h3 className="text-center font-display text-2xl font-bold mb-6 sm:text-3xl sm:mb-8">Things I've Said & Words of Love</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
          {content.quotes.mine.map((q, i) => (
            <div key={i} className="glass rounded-3xl p-5 shadow-soft border-primary/20 flex flex-col justify-between sm:p-6">
              <p className="font-display text-lg italic text-foreground sm:text-xl">"{q.text}"</p>
              <span className="mt-3 text-[10px] font-semibold text-primary uppercase tracking-widest sm:text-xs">— {content.couple.yourName}</span>
            </div>
          ))}

          {content.quotes.borrowed.map((q, i) => (
            <div key={i} className="glass tone-lavender rounded-3xl p-5 shadow-soft border-purple-200 flex flex-col justify-between sm:p-6">
              <p className="font-display text-lg italic text-foreground sm:text-xl">"{q.text}"</p>
              <span className="mt-3 text-[10px] font-semibold text-muted-foreground sm:text-xs">— {q.by}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Poem Card */}
      <div className="glass mx-auto max-w-2xl rounded-3xl p-6 text-center shadow-soft border-accent/40 bg-cream/50 sm:p-12">
        <span className="text-3xl sm:text-4xl">📜</span>
        <h3 className="mt-2 font-display text-2xl font-bold text-foreground sm:text-3xl">{content.quotes.poem.title}</h3>
        <div className="mt-4 space-y-1.5 font-display text-sm italic text-foreground/90 leading-relaxed sm:mt-6 sm:text-base sm:space-y-2">
          {content.quotes.poem.lines.map((line, idx) => (
            <p key={idx}>{line === "" ? <br /> : line}</p>
          ))}
        </div>
        <p className="mt-6 font-script text-2xl text-primary sm:mt-8 sm:text-3xl">{content.quotes.poem.sign}</p>
      </div>

      {/* The Long Letter */}
      <div className="glass mx-auto max-w-3xl rounded-3xl p-6 shadow-soft border-primary/30 relative overflow-hidden sm:p-14">
        <div className="absolute top-0 right-0 p-6 text-4xl opacity-10 pointer-events-none sm:p-8 sm:text-6xl">✉️</div>
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-primary sm:text-xs">{content.quotes.letter.eyebrow}</span>
          <span className="text-xs text-muted-foreground">{content.quotes.letter.date}</span>
        </div>
        <h3 className="mt-3 font-display text-3xl font-bold text-foreground sm:mt-4 sm:text-4xl">{content.quotes.letter.title}</h3>
        <div className="mt-4 space-y-3 font-display text-base text-foreground/90 leading-relaxed sm:mt-6 sm:space-y-4 sm:text-lg">
          {content.quotes.letter.paragraphs.map((para, i) => (
            <p key={i} className="whitespace-pre-line">{para}</p>
          ))}
        </div>
        <div className="mt-6 border-t border-border/60 pt-5 text-right sm:mt-8 sm:pt-6">
          <p className="font-script text-3xl text-primary sm:text-4xl">{content.quotes.letter.sign}</p>
        </div>
      </div>
    </div>
  );
}

export function MusicPlayer({ isUnlocked = true }: { isUnlocked?: boolean }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasSeekedRef = useRef(false);

  const track = content.bgMusic || content.playlist[0];

  useEffect(() => {
    const handlePauseBg = () => {
      if (audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    };

    window.addEventListener("pause-bg-music", handlePauseBg);
    return () => {
      window.removeEventListener("pause-bg-music", handlePauseBg);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Enforce 15s start on mobile & desktop
    const ensureSeekTo15 = () => {
      if (!hasSeekedRef.current && audio.currentTime < 14.8) {
        try {
          audio.currentTime = 15;
          hasSeekedRef.current = true;
        } catch {
          // ignore
        }
      }
    };

    audio.addEventListener("loadedmetadata", ensureSeekTo15);
    audio.addEventListener("canplay", ensureSeekTo15);
    audio.addEventListener("playing", ensureSeekTo15);

    const handleTimeUpdate = () => {
      if (!hasSeekedRef.current && audio.currentTime < 14.8) {
        try {
          audio.currentTime = 15;
          hasSeekedRef.current = true;
        } catch {
          // ignore
        }
      }
    };
    audio.addEventListener("timeupdate", handleTimeUpdate);

    const startPlayback = () => {
      ensureSeekTo15();
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
          ensureSeekTo15();
          window.removeEventListener("pointerdown", startPlayback);
          window.removeEventListener("click", startPlayback);
          window.removeEventListener("keydown", startPlayback);
          window.removeEventListener("scroll", startPlayback);
        })
        .catch(() => {
          // Autoplay blocked by browser policy until interaction
        });
    };

    // Listen for external trigger to start background music
    window.addEventListener("start-bg-music", startPlayback);

    // If unlocked, try starting playback
    if (isUnlocked) {
      startPlayback();
      window.addEventListener("pointerdown", startPlayback, { once: true });
      window.addEventListener("click", startPlayback, { once: true });
      window.addEventListener("keydown", startPlayback, { once: true });
      window.addEventListener("scroll", startPlayback, { once: true });
    }

    return () => {
      window.removeEventListener("start-bg-music", startPlayback);
      window.removeEventListener("pointerdown", startPlayback);
      window.removeEventListener("click", startPlayback);
      window.removeEventListener("keydown", startPlayback);
      window.removeEventListener("scroll", startPlayback);
      audio.removeEventListener("loadedmetadata", ensureSeekTo15);
      audio.removeEventListener("canplay", ensureSeekTo15);
      audio.removeEventListener("playing", ensureSeekTo15);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [isUnlocked]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      if (!hasSeekedRef.current && audio.currentTime < 14.8) {
        try {
          audio.currentTime = 15;
          hasSeekedRef.current = true;
        } catch {
          // ignore
        }
      }
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
          if (!hasSeekedRef.current && audio.currentTime < 14.8) {
            audio.currentTime = 15;
            hasSeekedRef.current = true;
          }
        })
        .catch(() => {});
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleEnded = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 15;
    hasSeekedRef.current = true;
    audioRef.current.play().catch(() => {});
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={track?.src}
        preload="auto"
        onEnded={handleEnded}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
      />

      {isUnlocked && (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2">
          {!isPlaying && !isExpanded && (
            <button
              onClick={togglePlay}
              aria-label="Start background music"
              className="flex items-center gap-1.5 rounded-full bg-primary/95 text-white px-3.5 py-2 text-xs font-semibold shadow-xl backdrop-blur-md animate-bounce border border-white/20 transition active:scale-95 hover:bg-primary"
            >
              <span>🎵 Tap to start music</span>
            </button>
          )}

      {!isExpanded ? (
        <button
          onClick={() => setIsExpanded(true)}
          aria-label="Open background music controls"
          className="relative flex h-12 w-12 items-center justify-center rounded-full bg-primary/90 text-white shadow-xl backdrop-blur-md border border-primary/30 transition-all duration-300 hover:scale-105 active:scale-95"
        >
          {isPlaying && (
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-rose-400" />
            </span>
          )}
          <Music className={`h-5 w-5 ${isPlaying ? "animate-pulse text-white" : "text-white/80"}`} />
        </button>
      ) : (
        <div className="glass flex items-center gap-2.5 rounded-full px-3.5 py-2 shadow-2xl border-primary/40 backdrop-blur-xl transition-all duration-300 animate-fade-rise max-w-[calc(100vw-2rem)] sm:max-w-sm">
          <button
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause background music" : "Play background music"}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-white shadow-md transition active:scale-95 sm:h-10 sm:w-10"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
          </button>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <Music className={`h-3 w-3 text-primary shrink-0 ${isPlaying ? "animate-bounce" : ""}`} />
              <p className="truncate text-xs font-bold text-foreground">{track?.title}</p>
            </div>
            <p className="truncate text-[10px] text-muted-foreground">{track?.note}</p>
          </div>

          <button
            onClick={toggleMute}
            aria-label={isMuted ? "Unmute" : "Mute"}
            className="text-muted-foreground hover:text-foreground active:scale-95 p-1"
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>

          <button
            onClick={() => setIsExpanded(false)}
            aria-label="Minimize music player"
            className="text-muted-foreground hover:text-foreground active:scale-95 p-1 border-l border-border/50 pl-2"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  )}
</>
);
}
