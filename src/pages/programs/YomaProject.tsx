import { motion } from "framer-motion";
import { ArrowLeft, Cpu, Target, Users, Lightbulb, CheckCircle2, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const YomaProject = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative h-[50vh] sm:h-[60vh] overflow-hidden">
        <img src="/afosi_pad1.jpg" alt="YOMA Project" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/65" />
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-6 pb-12">
            <Link to="/projects" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 group">
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-semibold">Back to Projects</span>
            </Link>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-500 flex items-center justify-center">
                <Cpu className="text-white" size={24} />
              </div>
              <Badge className="bg-indigo-500/90 text-white border-0">Digital Marketplace</Badge>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-3 leading-tight">YOMA</h1>
            <p className="text-lg text-white/90 max-w-3xl">Youth Agency Marketplace — a digital ecosystem creating pathways to improve youth employability across Kenya.</p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container mx-auto px-6 max-w-5xl">

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
            <div className="flex items-center gap-3 mb-5">
              <Target className="text-primary" size={28} />
              <h2 className="text-3xl font-black text-foreground">About YOMA</h2>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              YOMA is a digital marketplace that opens up a world of opportunities to young people. It is a partnership ecosystem, enabled by technology, that creates pathways to improve youth employability. Through a unique digital identity, young people seamlessly navigate opportunities to learn, earn, and impact their environment and communities.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Implemented in Kenya by STEM Impact Center Kenya in consortium with Fablab (Kisumu) and Tech Kidz Africa (Mombasa), and funded by UNICEF under the Generation Unlimited (GenU) initiative, YOMA Kenya is being scaled to reach 69,000 young people across Nairobi, Kisumu, and Mombasa.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
            {[
              { value: "69,000", label: "Youth to be Reached" },
              { value: "7,000", label: "Digitally Trained" },
              { value: "2,000", label: "Job Opportunities" },
              { value: "5", label: "Innovations Incubated" },
            ].map((s, i) => (
              <div key={i} className="bg-primary/10 rounded-2xl p-5 border border-primary/20">
                <div className="text-2xl font-black text-primary mb-1">{s.value}</div>
                <p className="text-muted-foreground text-xs">{s.label}</p>
              </div>
            ))}
          </motion.div>

          {/* Key Programs */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-12">
            <div className="flex items-center gap-3 mb-5">
              <Lightbulb className="text-primary" size={28} />
              <h2 className="text-3xl font-black text-foreground">Key Programs</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              {[
                { title: "Youth Climate Innovation Challenge (YCIC)", desc: "A 3-stage innovation programme identifying, incubating, and funding the most promising youth-led climate solutions from informal settlements across 5 thematic areas." },
                { title: "YOMA Digital Platform", desc: "Connects youth to learning, earning, and impact opportunities through a unique digital identity with AI-powered job matching and career guidance tools." },
                { title: "Youth-Led YOMA Hub", desc: "A physical and virtual hybrid hub in Nairobi (with satellite presence in Kisumu and Mombasa) offering co-working spaces, mentorship, and training." },
                { title: "Digital Skills Pathways", desc: "Three structured pathways: Digital Skills (online freelancing, coding, BPO), Public Sector (government internships), and Climate Pathway (green jobs, eco-entrepreneurship)." },
              ].map((p, i) => (
                <div key={i} className="bg-card rounded-xl p-6 border border-border hover:shadow-lg transition-shadow">
                  <h3 className="font-bold text-foreground mb-2">{p.title}</h3>
                  <p className="text-muted-foreground text-sm">{p.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* YCIC Thematic Areas */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-12">
            <h2 className="text-3xl font-black text-foreground mb-5">YCIC Thematic Areas</h2>
            <div className="bg-primary/5 rounded-2xl p-8 border border-primary/20 space-y-3">
              {[
                "Flood Resilience and Urban Drainage",
                "Sustainable Waste Management and Circular Economy",
                "Water, Sanitation, and Hygiene (WASH) Solutions",
                "Renewable Energy and Sustainable Infrastructure",
                "Climate Education and Community Awareness",
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
                {["UNICEF", "STEM Impact Center Kenya", "Fablab Kisumu", "Tech Kidz Africa", "NETFUND", "KeNIA", "GIZ", "Rockefeller Foundation", "State Dept. for Youth Affairs"].map(p => (
                  <span key={p} className="px-3 py-1.5 bg-primary/10 text-primary text-sm font-semibold rounded-full">{p}</span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="text-center bg-primary/10 rounded-2xl p-10 border border-primary/20">
            <h3 className="text-2xl font-black text-foreground mb-3">Join the YOMA Ecosystem</h3>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">Register on the YOMA platform, partner with us, or submit your climate innovation through the YCIC challenge.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary text-white rounded-full px-8" asChild>
                <a href="/#contact">Get Involved</a>
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

export default YomaProject;
