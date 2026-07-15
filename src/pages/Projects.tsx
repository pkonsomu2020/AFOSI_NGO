import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ProjectCard } from "@/components/ui/project-card";
import { projectsData } from "@/data/projectsData";


const filters = ["all", "Empowerment", "Education", "Digital", "Environment", "Health"];

const impactStats: { val: string; lbl: string }[] = [];

const Projects = () => {
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredProjects = projectsData.filter(
    (p) => activeFilter === "all" || p.cat === activeFilter
  );

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("on");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08 }
    );
    document.querySelectorAll(".reveal").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [filteredProjects]);

  return (
    <>
      <Navbar />
      <main className="font-montserrat">

        {/* ── PAGE HERO ── */}
        <header className="proj-hero">
          <div className="hero-eyebrow">Programs &amp; Initiatives</div>
          <h1 className="proj-hero-title">
            What We<br />
            <span>Build</span>
          </h1>
          <p className="proj-hero-sub">
            Eight transformative programs driving sustainable change across Kenya,
            from digital innovation to climate action.
          </p>
        </header>

        {/* ── FILTER STRIP ── */}
        <div id="filter-strip" role="navigation" aria-label="Filter projects">
          {filters.map((f) => (
            <button
              key={f}
              className={`filter-pill ${activeFilter === f ? "active" : ""}`}
              onClick={() => setActiveFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        {/* ── PROJECT CARDS GRID ── */}
        <section className="projects-grid-section">
          <div className="projects-card-grid">
            {filteredProjects.map((p) => (
              <ProjectCard
                key={p.id}
                imgSrc={p.bg}
                category={p.cat}
                title={p.title}
                description={p.desc}
                tags={p.tags}
                link={p.link}
                external={p.external}
                disabled={p.disabled}
                className="reveal"
              />
            ))}
          </div>


        </section>

        {/* ── CTA SECTION ── */}
        <section className="proj-cta reveal">
          <div>
            <h2 className="proj-cta-title">Want to Partner With Us?</h2>
            <p className="proj-cta-sub">
              Join us in creating sustainable change. Whether through funding,
              collaboration, or volunteering, your support makes a difference.
            </p>
          </div>
          <div className="proj-cta-btns">
            <a href="/#contact" className="btn-fill">Become a Partner</a>
            <a href="/opportunities" className="btn-ghost" style={{ color: "var(--fg)", borderColor: "var(--border-af)" }}>
              View Opportunities
            </a>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
};

export default Projects;
