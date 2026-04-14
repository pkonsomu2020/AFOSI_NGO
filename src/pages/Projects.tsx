import { motion } from "framer-motion";
import { Lightbulb, Users, Leaf, Rocket, ArrowUpRight, CheckCircle2, ExternalLink, ArrowLeft, FolderKanban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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
  has_subpage?: boolean;
  excerpt?: string;
  slug?: string;
}

const staticProjects: Project[] = [
  {
    id: "we-lead",
    title: "We Lead",
    description: "Strengthening the influence and position of young women whose sexual and reproductive health and rights are neglected the most.",
    image_url: "/PROJECT-IMAGES/welead-project.jpg",
    icon: "Users",
    beneficiaries: "500+",
    duration: "Ongoing",
    highlights: ["Young women living with HIV", "Women with disabilities", "Displacement-affected youth"],
    link: "/programs/we-lead",
    is_external: false,
    is_featured: true,
    display_order: 1,
  },
  {
    id: "math-project",
    title: "The M.A.T.H Project",
    description: "Mazingira, Afya, Tumaini, na Haki yetu — Education for Sustainable Development in 60 APBET schools in Kibera and Mukuru.",
    image_url: "/afosi_pad2.jpg",
    icon: "Leaf",
    beneficiaries: "10,000+",
    duration: "2025–2028",
    highlights: ["60 APBET schools targeted", "ESD Policy advocacy", "Youth climate innovation"],
    link: "/programs/math-project",
    is_external: false,
    is_featured: true,
    display_order: 2,
  },
  {
    id: "sheria-ya-vijana",
    title: "Sheria Ya Vijana",
    description: "Empowering youth in Nairobi and Kwale to lead Kenya's twin green and digital transition through skills, leadership, and policy engagement.",
    image_url: "/afosi_pad3.jpg",
    icon: "Rocket",
    beneficiaries: "5,875",
    duration: "Ongoing",
    highlights: ["Kiongozi AI platform", "Green & digital apprenticeships", "Youth-led enterprise grants"],
    link: "/programs/sheria-ya-vijana",
    is_external: false,
    is_featured: true,
    display_order: 3,
  },
  {
    id: "yoma",
    title: "YOMA — Youth Agency Marketplace",
    description: "A digital marketplace creating pathways to improve youth employability through learning, earning, and climate innovation across Kenya.",
    image_url: "/afosi_pad1.jpg",
    icon: "Lightbulb",
    beneficiaries: "69,000",
    duration: "Ongoing",
    highlights: ["Youth Climate Innovation Challenge", "Digital skills pathways", "YOMA Hub in Nairobi"],
    link: "/programs/yoma",
    is_external: false,
    is_featured: true,
    display_order: 4,
  },
  {
    id: "youth-voices-lab",
    title: "Youth Voices Lab",
    description: "Unheard to Influential — harnessing AI and digital advocacy to give voice to marginalized young women in Mukuru, Nairobi.",
    image_url: "/afosi_pad.jpg",
    icon: "Users",
    beneficiaries: "150+",
    duration: "12 months",
    highlights: ["AI-driven storytelling tools", "Policy advocacy training", "15 intervention countries"],
    link: "/programs/youth-voices-lab",
    is_external: false,
    is_featured: true,
    display_order: 5,
  },
];

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>(staticProjects);

  useEffect(() => {
    projectsAPI.getAll()
      .then(r => { if (r.data?.length) setProjects(r.data); })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20 sm:py-24 md:py-32 lg:py-40 overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/HERO_4.jpg')",
          }}
        />
        
        {/* Black Overlay */}
        <div className="absolute inset-0 bg-black/70" />
        
        {/* Content */}
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-6 sm:mb-8 group">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-semibold">Back to Home</span>
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm shrink-0">
                <FolderKanban className="text-white" size={24} />
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white leading-tight">
                Our Projects
              </h1>
            </div>
            <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-2xl leading-relaxed">
              Transformative initiatives making a real difference in communities across Kenya
            </p>
          </motion.div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-7xl">
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
                        {project.excerpt || project.description}
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
              <Button variant="hero" size="lg" className="shadow-xl" asChild>
                <a href="/#contact">Become a Partner</a>
              </Button>
              <Button variant="outline" size="lg" className="shadow-lg" asChild>
                <Link to="/opportunities">View Opportunities</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Projects;
