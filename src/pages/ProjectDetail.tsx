import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, CheckCircle2, Lightbulb, Users, Leaf, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-muted-foreground">Loading project...</p>
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
          <Button asChild>
            <Link to="/projects">
              <ArrowLeft size={16} className="mr-2" />
              Back to Projects
            </Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const Icon = iconMap[project.icon] || Lightbulb;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-12 md:py-20 bg-primary">
        <div className="absolute inset-0 bg-[url('/afosi_pad.jpg')] bg-cover bg-center opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link 
              to="/projects" 
              className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Projects
            </Link>
            
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 rounded-xl bg-white flex items-center justify-center shadow-lg shrink-0">
                <Icon className="text-primary" size={32} />
              </div>
              
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white mb-4">
                  {project.title}
                </h1>
                
                <div className="flex flex-wrap gap-3">
                  {project.beneficiaries && (
                    <Badge className="bg-white/20 backdrop-blur-sm text-white border-0">
                      {project.beneficiaries} Youth
                    </Badge>
                  )}
                  {project.duration && (
                    <Badge className="bg-white/20 backdrop-blur-sm text-white border-0">
                      {project.duration}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="md:col-span-2 space-y-8">
              {/* Project Image */}
              {project.image_url && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="rounded-2xl overflow-hidden shadow-xl"
                >
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="w-full h-auto object-cover"
                  />
                </motion.div>
              )}

              {/* Full Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="prose prose-lg max-w-none"
              >
                <div className="text-foreground leading-relaxed whitespace-pre-line">
                  {project.full_content || project.description}
                </div>
              </motion.div>

              {/* Project Link */}
              {project.link && project.is_external && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Button variant="hero" size="lg" className="gap-2" asChild>
                    <a href={project.link} target="_blank" rel="noopener noreferrer">
                      Visit Project Website
                      <ExternalLink size={18} />
                    </a>
                  </Button>
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Highlights */}
              {project.highlights.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-card border border-border rounded-xl p-6"
                >
                  <h3 className="text-lg font-heading font-bold text-foreground mb-4">
                    Key Highlights
                  </h3>
                  <div className="space-y-3">
                    {project.highlights.map((highlight, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <CheckCircle2 size={20} className="text-primary shrink-0 mt-0.5" />
                        <span className="text-sm text-foreground">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Project Info */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-card border border-border rounded-xl p-6"
              >
                <h3 className="text-lg font-heading font-bold text-foreground mb-4">
                  Project Information
                </h3>
                <div className="space-y-3 text-sm">
                  {project.beneficiaries && (
                    <div>
                      <span className="text-muted-foreground">Beneficiaries:</span>
                      <p className="text-foreground font-medium">{project.beneficiaries} Youth</p>
                    </div>
                  )}
                  {project.duration && (
                    <div>
                      <span className="text-muted-foreground">Duration:</span>
                      <p className="text-foreground font-medium">{project.duration}</p>
                    </div>
                  )}
                  <div>
                    <span className="text-muted-foreground">Category:</span>
                    <p className="text-foreground font-medium">{project.icon}</p>
                  </div>
                </div>
              </motion.div>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-primary/10 border border-primary/20 rounded-xl p-6"
              >
                <h3 className="text-lg font-heading font-bold text-foreground mb-2">
                  Get Involved
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Interested in supporting or partnering with this project?
                </p>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link to="/#contact">Contact Us</Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProjectDetail;
