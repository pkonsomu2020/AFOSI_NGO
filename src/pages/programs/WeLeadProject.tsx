import { motion } from "framer-motion";
import { ArrowLeft, Users, Target, Heart, Sparkles, CheckCircle2, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const WeLeadProject = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[50vh] sm:h-[60vh] overflow-hidden">
        <img
          src="https://afosi.org/assets/images/we_lead.webp"
          alt="We Lead Project"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/70" />
        
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 sm:px-6 pb-12 sm:pb-16">
            <Link to="/#programs" className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-6 group">
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-semibold">Back to Programs</span>
            </Link>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center shadow-lg">
                <Users className="text-white" size={28} />
              </div>
              <Badge className="bg-purple-500/90 backdrop-blur-sm text-white border-0">
                Empowerment Program
              </Badge>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-4 leading-tight">
              We Lead Project
            </h1>
            
            <p className="text-lg sm:text-xl text-white/90 max-w-3xl leading-relaxed">
              Empowering young women to take charge of their Sexual and Reproductive Health Rights through leadership and social justice
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            {/* Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12"
            >
              <div className="flex items-center gap-3 mb-6">
                <Target className="text-primary" size={32} />
                <h2 className="text-3xl font-heading font-bold text-foreground">Program Overview</h2>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                The We Lead Project, funded by HIVOS East Africa through the Center for Adolescence (CSA), is an inspiring initiative designed to empower young women facing multiple barriers in society. This project focuses on supporting young women right-holders on their SRHR (Sexual and Reproductive Health Rights).
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                By addressing the intersectionality of these diverse challenges, the initiative provides a unique platform where these young women can find support, share experiences, and develop vital leadership skills.
              </p>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid sm:grid-cols-3 gap-6 mb-12"
            >
              <div className="bg-primary/10 rounded-2xl p-6 border border-primary/20">
                <div className="text-4xl font-heading font-bold text-primary mb-2">500+</div>
                <p className="text-muted-foreground">Young Women Empowered</p>
              </div>
              <div className="bg-primary/10 rounded-2xl p-6 border border-primary/20">
                <div className="text-4xl font-heading font-bold text-primary mb-2">Ongoing</div>
                <p className="text-muted-foreground">Program Duration</p>
              </div>
              <div className="bg-primary/10 rounded-2xl p-6 border border-primary/20">
                <div className="text-4xl font-heading font-bold text-primary mb-2">100%</div>
                <p className="text-muted-foreground">SRHR Focused</p>
              </div>
            </motion.div>

            {/* Key Components */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-12"
            >
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="text-primary" size={32} />
                <h2 className="text-3xl font-heading font-bold text-foreground">Key Components</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    title: "Leadership Training",
                    description: "Comprehensive leadership development programs that build confidence, decision-making skills, and advocacy capabilities.",
                    icon: Award
                  },
                  {
                    title: "SRHR Education",
                    description: "Evidence-based sexual and reproductive health rights education tailored to young women's needs and experiences.",
                    icon: Heart
                  },
                  {
                    title: "Mentorship Programs",
                    description: "One-on-one mentorship with experienced leaders who provide guidance, support, and inspiration.",
                    icon: Users
                  },
                  {
                    title: "Community Engagement",
                    description: "Opportunities to lead community initiatives and drive social change in their local environments.",
                    icon: Target
                  }
                ].map((component, idx) => {
                  const Icon = component.icon;
                  return (
                    <div key={idx} className="bg-card rounded-xl p-6 border border-border hover:shadow-lg transition-shadow">
                      <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center mb-4">
                        <Icon className="text-white" size={24} />
                      </div>
                      <h3 className="text-xl font-heading font-bold text-foreground mb-2">{component.title}</h3>
                      <p className="text-muted-foreground">{component.description}</p>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Impact Areas */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-12"
            >
              <h2 className="text-3xl font-heading font-bold text-foreground mb-6">Impact Areas</h2>
              <div className="bg-primary/5 rounded-2xl p-8 border border-primary/20">
                <div className="space-y-4">
                  {[
                    "Enhanced self-confidence and self-esteem among young women",
                    "Increased knowledge and awareness of SRHR",
                    "Development of leadership and advocacy skills",
                    "Creation of safe spaces for sharing experiences",
                    "Building networks of support and solidarity",
                    "Empowerment to challenge systemic barriers",
                    "Promotion of social justice and gender equality"
                  ].map((impact, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle2 size={20} className="text-primary shrink-0 mt-0.5" />
                      <p className="text-muted-foreground">{impact}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Funding Partner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-12"
            >
              <h2 className="text-3xl font-heading font-bold text-foreground mb-6">Funding Partner</h2>
              <div className="bg-card rounded-2xl p-8 border border-border">
                <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                  This program is made possible through generous funding from <strong className="text-foreground">HIVOS East Africa</strong> through the <strong className="text-foreground">Center for Adolescence (CSA)</strong>.
                </p>
                <p className="text-muted-foreground">
                  Their commitment to empowering young women and advancing SRHR has been instrumental in creating lasting change in communities across Kenya.
                </p>
              </div>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center bg-primary/10 rounded-2xl p-8 sm:p-12 border border-primary/20"
            >
              <h3 className="text-2xl sm:text-3xl font-heading font-bold text-foreground mb-4">
                Want to Get Involved?
              </h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Join us in empowering young women and advancing SRHR. Whether through volunteering, partnerships, or support, your involvement makes a difference.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="hero" size="lg" asChild>
                  <a href="/#contact">Contact Us</a>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/#programs">View All Programs</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default WeLeadProject;
