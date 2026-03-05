import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, ArrowRight, Newspaper, FileText, Download } from "lucide-react";
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

const NewsSection = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await newsAPI.getAll({ limit: 6, featured: true });
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
      education: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      community: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      infrastructure: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      health: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      environment: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
      newsletter: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
      report: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
      general: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
    };
    return colors[category] || colors.general;
  };

  if (loading) {
    return (
      <section id="news" className="py-16 md:py-24 bg-accent/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="h-8 w-48 bg-muted animate-pulse mx-auto mb-4 rounded"></div>
            <div className="h-4 w-96 bg-muted animate-pulse mx-auto rounded"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        </div>
      </section>
    );
  }

  if (news.length === 0) {
    return null;
  }

  return (
    <section id="news" className="py-16 md:py-24 bg-accent/30">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
            <Newspaper className="w-5 h-5 text-primary" />
            <span className="text-sm font-semibold text-primary">Latest Updates</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-4">
            News & Newsletters
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Stay informed about our latest projects, partnerships, community impact initiatives, and monthly newsletters
          </p>
        </motion.div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
          {news.map((article, index) => (
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
                  {article.type === 'newsletter' && (
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

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center"
        >
          <Button
            variant="outline"
            size="lg"
            className="group"
            asChild
          >
            <a href="/news">
              View All Reports & Newsletters
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default NewsSection;
