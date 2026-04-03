import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { Lightbulb, Users, Leaf, Rocket, ArrowUpRight, CheckCircle2, ExternalLink, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { projectsAPI } from "@/services/api";

const iconMap: Record<string, any> = { Lightbulb, Users, Leaf, Rocket };

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
  is_featured: boolean;
  display_order: number;
}

const TiltCard = ({ project, i }: { project: Project; i: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), { stiffness: 300, damping: 30 });
  const Icon = iconMap[project.icon] || Lightbulb;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: i * 0.1 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 1000 }}
      className="group relative rounded-2xl overflow-hidden bg-card border border-border shadow-lg hover:shadow-2xl hover:shadow-primary/10 transition-shadow duration-500 cursor-pointer"
    >
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={project.image_url}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute top-4 left-4 w-11 h-11 rounded-xl bg-primary flex items-center justify-center shadow-lg">
          <Icon className="text-white" size={20} />
        </div>
        <div className="absolute bottom-4 left-4 right-4 flex gap-2">
          <span className="text-xs bg-white/20 backdrop-blur-sm text-white px-2 py-1 rounded-full font-semibold">
            {project.beneficiaries} Youth
          </span>
          <span className="text-xs bg-white/20 backdrop-blur-sm text-white px-2 py-1 rounded-full font-semibold">
            {project.duration}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-black text-foreground mb-2 group-hover:text-primary transition-colors">
          {project.title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">
          {project.description}
        </p>
        <div className="space-y-1.5 mb-5">
          {project.highlights.slice(0, 3).map((h, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs">
              <CheckCircle2 size={13} className="text-primary shrink-0" />
              <span className="text-muted-foreground">{h}</span>
            </div>
          ))}
        </div>
        {project.is_external ? (
          <Button variant="ghost" size="sm" className="w-full group/btn hover:bg-primary/10 text-primary font-bold" asChild>
            <a href={project.link} target="_blank" rel="noopener noreferrer">
              Visit Website <ExternalLink size={14} className="ml-1.5" />
            </a>
          </Button>
        ) : (
          <Button variant="ghost" size="sm" className="w-full group/btn hover:bg-primary/10 text-primary font-bold" asChild>
            <Link to={project.link}>
              Learn More <ArrowUpRight size={14} className="ml-1.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
            </Link>
          </Button>
        )}
      </div>

      {/* Hover border glow */}
      <div className="absolute inset-0 border-2 border-primary/0 group-hover:border-primary/30 rounded-2xl transition-colors pointer-events-none" />
    </motion.div>
  );
};

const ProgramsSection = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch latest 4 projects regardless of featured status
    projectsAPI.getAll({ limit: 4 })
      .then(r => setProjects(r.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="programs" className="relative py-16 overflow-hidden bg-background">
      {/* Background accent */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase mb-3">
            What We Do
          </span>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <h2 className="text-4xl md:text-5xl font-black text-foreground leading-none">
              Our <span className="text-primary">Projects</span>
            </h2>
            <Button variant="outline" size="lg" className="group self-start" asChild>
              <a href="/projects">
                View All Projects
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />
              </a>
            </Button>
          </div>
        </motion.div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1,2,3,4].map(i => (
              <div key={i} className="rounded-2xl overflow-hidden bg-card border border-border">
                <div className="h-56 bg-muted animate-pulse" />
                <div className="p-6 space-y-3">
                  <div className="h-5 bg-muted animate-pulse rounded" />
                  <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {projects.map((project, i) => (
              <TiltCard key={project.id} project={project} i={i} />
            ))}
          </div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-10 relative rounded-3xl overflow-hidden bg-gray-950 p-8 md:p-12 text-center"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-orange-500/20 via-transparent to-transparent pointer-events-none" />
          <div className="relative z-10">
            <h3 className="text-3xl md:text-4xl font-black text-white mb-4">
              Want to Partner With Us?
            </h3>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto">
              Join us in creating sustainable change. Whether through funding, collaboration, or volunteering, your support makes a difference.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-8 shadow-xl shadow-orange-500/30">
                Become a Partner
              </Button>
              <Button size="lg" variant="outline" className="border-white/20 text-gray-900 bg-white hover:bg-gray-100 rounded-full px-8" asChild>
                <a href="/projects">View All Projects</a>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProgramsSection;
