import { motion } from "framer-motion";
import { Lightbulb, Users, Leaf, Rocket, ArrowUpRight, CheckCircle2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { projectsAPI } from "@/services/api";

// Icon mapping
const iconMap: Record<string, any> = {
  Lightbulb,
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
  is_featured: boolean;
  display_order: number;
}

const ProgramsSection = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await projectsAPI.getAll({ featured: true, limit: 2 });
        setProjects(response.data || []);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <section id="programs" className="relative py-16 sm:py-20 md:py-24 lg:py-32 overflow-hidden bg-background">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl relative z-10">
          <div className="text-center">
            <p className="text-muted-foreground">Loading projects...</p>
          </div>
        </div>
      </section>
    );
  }
  
  return (
    <section id="programs" className="relative py-16 sm:py-20 md:py-24 lg:py-32 overflow-hidden bg-background">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-foreground mb-4 leading-tight">
            Our <span className="text-primary">Projects</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Recent projects making a difference in communities
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
          {projects.map((project, i) => {
            const Icon = iconMap[project.icon] || Lightbulb;
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group relative rounded-2xl overflow-hidden bg-card border border-border shadow-lg hover:shadow-2xl transition-all duration-500"
              >
                {/* Image with overlay */}
                <div className="relative h-48 sm:h-56 overflow-hidden">
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  
                  {/* Icon */}
                  <div className="absolute top-4 left-4 w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Icon className="text-white" size={24} />
                  </div>

                  {/* Stats badges */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <Badge className="bg-white/90 backdrop-blur-sm text-foreground border-0 shadow-lg text-xs">
                      {project.beneficiaries} Youth
                    </Badge>
                    <Badge className="bg-white/90 backdrop-blur-sm text-foreground border-0 shadow-lg text-xs">
                      {project.duration}
                    </Badge>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 sm:p-6">
                  <h3 className="text-xl sm:text-2xl font-heading font-bold text-foreground mb-3 group-hover:text-primary transition-colors leading-tight">
                    {project.title}
                  </h3>

                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {project.description}
                  </p>

                  {/* Highlights */}
                  <div className="space-y-2 mb-5">
                    {project.highlights.map((highlight, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm">
                        <CheckCircle2 size={16} className="text-primary shrink-0" />
                        <span className="text-muted-foreground">{highlight}</span>
                      </div>
                    ))}
                  </div>

                  {/* Learn more button */}
                  {project.is_external ? (
                    <Button 
                      variant="ghost" 
                      className="w-full group/btn hover:bg-primary/10 text-primary font-semibold"
                      asChild
                    >
                      <a href={project.link} target="_blank" rel="noopener noreferrer">
                        Visit Website
                        <ExternalLink size={16} className="ml-2 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                      </a>
                    </Button>
                  ) : (
                    <Button 
                      variant="ghost" 
                      className="w-full group/btn hover:bg-primary/10 text-primary font-semibold"
                      asChild
                    >
                      <Link to={project.link}>
                        Learn More
                        <ArrowUpRight size={16} className="ml-2 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                      </Link>
                    </Button>
                  )}
                </div>

                {/* Animated border on hover */}
                <div className="absolute inset-0 border-2 border-primary/0 group-hover:border-primary/30 rounded-2xl transition-colors pointer-events-none" />
              </motion.div>
            );
          })}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-12 sm:mt-16 text-center bg-primary/10 rounded-2xl p-8 sm:p-12 border border-primary/20"
        >
          <h3 className="text-2xl sm:text-3xl font-heading font-bold text-foreground mb-4">
            Want to Partner With Us?
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Join us in creating sustainable change. Whether through funding, collaboration, or volunteering, your support makes a difference.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg" className="shadow-xl">
              Become a Partner
            </Button>
            <Button variant="outline" size="lg" className="shadow-lg" asChild>
              <a href="/projects">View All Projects</a>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProgramsSection;
