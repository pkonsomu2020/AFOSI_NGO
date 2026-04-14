import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, Globe, Target, Lightbulb, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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

const ProjectPage = ({ slug, fallbackTitle, fallbackImage, fallbackBadge, fallbackBadgeColor }: ProjectPageProps) => {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  const title = project?.title || fallbackTitle;
  const image = project?.image_url || fallbackImage;
  const excerpt = project?.excerpt || project?.description || "";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative h-[50vh] sm:h-[60vh] overflow-hidden">
        <img src={image} alt={title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/65" />
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-6 pb-12">
            <Link to="/projects" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 group">
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-semibold">Back to Projects</span>
            </Link>
            <div className="flex items-center gap-3 mb-4">
              <span className={`px-3 py-1.5 rounded-full text-white text-xs font-bold ${fallbackBadgeColor}`}>
                {fallbackBadge}
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-3 leading-tight">{title}</h1>
            {excerpt && <p className="text-lg text-white/90 max-w-3xl">{excerpt}</p>}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container mx-auto px-6 max-w-5xl space-y-12">

          {/* Stats */}
          {(project?.beneficiaries || project?.duration) && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {project?.beneficiaries && (
                <div className="bg-primary/10 rounded-2xl p-5 border border-primary/20">
                  <div className="text-2xl font-black text-primary mb-1">{project.beneficiaries}</div>
                  <p className="text-muted-foreground text-xs">Beneficiaries</p>
                </div>
              )}
              {project?.duration && (
                <div className="bg-primary/10 rounded-2xl p-5 border border-primary/20">
                  <div className="text-2xl font-black text-primary mb-1">{project.duration}</div>
                  <p className="text-muted-foreground text-xs">Duration</p>
                </div>
              )}
            </motion.div>
          )}

          {/* Why It Matters */}
          {project?.why_it_matters && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center gap-3 mb-4">
                <Target className="text-primary" size={24} />
                <h2 className="text-2xl font-black text-foreground">Why It Matters</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">{project.why_it_matters}</p>
            </motion.div>
          )}

          {/* What We Do */}
          {project?.what_we_do?.filter(Boolean).length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center gap-3 mb-4">
                <Lightbulb className="text-primary" size={24} />
                <h2 className="text-2xl font-black text-foreground">What We Do</h2>
              </div>
              <div className="space-y-3">
                {project.what_we_do.filter(Boolean).map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-primary shrink-0 mt-0.5" />
                    <p className="text-muted-foreground">{item}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Key Solutions */}
          {project?.key_solutions && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center gap-3 mb-4">
                <Lightbulb className="text-primary" size={24} />
                <h2 className="text-2xl font-black text-foreground">Key Solutions & Programs</h2>
              </div>
              <div className="bg-card rounded-2xl p-6 border border-border">
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{project.key_solutions}</p>
              </div>
            </motion.div>
          )}

          {/* Who It Serves */}
          {project?.who_it_serves && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center gap-3 mb-4">
                <Users className="text-primary" size={24} />
                <h2 className="text-2xl font-black text-foreground">Who It Serves</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">{project.who_it_serves}</p>
            </motion.div>
          )}

          {/* Impact */}
          {project?.impact?.filter(Boolean).length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="text-2xl font-black text-foreground mb-4">Impact</h2>
              <div className="bg-primary/5 rounded-2xl p-6 border border-primary/20 space-y-3">
                {project.impact.filter(Boolean).map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-primary shrink-0 mt-0.5" />
                    <p className="text-muted-foreground">{item}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Partners */}
          {project?.partners?.filter(Boolean).length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center gap-3 mb-4">
                <Globe className="text-primary" size={24} />
                <h2 className="text-2xl font-black text-foreground">Partners</h2>
              </div>
              <div className="bg-card rounded-2xl p-6 border border-border">
                <div className="flex flex-wrap gap-3">
                  {project.partners.filter(Boolean).map(p => (
                    <span key={p} className="px-3 py-1.5 bg-primary/10 text-primary text-sm font-semibold rounded-full">{p}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Highlights */}
          {project?.highlights?.filter(Boolean).length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="text-2xl font-black text-foreground mb-4">Highlights</h2>
              <div className="flex flex-wrap gap-3">
                {project.highlights.filter(Boolean).map((h, i) => (
                  <span key={i} className="px-4 py-2 bg-primary/10 text-primary font-semibold rounded-full text-sm">{h}</span>
                ))}
              </div>
            </motion.div>
          )}

          {/* CTA */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-center bg-primary/10 rounded-2xl p-10 border border-primary/20">
            <h3 className="text-2xl font-black text-foreground mb-3">Get Involved</h3>
            {project?.call_to_action && (
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">{project.call_to_action}</p>
            )}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary text-white rounded-full px-8" asChild>
                <a href="/#contact">Contact Us</a>
              </Button>
              <Button variant="outline" size="lg" className="rounded-full px-8" asChild>
                <Link to="/projects">View All Projects</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ProjectPage;
