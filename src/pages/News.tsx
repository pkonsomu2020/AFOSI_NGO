import { useState, useEffect } from "react";
import { Calendar, MapPin, ArrowRight, Newspaper, FileText, Download, Search, Filter, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
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
      newsletter: 'var(--or)',
      report: 'var(--silver)',
      general: 'var(--fg)',
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

  // Scroll Reveal Observer
  useEffect(() => {
    if (loading) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("on");
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    
    setTimeout(() => {
      document.querySelectorAll(".reveal").forEach((el) => obs.observe(el));
    }, 100);

    return () => obs.disconnect();
  }, [loading, filteredNews]);

  return (
    <main className="min-h-screen font-montserrat" style={{ background: 'var(--bg)' }}>
      <ScrollToTop />
      <Navbar />
      
      {/* Hero Section */}
      <div className="opp-hero" style={{ minHeight: '55vh', paddingBottom: '60px' }}>
        <Link
          to="/"
          className="inline-flex items-center gap-2 transition-colors mb-8 font-semibold text-sm"
          style={{ color: 'var(--fg)', textDecoration: 'none' }}
        >
          <ArrowLeft size={18} /> Back to Home
        </Link>
        <div className="opp-hero-line"></div>
        <h1 className="opp-hero-title">
          <span className="t-fg">News &</span><br />
          <span className="t-or">Newsletters</span>
        </h1>
        <p className="opp-hero-sub" style={{ maxWidth: '800px' }}>
          Stay informed about our latest reports, newsletters, and organizational updates.
        </p>
      </div>

      {/* Filters Section */}
      <section className="opp-section" style={{ paddingTop: '40px', paddingBottom: '20px' }}>
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8 items-center justify-between reveal">
          {/* Search */}
          <div className="relative w-full md:w-96" style={{ background: 'var(--bg2)', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--silver)' }} />
            <input
              type="text"
              placeholder="Search reports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-transparent focus:outline-none"
              style={{ color: 'var(--fg)' }}
            />
          </div>

          {/* Category Filter */}
          <div className="filter-tabs" style={{ marginBottom: 0, justifyContent: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--silver)', marginRight: '8px' }}>
              <Filter size={18} /> Filter:
            </div>
            {categories.map((cat) => (
              <button
                key={cat.value}
                className={`filter-tab ${selectedCategory === cat.value ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.value)}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* News Grid */}
      <section className="opp-section" style={{ paddingTop: '20px', paddingBottom: '120px' }}>
        <div className="max-w-5xl mx-auto">
          {loading ? (
            <div className="related-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
              {[1, 2, 3].map((i) => (
                <div key={i} className="related-card" style={{ opacity: 0.5 }}>
                  <div className="related-img" style={{ background: 'var(--bg3)' }}></div>
                  <div className="related-body" style={{ minHeight: '150px' }}></div>
                </div>
              ))}
            </div>
          ) : filteredNews.length === 0 ? (
            <div className="empty-state reveal">
              <div className="empty-icon"><Newspaper size={48} /></div>
              <h3 className="empty-title">No reports found</h3>
              <p className="empty-text">
                {searchQuery ? 'Try adjusting your search query' : 'Check back later for updates'}
              </p>
            </div>
          ) : (
            <div className="related-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
              {filteredNews.map((article, index) => (
                <article
                  key={article.id}
                  className="related-card reveal"
                  style={{ transitionDelay: `${index * 0.1}s` }}
                >
                  <div className="related-img" style={{ backgroundImage: `url('${article.image_url}')` }}>
                    <div style={{ position: 'absolute', top: '16px', left: '16px', display: 'flex', gap: '8px' }}>
                      <span style={{ 
                        background: 'var(--bg2)', color: getCategoryColor(article.category), 
                        padding: '4px 12px', borderRadius: '4px', fontSize: '11px', fontWeight: 700, 
                        textTransform: 'uppercase', letterSpacing: '1px', border: '1px solid var(--border)' 
                      }}>
                        {article.category}
                      </span>
                      {article.type === 'newsletter' && article.pdf_url && (
                        <span style={{ 
                          background: 'var(--or)', color: '#fff', 
                          padding: '4px 12px', borderRadius: '4px', fontSize: '11px', fontWeight: 700, 
                          textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '4px' 
                        }}>
                          <FileText size={12} /> PDF
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="related-body">
                    <div className="flex items-center gap-4 text-sm mb-4" style={{ color: 'var(--silver)', fontSize: '12px', fontWeight: 500 }}>
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} />
                        <span>{formatDate(article.published_date)}</span>
                      </div>
                      {article.location && (
                        <div className="flex items-center gap-1.5">
                          <MapPin size={14} />
                          <span>{article.location}</span>
                        </div>
                      )}
                    </div>

                    <h3 className="related-title" style={{ fontSize: '20px', lineHeight: 1.4, marginBottom: '12px' }}>
                      {article.title}
                    </h3>

                    <p className="related-desc" style={{ marginBottom: '24px' }}>
                      {article.excerpt}
                    </p>

                    <div className="flex items-center gap-4">
                      {article.pdf_url ? (
                        <>
                          <a
                            href={article.pdf_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="related-link"
                          >
                            <FileText size={14} /> View PDF
                          </a>
                          <a
                            href={article.pdf_url}
                            download
                            className="related-link"
                            style={{ color: 'var(--silver)' }}
                          >
                            <Download size={14} /> Download
                          </a>
                        </>
                      ) : (
                        <span style={{ fontSize: '12px', color: 'var(--silver)', fontStyle: 'italic' }}>PDF not available</span>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default News;
