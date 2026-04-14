import { motion } from "framer-motion";
import { ArrowLeft, Rocket, Target, Users, Lightbulb, CheckCircle2, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const SheriaYaVijana = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative h-[50vh] sm:h-[60vh] overflow-hidden">
        <img src="/afosi_pad3.jpg" alt="Sheria Ya Vijana" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/65" />
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-6 pb-12">
            <Link to="/projects" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 group">
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-semibold">Back to Projects</span>
            </Link>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center">
                <Rocket className="text-white" size={24} />
              </div>
              <Badge className="bg-blue-500/90 text-white border-0">Youth Empowerment</Badge>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-3 leading-tight">Sheria Ya Vijana</h1>
            <p className="text-lg text-white/90 max-w-3xl">Empower, Engage and Connect young people to lead Kenya's twin green and digital transition.</p>
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
              Sheria Ya Vijana empowers youth in Nairobi and Kwale by strengthening their skills, leadership, and participation in the green and digital economy. It builds youth capacities through training, mentorship, digital tools, and policy engagement platforms.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              The overall goal is to enable youth and youth-led organisations to influence policy, access opportunities, and drive sustainable socio-economic change.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="grid sm:grid-cols-3 gap-5 mb-12">
            {[
              { value: "5,875", label: "Young People Targeted (15–29)" },
              { value: "1.8M", label: "Indirect Beneficiaries in Nairobi & Kwale" },
              { value: "Nairobi & Kwale", label: "Target Counties" },
            ].map((s, i) => (
              <div key={i} className="bg-primary/10 rounded-2xl p-6 border border-primary/20">
                <div className="text-3xl font-black text-primary mb-2">{s.value}</div>
                <p className="text-muted-foreground text-sm">{s.label}</p>
              </div>
            ))}
          </motion.div>

          {/* Key Solutions */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-12">
            <div className="flex items-center gap-3 mb-5">
              <Lightbulb className="text-primary" size={28} />
              <h2 className="text-3xl font-black text-foreground">Key Solutions</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {[
                { title: "Kiongozi Digital Platform", desc: "An AI-powered platform co-created with youth to deliver personalised digital training, leadership modules, policy tools, fund tracking, and youth input on policy issues." },
                { title: "Green & Digital Apprenticeship Hubs", desc: "Hands-on mentorship, incubation, internship linkages, and AI-driven matching between youth and mentors targeting youth-led enterprises in green and digital sectors." },
                { title: "FSTP Youth-Led Enterprise Grants", desc: "Financial and technical support for youth-led organisations to scale innovative green and digital ventures." },
              ].map((s, i) => (
                <div key={i} className="bg-card rounded-xl p-6 border border-border hover:shadow-lg transition-shadow">
                  <h3 className="font-bold text-foreground mb-2">{s.title}</h3>
                  <p className="text-muted-foreground text-sm">{s.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* What We Do */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-12">
            <h2 className="text-3xl font-black text-foreground mb-5">What We Do</h2>
            <div className="bg-primary/5 rounded-2xl p-8 border border-primary/20 space-y-3">
              {[
                "Build youth skills in leadership, digital literacy, sustainability and green/digital entrepreneurship",
                "Provide mentorship, incubation and apprenticeships through digital and physical hubs",
                "Develop youth-led platforms such as Kiongozi for AI-powered training and policy engagement",
                "Establish and support youth forums, policy labs and national simulations for evidence-based advocacy",
                "Strengthen youth-led organisations through capacity building and Financial Support to Third Parties (FSTP)",
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
                {["Barnfonden", "WeWorld Kenya", "AFOSI", "Organisation of African Youth (OAY)", "Stretchers Youth Organisation (SYO)", "Kenya Climate Innovation Center (KCIC)", "WeWorld GVC"].map(p => (
                  <span key={p} className="px-3 py-1.5 bg-primary/10 text-primary text-sm font-semibold rounded-full">{p}</span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="text-center bg-primary/10 rounded-2xl p-10 border border-primary/20">
            <h3 className="text-2xl font-black text-foreground mb-3">Join the Movement</h3>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">Support youth-led empowerment across Kenya's green and digital transition.</p>
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

export default SheriaYaVijana;
