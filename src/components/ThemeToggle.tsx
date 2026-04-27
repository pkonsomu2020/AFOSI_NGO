import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    // If system is selected, we resolve it first
    if (theme === "system") {
      const isSystemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(isSystemDark ? "light" : "dark");
    } else {
      setTheme(theme === "dark" ? "light" : "dark");
    }
  };

  // We determine the active theme to conditionally render icons,
  // matching the new design's logic where light theme shows sun and dark shows moon.
  // Wait, the new design logic uses CSS display:none based on html[data-theme="light"],
  // but since we are in React, we can just render conditionally.
  // Actually, the new design uses .icon-moon and .icon-sun classes, but we can just use conditional rendering.
  
  const isLight = theme === "light" || (theme === "system" && !window.matchMedia("(prefers-color-scheme: dark)").matches);

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label="Toggle theme"
    >
      {isLight ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
