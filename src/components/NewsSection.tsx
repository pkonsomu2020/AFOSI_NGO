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

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    education: 'bg-blue-100 text-blue-700',
    community: 'bg-green-100 text-green-700',
    health: 'bg-red-100 text-red-700',
    environment: 'bg-emerald-100 text-emerald-700',
    newsletter: 'bg-orange-100 text-orange-700',
    report: 'bg-indigo-100 text-indigo-700',
    general: 'bg-gray-100 text-gray-700',
  };
  return colors[category] || colors.general;
};

const NewsSection = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch latest 3 news items
    newsAPI.getAll({ limit: 3 })
      .then(r => setNews(r.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

  if (loading) {
    return (
      <section id="news" className="py-24 bg-accent/20">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1,2,3].map(i => (
              <div key={i} className="rounded-2xl overflow-hidden bg-card border border-border">
                <div className="h-52 bg-muted animate-pulse" />
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-muted animate-pulse rounded w-1/3" />
                  <div className="h-5 bg-muted animate-pulse rounded" />
                  <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (news.length === 0) return null;

  return (
    <section id="news" className="py-24 bg-accent/20 overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase mb-3">
            <Newspaper size={14} />
            Latest Updates
          </span>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <h2 className="text-4xl md:text-6xl font-black text-foreground leading-none">
              News &<br /><span className="text-primary">Newsletters</span>
            </h2>
            <Button variant="outline" size="lg" className="group self-start md:self-auto" asChild>
              <a href="/news">
                View All
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />
              </a>
            </Button>
          </div>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {news.map((article, i) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -6 }}
              className="group bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500"
            >
              {/* Image */}
              <div className="relative h-52 overflow-hidden bg-muted">
                <motion.img
                  src={article.image_url}
                  alt={article.title}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.08 }}
                  transition={{ duration: 0.6 }}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-4 left-4 flex gap-2">
                  <Badge className={`${getCategoryColor(article.category)} font-semibold capitalize text-xs`}>
                    {article.category}
                  </Badge>
                  {article.pdf_url && (
                    <Badge className="bg-primary text-white text-xs">
                      <FileText size={10} className="mr-1" /> PDF
                    </Badge>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {formatDate(article.published_date)}
                  </span>
                  {article.location && (
                    <span className="flex items-center gap-1">
                      <MapPin size={12} />
                      {article.location}
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                  {article.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 mb-4">
                  {article.excerpt}
                </p>

                {article.pdf_url ? (
                  <div className="flex items-center gap-4 pt-2 border-t border-border">
                    <a href={article.pdf_url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-primary text-sm font-semibold hover:gap-2.5 transition-all">
                      <FileText size={14} /> View PDF
                    </a>
                    <a href={article.pdf_url} download
                      className="flex items-center gap-1.5 text-muted-foreground text-sm hover:text-primary transition-colors">
                      <Download size={14} /> Download
                    </a>
                  </div>
                ) : (
                  <div className="pt-2 border-t border-border">
                    <span className="text-xs text-muted-foreground">PDF not available</span>
                  </div>
                )}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
