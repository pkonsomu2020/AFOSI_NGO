import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, ZoomIn, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// --- Data ---
const carouselItems = [
  {
    src: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80",
    alt: "Children learning in a classroom",
    label: "Programs",
    caption: "Empowering young minds through quality education"
  },
  {
    src: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=800&q=80",
    alt: "Community gathering",
    label: "Community",
    caption: "Building stronger communities together"
  },
  {
    src: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80",
    alt: "Tree planting and environment",
    label: "Environment",
    caption: "Restoring ecosystems, one tree at a time"
  },
  {
    src: "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=800&q=80",
    alt: "Youth empowerment",
    label: "Youth",
    caption: "Investing in the next generation of leaders"
  },
  {
    src: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&q=80",
    alt: "Team and partners",
    label: "Partners",
    caption: "Collaborating for lasting sustainable change"
  }
];

const masonryItems = [
  { src: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&q=80", cat: "Programs", cap: "Classroom sessions bringing education to life" },
  { src: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=600&q=80", cat: "Community", cap: "Voices united for a common purpose" },
  { src: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&q=80", cat: "Environment", cap: "Green futures planted today" },
  { src: "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=600&q=80", cat: "Youth", cap: "Young leaders shaping tomorrow" },
  { src: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=600&q=80", cat: "Partners", cap: "Stronger together with our partners" },
  { src: "https://images.unsplash.com/photo-1504805572947-34fad45aed93?w=600&q=80", cat: "Events", cap: "Celebrating milestones and achievements" },
  { src: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=600&q=80", cat: "Programs", cap: "Skills training for sustainable livelihoods" },
  { src: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80", cat: "Community", cap: "Grassroots change from within" },
  { src: "https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?w=600&q=80", cat: "Youth", cap: "Mentorship that transforms lives" },
  { src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80", cat: "Events", cap: "Workshops driving knowledge and action" },
  { src: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&q=80", cat: "Programs", cap: "Collaborative learning in action" },
  { src: "https://images.unsplash.com/photo-1526976668912-1a811878dd37?w=600&q=80", cat: "Environment", cap: "Protecting Kenya's natural heritage" },
  { src: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&q=80", cat: "Community", cap: "Outreach that reaches the last mile" },
  { src: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&q=80", cat: "Partners", cap: "Strategic alliances for greater impact" },
  { src: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=600&q=80", cat: "Youth", cap: "Peer learning and peer leadership" },
  { src: "https://images.unsplash.com/photo-1607748862156-7c548e7e98f4?w=600&q=80", cat: "Events", cap: "Annual gathering of changemakers" },
  { src: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600&q=80", cat: "Programs", cap: "Volunteers powering community change" },
  
  // Tall portraits
  { src: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&h=800&q=80", cat: "Community", cap: "Faces of resilience and hope" },
  { src: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=600&h=800&q=80", cat: "Youth", cap: "A generation ready to lead" },
  { src: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&h=800&q=80", cat: "Environment", cap: "Roots of a sustainable future" },
  { src: "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=600&h=800&q=80", cat: "Programs", cap: "Dedicated to every participant's growth" },
  { src: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=600&h=800&q=80", cat: "Partners", cap: "Partnerships built on shared values" },
  { src: "https://images.unsplash.com/photo-1504805572947-34fad45aed93?w=600&h=800&q=80", cat: "Events", cap: "Every event tells a story of progress" },
  { src: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=600&h=800&q=80", cat: "Community", cap: "Community bonds that endure" }
];

const filters = ["all", "Programs", "Community", "Youth", "Events", "Environment", "Partners"];

const Gallery = () => {
  // --- Carousel State ---
  const [center, setCenter] = useState(2);
  const total = carouselItems.length;

  const getPos = (i: number) => {
    let diff = i - center;
    if (diff > Math.floor(total / 2)) diff -= total;
    if (diff < -Math.floor(total / 2)) diff += total;
    return diff;
  };

  const advance = (dir: number) => {
    setCenter((prev) => (prev + dir + total) % total);
  };

  useEffect(() => {
    const autoTimer = setInterval(() => advance(1), 5000);
    return () => clearInterval(autoTimer);
  }, [center]);

  // --- Filter State ---
  const [activeFilter, setActiveFilter] = useState("all");
  const filteredMasonry = masonryItems.filter(item => activeFilter === "all" || item.cat === activeFilter);

  // --- Lightbox State ---
  const [lightbox, setLightbox] = useState({ open: false, src: "", alt: "", caption: "" });

  const openLightbox = (src: string, alt: string, caption: string) => {
    setLightbox({ open: true, src, alt, caption });
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setLightbox({ ...lightbox, open: false });
    document.body.style.overflow = "";
    // Wait for transition before clearing src
    setTimeout(() => {
      setLightbox(prev => ({ ...prev, src: "" }));
    }, 350);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
    };
    if (lightbox.open) document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [lightbox.open]);

  // --- Scroll Reveal ---
  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add("on");
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.08 });
    document.querySelectorAll(".reveal").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [filteredMasonry]);

  return (
    <>
      <Navbar />
      <main>
      {/* HERO */}
      <div className="gallery-hero">
        <div className="hero-eyebrow">Gallery</div>
        <h1 className="gallery-hero-title">
          <span className="t-fg">Our</span> <span className="t-or">Visual</span><br />
          <span className="t-fg">Story</span>
        </h1>
        <p className="gallery-hero-sub">
          Moments of impact, community, and change — captured across our programs, events, and partnerships throughout Kenya.
        </p>
      </div>

      {/* FILTER BAR */}
      <div className="filter-section">
        <div className="filter-bar">
          {filters.map(filter => (
            <button
              key={filter}
              className={`filter-pill ${activeFilter === filter ? "active" : ""}`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* CAROUSEL SECTION */}
      <section className="carousel-section">
        <div className="s-label reveal">Featured</div>
        <h2 className="section-title reveal"><span className="t-fg">Highlights &amp;</span> <span className="t-or">Stories</span></h2>

        <div className="carousel-stage">
          <div className="carousel-track">
            {carouselItems.map((item, i) => {
              const pos = getPos(i);
              return (
                <div
                  key={i}
                  className={`c-card ${pos === 0 ? "center" : ""}`}
                  data-pos={pos}
                  onClick={() => {
                    if (pos !== 0) advance(pos);
                  }}
                >
                  <img src={item.src} alt={item.alt} loading="lazy" />
                  <div className="c-card-overlay">
                    <div className="c-card-label">{item.label}</div>
                    <div className="c-card-caption">{item.caption}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="carousel-nav">
          <button className="c-nav-btn" onClick={() => advance(-1)} aria-label="Previous">
            <ChevronLeft size={24} />
          </button>
          <div className="c-dots">
            {carouselItems.map((_, i) => (
              <div
                key={i}
                className={`c-dot ${i === center ? "active" : ""}`}
                onClick={() => setCenter(i)}
              ></div>
            ))}
          </div>
          <button className="c-nav-btn" onClick={() => advance(1)} aria-label="Next">
            <ChevronRight size={24} />
          </button>
        </div>
      </section>

      {/* MASONRY GRID */}
      <section className="masonry-section">
        <div className="s-label reveal">All Photos</div>
        <h2 className="section-title reveal"><span className="t-fg">Moments of</span> <span className="t-or">Impact</span></h2>

        <div className="masonry-grid">
          {filteredMasonry.map((item, i) => (
            <div
              key={i}
              className="masonry-item reveal"
              onClick={() => openLightbox(item.src, item.cat, item.cap)}
            >
              <img src={item.src} alt={item.cap} loading="lazy" />
              <div className="masonry-overlay">
                <div className="masonry-cat">{item.cat}</div>
                <div className="masonry-caption">{item.cap}</div>
              </div>
              <div className="masonry-zoom">
                <ZoomIn size={16} />
              </div>
            </div>
          ))}
        </div>

        <div className="load-more-wrap">
          <button className="load-more-btn" onClick={(e) => {
            const btn = e.currentTarget;
            btn.textContent = "All photos loaded";
            btn.disabled = true;
            btn.style.opacity = "0.5";
            btn.style.cursor = "default";
          }}>
            Load More Photos
          </button>
        </div>
      </section>

      {/* LIGHTBOX */}
      <div
        id="lightbox"
        className={lightbox.open ? "open" : ""}
        role="dialog"
        aria-modal="true"
        aria-label="Photo lightbox"
        onClick={(e) => {
          if (e.target === e.currentTarget) closeLightbox();
        }}
      >
        <button id="lb-close" aria-label="Close lightbox" onClick={closeLightbox}>
          <X size={24} />
        </button>
        <img id="lb-img" src={lightbox.src} alt={lightbox.alt} />
        <div id="lb-caption">{lightbox.caption}</div>
      </div>
    </main>
    <Footer />
    </>
  );
};

export default Gallery;
