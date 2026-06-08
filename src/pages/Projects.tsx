import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
    bg: "https://pmigmljjnyucethipdtk.supabase.co/storage/v1/object/public/afosi-projects/1776244075815-WE_LEAD_BG.jpg",
    type: "feature"
  },
  {
    id: "02",
    cat: "Digital",
    title: "Robotics & Creative Coding",
    desc: "In collaboration with STEM Impact Center Kenya, this program introduces youth in informal settlements to robotics, creative coding, and digital innovation — developing critical thinking and problem-solving skills that prepare young people for careers in the digital economy.",
    stats: [
      { val: "300+", lbl: "Youth" },
      { val: "12", lbl: "Months" }
    ],
    tags: ["STEM Education", "Hands-on Learning", "Innovation Skills"],
    link: "/programs/robotics-coding",
    bg: "https://afosi.org/PROJECT-IMAGES/robotics-coding-img.png",
    type: "split"
  },
  {
    id: "03",
    cat: "Education",
    title: "The M.A.T.H Project",
    desc: "The M.A.T.H Project (Mazingira, Afya, Tumaini, na Haki yetu) is a three-year initiative (2025–2028) implemented in 60 APBET schools in Kibera and Mukuru, supporting the review and implementation of Kenya's Education for Sustainable Development (ESD) Policy.",
    stats: [
      { val: "10,000+", lbl: "Youth" },
      { val: "2025–28", lbl: "Timeline" }
    ],
    tags: ["60 APBET schools", "ESD Policy advocacy", "Youth climate innovation"],
    link: "/programs/math-project",
    bg: "https://pmigmljjnyucethipdtk.supabase.co/storage/v1/object/public/afosi-projects/1776244146444-MATH_BG.jpg",
    type: "split",
    reverse: true,
    alt: true
  },
  {
    id: "04",
    cat: "Empowerment",
    title: "Sheria Ya Vijana",
    desc: "Sheria Ya Vijana empowers youth in Nairobi and Kwale by strengthening their skills, leadership, and participation in the green and digital economy through training, mentorship, digital tools, and policy engagement platforms.",
    stats: [
      { val: "5,875", lbl: "Youth" },
      { val: "Ongoing", lbl: "Status" }
    ],
    tags: ["Kiongozi AI platform", "Green & digital apprenticeships", "Youth-led enterprise grants"],
    link: "/programs/sheria-ya-vijana",
    bg: "https://pmigmljjnyucethipdtk.supabase.co/storage/v1/object/public/afosi-projects/1776244163145-SHERIA_BG.jpg",
    type: "split"
  },
  {
    id: "05",
    cat: "Digital",
    title: "YOMA — Youth Agency Marketplace",
    desc: "YOMA is a digital marketplace that opens up a world of opportunities to young people. Through a unique digital identity, young people navigate opportunities to learn, earn, and impact their communities. Being scaled to reach 69,000 youth across Nairobi, Kisumu, and Mombasa.",
    stats: [
      { val: "69,000", lbl: "Youth" },
      { val: "Ongoing", lbl: "Status" }
    ],
    tags: ["Youth Climate Innovation Challenge", "Digital skills pathways", "YOMA Hub in Nairobi"],
    link: "/programs/yoma",
    bg: "https://pmigmljjnyucethipdtk.supabase.co/storage/v1/object/public/afosi-projects/1776244186463-YOMA_BG.jpg",
    type: "split",
    reverse: true,
    alt: true
  },
  {
    id: "06",
    cat: "Digital",
    title: "Forest Explorer",
    desc: "Forest Explorer is a game-based learning platform that uses interactive gameplay mechanics to teach educational concepts through exploration, challenges, and immersive digital environments.",
    stats: [
      { val: "100+", lbl: "Youth" },
      { val: "Ongoing", lbl: "Status" }
    ],
    tags: ["Interactive gameplay mechanics", "Embedded learning objectives", "Engagement psychology"],
    link: "https://forest-explorer-pi.vercel.app/",
    bg: "https://pmigmljjnyucethipdtk.supabase.co/storage/v1/object/public/afosi-images/gallery/bcfaefa0-c598-4e67-ae04-ccb653c8dfe0.png",
    type: "split",
    external: true
  },
  {
    id: "07",
    cat: "Health",
    title: "Youth Voices Lab",
    desc: "Unheard to Influential is a 12-month initiative harnessing AI and digital advocacy to give voice to young women living with HIV and young women with disabilities in Mukuru, Nairobi — transforming them from passive recipients of policy into active architects of change.",
    stats: [
      { val: "150+", lbl: "Youth" },
      { val: "12", lbl: "Months" }
    ],
    tags: ["AI-driven storytelling tools", "Policy advocacy training", "15 intervention countries"],
    link: "/programs/youth-voices-lab",
    bg: "https://pmigmljjnyucethipdtk.supabase.co/storage/v1/object/public/afosi-projects/1776244201335-YOUTHVOICESLAB_BG.jpg",
    type: "split",
    reverse: true,
    alt: true
  },
  {
    id: "08",
    cat: "Digital",
    title: "AI-Powered Music-Based Learning",
    desc: "The AI-Powered Music-Based Learning platform converts curriculum content into short, high-energy music videos using AI for lyric generation, producing 20–60 second videos optimized for short-form platforms.",
    stats: [
      { val: "100+", lbl: "Youth" },
      { val: "Ongoing", lbl: "Status" }
    ],
    tags: ["AI lyric generation", "Short-form video", "Curriculum integration"],
    link: "#",
    bg: "https://pmigmljjnyucethipdtk.supabase.co/storage/v1/object/public/afosi-images/gallery/4a8211e1-5afe-4f56-a5ae-797efdfab615.png",
    type: "split",
    disabled: true
  }
];

