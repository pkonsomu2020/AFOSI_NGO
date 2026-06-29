import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ExternalLink, Users, Leaf, Rocket, Calendar, MapPin, Target, Globe, Heart, Download } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";

// Icon mapping
const iconMap: Record<string, any> = {
  Users,
  Leaf,
  Rocket,
};

interface Project {
  id: string;
  title: string;
  description: string;
  image_url: string;
  icon: string;
  beneficiaries: string;
  duration: string;
  highlights: string[];
  link: string;
  is_external: boolean;
  has_subpage: boolean;
  excerpt: string;
  full_content: string;
  slug: string;
}

const ProjectDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const response = await fetch(`${API_BASE_URL}/projects/slug/${slug}`);
        const data = await response.json();
        
        if (data.success) {
          setProject(data.data);
        } else {
          setError(true);
        }
      } catch (error) {
        console.error('Error fetching project:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProject();
    }
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
      const heroBg = document.getElementById("heroBg");
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
            <p className="text-muted-foreground">Loading project...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Project Not Found</h1>
          <p className="text-muted-foreground mb-6">The project you're looking for doesn't exist.</p>
          <Link to="/projects" className="btn-fill" style={{ display: 'inline-flex' }}>
            <ArrowLeft size={16} className="mr-2" />
            Back to Projects
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <main className="min-h-screen font-montserrat" style={{ background: 'var(--bg)' }}>
      <ScrollToTop />
      <Navbar />
      
      {/* ── FULL-BLEED HERO ── */}
      <header className="detail-hero">
        <div 
          className="detail-hero-bg" 
          id="heroBg" 
          style={{ backgroundImage: `url('${project.image_url || '/afosi_pad.jpg'}')` }} 
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
          <div className="detail-eyebrow">{project.icon || 'Empowerment Program'}</div>
          <h1 className="detail-hero-title">{project.title}</h1>
          <p className="detail-hero-sub">{project.description || project.excerpt}</p>
          <div className="detail-hero-stats">
            {project.beneficiaries && (
              <div className="detail-stat-badge">
                <Users size={14} style={{ color: 'var(--or)' }} />
                <strong>{project.beneficiaries}</strong> Beneficiaries
              </div>
            )}
            {project.duration && (
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
          {project.full_content && project.full_content.trim() ? (
            <div className="reveal">
              <div className="s-label">About the Project</div>
              <h2 className="detail-section-title">Overview</h2>
              <div className="detail-body-text" style={{ whiteSpace: 'pre-line' }}>
                {project.full_content}
              </div>
            </div>
          ) : (
            <div className="reveal">
              <div className="s-label">About the Project</div>
              <h2 className="detail-section-title">Overview</h2>
              <p className="detail-body-text">{project.description}</p>
            </div>
          )}

          {/* Highlights as Pull Quote / Core area */}
          {project.highlights && project.highlights.length > 0 && (
            <div className="reveal mt-12">
              <div className="s-label">Highlights</div>
              <div className="pull-quote">
                {project.highlights.map((hl, i) => (
                  <p key={i} style={{ marginBottom: i < project.highlights.length - 1 ? '16px' : 0 }}>
                    {hl}
                  </p>
                ))}
              </div>
            </div>
          )}
          
          {project.link && project.is_external && (
            <div className="reveal mt-12">
              <a href={project.link} target="_blank" rel="noopener noreferrer" className="btn-fill">
                Visit Project Website <ExternalLink size={16} />
              </a>
            </div>
          )}
        </main>

        {/* RIGHT: Sticky sidebar */}
        <aside className="detail-sidebar">
          <div className="sidebar-card reveal">
            <div className="sidebar-title">Project At a Glance</div>

            {project.beneficiaries && (
              <div className="sidebar-stat">
                <div className="sidebar-stat-icon"><Users /></div>
                <div>
                  <div className="sidebar-stat-label">Beneficiaries</div>
                  <div className="sidebar-stat-val">{project.beneficiaries} Youth</div>
                </div>
              </div>
            )}

            {project.duration && (
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
                <div className="sidebar-stat-val">{project.icon || 'Empowerment'}</div>
              </div>
            </div>

            <div className="sidebar-divider"></div>

            <Link to="/#contact" className="sidebar-btn-fill">
              <Heart size={14} /> Get Involved
            </Link>
            
            <p className="sidebar-note">Part of AFOSI's broader SRHR and youth empowerment portfolio</p>
          </div>
        </aside>
      </div>

      {/* ── CTA BANNER ── */}
      <section className="detail-cta">
        <h2 className="detail-cta-title reveal">Be Part of the <span>Change</span></h2>
        <p className="detail-cta-sub reveal">Support our efforts in creating sustainable impact across Kenya.</p>
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

export default ProjectDetail;
