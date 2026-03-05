// Optimized Framer Motion configuration for better scroll performance
export const optimizedViewport = {
  once: true,
  margin: "0px 0px -50px 0px", // Trigger animations slightly before element is visible
  amount: 0.1 // Only need 10% visible to trigger (reduces calculations)
};

export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: optimizedViewport,
  transition: { duration: 0.3, ease: "easeOut" }
};

export const fadeIn = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: optimizedViewport,
  transition: { duration: 0.3, ease: "easeOut" }
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: optimizedViewport,
  transition: { duration: 0.3, ease: "easeOut" }
};
