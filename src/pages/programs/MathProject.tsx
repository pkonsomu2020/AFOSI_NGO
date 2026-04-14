import { motion } from "framer-motion";
import { ArrowLeft, Leaf, Target, Users, Lightbulb, CheckCircle2, Globe, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const MathProject = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative h-[50vh] sm:h-[60vh] overflow-hidden">
        <img src="/afosi_pad2.jpg" alt="M.A.T.H Project" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/65" />
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-6 pb-12">
            <Link to="/projects" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 group">
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-semibold">Back to Projects</span>
            </Link>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center">
                <Leaf className="text-white" size={24} />
              </div>
              <Badge className="bg-green-500/90 text-white border-0">Education & Environment</Badge>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-3 leading-tight">The M.A.T.H Project</h1>
            <p className="text-lg text-white/90 max-w-3xl">Mazingira, Afya, Tumaini, na Haki yetu — Education for Sustainable Development in Nairobi's informal settlements.</p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container mx-auto px-6 max-w-5xl">

          {/* Overview */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
            <div className="flex items-center gap-3 mb-5">
              <Target className="text-primary" size={28} />
              <h2 className="text-3xl font-black text-foreground">About the Project</h2>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              The M.A.T.H Project is a three-year initiative (2025–2028) implemented by AFOSI in 60 Alternative Provision of Basic Education and Training (APBET) schools in Kibera and Mukuru — two of Nairobi's largest informal settlements.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              The project supports the review, sensitization, and implementation of Kenya's Education for Sustainable Development (ESD) Policy (2017), targeting school communities who lack the knowledge, skills, and platforms to address climate change and environmental degradation.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="grid sm:grid-cols-4 gap-5 mb-12">
            {[
              { value: "60", label: "APBET Schools" },
              { value: "2025–2028", label: "Project Duration" },
              { value: "Kibera & Mukuru", label: "Target Areas" },
              { value: "3", label: "Integrated Pillars" },
            ].map((s, i) => (
              <div key={i} className="bg-primary/10 rounded-2xl p-5 border border-primary/20">
                <div className="text-2xl font-black text-primary mb-1">{s.value}</div>
                <p className="text-muted-foreground text-xs">{s.label}</p>
              </div>
            ))}
          </motion.div>

          {/* Three Pillars */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-12">
            <div className="flex items-center gap-3 mb-5">
              <Lightbulb className="text-primary" size={28} />
              <h2 className="text-3xl font-black text-foreground">Three Integrated Pillars</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {[
                { icon: Users, title: "Education & Sensitization", desc: "Trains APBET owners, teachers, and learners using animation, gamification, and STEM4Sustainable Development tools including creative coding and AI-enabled early warning systems." },
                { icon: Megaphone, title: "Advocacy", desc: "Supports the Ministry of Education to review the ESD Policy (2017), partners with the First Lady's Mazingira Awards (FLAMA), and amplifies youth voices in climate policy processes." },
                { icon: Lightbulb, title: "Innovation", desc: "Organizes platforms for APBET schools to showcase ESD ideas, incubates winning projects for 12+ months, and links youth innovators to the Youth Climate Hub." },
              ].map((p, i) => {
                const Icon = p.icon;
                return (
                  <div key={i} className="bg-card rounded-xl p-6 border border-border hover:shadow-lg transition-shadow">
                    <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center mb-4">
                      <Icon className="text-white" size={20} />
                    </div>
                    <h3 className="font-bold text-foreground mb-2">{p.title}</h3>
                    <p className="text-muted-foreground text-sm">{p.desc}</p>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Impact */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-12">
            <h2 className="text-3xl font-black text-foreground mb-5">Expected Impact by 2028</h2>
            <div className="bg-primary/5 rounded-2xl p-8 border border-primary/20 space-y-3">
              {[
                "75%+ of targeted children, youth, teachers, and duty bearers demonstrate improved climate knowledge",
                "Kenya's ESD Policy (2017) reviewed and piloted in targeted APBET schools",
                "60%+ of trained youth participate in at least one environmental advocacy platform annually",
                "20 youth innovators incubated and linked to the Youth Climate Hub",
                "At least 2 climate-related policy processes influenced by youth and community contributions",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-primary shrink-0 mt-0.5" />
                  <p className="text-muted-foreground">{item}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Partners */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mb-12">
            <div className="flex items-center gap-3 mb-5">
              <Globe className="text-primary" size={28} />
              <h2 className="text-3xl font-black text-foreground">Partners</h2>
            </div>
            <div className="bg-card rounded-2xl p-6 border border-border">
              <div className="flex flex-wrap gap-3">
                {["DeCA", "Ministry of Education Kenya", "STEM Impact Centre Kenya", "First Lady's Mazingira Awards (FLAMA)", "Barnfonden", "SIDA"].map(p => (
                  <span key={p} className="px-3 py-1.5 bg-primary/10 text-primary text-sm font-semibold rounded-full">{p}</span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="text-center bg-primary/10 rounded-2xl p-10 border border-primary/20">
            <h3 className="text-2xl font-black text-foreground mb-3">Support the M.A.T.H Project</h3>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">Help equip children and youth in Kibera and Mukuru to become environmental stewards and climate advocates.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary text-white rounded-full px-8" asChild>
                <a href="/#contact">Partner With Us</a>
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

export default MathProject;
