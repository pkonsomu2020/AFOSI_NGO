import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ZoomIn, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { galleryAPI } from "@/services/api";

interface GalleryImage {
  id: string;
  title: string;
  description: string;
  category: string;
  image_url: string;
  featured: boolean;
  created_at: string;
}

const filters = ["all", "Programs", "Community", "Youth", "Events", "Environment", "Partners"];

const Gallery = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // --- Carousel State ---
  const [center, setCenter] = useState(0);
  
  // --- Filter State ---
  const [activeFilter, setActiveFilter] = useState("all");

  // Fetch images from API
  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await galleryAPI.getAll(activeFilter !== "all" ? activeFilter : undefined);
        setImages(response.data || []);
      } catch (error) {
        console.error('Error fetching gallery images:', error);
        setError('Failed to load gallery images. Please try again later.');
        setImages([]);
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, [activeFilter]);

  // Featured images for carousel
  const carouselItems = images.filter(img => img.featured).slice(0, 5);
  const total = carouselItems.length;

  // All images for masonry grid
  const masonryItems = images;

  const getPos = (i: number) => {
    if (total === 0) return 0;
    let diff = i - center;
    if (diff > Math.floor(total / 2)) diff -= total;
    if (diff < -Math.floor(total / 2)) diff += total;
    return diff;
  };

  const advance = (dir: number) => {
    if (total === 0) return;
    setCenter((prev) => (prev + dir + total) % total);
  };

  useEffect(() => {
    if (total === 0) return;
    const autoTimer = setInterval(() => advance(1), 5000);
    return () => clearInterval(autoTimer);
  }, [center, total]);

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
    if (loading) return;
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
  }, [loading, images]);

  return (
    <>
      <Navbar />
      <main className="font-montserrat">
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

      {loading ? (
        <div className="empty-state" style={{ padding: '100px 64px', textAlign: 'center' }}>
          <div className="empty-title">Loading gallery...</div>
        </div>
      ) : error ? (
        <div className="empty-state" style={{ padding: '100px 64px', textAlign: 'center' }}>
          <div className="empty-title">Error Loading Gallery</div>
          <p className="empty-text">{error}</p>
        </div>
      ) : images.length === 0 ? (
        <div className="empty-state" style={{ padding: '100px 64px', textAlign: 'center' }}>
          <div className="empty-title">No Images Available</div>
          <p className="empty-text">Check back soon for new photos from our programs and events.</p>
        </div>
      ) : (
        <>
          {/* CAROUSEL SECTION */}
          {carouselItems.length > 0 && (
            <section className="carousel-section">
              <div className="s-label reveal">Featured</div>
              <h2 className="section-title reveal"><span className="t-fg">Highlights &amp;</span> <span className="t-or">Stories</span></h2>

              <div className="carousel-stage">
                <div className="carousel-track">
                  {carouselItems.map((item, i) => {
                    const pos = getPos(i);
                    return (
                      <div
                        key={item.id}
                        className={`c-card ${pos === 0 ? "center" : ""}`}
                        data-pos={pos}
                        onClick={() => {
                          if (pos !== 0) advance(pos);
                        }}
                      >
                        <img src={item.image_url} alt={item.title} loading="lazy" />
                        <div className="c-card-overlay">
                          <div className="c-card-label">{item.category}</div>
                          <div className="c-card-caption">{item.description}</div>
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
          )}

          {/* MASONRY GRID */}
          <section className="masonry-section">
            <div className="s-label reveal">All Photos</div>
            <h2 className="section-title reveal"><span className="t-fg">Moments of</span> <span className="t-or">Impact</span></h2>

            <div className="masonry-grid">
              {masonryItems.map((item) => (
                <div
                  key={item.id}
                  className="masonry-item reveal"
                  onClick={() => openLightbox(item.image_url, item.title, item.description)}
                >
                  <img src={item.image_url} alt={item.title} loading="lazy" />
                  <div className="masonry-overlay">
                    <div className="masonry-cat">{item.category}</div>
                    <div className="masonry-caption">{item.description}</div>
                  </div>
                  <div className="masonry-zoom">
                    <ZoomIn size={16} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

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
