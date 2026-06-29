import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ProjectCard } from "@/components/ui/project-card";

const projectsData = [
  {
    id: "01",
    cat: "Empowerment",
    title: "We Lead Project",
    desc: "A bold initiative placing young women at the centre of change — building leadership, agency, and resilience among the most marginalised youth in Kenya.",
    stats: [
      { val: "500+", lbl: "Youth" },
      { val: "Ongoing", lbl: "Status" }
    ],
    tags: ["Young women with HIV", "Women with disabilities", "Displacement-affected youth"],
    link: "/programs/we-lead",
    bg: "/PROJECT-IMAGES/welead_img.jpg",
  },
  {
    id: "02",
    cat: "Digital",
    title: "Robotics & Creative Coding",
    desc: "In collaboration with STEM Impact Center Kenya, this program introduces youth in informal settlements to robotics, creative coding, and digital innovation — developing critical thinking and problem-solving skills.",
    stats: [
      { val: "300+", lbl: "Youth" },
      { val: "12", lbl: "Months" }
    ],
    tags: ["STEM Education", "Hands-on Learning", "Innovation Skills"],
    link: "/programs/robotics-coding",
    bg: "https://afosi.org/PROJECT-IMAGES/robotics-coding-img.png",
  },
  {
    id: "03",
    cat: "Education",
    title: "The M.A.T.H Project",
    desc: "Mazingira, Afya, Tumaini, na Haki yetu — a three-year initiative in 60 APBET schools in Kibera and Mukuru, supporting Kenya's Education for Sustainable Development (ESD) Policy.",
    stats: [
      { val: "10,000+", lbl: "Youth" },
      { val: "2025–28", lbl: "Timeline" }
    ],
    tags: ["60 APBET schools", "ESD Policy advocacy", "Youth climate innovation"],
    link: "/programs/math-project",
    bg: "/PROJECT-IMAGES/math-bg.jpg",
  },
  {
    id: "04",
    cat: "Empowerment",
    title: "Sheria Ya Vijana",
    desc: "Empowers youth in Nairobi and Kwale through skills, leadership, and participation in the green and digital economy via training, mentorship, digital tools, and policy engagement platforms.",
    stats: [
      { val: "5,875", lbl: "Youth" },
      { val: "Ongoing", lbl: "Status" }
    ],
    tags: ["Kiongozi AI platform", "Green & digital apprenticeships", "Youth-led enterprise grants"],
    link: "/programs/sheria-ya-vijana",
    bg: "/PROJECT-IMAGES/sheria-vijana.jpg",
  },
  {
    id: "05",
    cat: "Digital",
    title: "YOMA — Youth Agency Marketplace",
    desc: "A digital marketplace opening opportunities to young people through a unique digital identity — enabling them to learn, earn, and impact their communities. Scaling to 69,000 youth.",
    stats: [
      { val: "69,000", lbl: "Youth" },
      { val: "Ongoing", lbl: "Status" }
    ],
    tags: ["Youth Climate Innovation Challenge", "Digital skills pathways", "YOMA Hub in Nairobi"],
    link: "/programs/yoma",
    bg: "/PROJECT-IMAGES/yoma-bg.png",
  },
  {
    id: "06",
    cat: "Digital",
    title: "Forest Explorer",
    desc: "A game-based learning platform using interactive gameplay mechanics to teach educational concepts through exploration, challenges, and immersive digital environments.",
    stats: [
      { val: "100+", lbl: "Youth" },
      { val: "Ongoing", lbl: "Status" }
    ],
    tags: ["Interactive gameplay mechanics", "Embedded learning objectives", "Engagement psychology"],
    link: "https://forest-explorer-pi.vercel.app/",
    bg: "https://pmigmljjnyucethipdtk.supabase.co/storage/v1/object/public/afosi-images/gallery/bcfaefa0-c598-4e67-ae04-ccb653c8dfe0.png",
    external: true,
  },
  {
    id: "07",
    cat: "Health",
    title: "Youth Voices Lab",
    desc: "Unheard to Influential — a 12-month initiative harnessing AI and digital advocacy to give voice to young women living with HIV and young women with disabilities in Mukuru, Nairobi.",
    stats: [
      { val: "150+", lbl: "Youth" },
      { val: "12", lbl: "Months" }
    ],
    tags: ["AI-driven storytelling tools", "Policy advocacy training", "15 intervention countries"],
    link: "/programs/youth-voices-lab",
    bg: "https://pmigmljjnyucethipdtk.supabase.co/storage/v1/object/public/afosi-projects/1776244201335-YOUTHVOICESLAB_BG.jpg",
  },
  {
    id: "08",
    cat: "Digital",
    title: "AI-Powered Music-Based Learning",
    desc: "Converts curriculum content into short, high-energy music videos using AI for lyric generation, producing 20–60 second videos optimized for short-form platforms.",
    stats: [
      { val: "100+", lbl: "Youth" },
      { val: "Ongoing", lbl: "Status" }
    ],
    tags: ["AI lyric generation", "Short-form video", "Curriculum integration"],
    link: "#",
    bg: "https://pmigmljjnyucethipdtk.supabase.co/storage/v1/object/public/afosi-images/gallery/4a8211e1-5afe-4f56-a5ae-797efdfab615.png",
    disabled: true,
  }
];

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
      <main>

        {/* ── PAGE HERO ── */}
        <header className="proj-hero">
          <div className="hero-eyebrow">Programs &amp; Initiatives</div>
          <h1 className="proj-hero-title">
            What We<br />
            <span>Build</span>
          </h1>
          <p className="proj-hero-sub">
            Eight transformative programs driving sustainable change across Kenya —
            from digital innovation to climate action.
          </p>
          <div className="hero-pills">
            <div className="hero-pill"><strong>8</strong> Active Programs</div>
            <div className="hero-pill"><strong>69,000+</strong> Youth Reached</div>
          </div>
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
                stats={p.stats}
                tags={p.tags}
                link={p.link}
                external={p.external}
                disabled={p.disabled}
                featured={p.featured}
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
