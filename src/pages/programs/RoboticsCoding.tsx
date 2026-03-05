import { motion } from "framer-motion";
import { ArrowLeft, Rocket, Code, Cpu, Lightbulb, CheckCircle2, Users, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const RoboticsCoding = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[50vh] sm:h-[60vh] overflow-hidden">
        <img
          src="https://afosi.org/assets/images/robotics.webp"
          alt="Robotics & Creative Coding"
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
                <Rocket className="text-white" size={28} />
              </div>
              <Badge className="bg-blue-500/90 backdrop-blur-sm text-white border-0">
                STEM Education
              </Badge>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-4 leading-tight">
              Robotics & Creative Coding
            </h1>
            
            <p className="text-lg sm:text-xl text-white/90 max-w-3xl leading-relaxed">
              Introducing youth to creative coding and robotics, developing critical thinking and problem-solving skills for the digital age
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
                In collaboration with STEM IMPACT CENTER, our Robotics & Creative Coding program introduces youth in informal settlements to the exciting world of technology, coding, and robotics. This hands-on program develops critical thinking, problem-solving skills, and prepares young people for careers in the digital economy.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Through practical projects and real-world applications, participants learn to code, build robots, and use technology to solve community challenges, breaking down barriers to STEM education and creating pathways to innovation.
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
                <div className="text-4xl font-heading font-bold text-primary mb-2">300+</div>
                <p className="text-muted-foreground">Youth Trained</p>
              </div>
              <div className="bg-primary/10 rounded-2xl p-6 border border-primary/20">
                <div className="text-4xl font-heading font-bold text-primary mb-2">12</div>
                <p className="text-muted-foreground">Months Duration</p>
              </div>
              <div className="bg-primary/10 rounded-2xl p-6 border border-primary/20">
                <div className="text-4xl font-heading font-bold text-primary mb-2">100%</div>
                <p className="text-muted-foreground">Hands-On Learning</p>
              </div>
            </motion.div>

            {/* Learning Areas */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-12"
            >
              <div className="flex items-center gap-3 mb-6">
                <Code className="text-primary" size={32} />
                <h2 className="text-3xl font-heading font-bold text-foreground">What Students Learn</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    title: "Creative Coding",
                    description: "Learn programming fundamentals through creative projects, building games, animations, and interactive applications.",
                    icon: Code
                  },
                  {
                    title: "Robotics Basics",
                    description: "Build and program robots, understanding mechanics, electronics, and automation through hands-on projects.",
                    icon: Cpu
                  },
                  {
                    title: "Problem Solving",
                    description: "Develop critical thinking skills by applying technology to solve real community challenges and create solutions.",
                    icon: Lightbulb
                  },
                  {
                    title: "Collaboration",
                    description: "Work in teams on projects, learning communication, teamwork, and project management skills.",
                    icon: Users
                  }
                ].map((area, idx) => {
                  const Icon = area.icon;
                  return (
                    <div key={idx} className="bg-card rounded-xl p-6 border border-border hover:shadow-lg transition-shadow">
                      <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center mb-4">
                        <Icon className="text-white" size={24} />
                      </div>
                      <h3 className="text-xl font-heading font-bold text-foreground mb-2">{area.title}</h3>
                      <p className="text-muted-foreground">{area.description}</p>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Program Structure */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-12"
            >
              <h2 className="text-3xl font-heading font-bold text-foreground mb-6">Program Structure</h2>
              <div className="space-y-6">
                {[
                  {
                    phase: "Phase 1: Foundations",
                    duration: "Months 1-3",
                    activities: [
                      "Introduction to coding concepts and logic",
                      "Basic programming with visual tools",
                      "Introduction to robotics components",
                      "Simple robot building projects"
                    ]
                  },
                  {
                    phase: "Phase 2: Application",
                    duration: "Months 4-8",
                    activities: [
                      "Text-based programming languages",
                      "Advanced robot programming",
                      "Team projects and challenges",
                      "Community problem identification"
                    ]
                  },
                  {
                    phase: "Phase 3: Innovation",
                    duration: "Months 9-12",
                    activities: [
                      "Final project development",
                      "Community solution implementation",
                      "Project presentations and demos",
                      "Career guidance and pathways"
                    ]
                  }
                ].map((phase, idx) => (
                  <div key={idx} className="bg-card rounded-xl p-6 border border-border">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-heading font-bold text-foreground">{phase.phase}</h3>
                      <Badge className="bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800">
                        {phase.duration}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      {phase.activities.map((activity, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <CheckCircle2 size={18} className="text-primary shrink-0 mt-0.5" />
                          <p className="text-muted-foreground">{activity}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Impact & Outcomes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-12"
            >
              <h2 className="text-3xl font-heading font-bold text-foreground mb-6">Impact & Outcomes</h2>
              <div className="bg-primary/5 rounded-2xl p-8 border border-primary/20">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xl font-heading font-bold text-foreground mb-4">For Students</h3>
                    <div className="space-y-3">
                      {[
                        "Gain valuable STEM skills",
                        "Build confidence in technology",
                        "Develop problem-solving abilities",
                        "Prepare for tech careers",
                        "Create innovative solutions"
                      ].map((outcome, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <CheckCircle2 size={18} className="text-primary shrink-0 mt-0.5" />
                          <p className="text-muted-foreground">{outcome}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-heading font-bold text-foreground mb-4">For Communities</h3>
                    <div className="space-y-3">
                      {[
                        "Technology-driven solutions",
                        "Youth innovation and creativity",
                        "Digital literacy improvement",
                        "Economic opportunities",
                        "Community problem-solving"
                      ].map((outcome, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <CheckCircle2 size={18} className="text-primary shrink-0 mt-0.5" />
                          <p className="text-muted-foreground">{outcome}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Partnership */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-12"
            >
              <h2 className="text-3xl font-heading font-bold text-foreground mb-6">Our Partner</h2>
              <div className="bg-card rounded-2xl p-8 border border-border">
                <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                  This program is delivered in collaboration with <strong className="text-foreground">STEM IMPACT CENTER</strong>, a leading organization in STEM education and youth empowerment.
                </p>
                <p className="text-muted-foreground">
                  Together, we're breaking down barriers to technology education and creating pathways for youth in informal settlements to access quality STEM learning and career opportunities.
                </p>
              </div>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-center bg-primary/10 rounded-2xl p-8 sm:p-12 border border-primary/20"
            >
              <h3 className="text-2xl sm:text-3xl font-heading font-bold text-foreground mb-4">
                Interested in STEM Education?
              </h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Whether you want to enroll, volunteer, or partner with us, we'd love to hear from you. Let's empower the next generation of innovators together.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="hero" size="lg" asChild>
                  <a href="/#contact">Get In Touch</a>
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

export default RoboticsCoding;
