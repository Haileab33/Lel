import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const hasDark = document.documentElement.classList.contains("dark");
    setIsDark(hasDark);
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  if (!mounted) {
    return (
      <button
        type="button"
        className={`flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary transition active:scale-95 sm:h-10 sm:w-10 ${className}`}
        aria-label="Toggle dark mode"
      >
        <Moon className="h-4 w-4 sm:h-5 sm:w-5" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary transition active:scale-95 hover:bg-primary/20 ${className}`}
      aria-label={isDark ? "Switch to romantic daylight mode" : "Switch to romantic night mode"}
      title={isDark ? "Switch to romantic daylight mode" : "Switch to romantic night mode"}
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-amber-400 transition-transform duration-300 hover:rotate-45 sm:h-5 sm:w-5" />
      ) : (
        <Moon className="h-4 w-4 text-primary transition-transform duration-300 hover:-rotate-12 sm:h-5 sm:w-5" />
      )}
    </button>
  );
}
