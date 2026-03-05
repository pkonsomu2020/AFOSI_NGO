import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "./ThemeToggle";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Pillars", href: "#pillars" },
  { label: "Team", href: "#team" },
  { label: "Partners", href: "#partners" },
  { label: "Projects", href: "#programs" },
  { label: "Contact", href: "#contact" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  
  const isHomePage = location.pathname === "/" || location.pathname === "/index";

  // Handle scrolling to hash on page load or hash change
  useEffect(() => {
    if (isHomePage && location.hash) {
      // Wait for page to render, then scroll to section
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

  // Handle scroll for navbar visibility and background
  useEffect(() => {
    let ticking = false;
    let currentScrollY = window.scrollY;

    const onScroll = () => {
      currentScrollY = window.scrollY;
      
      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Show/hide navbar based on scroll direction
          if (currentScrollY > lastScrollY && currentScrollY > 100) {
            // Scrolling down & past threshold
            setVisible(false);
          } else {
            // Scrolling up
            setVisible(true);
          }
          
          setScrolled(currentScrollY > 50);
          setLastScrollY(currentScrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [lastScrollY]);

  // Use IntersectionObserver for active section detection (more efficient)
  useEffect(() => {
    if (!isHomePage) return;

    const observerOptions = {
      rootMargin: '-100px 0px -66%',
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all sections
    navLinks.forEach(link => {
      const element = document.getElementById(link.href.substring(1));
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [isHomePage]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    
    if (isHomePage) {
      // On homepage, just scroll to section
      const sectionId = href.substring(1);
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      // On other pages, navigate to homepage with hash
      navigate(`/${href}`);
    }
    
    setMobileOpen(false);
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    
    if (isHomePage) {
      // On homepage, scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // On other pages, navigate to homepage
      navigate("/");
    }
  };

  return (
    <nav className={`fixed top-4 left-0 right-0 z-50 px-4 transition-all duration-300 ${
      visible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
    }`}>
      <div className="container mx-auto max-w-fit">
        <div className="flex items-center justify-center">
          {/* Combined Single Card - Centered */}
          <div className="flex items-center gap-2 bg-white/95 backdrop-blur-xl rounded-full px-4 py-3 shadow-2xl border border-white/20">
            {/* Logo */}
            <a 
              href="#home" 
              onClick={handleLogoClick} 
              className="flex items-center gap-2 px-2 hover:scale-105 transition-transform group"
            >
              <img 
                src="/afosi_logo.png" 
                alt="AFOSI Logo" 
                className="h-10 w-auto transition-transform duration-300 group-hover:rotate-12"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </a>

            {/* Divider */}
            <div className="hidden lg:block w-px h-6 bg-gray-300 mx-1" />

            {/* Navigation Links - Desktop Only */}
            <div className="hidden lg:flex items-center gap-2">
              {navLinks.map((link) => {
                const isActive = isHomePage && activeSection === link.href.substring(1);
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className={`relative px-4 py-2 text-sm font-semibold transition-all duration-300 rounded-full ${
                      isActive 
                        ? "bg-orange-500 text-white shadow-lg" 
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {link.label}
                  </a>
                );
              })}
              
              {/* Divider */}
              <div className="w-px h-6 bg-gray-300 mx-1" />
              
              {/* Action Buttons */}
              <Button 
                className="font-semibold bg-orange-500 hover:bg-orange-600 text-white border-0 rounded-full px-6 h-9 shadow-lg hover:shadow-xl transition-all duration-300" 
                asChild
              >
                <a href="/opportunities">Opportunities</a>
              </Button>
              <Button 
                className="font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 border-0 rounded-full px-6 h-9" 
                asChild
              >
                <a href="/gallery">Gallery</a>
              </Button>
              
              {/* Divider */}
              <div className="w-px h-6 bg-gray-300 mx-1" />
              
              {/* Theme Toggle */}
              <ThemeToggle />
            </div>

            {/* Mobile: Theme Toggle + Menu Button */}
            <div className="lg:hidden flex items-center gap-2 ml-2">
              {/* Theme Toggle - Visible on Mobile */}
              <ThemeToggle />
              
              {/* Divider */}
              <div className="w-px h-6 bg-gray-300" />
              
              {/* Mobile Menu Button */}
              <button 
                className="p-2 rounded-full hover:bg-gray-100 transition-all" 
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={24} className="text-gray-900" /> : <Menu size={24} className="text-gray-900" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="lg:hidden mt-4 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden"
          >
            <div className="flex flex-col gap-1 p-4">
              {navLinks.map((link) => {
                const isActive = isHomePage && activeSection === link.href.substring(1);
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className={`px-4 py-3 rounded-full text-sm font-semibold transition-all ${
                      isActive
                        ? "bg-orange-500 text-white shadow-lg"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {link.label}
                  </a>
                );
              })}
              <div className="h-px bg-gray-200 my-2" />
              <Button 
                className="w-full font-semibold bg-orange-500 hover:bg-orange-600 text-white border-0 rounded-full shadow-lg" 
                size="lg"
                asChild
              >
                <a href="/opportunities" onClick={() => setMobileOpen(false)}>
                  Opportunities
                </a>
              </Button>
              <Button 
                className="w-full font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 border-0 rounded-full" 
                size="lg"
                asChild
              >
                <a href="/gallery" onClick={() => setMobileOpen(false)}>
                  Gallery
                </a>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
