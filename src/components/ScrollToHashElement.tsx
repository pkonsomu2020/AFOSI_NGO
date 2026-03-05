import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToHashElement = () => {
  const location = useLocation();

  useEffect(() => {
    const hash = location.hash;
    
    if (hash) {
      // Remove the # from the hash
      const id = hash.replace("#", "");
      
      // Wait a bit for the page to render
      const timeoutId = setTimeout(() => {
        const element = document.getElementById(id);
        
        if (element) {
          // Get the navbar height to offset the scroll
          const navbarHeight = 80; // Approximate navbar height
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
          });
        }
      }, 100);

      return () => clearTimeout(timeoutId);
    } else {
      // If no hash, scroll to top
      window.scrollTo(0, 0);
    }
  }, [location]);

  return null;
};

export default ScrollToHashElement;
