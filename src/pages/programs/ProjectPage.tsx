import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, Heart, Users, Calendar, Target, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { projectsAPI } from "@/services/api";

interface Project {
  id: string;
  title: string;
  description: string;
  image_url: string;
  beneficiaries: string;
  duration: string;
  highlights: string[];
  link: string;
  slug?: string;
  excerpt?: string;
  why_it_matters?: string;
  what_we_do?: string[];
  key_solutions?: string;
  who_it_serves?: string;
  impact?: string[];
  partners?: string[];
  call_to_action?: string;
}

interface ProjectPageProps {
  slug: string;
  fallbackTitle: string;
  fallbackImage: string;
  fallbackBadge: string;
  fallbackBadgeColor: string;
}

const ProjectPage = ({ slug, fallbackTitle, fallbackImage, fallbackBadge }: ProjectPageProps) => {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    projectsAPI.getAll()
      .then(r => {
        const found = (r.data || []).find((p: Project) =>
          p.slug === slug || p.link === `/programs/${slug}`
        );
        if (found) setProject(found);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

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
      const heroBg = document.getElementById("programHeroBg");
      if (heroBg) heroBg.classList.add("loaded");
    }, 100);

    return () => obs.disconnect();
  }, [loading, project]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" style={{ borderColor: 'var(--or)' }} />
            <p className="text-muted-foreground">Loading program...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const title = project?.title || fallbackTitle;
  const image = project?.image_url || fallbackImage;
  const excerpt = project?.excerpt || project?.description || "";

  return (
    <main className="min-h-screen font-montserrat" style={{ background: 'var(--bg)' }}>
      <ScrollToTop />
      <Navbar />

      {/* ── FULL-BLEED HERO ── */}
      <header className="detail-hero">
        <div 
          className="detail-hero-bg" 
          id="programHeroBg" 
          style={{ backgroundImage: `url('${image}')` }} 
          role="img" 
        />
        <div className="detail-hero-overlay"></div>

        {/* Breadcrumb */}
        <div className="detail-breadcrumb">
          <Link to="/projects">
            <ArrowLeft size={14} style={{ display: 'inline', marginRight: '8px' }} />
            Back to Projects
          </Link>
        </div>

        {/* Hero content */}
        <div className="detail-hero-content">
          <div className="detail-eyebrow">{fallbackBadge}</div>
          <h1 className="detail-hero-title" style={{ fontSize: 'clamp(60px, 10vw, 140px)' }}>{title}</h1>
          <p className="detail-hero-sub">{excerpt}</p>
          
          <div className="detail-hero-stats">
            {project?.beneficiaries && (
              <div className="detail-stat-badge">
                <Users size={14} style={{ color: 'var(--or)' }} />
                <strong>{project.beneficiaries}</strong> Beneficiaries
              </div>
            )}
            {project?.duration && (
              <div className="detail-stat-badge">
                <Calendar size={14} style={{ color: 'var(--or)' }} />
                <strong>{project.duration}</strong>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── INTRO + STICKY SIDEBAR ── */}
      <div className="detail-body">
        {/* LEFT: Main content */}
        <main className="detail-main">
          
          {/* Why It Matters */}
          {project?.why_it_matters && (
            <div className="reveal">
              <div className="s-label">The Challenge</div>
              <h2 className="detail-section-title">The Problem We're Solving</h2>
              <p className="detail-body-text">{project.why_it_matters}</p>
            </div>
          )}

          {/* Pull Quote / Key Solutions */}
          {project?.key_solutions && (
            <div className="pull-quote reveal mt-12 mb-12">
              <p style={{ fontSize: '20px', fontStyle: 'normal' }}>{project.key_solutions}</p>
            </div>
          )}

          {/* Who It Serves */}
          {project?.who_it_serves && (
            <div className="reveal mt-12 mb-12">
              <div className="s-label">Who We Serve</div>
              <p className="detail-body-text">{project.who_it_serves}</p>
            </div>
          )}

          {/* Impact */}
          {project?.impact?.filter(Boolean).length ? (
            <div className="reveal mt-12">
              <div className="s-label">Expected Outcomes</div>
              <h2 className="detail-section-title">Impact & Results</h2>
              <div className="target-grid" style={{ gridTemplateColumns: '1fr', gap: '20px' }}>
                {project.impact.filter(Boolean).map((item, i) => (
                  <div key={i} className="target-card" style={{ padding: '20px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(224,90,24,0.1)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <CheckCircle2 size={14} style={{ color: 'var(--or)' }} />
                    </div>
                    <p className="target-desc" style={{ margin: 0, fontSize: '15px' }}>{item}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

        </main>

        {/* RIGHT: Sticky sidebar */}
        <aside className="detail-sidebar">
          <div className="sidebar-card reveal">
            <div className="sidebar-title">Program At a Glance</div>

            {project?.beneficiaries && (
              <div className="sidebar-stat">
                <div className="sidebar-stat-icon"><Users /></div>
                <div>
                  <div className="sidebar-stat-label">Beneficiaries</div>
                  <div className="sidebar-stat-val">{project.beneficiaries}</div>
                </div>
              </div>
            )}

            {project?.duration && (
              <div className="sidebar-stat">
                <div className="sidebar-stat-icon"><Calendar /></div>
                <div>
                  <div className="sidebar-stat-label">Duration</div>
                  <div className="sidebar-stat-val">{project.duration}</div>
                </div>
              </div>
            )}

            <div className="sidebar-stat">
              <div className="sidebar-stat-icon"><Target /></div>
              <div>
                <div className="sidebar-stat-label">Program Type</div>
                <div className="sidebar-stat-val">{fallbackBadge}</div>
              </div>
            </div>

            {project?.partners?.filter(Boolean).length ? (
              <div className="sidebar-stat">
                <div className="sidebar-stat-icon"><Globe /></div>
                <div>
                  <div className="sidebar-stat-label">Partners</div>
                  <div className="sidebar-stat-val">{project.partners.filter(Boolean).join(", ")}</div>
                </div>
              </div>
            ) : null}

            <div className="sidebar-divider"></div>

            <Link to="/#contact" className="sidebar-btn-fill">
              <Heart size={14} /> Get Involved
            </Link>
            
            <p className="sidebar-note">Part of AFOSI's broader empowerment portfolio</p>
          </div>
        </aside>
      </div>

      {/* ── CORE ACTIVITIES ── */}
      {project?.what_we_do?.filter(Boolean).length ? (
        <section className="activities-section">
          <div className="s-label reveal">What We Do</div>
          <h2 className="detail-section-title reveal">Our Core Activities</h2>

          <div className="activities-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
            {project.what_we_do.filter(Boolean).map((item, i) => (
              <div key={i} className="activity-card reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="activity-num">{(i + 1).toString().padStart(2, '0')}</div>
                <p className="activity-desc" style={{ fontSize: '15px' }}>{item}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* ── CTA BANNER ── */}
      <section className="detail-cta">
        <h2 className="detail-cta-title reveal">Be Part of the <span>Change</span></h2>
        <p className="detail-cta-sub reveal">
          {project?.call_to_action || "Support our efforts in creating sustainable impact across Kenya."}
        </p>
        <div className="detail-cta-btns reveal">
          <Link to="/#contact" className="btn-fill">
            <Heart size={14} /> Get Involved
          </Link>
          <Link to="/projects" className="btn-ghost">
            <ArrowLeft size={14} /> Back to Projects
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default ProjectPage;
