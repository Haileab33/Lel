import { useEffect, useRef, useState, useCallback } from "react";
import { Heart, Sparkles, X, RotateCcw } from "lucide-react";

const LOVE_MESSAGES = [
  "ለልቤ ንግሥት ❤️👑",
  "Happy Birthday Lel! 🎂✨",
  "I love you to the moon & back! 🌙❤️",
  "Walking beside you always! 🐾🧸",
  "You make every single day brighter! 🌸",
  "Keep scrolling, my beautiful queen! 💖",
  "መልካም ልደት የኔ ፍቅር! 🎉🥰",
  "Forever yours, always. 🫶🏽💍",
];

interface FloatingHeart {
  id: number;
  x: number;
  y: number;
  char: string;
  size: number;
}

export function TeddyBear() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<"down" | "up">("down");
  const [scrollSpeed, setScrollSpeed] = useState(0);
  const [step, setStep] = useState(0);

  // Dragging state
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ startX: number; startY: number; origX: number; origY: number; moved: boolean }>({
    startX: 0,
    startY: 0,
    origX: 0,
    origY: 0,
    moved: false,
  });

  // Tap & speech bubble state
  const [messageIndex, setMessageIndex] = useState(0);
  const [showMessage, setShowMessage] = useState(false);
  const [isWiggling, setIsWiggling] = useState(false);
  const [floatingHearts, setFloatingHearts] = useState<FloatingHeart[]>([]);
  const scrollTimeoutRef = useRef<number | null>(null);
  const lastScrollYRef = useRef(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Track page scroll with dynamic velocity and walking step calculations
  useEffect(() => {
    lastScrollYRef.current = window.scrollY;

    const handleScroll = () => {
      const currentY = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total > 0) {
        setScrollProgress(Math.min(100, Math.max(0, (currentY / total) * 100)));
      }

      const delta = currentY - lastScrollYRef.current;
      const absDelta = Math.abs(delta);

      if (absDelta > 1) {
        setIsScrolling(true);
        setScrollDirection(delta > 0 ? "down" : "up");
        setScrollSpeed(Math.min(absDelta, 40));
        // Driven footstep cycle based on scroll pixels
        setStep(Math.floor(currentY / 16) % 4);

        if (scrollTimeoutRef.current) {
          window.clearTimeout(scrollTimeoutRef.current);
        }
        scrollTimeoutRef.current = window.setTimeout(() => {
          setIsScrolling(false);
          setScrollSpeed(0);
        }, 180);
      }

      lastScrollYRef.current = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) window.clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  // Spawn floating heart particles on tap
  const spawnHearts = useCallback((originX: number, originY: number) => {
    const chars = ["💖", "✨", "❤️", "🧸", "💕", "🌸"];
    const newHearts: FloatingHeart[] = Array.from({ length: 6 }).map((_, i) => ({
      id: Date.now() + i + Math.random(),
      x: (Math.random() - 0.5) * 60,
      y: -20 - Math.random() * 40,
      char: chars[Math.floor(Math.random() * chars.length)] ?? "💖",
      size: 14 + Math.floor(Math.random() * 10),
    }));

    setFloatingHearts((prev) => [...prev.slice(-12), ...newHearts]);

    setTimeout(() => {
      setFloatingHearts((prev) => prev.filter((h) => !newHearts.some((nh) => nh.id === h.id)));
    }, 1200);
  }, []);

  // Handle tap / click
  const handleBearClick = (e: React.MouseEvent | React.TouchEvent) => {
    if (dragStartRef.current.moved) return;

    setIsWiggling(true);
    setTimeout(() => setIsWiggling(false), 700);

    // Cycle sweet message
    setMessageIndex((prev) => (prev + 1) % LOVE_MESSAGES.length);
    setShowMessage(true);

    const clientX = "clientX" in e ? e.clientX : e.touches[0]?.clientX || 0;
    const clientY = "clientY" in e ? e.clientY : e.touches[0]?.clientY || 0;
    spawnHearts(clientX, clientY);
  };

  // Pointer drag events for maximum flexibility (relocate bear anywhere)
  const handlePointerDown = (e: React.PointerEvent) => {
    // Only drag with left mouse button or touch
    if (e.button !== 0 && e.pointerType === "mouse") return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const currentX = position ? position.x : rect.left;
    const currentY = position ? position.y : rect.top;

    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      origX: currentX,
      origY: currentY,
      moved: false,
    };

    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.startX;
    const dy = e.clientY - dragStartRef.current.startY;

    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
      dragStartRef.current.moved = true;
    }

    const nextX = Math.max(10, Math.min(window.innerWidth - 86, dragStartRef.current.origX + dx));
    const nextY = Math.max(10, Math.min(window.innerHeight - 100, dragStartRef.current.origY + dy));

    setPosition({ x: nextX, y: nextY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    } catch {
      // Ignore if not supported
    }
  };

  // Walking & flexibility physics calculation
  // Tilt lean angle
  const leanAngle = isScrolling ? (scrollDirection === "down" ? 7 : -7) * Math.min(scrollSpeed / 10, 1.4) : 0;
  // Dynamic squash & stretch
  const squashX = isScrolling ? 1 + (scrollSpeed / 120) * 0.1 : 1;
  const squashY = isScrolling ? 1 - (scrollSpeed / 120) * 0.08 : 1;
  // Vertical step bounce
  const bounceY = isScrolling ? (step % 2 === 0 ? -8 : -1) : 0;
  // Left and right leg rotations
  const leftLegAngle = isScrolling ? (step === 0 ? -16 : step === 2 ? 14 : 0) : 0;
  const rightLegAngle = isScrolling ? (step === 0 ? 14 : step === 2 ? -16 : 0) : 0;
  // Paw swinging
  const leftArmAngle = isScrolling ? (step === 0 ? 8 : -8) : 0;
  const rightArmAngle = isScrolling ? (step === 0 ? -8 : 8) : 0;

  // Reset to default dock position
  const resetPosition = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPosition(null);
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={
        position
          ? {
              left: `${position.x}px`,
              top: `${position.y}px`,
            }
          : undefined
      }
      className={`fixed z-40 select-none touch-none ${
        position ? "" : "bottom-5 left-3 sm:bottom-6 sm:left-6"
      } ${isDragging ? "cursor-grabbing scale-105" : "cursor-grab"}`}
      aria-label="Interactive Teddy Bear Companion"
    >
      {/* Floating Heart Particles */}
      {floatingHearts.map((h) => (
        <span
          key={h.id}
          className="pointer-events-none absolute font-bold animate-out fade-out duration-1000"
          style={{
            transform: `translate(${h.x}px, ${h.y}px)`,
            fontSize: `${h.size}px`,
            zIndex: 60,
          }}
        >
          {h.char}
        </span>
      ))}

      {/* Sweet Speech Bubble */}
      {showMessage && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute -top-16 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1.5 max-w-[260px] sm:max-w-none whitespace-normal sm:whitespace-nowrap rounded-2xl glass px-3 py-1.5 shadow-soft border border-primary/30 text-xs font-semibold text-foreground backdrop-blur-xl animate-fade-rise"
        >
          <span>{LOVE_MESSAGES[messageIndex]}</span>
          <button
            onClick={() => setShowMessage(false)}
            className="ml-1 text-muted-foreground hover:text-foreground transition p-0.5 rounded-full shrink-0"
            aria-label="Close message"
          >
            <X className="h-3 w-3" />
          </button>
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 h-3 w-3 rotate-45 bg-card border-r border-b border-primary/20" />
        </div>
      )}

      {/* Main Teddy Bear Body Container */}
      <div
        onClick={handleBearClick}
        className="group relative flex flex-col items-center"
        style={{
          transform: `translate3d(0, ${bounceY}px, 0) rotate(${leanAngle}deg) scale(${squashX}, ${squashY}) ${
            isWiggling ? "scale(1.15) rotate(10deg)" : ""
          }`,
          transition: isDragging
            ? "none"
            : "transform 0.16s cubic-bezier(0.34, 1.56, 0.64, 1)",
          transformOrigin: "bottom center",
        }}
      >
        {/* Soft shadow that expands/contracts with bounce */}
        <div
          className="absolute -bottom-1.5 h-3 w-14 sm:w-16 rounded-full bg-black/15 blur-[3px] transition-all duration-200"
          style={{
            transform: `scale(${isScrolling ? (step % 2 === 0 ? 0.8 : 1.1) : 1})`,
            opacity: isScrolling ? (step % 2 === 0 ? 0.2 : 0.35) : 0.3,
          }}
        />

        {/* Custom Hand-Crafted SVG Teddy Bear - Scaled neatly for mobile screens */}
        <svg
          viewBox="0 0 100 115"
          className="h-16 w-14 sm:h-24 sm:w-20 drop-shadow-md transition-transform duration-200 group-hover:scale-105"
        >
          <defs>
            {/* Fur gradient */}
            <linearGradient id="bearFur" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C48B58" />
              <stop offset="50%" stopColor="#B37A44" />
              <stop offset="100%" stopColor="#9C6434" />
            </linearGradient>

            {/* Inner Ear & Snout Gradient */}
            <linearGradient id="bearLight" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FDEBD9" />
              <stop offset="100%" stopColor="#F5D7B7" />
            </linearGradient>

            {/* Heart Gradient */}
            <linearGradient id="bearHeart" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FB7185" />
              <stop offset="50%" stopColor="#E11D48" />
              <stop offset="100%" stopColor="#BE123C" />
            </linearGradient>

            {/* Crown Gold Gradient */}
            <linearGradient id="bearCrown" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="60%" stopColor="#EAB308" />
              <stop offset="100%" stopColor="#CA8A04" />
            </linearGradient>
          </defs>

          {/* EARS */}
          {/* Left Ear */}
          <g>
            <circle cx="28" cy="27" r="13" fill="url(#bearFur)" stroke="#7D4924" strokeWidth="1.8" />
            <circle cx="28" cy="27" r="7.5" fill="url(#bearLight)" opacity="0.95" />
          </g>

          {/* Right Ear */}
          <g>
            <circle cx="72" cy="27" r="13" fill="url(#bearFur)" stroke="#7D4924" strokeWidth="1.8" />
            <circle cx="72" cy="27" r="7.5" fill="url(#bearLight)" opacity="0.95" />
          </g>

          {/* LEGS (Animated for walking motion) */}
          {/* Left Leg */}
          <g
            style={{
              transform: `rotate(${leftLegAngle}deg)`,
              transformOrigin: "32px 92px",
              transition: isScrolling ? "transform 0.08s ease" : "transform 0.2s ease",
            }}
          >
            <ellipse cx="32" cy="94" rx="12" ry="9" fill="url(#bearFur)" stroke="#7D4924" strokeWidth="1.8" />
            <ellipse cx="32" cy="94" rx="7" ry="5" fill="url(#bearLight)" opacity="0.9" />
            <circle cx="27" cy="90" r="1.5" fill="#7D4924" opacity="0.5" />
            <circle cx="32" cy="88" r="1.5" fill="#7D4924" opacity="0.5" />
            <circle cx="37" cy="90" r="1.5" fill="#7D4924" opacity="0.5" />
          </g>

          {/* Right Leg */}
          <g
            style={{
              transform: `rotate(${rightLegAngle}deg)`,
              transformOrigin: "68px 92px",
              transition: isScrolling ? "transform 0.08s ease" : "transform 0.2s ease",
            }}
          >
            <ellipse cx="68" cy="94" rx="12" ry="9" fill="url(#bearFur)" stroke="#7D4924" strokeWidth="1.8" />
            <ellipse cx="68" cy="94" rx="7" ry="5" fill="url(#bearLight)" opacity="0.9" />
            <circle cx="63" cy="90" r="1.5" fill="#7D4924" opacity="0.5" />
            <circle cx="68" cy="88" r="1.5" fill="#7D4924" opacity="0.5" />
            <circle cx="73" cy="90" r="1.5" fill="#7D4924" opacity="0.5" />
          </g>

          {/* BODY */}
          <ellipse cx="50" cy="69" rx="28" ry="25" fill="url(#bearFur)" stroke="#7D4924" strokeWidth="1.8" />
          {/* Tummy Patch */}
          <ellipse cx="50" cy="72" rx="18" ry="15" fill="url(#bearLight)" opacity="0.95" />

          {/* HEAD */}
          <circle cx="50" cy="43" r="26" fill="url(#bearFur)" stroke="#7D4924" strokeWidth="1.8" />

          {/* Tiny Royal Crown for Lel's bear */}
          <g transform="translate(38, 11) scale(0.65)">
            <path
              d="M3 18 L7 6 L18 13 L29 6 L33 18 Z"
              fill="url(#bearCrown)"
              stroke="#A16207"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            {/* Jewels on crown */}
            <circle cx="7" cy="6" r="2" fill="#E11D48" />
            <circle cx="18" cy="13" r="2" fill="#3B82F6" />
            <circle cx="29" cy="6" r="2" fill="#E11D48" />
          </g>

          {/* Rosy Cheeks */}
          <ellipse cx="32" cy="48" rx="4.5" ry="3" fill="#FB7185" opacity="0.65" />
          <ellipse cx="68" cy="48" rx="4.5" ry="3" fill="#FB7185" opacity="0.65" />

          {/* Snout */}
          <ellipse cx="50" cy="49" rx="14" ry="10" fill="url(#bearLight)" stroke="#7D4924" strokeWidth="1.2" />

          {/* Nose */}
          <path
            d="M45.5 45 C45.5 43.5, 54.5 43.5, 54.5 45 C54.5 48, 50 50.5, 50 50.5 C50 50.5, 45.5 48, 45.5 45 Z"
            fill="#341A0B"
          />

          {/* Sweet Smile */}
          <path
            d="M50 50.5 L50 53 M45 53.5 Q50 57.5 55 53.5"
            stroke="#341A0B"
            strokeWidth="1.7"
            strokeLinecap="round"
            fill="none"
          />

          {/* Eyes with glimmer */}
          {/* Left Eye */}
          <g>
            <circle cx="37" cy="38" r="3.6" fill="#24140D" />
            <circle cx="35.8" cy="36.8" r="1.3" fill="#FFFFFF" />
            <circle cx="38.2" cy="39" r="0.6" fill="#FFFFFF" opacity="0.7" />
          </g>

          {/* Right Eye */}
          <g>
            <circle cx="63" cy="38" r="3.6" fill="#24140D" />
            <circle cx="61.8" cy="36.8" r="1.3" fill="#FFFFFF" />
            <circle cx="64.2" cy="39" r="0.6" fill="#FFFFFF" opacity="0.7" />
          </g>

          {/* ARMS HOLDING HEART */}
          {/* Left Paw/Arm */}
          <g
            style={{
              transform: `rotate(${leftArmAngle}deg)`,
              transformOrigin: "34px 66px",
              transition: isScrolling ? "transform 0.08s ease" : "transform 0.2s ease",
            }}
          >
            <ellipse cx="33" cy="67" rx="8" ry="7" fill="url(#bearFur)" stroke="#7D4924" strokeWidth="1.8" />
            <ellipse cx="33" cy="67" rx="4" ry="3.5" fill="url(#bearLight)" opacity="0.8" />
          </g>

          {/* Glowing Red Heart */}
          <g
            className="transition-transform duration-300"
            style={{
              transform: `scale(${isScrolling ? 1.08 : 1})`,
              transformOrigin: "50px 65px",
            }}
          >
            <path
              d="M50 63 C49.5 57, 41 53, 38 58 C34.5 62.5, 37 69, 50 78 C63 69, 65.5 62.5, 62 58 C59 53, 50.5 57, 50 63 Z"
              fill="url(#bearHeart)"
              stroke="#9F1239"
              strokeWidth="1.2"
              className="drop-shadow-sm"
            />
            {/* Heart Specular Reflection */}
            <path
              d="M40 59 Q43 56 46 58"
              stroke="#FECDD3"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
              opacity="0.9"
            />
          </g>

          {/* Right Paw/Arm */}
          <g
            style={{
              transform: `rotate(${rightArmAngle}deg)`,
              transformOrigin: "66px 66px",
              transition: isScrolling ? "transform 0.08s ease" : "transform 0.2s ease",
            }}
          >
            <ellipse cx="67" cy="67" rx="8" ry="7" fill="url(#bearFur)" stroke="#7D4924" strokeWidth="1.8" />
            <ellipse cx="67" cy="67" rx="4" ry="3.5" fill="url(#bearLight)" opacity="0.8" />
          </g>
        </svg>

        {/* Floating Mini Scroll Badge */}
        <div className="mt-1 flex items-center gap-1 rounded-full glass px-2 py-0.5 text-[9px] font-bold text-primary shadow-sm border border-primary/20 backdrop-blur-sm transition group-hover:scale-105">
          <span className="text-[10px]">{isScrolling ? "🐾" : "🧸"}</span>
          <span>{Math.round(scrollProgress)}%</span>
        </div>
      </div>

      {/* Reset position button if user dragged the bear */}
      {position && (
        <button
          onClick={resetPosition}
          title="Reset bear to corner"
          className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white shadow hover:bg-black transition active:scale-90"
        >
          <RotateCcw className="h-2.5 w-2.5" />
        </button>
      )}
    </div>
  );
}
