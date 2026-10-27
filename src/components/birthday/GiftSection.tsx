import { useState } from "react";
import { Sparkles, Gift, Heart } from "lucide-react";
import confetti from "canvas-confetti";
import { content } from "@/lib/content";

interface GiftCard {
  id: number;
  label: string;
  hint: string;
  ribbonColor: string;
  boxColor: string;
  bgGradStart?: string;
  bgGradEnd?: string;
  borderColor?: string;
  glowColor?: string;
  ringColor?: string;
  ribbonGradStart: string;
  ribbonGradEnd: string;
  ribbonStroke: string;
  boxStroke: string;
}

const CARDS: GiftCard[] = [
  {
    id: 1,
    label: "Card #1: For My Queen 👑",
    hint: "Wrapped with all my endless adoration",
    ribbonColor: "#F43F5E",
    boxColor: "from-rose-100 to-pink-200 border-rose-300",
    ribbonGradStart: "#FB7185",
    ribbonGradEnd: "#E11D48",
    ribbonStroke: "#BE123C",
    boxStroke: "#FDA4AF",
    glowColor: "bg-pink-300/40 group-hover:bg-pink-400/50",
    ringColor: "ring-pink-400",
  },
  {
    id: 2,
    label: "Card #2: Pure Magic ✨",
    hint: "A cozy secret kept straight from the heart",
    ribbonColor: "#ED8231",
    boxColor: "from-orange-50 to-amber-100/80 border-[#ED8231]/40",
    ribbonGradStart: "#FFA25B",
    ribbonGradEnd: "#ED8231",
    ribbonStroke: "#C96116",
    boxStroke: "#FDBA74",
    glowColor: "bg-amber-300/40 group-hover:bg-orange-400/50",
    ringColor: "ring-[#ED8231]",
  },
  {
    id: 3,
    label: "Card #3: Always & Forever 💍",
    hint: "Full of cuddles, smiles, and warm hugs",
    ribbonColor: "#F54927",
    boxColor: "from-red-50 to-orange-100/80 border-[#F54927]/40",
    ribbonGradStart: "#FF7355",
    ribbonGradEnd: "#F54927",
    ribbonStroke: "#C63012",
    boxStroke: "#FCA5A5",
    glowColor: "bg-orange-300/40 group-hover:bg-red-400/50",
    ringColor: "ring-[#F54927]",
  },
];

