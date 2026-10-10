import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { content } from "@/lib/content";
import {
  Countdown,
  CountdownSection,
  Gallery,
  Gate,
  GiftBoxes,
  Media,
  MusicPlayer,
  Petals,
  QuotesAndLetter,
  Scrapbook,
  ScrollProgress,
  Section,
  Timeline,
} from "@/components/birthday/Sections";
import { Heart, Menu, X, Sparkles } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `Happy Birthday, ${content.couple.herName} ♥` },
      { name: "description", content: "A private birthday gift, made with love." },
      { property: "og:title", content: `Happy Birthday, ${content.couple.herName} ♥` },
      { property: "og:description", content: "A private birthday gift, made with love." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Index,
});

const navLinks = [
  ["gallery", "Gallery", "01"],
  ["journey", "Our Story", "02"],
  ["media", "Listen", "03"],
  ["scrapbook", "Scrapbook", "04"],
  ["gifts", "Gifts", "05"],
  ["countdown", "Milestones", "06"],
  ["quotes", "For You", "07"],
] as const;

function Index() {
  const [unlocked, setUnlocked] = useState(!content.privacy.enabled);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("unlocked")) setUnlocked(true);
  }, []);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  if (!unlocked) return <Gate onOpen={() => setUnlocked(true)} />;

  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      <ScrollProgress />
      <Petals />

      {/* Floating Header Nav */}
      <header className="fixed inset-x-3 top-3 z-40 mx-auto max-w-5xl sm:inset-x-4 sm:top-4">
        <div className="glass flex items-center justify-between rounded-full px-4 py-2.5 shadow-soft sm:px-6 sm:py-3">
          <a href="#top" className="flex items-center gap-1.5 font-script text-2xl text-primary font-bold sm:gap-2 sm:text-3xl">
            <Heart className="h-4 w-4 fill-primary text-primary sm:h-5 sm:w-5" />
            <span>{content.couple.herName}</span>
          </a>

          <nav className="hidden items-center gap-6 text-xs font-medium lg:flex">
            {navLinks.map(([id, label]) => (
              <a key={id} href={`#${id}`} className="text-muted-foreground transition hover:text-primary">
                {label}
              </a>
            ))}
          </nav>

          <button
            className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary transition active:scale-95 lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Fullscreen Mobile Drawer Navigation Sheet */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-between bg-background/95 p-6 backdrop-blur-2xl animate-fade-rise lg:hidden">
          <div className="flex items-center justify-between border-b border-border/60 pb-4">
            <div className="flex items-center gap-2 font-script text-3xl text-primary font-bold">
              <Heart className="h-6 w-6 fill-primary text-primary" />
              <span>{content.couple.herName}</span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-muted text-foreground transition active:scale-95"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="my-auto space-y-2 py-4">
            <p className="px-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-accent">Chapters</p>
            {navLinks.map(([id, label, chapter]) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between rounded-2xl bg-card border border-border/60 px-5 py-3.5 text-base font-medium text-foreground shadow-sm transition active:scale-[0.98] active:bg-primary active:text-white"
              >
                <span className="font-display text-lg font-semibold">{label}</span>
                <span className="text-xs font-semibold text-primary/70 uppercase tracking-widest">{chapter}</span>
              </a>
            ))}
          </div>

          <div className="border-t border-border/60 pt-4 text-center">
            <p className="font-script text-2xl text-primary">Made with love for {content.couple.herName} ♥</p>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section id="top" className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 pt-24 pb-16 sm:px-6 sm:pt-28">
        <div className="absolute inset-0 bg-romance opacity-60" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(217,119,127,0.12)_0,transparent_75%)] animate-pulse-glow" />

        <div className="relative z-10 max-w-3xl text-center animate-fade-rise">
          <p className="text-[10px] uppercase tracking-[0.3em] font-semibold text-accent sm:text-xs">{content.hero.eyebrow}</p>
          <h1 className="mt-2 font-display text-4xl font-bold tracking-tight text-foreground sm:text-7xl lg:text-8xl leading-tight">
            {content.hero.headline}
          </h1>
          <p className="mx-auto mt-4 max-w-xl font-display text-base italic text-muted-foreground sm:mt-6 sm:text-2xl">
            "{content.hero.sub}"
          </p>

          <div className="mt-8 sm:mt-10">
            <Countdown />
          </div>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:mt-10">
            <a
              href="#gallery"
              onClick={() => {
                window.dispatchEvent(new CustomEvent("start-bg-music"));
              }}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-white shadow-soft transition active:scale-95 hover:scale-105"
            >
              {content.hero.cta} 💖
            </a>
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground sm:text-[11px]">{content.hero.scrollWord}</span>
          </div>
        </div>
      </section>

      {/* Main Content Sections */}
      <main className="relative z-10 space-y-6 sm:space-y-12">
        <Section id="gallery" eyebrow={content.gallery.eyebrow} title={content.gallery.title} lede={content.gallery.lede}>
          <Gallery />
        </Section>

        <div className="bg-muted/40">
          <Section id="journey" eyebrow={content.timeline.eyebrow} title={content.timeline.title} lede={content.timeline.lede}>
            <Timeline />
          </Section>
        </div>

        <Section id="media" eyebrow={content.media.eyebrow} title={content.media.title} lede={content.media.lede}>
          <Media />
        </Section>

        <div className="bg-muted/40">
          <Section id="scrapbook" eyebrow={content.scrapbook.eyebrow} title={content.scrapbook.title} lede={content.scrapbook.lede}>
            <Scrapbook />
          </Section>
        </div>

        <Section id="gifts" eyebrow={content.gifts.eyebrow} title={content.gifts.title} lede={content.gifts.lede}>
          <GiftBoxes />
        </Section>

        <div className="bg-muted/40">
          <Section id="countdown" eyebrow={content.countdown.eyebrow} title={content.countdown.title} lede={content.countdown.lede}>
            <CountdownSection />
          </Section>
        </div>

        <Section id="quotes" eyebrow={content.quotes.eyebrow} title={content.quotes.title} lede={content.quotes.lede}>
          <QuotesAndLetter />
        </Section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/60 py-12 text-center sm:py-16">
        <div className="mx-auto max-w-xl px-4 sm:px-5">
          <p className="font-script text-3xl text-primary sm:text-4xl">Forever yours,</p>
          <p className="mt-1 font-display text-xl font-semibold sm:text-2xl">{content.couple.yourName}</p>
          <p className="mt-4 text-xs text-muted-foreground">{content.footer.line}</p>
          <p className="mt-1 text-[11px] text-muted-foreground">{content.footer.sub}</p>
          <p className="mt-4 text-xs italic text-accent">{content.footer.easterEgg}</p>
        </div>
      </footer>

      {/* Persistent Audio Mini-Player */}
      <MusicPlayer />
    </div>
  );
}
