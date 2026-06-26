import { useEffect } from "react";
import { Globe, ArrowUpRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const platforms = [
  {
    id: "01",
    name: "Kenya Youth Climate Hub",
    acronym: "KYCH",
    url: "https://www.kenyayouthclimatehub.org/",
    displayUrl: "kenyayouthclimatehub.org",
    category: "Climate & Environment",
    summary:
      "KYCH serves as a national digital platform for Kenya's youth climate movement, connecting ambition to systems change. It operates under AFOSI — Action for Sustainability Initiative, blending over a decade of evidence-based development with youth-first design.",
    tags: ["Climate Action", "Youth Movement", "Systems Change", "National Platform"],
    color: "#2D7D46",
    bg: "kych.png",
  },
  {
    id: "02",
    name: "Afosi Hub",
    acronym: "AFOSIHUB",
    url: "https://afosihub.com/",
    displayUrl: "afosihub.com",
    category: "Digital Innovation",
    summary:
      "Afosihub is a digital innovation sandbox, designed to transition local youth from theoretical knowledge into building real-world software, AI, and civic technology solutions. It bridges the gap between community-driven social impact and agile tech startup acceleration by hosting digital management networks.",
    tags: ["Digital Innovation", "AI & Tech", "Civic Technology", "Startup Acceleration"],
    color: "#E05A18",
    bg: "afosihub.jpg",
  },
  {
    id: "03",
    name: "Kiongozi Platform",
    acronym: "KIONGOZI",
    url: "https://kiongozi.org/",
    displayUrl: "kiongozi.org",
    category: "Youth Empowerment",
    summary:
      "Sheria ya Vijana (SYV) is a youth empowerment initiative that equips young Kenyans aged 15–35 with the skills, digital tools, and civic knowledge to lead Kenya's green and digital transition. Through the Kiongozi ya Vijana platform, we connect youth to learning, opportunities, and community-driven data.",
    tags: ["Youth Empowerment", "Green Economy", "Digital Skills", "Civic Knowledge"],
    color: "#1A6FA8",
    bg: "kiongozi.jpeg",
  },
];

const DeliveryPlatforms = () => {
  // Scroll-reveal observer
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
      { threshold: 0.06 }
    );
    document.querySelectorAll(".reveal").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <Navbar />
      <main className="font-montserrat">

        {/* ── HERO ── */}
        <header className="platforms-hero">
          <div className="hero-eyebrow">Digital Ecosystem</div>
          <h1 className="platforms-hero-title">
            Delivery<br />
            <span>Platforms</span>
          </h1>
          <p className="platforms-hero-sub">
            AFOSI operates a suite of purpose-built digital platforms — each designed
            to connect youth to learning, opportunity, and lasting impact across Kenya.
          </p>
          <div className="hero-pills">
            <div className="hero-pill"><strong>3</strong> Active Platforms</div>
            <div className="hero-pill"><strong>69,000+</strong> Youth Served</div>
          </div>
        </header>

        {/* ── PLATFORMS LIST ── */}
        <section className="platforms-section">
          <div className="platforms-list">
            {platforms.map((p, i) => (
              <article key={p.id} className="platform-card reveal">

                {/* Image panel */}
                <div
                  className="platform-card-img"
                  style={{ backgroundImage: `url('${p.bg}')` }}
                  aria-hidden="true"
                />

                {/* Content panel */}
                <div className="platform-card-content">
                  <div className="platform-card-top">
                    <span className="platform-cat" style={{ color: p.color }}>
                      {p.category}
                    </span>
                    <div className="platform-title-row">
                      <h2 className="platform-name">{p.name}</h2>
                      <span className="platform-acronym">{p.acronym}</span>
                    </div>
                    <p className="platform-summary">{p.summary}</p>
                  </div>

                  {/* Tags */}
                  <div className="platform-tags">
                    {p.tags.map((t) => (
                      <span key={t} className="platform-tag">{t}</span>
                    ))}
                  </div>

                  {/* CTA row */}
                  <div className="platform-cta-row">
                    <div className="platform-url-display">
                      <Globe size={14} />
                      <span>{p.displayUrl}</span>
                    </div>
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="platform-visit-btn"
                      style={{ background: p.color }}
                    >
                      Visit Platform
                      <ArrowUpRight size={16} />
                    </a>
                  </div>
                </div>

              </article>
            ))}
          </div>
        </section>

        {/* ── CTA BANNER ── */}
        <section className="proj-cta reveal">
          <div>
            <h2 className="proj-cta-title">Build With Us</h2>
            <p className="proj-cta-sub">
              Interested in partnering on a platform or contributing to our digital
              ecosystem? We'd love to hear from you.
            </p>
          </div>
          <div className="proj-cta-btns">
            <a href="/#contact" className="btn-fill">Get in Touch</a>
            <a
              href="/opportunities"
              className="btn-ghost"
              style={{ color: "var(--fg)", borderColor: "var(--border-af)" }}
            >
              View Opportunities
            </a>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
};

export default DeliveryPlatforms;