const filters = ["all", "Empowerment", "Education", "Digital", "Environment", "Health"];

const Projects = () => {
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredProjects = projectsData.filter(
    (p) => activeFilter === "all" || p.cat === activeFilter
  );

  // Re-run observer when filter changes to catch newly revealed elements
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
      {/* PAGE HERO */}
      <header className="proj-hero">
        <div className="hero-eyebrow">Programs &amp; Initiatives</div>
        <h1 className="proj-hero-title">
          What We<br />
          <span>Build</span>
        </h1>
        <p className="proj-hero-sub">
          Eight transformative programs driving sustainable change across Kenya — from digital innovation to climate action.
        </p>
        <div className="hero-pills">
          <div className="hero-pill">
            <strong>8</strong> Active Programs
          </div>
          <div className="hero-pill">
            <strong>69,000+</strong> Youth Reached
          </div>
        </div>
      </header>

      {/* FILTER STRIP */}
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

      {/* PROJECTS LIST */}
      <div>
        {filteredProjects.map((p, index) => {
          const isFeature = p.type === "feature";
          const classes = isFeature
            ? "proj-feature reveal"
            : `proj-split ${p.reverse ? "reverse" : ""} ${p.alt ? "alt" : ""} reveal`;

          const Content = (
            <div className={isFeature ? "proj-feature-content" : "proj-split-content"}>
              <div className="proj-cat">{p.cat}</div>
              <h2 className="proj-title-lg">{p.title}</h2>
              <p className="proj-desc-text">{p.desc}</p>
              
              <div className="proj-stats-row">
                {p.stats.map((s, i) => (
                  <div className="proj-stat" key={i}>
                    <span className="proj-stat-val">{s.val}</span>
                    <span className="proj-stat-lbl">{s.lbl}</span>
                  </div>
                ))}
              </div>
              
              <div className="proj-tags">
                {p.tags.map((t, i) => (
                  <span className="proj-tag" key={i}>
                    {t}
                  </span>
                ))}
              </div>
              
              <a
                href={p.link}
                className="proj-link-btn"
                aria-disabled={p.disabled}
                target={p.external ? "_blank" : undefined}
                rel={p.external ? "noopener noreferrer" : undefined}
              >
                {p.disabled ? "Coming Soon" : "Explore Project"} <span className="arr"><ArrowRight size={18} /></span>
              </a>
            </div>
          );

          const Image = (
            <div
              className={isFeature ? "proj-feature-img" : "proj-split-img"}
              style={{ backgroundImage: `url('${p.bg}')` }}
              role="img"
              aria-label={p.title}
            ></div>
          );

          // We insert the impact strip right after project 04 (index visually based on ID, but array mapped so if filtered, might shift).
          // The HTML put it after 04. Let's just put it if p.id === '04'
          return (
            <div key={p.id} style={{ display: 'contents' }}>
              <article className={classes} data-category={p.cat}>
                {isFeature ? (
                  <>
                    {Content}
                    {Image}
                  </>
                ) : (
                  <>
                    {p.reverse ? (
                      <>
                        {Content}
                        {Image}
                      </>
                    ) : (
                      <>
                        {Image}
                        {Content}
                      </>
                    )}
                  </>
                )}
              </article>
              {p.id === "04" && (
                <div className="impact-strip" aria-label="Impact statistics">
                  <div>
                    <div className="impact-stat-val">69,000+</div>
                    <div className="impact-stat-lbl">Youth Reached</div>
                  </div>
                  <div>
                    <div className="impact-stat-val">8</div>
                    <div className="impact-stat-lbl">Active Programs</div>
                  </div>
                  <div>
                    <div className="impact-stat-val">60+</div>
                    <div className="impact-stat-lbl">Schools</div>
                  </div>
                  <div>
                    <div className="impact-stat-val">10</div>
                    <div className="impact-stat-lbl">Years of Impact</div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* CTA SECTION */}
      <section className="proj-cta reveal">
        <div>
          <h2 className="proj-cta-title">Want to Partner With Us?</h2>
          <p className="proj-cta-sub">
            Join us in creating sustainable change. Whether through funding, collaboration, or volunteering, your support makes a difference.
          </p>
        </div>
        <div className="proj-cta-btns">
          <a href="/#contact" className="btn-fill">
            Become a Partner
          </a>
          <a href="/opportunities" className="btn-ghost">
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
