import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";

const navLinks = [
  { label: "Home", href: "/#home" },
  { label: "About", href: "/#about" },
  { label: "Pillars", href: "/#pillars" },
  { label: "Team", href: "/team" },
  { label: "Gallery", href: "/gallery" },
  { label: "Partners", href: "/#partners" },
  { label: "Projects", href: "/projects" },
  { label: "Contact", href: "/#contact" },
];

const Navbar = () => {
  const [stuck, setStuck] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isHomePage = location.pathname === "/" || location.pathname === "/index";

  // Handle scrolling to hash on page load or hash change
  useEffect(() => {
    if (isHomePage && location.hash) {
      const timeoutId = setTimeout(() => {
        const sectionId = location.hash.substring(1);
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [location.hash, isHomePage]);

  // Handle sticky nav on scroll
  useEffect(() => {
    const handleScroll = () => {
      setStuck(window.scrollY > 60);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileOpen(false); // Close mobile menu if open

    // Check if it's a hash link targeting the homepage
    if (href.startsWith("/#")) {
      if (isHomePage) {
        // Already on home, just scroll
        const sectionId = href.substring(2);
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        } else if (sectionId === "home") {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      } else {
        // Navigate to home page with hash
        navigate(href);
      }
    } else {
      // Normal route navigation
      navigate(href);
    }
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (isHomePage) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate("/");
    }
  };

  return (
    <>
      {/* MOBILE MENU */}
      <div id="mob-menu" className={mobileOpen ? "open" : ""}>
        <a href="/" onClick={handleLogoClick} className="mob-menu-logo">
          <img src="/afosi_logo.png" alt="AFOSI" className="h-10 w-auto" />
        </a>
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={(e) => handleNavClick(e, link.href)}
            style={location.pathname === link.href ? { color: "var(--or)" } : {}}
          >
            {link.label}
          </a>
        ))}
        <a 
          href="/opportunities" 
          onClick={(e) => handleNavClick(e, "/opportunities")}
          style={location.pathname === "/opportunities" ? { color: "var(--or)" } : {}}
        >
          Opportunities
        </a>
      </div>

      {/* NAV */}
      <nav id="nav" className={stuck ? "stuck" : ""}>
        <a href="/" onClick={handleLogoClick} className="nav-logo">
          <img
            src="/afosi_logo_white.png"
            alt="AFOSI"
            className="nav-logo-img nav-logo-white"
          />
          <img
            src="/afosi_logo.png"
            alt="AFOSI"
            className="nav-logo-img nav-logo-color"
          />
        </a>
        <ul className="nav-links">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                style={location.pathname === link.href || (isHomePage && location.hash === link.href.substring(1)) ? { color: "var(--or)" } : {}}
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="/opportunities"
              onClick={(e) => handleNavClick(e, "/opportunities")}
              className="nav-btn"
            >
              Opportunities
            </a>
          </li>
        </ul>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <ThemeToggle />
          <button
            className="nav-ham"
            id="hamBtn"
            aria-label="Menu"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <span
              style={mobileOpen ? { transform: "rotate(45deg) translate(4px, 5px)" } : {}}
            ></span>
            <span style={mobileOpen ? { opacity: 0 } : {}}></span>
            <span
              style={mobileOpen ? { transform: "rotate(-45deg) translate(4px, -5px)" } : {}}
            ></span>
          </button>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
