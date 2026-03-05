import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, ArrowRight, Newspaper, FileText, Download, Search, Filter, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { newsAPI } from "@/services/api";

interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  image_url: string;
  pdf_url?: string;
  category: string;
  location?: string;
  published_date: string;
  featured: boolean;
  type: 'article' | 'newsletter';
}

const News = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchNews();
  }, [selectedCategory]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (selectedCategory !== 'all') {
        params.category = selectedCategory;
      }
      const response = await newsAPI.getAll(params);
      setNews(response.data || []);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      day: 'numeric',
      month: 'short', 
      year: 'numeric' 
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      newsletter: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
      report: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
      general: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
    };
    return colors[category] || colors.general;
  };

  const filteredNews = news.filter(article => {
    if (searchQuery) {
      return article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
             article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  const categories = [
    { value: 'all', label: 'All Reports' },
    { value: 'newsletter', label: 'Newsletters' },
    { value: 'report', label: 'Annual Reports' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
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
                <Newspaper className="text-white" size={24} />
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white leading-tight">
                News & Newsletters
              </h1>
            </div>
            <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-2xl leading-relaxed">
              Stay informed about our latest reports, newsletters, and organizational updates
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-accent/30 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search reports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-5 h-5 text-muted-foreground" />
              {categories.map((cat) => (
                <Button
                  key={cat.value}
                  variant={selectedCategory === cat.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat.value)}
                >
                  {cat.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* News Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-card rounded-xl overflow-hidden">
                  <div className="h-48 bg-muted animate-pulse"></div>
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-muted animate-pulse rounded"></div>
                    <div className="h-4 bg-muted animate-pulse rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredNews.length === 0 ? (
            <div className="text-center py-16">
              <Newspaper className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-2xl font-heading font-bold text-foreground mb-2">
                No reports found
              </h3>
              <p className="text-muted-foreground">
                {searchQuery ? 'Try adjusting your search query' : 'Check back later for updates'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filteredNews.map((article, index) => (
                <motion.article
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={article.image_url}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute top-4 left-4 flex gap-2">
                      <Badge className={`${getCategoryColor(article.category)} font-semibold capitalize`}>
                        {article.category}
                      </Badge>
                      {article.type === 'newsletter' && article.pdf_url && (
                        <Badge className="bg-primary text-primary-foreground font-semibold">
                          <FileText size={12} className="mr-1" />
                          PDF
                        </Badge>
                      )}
                    </div>
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Meta Info */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{formatDate(article.published_date)}</span>
                      </div>
                      {article.location && (
                        <div className="flex items-center gap-1">
                          <MapPin size={14} />
                          <span>{article.location}</span>
                        </div>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-heading font-bold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                      {article.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
                      {article.excerpt}
                    </p>

                    {/* Action Links */}
                    <div className="flex items-center gap-3">
                      {article.pdf_url ? (
                        <>
                          <a
                            href={article.pdf_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:gap-3 transition-all"
                          >
                            <FileText size={16} />
                            View PDF
                          </a>
                          <span className="text-muted-foreground">|</span>
                          <a
                            href={article.pdf_url}
                            download
                            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary font-semibold text-sm transition-colors"
                          >
                            <Download size={16} />
                            Download
                          </a>
                        </>
                      ) : (
                        <span className="text-sm text-muted-foreground">PDF not available</span>
                      )}
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default News;
