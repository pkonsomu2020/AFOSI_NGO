import { useState, useEffect } from "react";
import { MapPin, Clock, Calendar, ArrowRight, Zap, Users, TrendingUp, Send } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { opportunitiesAPI } from "@/services/api";
import "./opportunities.css";

type OpportunityType = "consulting" | "employment" | "volunteering";

interface Opportunity {
  id: string;
  title: string;
  type: OpportunityType;
  description: string;
  location: string;
  duration: string;
  deadline: string;
  manually_disabled: boolean;
  slug?: string;
}

const Opportunities = () => {
  const [activeFilter, setActiveFilter] = useState<"all" | OpportunityType>("all");
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await opportunitiesAPI.getAll();
        
        // Filter out manually disabled and expired opportunities
        const activeOpportunities = (response.data || []).filter((opp: Opportunity) => {
          if (opp.manually_disabled) return false;
          
          // Check if deadline has passed
          const deadlineDate = new Date(opp.deadline);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          return deadlineDate >= today;
        });
        
        setOpportunities(activeOpportunities);
      } catch (error) {
        console.error('Error fetching opportunities:', error);
        setError('Failed to load opportunities. Please try again later.');
        setOpportunities([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter opportunities
  const filteredOpportunities = opportunities.filter(opp => {
    if (activeFilter === "all") return true;
    return opp.type === activeFilter;
  });

  // Scroll reveal effect
  useEffect(() => {
    if (loading) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("on");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    const reveals = document.querySelectorAll(".reveal");
    reveals.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [loading]);

  const getBadgeClass = (type: OpportunityType) => {
    switch (type) {
      case "employment":
        return "job-badge employment";
      case "consulting":
        return "job-badge consulting";
      case "volunteering":
        return "job-badge volunteering";
      default:
        return "job-badge";
    }
  };

  return (
    <>
      <Navbar />
      <main>
        <ScrollToTop />
        
        {/* PAGE HERO */}
        <div className="opp-hero">
          <div className="opp-hero-line"></div>
          <h1 className="opp-hero-title">
            <span className="t-fg">Career</span><br />
            <span className="t-or">Opportunities</span>
          </h1>
          <p className="opp-hero-sub">
            Join AFOSI in driving sustainable development and social impact across Kenya. Explore career and consulting opportunities to make a real difference.
          </p>
        </div>

        {/* WHY JOIN SECTION */}
        <section className="why-section">
          <div className="s-label reveal">Why AFOSI</div>
          <h2 className="opp-section-title reveal">
            <span className="t-fg">Why</span> <span className="t-or">Join Us?</span>
          </h2>
          <div className="why-grid">
            <div className="why-card reveal">
              <div className="why-icon"><Zap size={20} /></div>
              <div className="why-title">Innovation-Led</div>
              <p className="why-desc">Work at the intersection of technology and social impact, building digital tools that reach thousands of youth across Kenya.</p>
            </div>
            <div className="why-card reveal" style={{ transitionDelay: '0.08s' }}>
              <div className="why-icon"><Users size={20} /></div>
              <div className="why-title">Community First</div>
              <p className="why-desc">Every role at AFOSI is rooted in community. Your work directly shapes the lives of young people in underserved communities.</p>
            </div>
            <div className="why-card reveal" style={{ transitionDelay: '0.16s' }}>
              <div className="why-icon"><TrendingUp size={20} /></div>
              <div className="why-title">Real Impact</div>
              <p className="why-desc">We measure success by tangible change — 69K+ youth reached, 60+ schools supported, and growing every year since 2014.</p>
            </div>
          </div>
        </section>

        {/* OPENINGS SECTION */}
        <section className="opp-section">
          <div className="s-label">Current Openings</div>
          <h2 className="opp-section-title reveal">
            <span className="t-fg">Open</span> <span className="t-or">Positions</span>
          </h2>
          <p className="opp-intro reveal">
            If you think you might be a good fit for our team, we'd love to hear from you!
          </p>

          {/* Filter Tabs */}
          <div className="filter-tabs reveal">
            <button
              className={`filter-tab ${activeFilter === "all" ? "active" : ""}`}
              onClick={() => setActiveFilter("all")}
            >
              All Opportunities
            </button>
            <button
              className={`filter-tab ${activeFilter === "employment" ? "active" : ""}`}
              onClick={() => setActiveFilter("employment")}
            >
              Employment
            </button>
            <button
              className={`filter-tab ${activeFilter === "consulting" ? "active" : ""}`}
              onClick={() => setActiveFilter("consulting")}
            >
              Consulting
            </button>
            <button
              className={`filter-tab ${activeFilter === "volunteering" ? "active" : ""}`}
              onClick={() => setActiveFilter("volunteering")}
            >
              Volunteering/Mentorship
            </button>
          </div>

          {/* Job List */}
          {loading ? (
            <div className="empty-state">
              <div className="empty-title">Loading opportunities...</div>
            </div>
          ) : filteredOpportunities.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <Users size={56} />
              </div>
              <div className="empty-title">No Opportunities Available</div>
              <p className="empty-text">
                There are currently no {activeFilter !== "all" ? activeFilter : ""} opportunities available. Check back soon or send us your CV for future openings.
              </p>
              <div className="empty-actions">
                <a href="mailto:info@afosi.org?subject=General%20Application" className="btn-fill">
                  <Send size={16} /> Send Your CV
                </a>
              </div>
            </div>
          ) : (
            <div className="job-list reveal">
              {filteredOpportunities.map((opp) => (
                <div key={opp.id} className="job-card">
                  <div className="job-card-left">
                    <span className={getBadgeClass(opp.type)}>
                      {opp.type.charAt(0).toUpperCase() + opp.type.slice(1)}
                    </span>
                    <h3 className="job-title">{opp.title}</h3>
                    <div className="job-meta">
                      <span className="job-meta-item">
                        <MapPin size={13} /> {opp.location}
                      </span>
                      <span className="job-meta-item">
                        <Clock size={13} /> {opp.duration}
                      </span>
                      <span className="job-meta-item">
                        <Calendar size={13} /> Deadline: {opp.deadline}
                      </span>
                    </div>
                    <p className="job-desc">{opp.description}</p>
                  </div>
                  <div className="job-card-right">
                    <Link
                      to={`/opportunities/${opp.slug || opp.id}`}
                      className="btn-fill"
                    >
                      View Details <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* CTA SECTION */}
        <div className="opp-cta">
          <div>
            <h2 className="opp-cta-title">Don't See the Right Fit?</h2>
            <p className="opp-cta-text">
              Send us your CV and area of interest. We're always looking for passionate individuals to join our mission of creating sustainable change across Kenya.
            </p>
          </div>
          <div className="opp-cta-btns">
            <a href="mailto:info@afosi.org?subject=General%20Application" className="btn-white">
              <Send size={16} /> Send Your CV
            </a>
            <Link to="/#projects" className="btn-ghost-white">
              <ArrowRight size={16} /> View Our Work
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Opportunities;
