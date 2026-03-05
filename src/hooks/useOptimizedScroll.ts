import { useEffect } from 'react';

/**
 * Optimizes scroll performance by using passive event listeners
 * and requestAnimationFrame for smooth scrolling
 */
export const useOptimizedScroll = () => {
  useEffect(() => {
    // Disable smooth scroll during rapid scrolling for better performance
    let scrollTimeout: NodeJS.Timeout;
    let isScrolling = false;
    
    const handleScrollStart = () => {
      if (!isScrolling) {
        isScrolling = true;
        document.documentElement.style.scrollBehavior = 'auto';
      }
      
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        isScrolling = false;
        document.documentElement.style.scrollBehavior = 'smooth';
      }, 150);
    };

    // Use passive listeners for better performance
    window.addEventListener('scroll', handleScrollStart, { passive: true });
    window.addEventListener('wheel', handleScrollStart, { passive: true });
    window.addEventListener('touchmove', handleScrollStart, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScrollStart);
      window.removeEventListener('wheel', handleScrollStart);
      window.removeEventListener('touchmove', handleScrollStart);
      clearTimeout(scrollTimeout);
    };
  }, []);
};