export function GiftSection() {
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
  const [isOpening, setIsOpening] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [bearHugging, setBearHugging] = useState(false);

  const handleSelectCard = (id: number) => {
    if (isOpening || isRevealed) return;
    setSelectedCardId(id);
    setIsOpening(true);

    // Fire sound or haptic simulation & confetti bursts
    setTimeout(() => {
      try {
        confetti({
          particleCount: 60,
          spread: 80,
          origin: { y: 0.6 },
          colors: ["#F472B6", "#FB7185", "#FDA4AF", "#F43F5E", "#FFF"],
        });
      } catch {
        // no-op
      }
    }, 400);

    setTimeout(() => {
      setIsOpening(false);
      setIsRevealed(true);

      // Second celebratory confetti explosion
      try {
        confetti({
          particleCount: 100,
          spread: 100,
          origin: { y: 0.5 },
          colors: ["#EC4899", "#F43F5E", "#E11D48", "#FDE047", "#FFB6C1"],
        });
      } catch {
        // no-op
      }
    }, 900);
  };

  const handleReset = () => {
    setIsRevealed(false);
    setIsOpening(false);
    setSelectedCardId(null);
  };

  return (
    <div className="mx-auto max-w-4xl text-center">
      {/* Intro text */}
      <div className="mx-auto max-w-2xl px-4">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-pink-100 px-3.5 py-1 text-xs font-semibold text-pink-700">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Interactive Surprise</span>
        </span>
        <h3 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
          Pick A Gift Card, My Love 🎁
        </h3>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          There are three special wrapped gift cards waiting for you. Choose whichever calls to your heart and open your surprise!
        </p>
      </div>

      {/* Main interactive area */}
      <div className="mt-10 sm:mt-14">
        {!isRevealed ? (
          /* The 3 Cards Selection Grid */
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-6 px-4">
            {CARDS.map((card) => {
              const isChosen = selectedCardId === card.id;

              return (
                <div
                  key={card.id}
                  onClick={() => handleSelectCard(card.id)}
                  className={`group relative flex flex-col items-center rounded-3xl border-2 p-6 shadow-soft transition-all duration-300 cursor-pointer select-none bg-gradient-to-b ${
                    card.boxColor
                  } ${
                    isChosen && isOpening
                      ? `scale-105 ring-4 ${card.ringColor} ring-offset-2`
                      : "hover:-translate-y-2 hover:shadow-xl active:scale-95"
                  }`}
                >
                  {/* Floating Sparkle on top */}
                  <div className="absolute -top-3 -right-2 text-xl animate-bounce">
                    ✨
                  </div>

                  {/* Gift Box Graphic with animated lid on click */}
                  <div className="relative my-4 flex h-36 w-36 items-center justify-center">
                    {/* Glow aura */}
                    <div className={`absolute inset-0 rounded-full blur-xl transition duration-300 ${card.glowColor}`} />

                    {/* Handcrafted Animated Gift SVG */}
                    <svg
                      viewBox="0 0 120 120"
                      className={`h-32 w-32 drop-shadow-md transition-transform duration-300 ${
                        isChosen && isOpening ? "" : "group-hover:scale-105"
                      }`}
                    >
                      <defs>
                        <linearGradient id={`boxGrad-${card.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#FFFFFF" />
                          <stop offset="100%" stopColor={card.id === 1 ? "#FED7E2" : card.id === 2 ? "#FED7AA" : "#FECACA"} />
                        </linearGradient>
                        <linearGradient id={`ribbonGrad-${card.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor={card.ribbonGradStart} />
                          <stop offset="100%" stopColor={card.ribbonGradEnd} />
                        </linearGradient>
                      </defs>

                      {/* Box Base */}
                      <rect
                        x="24"
                        y="52"
                        width="72"
                        height="54"
                        rx="8"
                        fill={`url(#boxGrad-${card.id})`}
                        stroke={card.boxStroke}
                        strokeWidth="2.5"
                      />

                      {/* Vertical Ribbon */}
                      <rect x="53" y="52" width="14" height="54" fill={`url(#ribbonGrad-${card.id})`} />

                      {/* Horizontal Ribbon on Base */}
                      <rect x="24" y="74" width="72" height="12" fill={`url(#ribbonGrad-${card.id})`} opacity="0.9" />

                      {/* Gift Box Lid with Opening Animation */}
                      <g
                        className={isChosen && isOpening ? "animate-gift-open-lid" : "group-hover:-translate-y-1 transition-transform"}
                        style={{ transformOrigin: "60px 48px" }}
                      >
                        {/* Lid Rectangle */}
                        <rect
                          x="20"
                          y="42"
                          width="80"
                          height="14"
                          rx="4"
                          fill="#FFFFFF"
                          stroke={card.boxStroke}
                          strokeWidth="2.5"
                        />
                        {/* Vertical Ribbon on Lid */}
                        <rect x="53" y="42" width="14" height="14" fill={`url(#ribbonGrad-${card.id})`} />

                        {/* Ribbon Bow on Lid */}
                        {/* Left Loop */}
                        <path
                          d="M60 42 C50 24, 30 30, 42 42 C48 42, 54 42, 60 42 Z"
                          fill={`url(#ribbonGrad-${card.id})`}
                          stroke={card.ribbonStroke}
                          strokeWidth="1.2"
                        />
                        {/* Right Loop */}
                        <path
                          d="M60 42 C70 24, 90 30, 78 42 C72 42, 66 42, 60 42 Z"
                          fill={`url(#ribbonGrad-${card.id})`}
                          stroke={card.ribbonStroke}
                          strokeWidth="1.2"
                        />
                        {/* Center Knot */}
                        <circle cx="60" cy="42" r="5" fill={card.ribbonGradEnd} stroke={card.ribbonStroke} strokeWidth="1.2" />
                      </g>
                    </svg>
                  </div>

                  {/* Card Title & Hint */}
                  <h4 className="mt-2 text-base font-bold text-foreground sm:text-lg">{card.label}</h4>
                  <p className="mt-1 text-xs text-muted-foreground">{card.hint}</p>

                  {/* Action CTA */}
                  <button
                    disabled={isOpening}
                    className="mt-4 flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white shadow-soft transition hover:scale-105 active:scale-95 group-hover:bg-primary/90"
                  >
                    <Gift className="h-3.5 w-3.5" />
                    <span>{isChosen && isOpening ? "Opening... 🎁✨" : "Tap To Open"}</span>
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          /* Revealed Big Pink Teddy Bear Showcase */
          <div className="glass mx-auto max-w-2xl rounded-3xl border-2 border-pink-300/80 p-6 sm:p-10 shadow-2xl animate-bear-pop-out bg-gradient-to-b from-pink-50/90 via-white to-rose-50/90">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-pink-100 px-4 py-1.5 text-xs font-bold text-pink-700 shadow-sm sm:text-sm">
              <Heart className="h-4 w-4 fill-pink-500 text-pink-500 animate-pulse" />
              <span>Surprise Unlocked for {content.couple.herName}! 💖🧸</span>
            </div>

            <h4 className="mt-4 font-display text-3xl font-bold text-primary sm:text-4xl md:text-5xl">
              A Giant Teddy Bear For You! 🌸🧸
            </h4>
            <p className="mx-auto mt-2 max-w-md text-xs text-muted-foreground sm:text-sm">
              Whenever I am not right beside you, squeeze this fluffy bear and know that I love you more than all the stars in the sky!
            </p>

            {/* Giant Teddy Bear Graphic - Responsive for mobile */}
            <div
              onClick={() => setBearHugging((prev) => !prev)}
              className="relative mx-auto my-4 sm:my-6 flex h-60 w-60 sm:h-80 sm:w-80 cursor-pointer items-center justify-center select-none transition-transform duration-300 hover:scale-105 active:scale-95"
              title="Tap me for a hug!"
            >
              {/* Floating hearts surrounding bear */}
              <div className="pointer-events-none absolute -inset-3 sm:-inset-4 animate-pulse opacity-80">
                <span className="absolute top-2 left-4 sm:left-6 text-xl sm:text-2xl">💖</span>
                <span className="absolute top-4 sm:top-6 right-2 sm:right-4 text-2xl sm:text-3xl">🌸</span>
                <span className="absolute bottom-8 sm:bottom-10 left-1 sm:left-2 text-xl sm:text-2xl">✨</span>
                <span className="absolute bottom-3 sm:bottom-4 right-6 sm:right-8 text-xl sm:text-2xl">💕</span>
              </div>

              {/* Handcrafted Big Teddy Bear SVG */}
              <svg viewBox="0 0 200 220" className="h-full w-full drop-shadow-2xl">
                <defs>
                  {/* Big Pink Bear Fur Gradient */}
                  <radialGradient id="pinkFur" cx="40%" cy="35%" r="65%">
                    <stop offset="0%" stopColor="#FFA4C4" />
                    <stop offset="50%" stopColor="#F472B6" />
                    <stop offset="100%" stopColor="#DB2777" />
                  </radialGradient>

                  {/* Soft Pink Tummy / Snout Gradient */}
                  <radialGradient id="pinkLight" cx="45%" cy="40%" r="60%">
                    <stop offset="0%" stopColor="#FFF0F5" />
                    <stop offset="70%" stopColor="#FCE7F3" />
                    <stop offset="100%" stopColor="#FBCFE8" />
                  </radialGradient>

                  {/* Red Heart Gradient */}
                  <linearGradient id="pinkHeart" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FB7185" />
                    <stop offset="50%" stopColor="#E11D48" />
                    <stop offset="100%" stopColor="#9F1239" />
                  </linearGradient>

                  {/* Crown Gradient */}
                  <linearGradient id="pinkCrown" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#FDE047" />
                    <stop offset="50%" stopColor="#FACC15" />
                    <stop offset="100%" stopColor="#CA8A04" />
                  </linearGradient>
                </defs>

                {/* EARS */}
                {/* Left Ear */}
                <g>
                  <circle cx="56" cy="55" r="26" fill="url(#pinkFur)" stroke="#BE185D" strokeWidth="3" />
                  <circle cx="56" cy="55" r="15" fill="url(#pinkLight)" opacity="0.95" />
                </g>

                {/* Right Ear */}
                <g>
                  <circle cx="144" cy="55" r="26" fill="url(#pinkFur)" stroke="#BE185D" strokeWidth="3" />
                  <circle cx="144" cy="55" r="15" fill="url(#pinkLight)" opacity="0.95" />
                </g>

                {/* BIG CHUBBY LEGS */}
                {/* Left Leg */}
                <g>
                  <ellipse cx="60" cy="186" rx="26" ry="18" fill="url(#pinkFur)" stroke="#BE185D" strokeWidth="3" />
                  <ellipse cx="60" cy="186" rx="15" ry="10" fill="url(#pinkLight)" opacity="0.9" />
                  {/* Paw pads */}
                  <circle cx="50" cy="178" r="3" fill="#BE185D" opacity="0.5" />
                  <circle cx="60" cy="174" r="3" fill="#BE185D" opacity="0.5" />
                  <circle cx="70" cy="178" r="3" fill="#BE185D" opacity="0.5" />
                </g>

                {/* Right Leg */}
                <g>
                  <ellipse cx="140" cy="186" rx="26" ry="18" fill="url(#pinkFur)" stroke="#BE185D" strokeWidth="3" />
                  <ellipse cx="140" cy="186" rx="15" ry="10" fill="url(#pinkLight)" opacity="0.9" />
                  {/* Paw pads */}
                  <circle cx="130" cy="178" r="3" fill="#BE185D" opacity="0.5" />
                  <circle cx="140" cy="174" r="3" fill="#BE185D" opacity="0.5" />
                  <circle cx="150" cy="178" r="3" fill="#BE185D" opacity="0.5" />
                </g>

                {/* BIG CHUBBY BODY */}
                <ellipse cx="100" cy="138" rx="56" ry="50" fill="url(#pinkFur)" stroke="#BE185D" strokeWidth="3" />
                {/* Fluffy Tummy Patch */}
                <ellipse cx="100" cy="144" rx="36" ry="30" fill="url(#pinkLight)" opacity="0.95" />

                {/* BIG ADORABLE HEAD */}
                <circle cx="100" cy="88" r="52" fill="url(#pinkFur)" stroke="#BE185D" strokeWidth="3" />

                {/* Princess Crown for Lel */}
                <g transform="translate(76, 24) scale(1.3)">
                  <path
                    d="M3 18 L7 6 L18 13 L29 6 L33 18 Z"
                    fill="url(#pinkCrown)"
                    stroke="#A16207"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                  />
                  <circle cx="7" cy="6" r="2.2" fill="#E11D48" />
                  <circle cx="18" cy="13" r="2.2" fill="#3B82F6" />
                  <circle cx="29" cy="6" r="2.2" fill="#E11D48" />
                </g>

                {/* Rosy Pink Cheeks */}
                <ellipse cx="64" cy="98" rx="9" ry="6" fill="#F43F5E" opacity="0.75" />
                <ellipse cx="136" cy="98" rx="9" ry="6" fill="#F43F5E" opacity="0.75" />

                {/* Big Cute Snout */}
                <ellipse cx="100" cy="100" rx="28" ry="20" fill="url(#pinkLight)" stroke="#BE185D" strokeWidth="2" />

                {/* Heart Nose */}
                <path
                  d="M92 92 C92 88, 108 88, 108 92 C108 99, 100 104, 100 104 C100 104, 92 99, 92 92 Z"
                  fill="#831843"
                />

                {/* Warm Cute Smile */}
                <path
                  d="M100 104 L100 109 M90 110 Q100 118 110 110"
                  stroke="#831843"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  fill="none"
                />

                {/* Sparkly Big Anime Eyes */}
                {/* Left Eye */}
                <g>
                  <circle cx="75" cy="80" r="7.2" fill="#3B0764" />
                  <circle cx="72.5" cy="77.5" r="2.8" fill="#FFFFFF" />
                  <circle cx="77.5" cy="82.5" r="1.3" fill="#FFFFFF" opacity="0.85" />
                </g>

                {/* Right Eye */}
                <g>
                  <circle cx="125" cy="80" r="7.2" fill="#3B0764" />
                  <circle cx="122.5" cy="77.5" r="2.8" fill="#FFFFFF" />
                  <circle cx="127.5" cy="82.5" r="1.3" fill="#FFFFFF" opacity="0.85" />
                </g>

                {/* ARMS HOLDING A BIG GLOWING HEART */}
                {/* Left Arm */}
                <ellipse
                  cx="66"
                  cy="134"
                  rx="16"
                  ry="14"
                  fill="url(#pinkFur)"
                  stroke="#BE185D"
                  strokeWidth="3"
                  transform={bearHugging ? "rotate(12 66 134)" : ""}
                />
                <ellipse cx="66" cy="134" rx="8" ry="7" fill="url(#pinkLight)" opacity="0.8" />

                {/* Right Arm */}
                <ellipse
                  cx="134"
                  cy="134"
                  rx="16"
                  ry="14"
                  fill="url(#pinkFur)"
                  stroke="#BE185D"
                  strokeWidth="3"
                  transform={bearHugging ? "rotate(-12 134 134)" : ""}
                />
                <ellipse cx="134" cy="134" rx="8" ry="7" fill="url(#pinkLight)" opacity="0.8" />

                {/* Giant Love Heart in Teddy's Paws */}
                <g
                  className="transition-transform duration-300"
                  style={{
                    transform: bearHugging ? "scale(1.15)" : "scale(1)",
                    transformOrigin: "100px 130px",
                  }}
                >
                  <path
                    d="M100 126 C99 114, 82 106, 76 116 C69 125, 74 138, 100 156 C126 138, 131 125, 124 116 C118 106, 101 114, 100 126 Z"
                    fill="url(#pinkHeart)"
                    stroke="#881337"
                    strokeWidth="2.5"
                    className="drop-shadow-lg"
                  />
                  {/* Heart reflection */}
                  <path
                    d="M80 118 Q86 112 92 116"
                    stroke="#FFF"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    fill="none"
                    opacity="0.9"
                  />
                  <text
                    x="100"
                    y="136"
                    fontSize="10"
                    fontWeight="bold"
                    fill="#FFF"
                    textAnchor="middle"
                    className="font-script select-none"
                  >
                    LEL ♥
                  </text>
                </g>
              </svg>
            </div>

            {/* Handwritten Message Under Teddy */}
            <div className="rounded-2xl bg-pink-100/70 p-4 border border-pink-200">
              <p className="font-handwriting text-2xl sm:text-3xl font-bold text-pink-900 leading-snug">
                "Here is your giant cuddle buddy, my queen! Made just for you to hug forever and ever."
              </p>
              <p className="mt-2 text-xs text-pink-700 font-medium">
                Tap the bear anytime for an extra warm squeeze! 🐾💕
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}