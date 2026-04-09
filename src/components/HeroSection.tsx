import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";

const techWords = [
  { word: "INNOVATION" },
  { word: "TECHNOLOGY" },
  { word: "AUTOMATION" },
  { word: "INTELLIGENCE" },
  { word: "SOLUTIONS" },
];

const HeroSection = () => {
  const [currentWord, setCurrentWord] = useState(0);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const videoScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.08]);
  const videoOpacity = useTransform(scrollYProgress, [0, 0.3], [0.4, 1]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.2, 0.5], [1, 1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.5], [0, -80]);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % techWords.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Lazy-load video only after page is interactive
  useEffect(() => {
    if (isMobile) return; // Skip video on mobile — use poster only

    const video = videoRef.current;
    if (!video) return;

    // Use IntersectionObserver to load video only when visible
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.src = "/hero_video.mp4";
          video.load();
          video.play().catch(() => {});
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [isMobile]);

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative min-h-[100vh] flex items-center justify-center overflow-hidden bg-black"
    >
      {/* Video background — desktop only, lazy loaded */}
      <motion.div
        style={{ scale: videoScale, opacity: videoOpacity }}
        className="absolute inset-0 w-full h-full overflow-hidden"
      >
        {!isMobile ? (
          <video
            ref={videoRef}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full w-auto h-auto object-cover"
            loop
            muted
            playsInline
            preload="none"
            onCanPlay={() => setVideoLoaded(true)}
          />
        ) : (
          // Mobile: static poster image instead of video
          <img
            src="/afosi_pad.jpg"
            alt="AFOSI hero"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        {/* Fade-in when video loads */}
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: videoLoaded ? 0 : 1 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 bg-black pointer-events-none"
        />

        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40" />
      </motion.div>

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] pointer-events-none z-10" />

      {/* Content */}
      <div className="container mx-auto px-4 py-32 relative z-20">
        <motion.div
          style={{ opacity: textOpacity, y: textY }}
          className="text-center"
        >
          <div className="relative h-32 md:h-40 flex items-center justify-center mb-8">
            {techWords.map((item, index) => {
              const isActive = currentWord === index;
              return (
                <motion.div
                  key={item.word}
                  initial={false}
                  animate={{ opacity: isActive ? 1 : 0, scale: isActive ? 1 : 0.9, y: isActive ? 0 : 20 }}
                  transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ willChange: "transform, opacity" }}
                >
                  <h1
                    className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-orange-500"
                    style={{ textShadow: "0 0 80px rgba(249, 115, 22, 0.5)", willChange: "transform, opacity" }}
                  >
                    {item.word}
                  </h1>
                </motion.div>
              );
            })}
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto mb-10 leading-relaxed"
          >
            Empowering youth through Health, Education, Environment, Leadership, and Livelihoods. Powered by innovative technology and digital solutions.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <Button
              variant="hero"
              size="lg"
              className="bg-orange-500 hover:bg-orange-600 text-white shadow-2xl shadow-orange-500/50 transition-all duration-300 border-0 rounded-full px-8"
              asChild
            >
              <a href="#programs">Explore Solutions</a>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-orange-400/50 text-black dark:text-orange-300 hover:bg-orange-500/10 hover:border-orange-400 backdrop-blur-xl shadow-xl transition-all duration-300 rounded-full px-8"
              asChild
            >
              <a href="#contact">Partner With Us</a>
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        style={{ opacity: textOpacity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 pointer-events-none"
      >
        <div className="flex flex-col items-center gap-2 text-orange-400/60 animate-bounce">
          <span className="text-xs font-semibold tracking-wider">SCROLL</span>
          <div className="w-6 h-10 border-2 border-orange-400/30 rounded-full p-1">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-orange-400 rounded-full mx-auto"
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;

// Tech-focused words that reveal as you scroll - using orange theme
const techWords = [
  { word: "INNOVATION" },
  { word: "TECHNOLOGY" },
  { word: "AUTOMATION" },
  { word: "INTELLIGENCE" },
  { word: "SOLUTIONS" },
];

const HeroSection = () => {
  const [currentWord, setCurrentWord] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Transform scroll progress to video reveal
  const videoScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);
  const videoOpacity = useTransform(scrollYProgress, [0, 0.3], [0.3, 1]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.2, 0.5], [1, 1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.5], [0, -100]);

  // Cycle through tech words with optimized timing
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % techWords.length);
    }, 3000); // Increased to 3 seconds for smoother transitions
    return () => clearInterval(interval);
  }, []);

  // Optimize video playback
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Ensure video plays smoothly
    video.playbackRate = 1.0;
    
    // Handle video loading and playback
    const handleCanPlay = () => {
      video.play().catch(() => {
        // Autoplay was prevented, try again on user interaction
        document.addEventListener('click', () => {
          video.play().catch(() => {});
        }, { once: true });
      });
    };

    video.addEventListener('canplay', handleCanPlay);
    
    // Preload video
    video.load();

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      id="home" 
      className="relative min-h-[100vh] flex items-center justify-center overflow-hidden bg-black"
    >
      {/* Local Video Background - Optimized for smooth playback */}
      <motion.div 
        style={{ 
          scale: videoScale,
          opacity: videoOpacity,
        }}
        className="absolute inset-0 w-full h-full overflow-hidden"
      >
        <video
          ref={videoRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full w-auto h-auto object-cover"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        >
          <source src="/hero_video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Very minimal uniform black overlay - reduced for better video visibility */}
        <div className="absolute inset-0 bg-black/5" />
        {/* Subtle edge blur vignette effect - reduced */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/5 via-transparent to-black/5" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/10" />
      </motion.div>
      
      {/* Animated Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] pointer-events-none z-10" />

      {/* Main Content Container */}
      <div className="container mx-auto px-4 py-32 relative z-20">
        <motion.div 
          style={{ opacity: textOpacity, y: textY }}
          className="text-center"
        >
          {/* Animated Tech Words - Optimized */}
          <div className="relative h-32 md:h-40 flex items-center justify-center mb-8">
            {techWords.map((item, index) => {
              const isActive = currentWord === index;
              return (
                <motion.div
                  key={item.word}
                  initial={false}
                  animate={{
                    opacity: isActive ? 1 : 0,
                    scale: isActive ? 1 : 0.9,
                    y: isActive ? 0 : 20,
                  }}
                  transition={{ 
                    duration: 0.8, 
                    ease: [0.4, 0, 0.2, 1],
                    opacity: { duration: 0.6 },
                  }}
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ willChange: 'transform, opacity' }}
                >
                  <h1 
                    className={`text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-orange-500`}
                    style={{
                      textShadow: "0 0 80px rgba(249, 115, 22, 0.5)",
                      willChange: 'transform, opacity'
                    }}
                  >
                    {item.word}
                  </h1>
                </motion.div>
              );
            })}
          </div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto mb-10 leading-relaxed"
          >
            Empowering youth through Health, Education, Environment, Leadership, and Livelihoods. Powered by innovative technology and digital solutions.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <Button
              variant="hero"
              size="lg"
              className="bg-orange-500 hover:bg-orange-600 text-white shadow-2xl shadow-orange-500/50 hover:shadow-orange-500/70 transition-all duration-300 border-0 rounded-full px-8"
              asChild
            >
              <a href="#programs">Explore Solutions</a>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-orange-400/50 text-black dark:text-orange-300 hover:bg-orange-500/10 hover:border-orange-400 backdrop-blur-xl shadow-xl transition-all duration-300 rounded-full px-8"
              asChild
            >
              <a href="#contact">Partner With Us</a>
            </Button>
          </motion.div>
        </motion.div>

        {/* Tech Stats Floating Cards - REMOVED */}
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        style={{ opacity: textOpacity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 pointer-events-none"
      >
        <div className="flex flex-col items-center gap-2 text-orange-400/60 animate-bounce">
          <span className="text-xs font-semibold tracking-wider">SCROLL</span>
          <div className="w-6 h-10 border-2 border-orange-400/30 rounded-full p-1">
            <motion.div 
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-orange-400 rounded-full mx-auto"
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
