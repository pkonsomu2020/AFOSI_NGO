import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";

const navLinks = [
  { label: "Home", href: "/#home" },
  { label: "About", href: "/#about" },
  { label: "Pillars", href: "/#pillars" },
  { label: "Projects", href: "/projects" },
  { label: "Team", href: "/team" },
  { label: "News", href: "/news" },
  { label: "Gallery", href: "/gallery" },
  { label: "Opportunities", href: "/opportunities" },
  { label: "Contact", href: "/#contact" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showNav, setShowNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  
  const location = useLocation();
  const navigate = useNavigate();

  const isHomePage = location.pathname === "/" || location.pathname === "/index";

  // Hide on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShowNav(false); // scrolling down
      } else {
        setShowNav(true); // scrolling up
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

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

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileOpen(false); // Close mobile menu if open

    if (href.startsWith("/#")) {
      if (isHomePage) {
        const sectionId = href.substring(2);
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        } else if (sectionId === "home") {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      } else {
        navigate(href);
      }
    } else {
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

  const isActive = (href: string) => {
    if (location.pathname === href) return true;
    if (isHomePage && href.startsWith("/#") && location.hash === href.substring(1)) return true;
    if (isHomePage && href === "/#home" && !location.hash) return true; // Default home state
    return false;
  };

  return (
    <>
      {/* MOBILE MENU */}
      <div 
        className={`fixed inset-0 bg-[#F2F2F2] dark:bg-[#1A1410] z-[100] transition-transform duration-300 ease-in-out flex flex-col items-center justify-center space-y-6 ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <button 
          onClick={() => setMobileOpen(false)}
          className="absolute top-6 right-6 p-2 text-4xl text-gray-800 dark:text-gray-200 font-light"
        >
          &times;
        </button>
        <a href="/" onClick={(e) => { handleLogoClick(e); setMobileOpen(false); }} className="mb-8">
          <img src="/afosi_logo.png" alt="AFOSI" className="h-12 w-auto block dark:hidden" />
          <img src="/afosi_logo_white.png" alt="AFOSI" className="h-12 w-auto hidden dark:block" />
        </a>
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={(e) => handleNavClick(e, link.href)}
            className={`text-2xl font-bold font-montserrat tracking-wide transition-colors ${isActive(link.href) ? 'text-[#e86c24]' : 'text-gray-800 dark:text-gray-200'}`}
          >
            {link.label}
          </a>
        ))}
      </div>

      {/* FLOATING PILL NAVBAR */}
      <nav 
        className={`fixed top-4 left-0 right-0 mx-auto w-[92%] md:w-max max-w-[95%] z-50 transition-all duration-300 ease-in-out ${showNav ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}
      >
        <div className="w-full bg-[#EAEAEA]/95 dark:bg-[#1E1A17]/95 backdrop-blur-md rounded-full px-5 py-2 md:px-4 flex items-center justify-between shadow-md border border-black/5 dark:border-white/5 gap-4 md:gap-6">
          
          {/* LOGO */}
          <a href="/" onClick={handleLogoClick} className="flex items-center gap-3 pl-2">
            <img src="/afosi_logo.png" alt="AFOSI" className="h-8 w-auto block dark:hidden" />
            <img src="/afosi_logo_white.png" alt="AFOSI" className="h-8 w-auto hidden dark:block" />
          </a>

          {/* DESKTOP LINKS */}
          <ul className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`px-4 py-2 rounded-full font-bold text-sm font-montserrat tracking-wide transition-all duration-200 flex items-center gap-2 ${
                    isActive(link.href) 
                    ? 'bg-[#e86c24] text-white shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* RIGHT CONTROLS */}
          <div className="flex items-center gap-3 pr-1">
            <ThemeToggle />
            
            {/* HAMBURGER (Mobile Only) */}
            <button
              className="md:hidden p-2 text-gray-800 dark:text-gray-200 flex flex-col gap-[5px]"
              onClick={() => setMobileOpen(true)}
            >
              <span className="w-6 h-[2px] bg-current rounded-full"></span>
              <span className="w-6 h-[2px] bg-current rounded-full"></span>
              <span className="w-6 h-[2px] bg-current rounded-full"></span>
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
