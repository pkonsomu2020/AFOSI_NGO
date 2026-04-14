import { motion } from "framer-motion";
import { ArrowLeft, Mic, Target, Users, Lightbulb, CheckCircle2, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const YouthVoicesLab = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative h-[50vh] sm:h-[60vh] overflow-hidden">
        <img src="/afosi_pad.jpg" alt="Youth Voices Lab" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/65" />
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-6 pb-12">
            <Link to="/projects" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 group">
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-semibold">Back to Projects</span>
            </Link>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-rose-500 flex items-center justify-center">
                <Mic className="text-white" size={24} />
              </div>
              <Badge className="bg-rose-500/90 text-white border-0">AI & Digital Advocacy</Badge>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-3 leading-tight">Youth Voices Lab</h1>
            <p className="text-lg text-white/90 max-w-3xl">Unheard to Influential — harnessing AI and digital advocacy to give voice to Kenya's most systematically excluded young people.</p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container mx-auto px-6 max-w-5xl">

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
            <div className="flex items-center gap-3 mb-5">
              <Target className="text-primary" size={28} />
              <h2 className="text-3xl font-black text-foreground">About the Project</h2>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              Unheard to Influential is a 12-month initiative by AFOSI that harnesses Artificial Intelligence and digital advocacy to give voice to some of Kenya's most systematically excluded young people — young women living with HIV and young women with disabilities — residing in Mukuru, one of Nairobi's largest informal settlements.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              The project bridges a critical gap: marginalized youth possess powerful first-hand knowledge of the policy failures that shape their lives, yet traditional advocacy channels have consistently shut them out. By equipping these young people with AI-driven storytelling tools, data analytics, and structured policy engagement pathways, the project transforms them from passive recipients of policy into active architects of change.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="grid sm:grid-cols-3 gap-5 mb-12">
            {[
              { value: "150", label: "Direct Rights-Holders Empowered" },
              { value: "500+", label: "Community Members Reached" },
              { value: "15", label: "Intervention Countries" },
            ].map((s, i) => (
              <div key={i} className="bg-primary/10 rounded-2xl p-6 border border-primary/20">
                <div className="text-3xl font-black text-primary mb-2">{s.value}</div>
                <p className="text-muted-foreground text-sm">{s.label}</p>
              </div>
            ))}
          </motion.div>

          {/* What We Do */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-12">
            <div className="flex items-center gap-3 mb-5">
              <Lightbulb className="text-primary" size={28} />
              <h2 className="text-3xl font-black text-foreground">What We Do</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              {[
                { title: "AI-Driven Data Collection", desc: "Deploy AI-driven data collection tools and digital storytelling platforms that enable marginalized youth to document their experiences and generate real-time evidence of discrimination and service gaps." },
                { title: "Advocacy Training", desc: "Train 150 young PLHIV and PWD advocates in AI-powered policy engagement, digital literacy, leadership, and strategic communication." },
                { title: "Policy Dialogues", desc: "Facilitate direct, structured dialogues between empowered youth advocates and policymakers at national, regional, and continental levels." },
                { title: "Policy Briefs", desc: "Produce and submit policy briefs and concrete reform recommendations to health, SRHR, and inclusion-focused government bodies and advocacy networks." },
              ].map((p, i) => (
                <div key={i} className="bg-card rounded-xl p-6 border border-border hover:shadow-lg transition-shadow">
                  <h3 className="font-bold text-foreground mb-2">{p.title}</h3>
                  <p className="text-muted-foreground text-sm">{p.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Who It Serves */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-12">
            <h2 className="text-3xl font-black text-foreground mb-5">Who It Serves</h2>
            <div className="bg-primary/5 rounded-2xl p-8 border border-primary/20 space-y-3">
              {[
                "Young women aged 18–35 living with HIV in Mukuru, Nairobi",
                "Young women with disabilities residing in Mukuru, Nairobi",
                "500+ community members through public forums, radio programming, and awareness campaigns",
                "Policymakers at local, national, and continental levels",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-primary shrink-0 mt-0.5" />
                  <p className="text-muted-foreground">{item}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Countries */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mb-12">
            <div className="flex items-center gap-3 mb-5">
              <Globe className="text-primary" size={28} />
              <h2 className="text-3xl font-black text-foreground">Intervention Countries</h2>
            </div>
            <div className="bg-card rounded-2xl p-6 border border-border">
              <div className="flex flex-wrap gap-3">
                {["Kenya", "Tanzania", "Uganda", "Burundi", "Southern Sudan", "Nigeria", "Ghana", "Burkina Faso", "Sierra Leone", "Senegal", "Cameroon", "Tunisia", "Zimbabwe", "Zambia", "Belgium"].map(c => (
                  <span key={c} className="px-3 py-1.5 bg-primary/10 text-primary text-sm font-semibold rounded-full">{c}</span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="text-center bg-primary/10 rounded-2xl p-10 border border-primary/20">
            <h3 className="text-2xl font-black text-foreground mb-3">Amplify Marginalized Voices</h3>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">Support AI-powered advocacy that transforms excluded youth into architects of policy change.</p>
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

export default YouthVoicesLab;
