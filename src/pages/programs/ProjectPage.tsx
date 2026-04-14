import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, Globe, Target, Lightbulb, Users, ArrowRight } from "lucide-react";
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

const Reveal = ({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 28 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

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

      {/* HERO — split layout */}
      <section className="min-h-screen grid lg:grid-cols-2 pt-20">
        {/* Left — text */}
        <div className="flex flex-col justify-center px-8 sm:px-12 lg:px-16 py-16 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
          <div className="relative z-10 max-w-xl">
            <Link to="/projects" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-10 group text-sm font-medium transition-colors">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Back to Projects
            </Link>

            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-px bg-primary" />
              <span className={`text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full text-white ${fallbackBadgeColor}`}>
                {fallbackBadge}
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-foreground leading-none mb-6 tracking-tight">
              {title}
            </h1>

            {excerpt && (
              <p className="text-lg text-muted-foreground leading-relaxed mb-10 font-light max-w-lg">
                {excerpt}
              </p>
            )}

            <div className="flex flex-wrap gap-4">
              <a href="#content" className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-orange-600 transition-colors">
                Explore Program <ArrowRight size={16} />
              </a>
              <a href="/#contact" className="inline-flex items-center gap-2 border border-border text-foreground px-6 py-3 rounded-full font-semibold text-sm hover:border-primary hover:text-primary transition-colors">
                Get Involved
              </a>
            </div>

            {/* Stats inline */}
            {(project?.beneficiaries || project?.duration) && (
              <div className="flex gap-8 mt-12 pt-8 border-t border-border">
                {project?.beneficiaries && (
                  <div>
                    <div className="text-3xl font-black text-primary">{project.beneficiaries}</div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Beneficiaries</div>
                  </div>
                )}
                {project?.duration && (
                  <div>
                    <div className="text-3xl font-black text-primary">{project.duration}</div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Duration</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right — image */}
        <div className="relative min-h-[50vh] lg:min-h-0 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-background/20 lg:to-background/10" />
        </div>
      </section>

      {/* CONTENT */}
      <div id="content">

        {/* Why It Matters */}
        {project?.why_it_matters && (
          <section className="py-20 border-t border-border">
            <div className="container mx-auto px-6 max-w-6xl grid lg:grid-cols-3 gap-12 items-start">
              <Reveal>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-px bg-primary" />
                  <span className="text-xs font-bold tracking-widest uppercase text-primary">Why It Matters</span>
                </div>
                <h2 className="text-3xl font-black text-foreground leading-tight">The Problem We're Solving</h2>
              </Reveal>
              <Reveal delay={0.1} className="lg:col-span-2">
                <p className="text-lg text-muted-foreground leading-relaxed font-light">{project.why_it_matters}</p>
              </Reveal>
            </div>
          </section>
        )}

        {/* What We Do */}
        {project?.what_we_do?.filter(Boolean).length > 0 && (
          <section className="py-20 bg-muted/30 border-t border-border">
            <div className="container mx-auto px-6 max-w-6xl">
              <Reveal className="mb-12">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-px bg-primary" />
                  <span className="text-xs font-bold tracking-widest uppercase text-primary">What We Do</span>
                </div>
                <h2 className="text-3xl font-black text-foreground">Our Core Activities</h2>
              </Reveal>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {project.what_we_do.filter(Boolean).map((item, i) => (
                  <Reveal key={i} delay={i * 0.07}>
                    <div className="bg-background rounded-2xl p-6 border border-border hover:border-primary/40 hover:shadow-lg transition-all duration-300 h-full">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <span className="text-primary font-black text-sm">{String(i + 1).padStart(2, '0')}</span>
                      </div>
                      <p className="text-foreground text-sm leading-relaxed">{item}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Key Solutions */}
        {project?.key_solutions && (
          <section className="py-20 border-t border-border">
            <div className="container mx-auto px-6 max-w-6xl grid lg:grid-cols-3 gap-12 items-start">
              <Reveal>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-px bg-primary" />
                  <span className="text-xs font-bold tracking-widest uppercase text-primary">Key Solutions</span>
                </div>
                <h2 className="text-3xl font-black text-foreground leading-tight">Programs & Platforms</h2>
              </Reveal>
              <Reveal delay={0.1} className="lg:col-span-2">
                <div className="bg-muted/40 rounded-2xl p-8 border border-border">
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{project.key_solutions}</p>
                </div>
              </Reveal>
            </div>
          </section>
        )}

        {/* Who It Serves */}
        {project?.who_it_serves && (
          <section className="py-20 bg-gray-950 border-t border-border">
            <div className="container mx-auto px-6 max-w-6xl grid lg:grid-cols-3 gap-12 items-start">
              <Reveal>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-px bg-orange-400" />
                  <span className="text-xs font-bold tracking-widest uppercase text-orange-400">Who It Serves</span>
                </div>
                <h2 className="text-3xl font-black text-white leading-tight">Our Beneficiaries</h2>
              </Reveal>
              <Reveal delay={0.1} className="lg:col-span-2">
                <p className="text-gray-300 text-lg leading-relaxed font-light">{project.who_it_serves}</p>
              </Reveal>
            </div>
          </section>
        )}

        {/* Impact */}
        {project?.impact?.filter(Boolean).length > 0 && (
          <section className="py-20 border-t border-border">
            <div className="container mx-auto px-6 max-w-6xl">
              <Reveal className="mb-12">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-px bg-primary" />
                  <span className="text-xs font-bold tracking-widest uppercase text-primary">Impact</span>
                </div>
                <h2 className="text-3xl font-black text-foreground">Expected Outcomes</h2>
              </Reveal>
              <div className="space-y-4">
                {project.impact.filter(Boolean).map((item, i) => (
                  <Reveal key={i} delay={i * 0.06}>
                    <div className="flex items-start gap-5 p-6 bg-muted/30 rounded-2xl border border-border hover:border-primary/30 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 size={16} className="text-white" />
                      </div>
                      <p className="text-foreground leading-relaxed">{item}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Partners */}
        {project?.partners?.filter(Boolean).length > 0 && (
          <section className="py-20 bg-muted/30 border-t border-border">
            <div className="container mx-auto px-6 max-w-6xl">
              <Reveal className="mb-10">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-px bg-primary" />
                  <span className="text-xs font-bold tracking-widest uppercase text-primary">Partners</span>
                </div>
                <h2 className="text-3xl font-black text-foreground">Who We Work With</h2>
              </Reveal>
              <Reveal delay={0.1}>
                <div className="flex flex-wrap gap-3">
                  {project.partners.filter(Boolean).map((p, i) => (
                    <span key={i} className="px-4 py-2 bg-background border border-border text-foreground text-sm font-medium rounded-full hover:border-primary hover:text-primary transition-colors">
                      {p}
                    </span>
                  ))}
                </div>
              </Reveal>
            </div>
          </section>
        )}

        {/* Highlights */}
        {project?.highlights?.filter(Boolean).length > 0 && (
          <section className="py-16 border-t border-border">
            <div className="container mx-auto px-6 max-w-6xl">
              <Reveal>
                <div className="flex flex-wrap gap-3">
                  {project.highlights.filter(Boolean).map((h, i) => (
                    <span key={i} className="px-4 py-2 bg-primary/10 text-primary font-semibold rounded-full text-sm border border-primary/20">
                      {h}
                    </span>
                  ))}
                </div>
              </Reveal>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="py-24 bg-gray-950 border-t border-border relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-orange-500/15 via-transparent to-transparent pointer-events-none" />
          <div className="container mx-auto px-6 max-w-4xl text-center relative z-10">
            <Reveal>
              <div className="flex items-center justify-center gap-2 mb-6">
                <div className="w-6 h-px bg-orange-400" />
                <span className="text-xs font-bold tracking-widest uppercase text-orange-400">Get Involved</span>
                <div className="w-6 h-px bg-orange-400" />
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
                Be Part of the Change
              </h2>
              {project?.call_to_action && (
                <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto leading-relaxed font-light">
                  {project.call_to_action}
                </p>
              )}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-10 shadow-xl shadow-orange-500/30" asChild>
                  <a href="/#contact">Contact Us</a>
                </Button>
                <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-full px-10" asChild>
                  <Link to="/projects">View All Projects</Link>
                </Button>
              </div>
            </Reveal>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default ProjectPage;
