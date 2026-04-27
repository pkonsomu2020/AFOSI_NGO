import { useEffect, useState } from "react";

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [ringPosition, setRingPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    let mx = 0, my = 0;
    let rx = 0, ry = 0;

    const updateMousePosition = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      setMousePosition({ x: mx, y: my });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.classList.contains("pillar-card") ||
        target.classList.contains("proj-card") ||
        target.classList.contains("p-name") ||
        target.classList.contains("track-btn") ||
        target.classList.contains("track-dot")
      ) {
        setIsHovering(true);
        document.body.classList.add("link-hover");
      } else {
        setIsHovering(false);
        document.body.classList.remove("link-hover");
      }
    };

    // Smooth ring follow animation
    const animateRing = () => {
      rx += (mx - rx) * 0.10;
      ry += (my - ry) * 0.10;
      setRingPosition({ x: rx, y: ry });
      requestAnimationFrame(animateRing);
    };

    window.addEventListener("mousemove", updateMousePosition);
    window.addEventListener("mouseover", handleMouseOver);
    animateRing();

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  // Hide on mobile
  if (typeof window !== 'undefined' && window.innerWidth < 768) {
    return null;
  }

  return (
    <>
      {/* Cursor Dot */}
      <div
        id="cur"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: isHovering ? "50px" : "10px",
          height: isHovering ? "50px" : "10px",
          backgroundColor: "var(--or)",
          borderRadius: "50%",
          pointerEvents: "none",
          transform: `translate(${mousePosition.x}px, ${mousePosition.y}px) translate(-50%, -50%)`,
          transition: "width 0.18s, height 0.18s, background 0.18s",
          zIndex: 8999,
          mixBlendMode: isHovering ? "exclusion" : "normal",
        }}
      />
      {/* Cursor Ring */}
      <div
        id="cur-ring"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: isHovering ? "50px" : "44px",
          height: isHovering ? "50px" : "44px",
          border: isHovering ? "1.5px solid transparent" : "1.5px solid rgba(224, 90, 24, 0.4)",
          borderRadius: "50%",
          pointerEvents: "none",
          transform: `translate(${ringPosition.x}px, ${ringPosition.y}px) translate(-50%, -50%)`,
          transition: "width 0.22s, height 0.22s, border-color 0.2s",
          zIndex: 8998,
        }}
      />
    </>
  );
}
