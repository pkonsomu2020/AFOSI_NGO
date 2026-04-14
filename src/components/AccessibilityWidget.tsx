import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn, Type, Underline, AlignJustify, Space, Moon, Sun, Contrast, FlipHorizontal, Palette, MousePointer2, BookOpen, Square, Pause } from "lucide-react";

interface A11yState {
  fontSize: number;
  dyslexiaFont: boolean;
  highlightLinks: boolean;
  lineHeight: boolean;
  letterSpacing: boolean;
  darkMode: boolean;
  highContrast: boolean;
  invertColors: boolean;
  grayscale: boolean;
  bigCursor: boolean;
  readingMask: boolean;
  stopMotion: boolean;
}

const DEFAULT: A11yState = {
  fontSize: 100,
  dyslexiaFont: false,
  highlightLinks: false,
  lineHeight: false,
  letterSpacing: false,
  darkMode: false,
  highContrast: false,
  invertColors: false,
  grayscale: false,
  bigCursor: false,
  readingMask: false,
  stopMotion: false,
};

const FONT_SIZES = [100, 110, 125, 150];

export default function AccessibilityWidget() {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<A11yState>(DEFAULT);
  const [maskY, setMaskY] = useState(0);

  const toggle = (key: keyof A11yState) => {
    setState(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const setFontSize = (size: number) => {
    setState(prev => ({ ...prev, fontSize: size }));
  };

  // Apply all effects to document
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    // Font size
    html.style.fontSize = `${state.fontSize}%`;

    // Dyslexia font
    if (state.dyslexiaFont) {
      body.style.fontFamily = "'Comic Sans MS', 'OpenDyslexic', cursive";
    } else {
      body.style.fontFamily = "";
    }

    // Highlight links
    const styleId = "a11y-highlight-links";
    let styleEl = document.getElementById(styleId) as HTMLStyleElement;
    if (state.highlightLinks) {
      if (!styleEl) {
        styleEl = document.createElement("style");
        styleEl.id = styleId;
        document.head.appendChild(styleEl);
      }
      styleEl.textContent = `a { outline: 2px solid #f97316 !important; background: #fff3e0 !important; }`;
    } else if (styleEl) {
      styleEl.textContent = "";
    }

    // Line height
    body.style.lineHeight = state.lineHeight ? "2" : "";

    // Letter spacing
    body.style.letterSpacing = state.letterSpacing ? "0.12em" : "";

    // Filters
    const filters: string[] = [];
    if (state.invertColors) filters.push("invert(1)");
    if (state.grayscale) filters.push("grayscale(1)");
    if (state.highContrast) filters.push("contrast(2)");
    html.style.filter = filters.join(" ");

    // Big cursor
    if (state.bigCursor) {
      body.style.cursor = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 24 24'%3E%3Cpath fill='%23f97316' d='M4 0l16 12-7 1-4 8z'/%3E%3C/svg%3E\") 0 0, auto";
    } else {
      body.style.cursor = "";
    }

    // Stop motion
    const motionStyleId = "a11y-stop-motion";
    let motionStyle = document.getElementById(motionStyleId) as HTMLStyleElement;
    if (state.stopMotion) {
      if (!motionStyle) {
        motionStyle = document.createElement("style");
        motionStyle.id = motionStyleId;
        document.head.appendChild(motionStyle);
      }
      motionStyle.textContent = `*, *::before, *::after { animation: none !important; transition: none !important; }`;
    } else if (motionStyle) {
      motionStyle.textContent = "";
    }
  }, [state]);

  // Reading mask follows mouse
  const handleMouseMove = useCallback((e: MouseEvent) => {
    setMaskY(e.clientY);
  }, []);

  useEffect(() => {
    if (state.readingMask) {
      window.addEventListener("mousemove", handleMouseMove);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
    }
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [state.readingMask, handleMouseMove]);

  const reset = () => {
    setState(DEFAULT);
    document.documentElement.style.cssText = "";
    document.body.style.cssText = "";
    ["a11y-highlight-links", "a11y-stop-motion"].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = "";
    });
  };

  const ToggleBtn = ({
    active, onClick, icon: Icon, label
  }: { active: boolean; onClick: () => void; icon: any; label: string }) => (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs font-semibold transition-all duration-200 ${
        active
          ? "bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/30"
          : "bg-background border-border text-foreground hover:border-orange-400 hover:text-orange-500"
      }`}
    >
      <Icon size={18} />
      {label}
    </button>
  );

  return (
    <>
      {/* Reading mask overlay */}
      {state.readingMask && (
        <div className="fixed inset-0 pointer-events-none z-[9998]">
          <div className="absolute inset-0 bg-black/60" style={{ clipPath: `inset(${maskY - 30}px 0 ${window.innerHeight - maskY - 30}px 0)` }} />
        </div>
      )}

      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Open accessibility menu"
        className="fixed bottom-6 left-6 z-[9999] w-16 h-16 rounded-full bg-orange-500 hover:bg-orange-600 shadow-2xl shadow-orange-500/40 flex items-center justify-center transition-all duration-300 hover:scale-110"
      >
        <img src="/icons8-accessibility-96.png" alt="Accessibility" className="w-10 h-10" />
      </button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-[9998] bg-black/20 backdrop-blur-sm" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="fixed bottom-0 left-0 top-0 z-[9999] w-80 bg-card border-r border-border shadow-2xl overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-orange-500">
                <div className="flex items-center gap-2 text-white">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <circle cx="12" cy="4" r="2" />
                    <path d="M19 7H5a1 1 0 000 2h5.5l-1.8 5.4A2 2 0 0010.6 17H8v4h2v-3h4v3h2v-4h-2.6l1.4-4.2 1.7 3.4A1 1 0 0018 17h1v-2h-.5l-2-4H19a1 1 0 000-2z" />
                  </svg>
                  <span className="font-bold text-base">Accessibility</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={reset} className="text-white/80 hover:text-white text-xs underline">Reset</button>
                  <button onClick={() => setOpen(false)} className="text-white hover:text-white/80 ml-1">
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="p-4 space-y-6">
                {/* Font Size */}
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Text Size</p>
                  <div className="grid grid-cols-4 gap-2">
                    {FONT_SIZES.map(size => (
                      <button
                        key={size}
                        onClick={() => setFontSize(size)}
                        className={`py-2 rounded-xl text-sm font-bold border transition-all ${
                          state.fontSize === size
                            ? "bg-orange-500 border-orange-500 text-white"
                            : "border-border text-foreground hover:border-orange-400"
                        }`}
                      >
                        {size}%
                      </button>
                    ))}
                  </div>
                </div>

                {/* Readability */}
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Readability</p>
                  <div className="grid grid-cols-2 gap-2">
                    <ToggleBtn active={state.dyslexiaFont} onClick={() => toggle("dyslexiaFont")} icon={Type} label="Dyslexia Font" />
                    <ToggleBtn active={state.highlightLinks} onClick={() => toggle("highlightLinks")} icon={Underline} label="Highlight Links" />
                    <ToggleBtn active={state.lineHeight} onClick={() => toggle("lineHeight")} icon={AlignJustify} label="Line Height" />
                    <ToggleBtn active={state.letterSpacing} onClick={() => toggle("letterSpacing")} icon={Space} label="Letter Spacing" />
                  </div>
                </div>

                {/* Visuals */}
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Visuals</p>
                  <div className="grid grid-cols-2 gap-2">
                    <ToggleBtn active={state.darkMode} onClick={() => { toggle("darkMode"); document.documentElement.classList.toggle("dark"); }} icon={state.darkMode ? Sun : Moon} label="Dark Mode" />
                    <ToggleBtn active={state.highContrast} onClick={() => toggle("highContrast")} icon={Contrast} label="High Contrast" />
                    <ToggleBtn active={state.invertColors} onClick={() => toggle("invertColors")} icon={FlipHorizontal} label="Invert Colors" />
                    <ToggleBtn active={state.grayscale} onClick={() => toggle("grayscale")} icon={Palette} label="Grayscale" />
                  </div>
                </div>

                {/* Focus & Navigation */}
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Focus & Navigation</p>
                  <div className="grid grid-cols-2 gap-2">
                    <ToggleBtn active={state.bigCursor} onClick={() => toggle("bigCursor")} icon={MousePointer2} label="Big Cursor" />
                    <ToggleBtn active={state.readingMask} onClick={() => toggle("readingMask")} icon={BookOpen} label="Reading Mask" />
                    <ToggleBtn active={state.stopMotion} onClick={() => toggle("stopMotion")} icon={Pause} label="Stop Motion" />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-5 py-4 border-t border-border text-center">
                <p className="text-xs text-muted-foreground">Accessibility tools for all users</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
