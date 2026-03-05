import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertCircle, ArrowLeft, Image as ImageIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { galleryAPI } from "@/services/api";

interface GalleryImage {
  id: string;
  src: string;
  category: string;
  alt: string;
}

const categories = [
  { id: "all", label: "All Photos" },
  { id: "programs", label: "Programs" },
  { id: "events", label: "Events" },
  { id: "projects", label: "Projects" },
];

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await galleryAPI.getAll();
      setGalleryImages(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load gallery images');
      console.error('Error fetching gallery:', err);
    } finally {
      setLoading(false);
    }
  };

  // Memoize filtered images to prevent unnecessary recalculations
  const filteredImages = useMemo(() => {
    return selectedCategory === "all" 
      ? galleryImages 
      : galleryImages.filter(img => img.category === selectedCategory);
  }, [selectedCategory, galleryImages]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section with Background Image */}
      <section className="relative py-20 sm:py-24 md:py-32 lg:py-40 overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/HERO_4.jpg')",
          }}
        />
        
        {/* Black Overlay */}
        <div className="absolute inset-0 bg-black/70" />
        
        {/* Content */}
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-6 sm:mb-8 group">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-semibold">Back to Home</span>
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm shrink-0">
                <ImageIcon className="text-white" size={24} />
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white leading-tight">
                Our Gallery
              </h1>
            </div>
            <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-2xl leading-relaxed">
              Explore moments from our programs, events, and community impact initiatives
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="py-8 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-2.5 rounded-full font-semibold transition-all ${
                  selectedCategory === category.id
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-accent text-foreground hover:bg-accent/80"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading gallery...</p>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center max-w-md mx-auto">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-red-900 mb-2">Error Loading Gallery</h3>
              <p className="text-red-700 mb-4">{error}</p>
              <Button onClick={fetchImages}>Try Again</Button>
            </div>
          ) : filteredImages.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">No images found in this category</p>
            </div>
          ) : (
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
            >
              <AnimatePresence mode="popLayout">
                {filteredImages.map((image, index) => (
                  <motion.div
                    key={image.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3, delay: Math.min(index * 0.02, 0.3) }}
                    className="group relative aspect-square overflow-hidden rounded-xl bg-muted cursor-pointer"
                    onClick={() => setSelectedImage(image)}
                    style={{ willChange: 'transform, opacity' }}
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              aria-label="Close"
            >
              <X className="w-6 h-6 text-white" />
            </button>
            
            <motion.img
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              src={selectedImage.src}
              alt={selectedImage.alt}
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Gallery;
