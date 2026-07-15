import { useEffect } from "react";
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
    categoryColor: "#5fd67e",
    summary: "A national digital platform for Kenya's youth climate movement, connecting ambition to systems change under AFOSI, Action for Sustainability Initiative.",
    btnColor: "#5fd67e",
    btnText: "#0b1109",
    cardBg: "radial-gradient(120% 140% at 82% 15%, #1c3327 0%, #10160f 55%, #0b0f0a 100%)",
    screenshotImg: "/kych-img.png",
    lightCard: false,
  },
  {
    id: "02",
    name: "Afosi Hub",
    acronym: "AFOSIHUB",
    url: "https://afosihub.com/",
    displayUrl: "afosihub.com",
    category: "Digital Innovation",
    categoryColor: "#1e7a3d",
    summary: "A digital innovation sandbox designed to transition local youth from theoretical knowledge into building real-world software, AI, and civic technology solutions. It bridges community-driven social impact and agile tech startup acceleration.",
    btnColor: "#1e7a3d",
    btnText: "#fff",
    cardBg: "radial-gradient(120% 140% at 82% 15%, #f5f0e8 0%, #ede8e0 55%, #e4ddd4 100%)",
    screenshotImg: "/afosihub-img.png",
    lightCard: true,
  },
  {
    id: "03",
    name: "Kiongozi ya Vijana",
    acronym: "KIONGOZI",
    url: "https://kiongozi.org/",
    displayUrl: "kiongozi.org",
    category: "Youth Empowerment",
    categoryColor: "#f97316",
    summary: "Sheria ya Vijana equips young Kenyans aged 15–35 with skills, digital tools, and civic knowledge to lead Kenya's green and digital transition. The Kiongozi ya Vijana platform connects youth to learning, opportunities, and community-driven data.",
    btnColor: "#f97316",
    btnText: "#fff",
    cardBg: "radial-gradient(120% 140% at 82% 15%, #1a0c00 0%, #0f0700 55%, #080400 100%)",
    screenshotImg: "/kiongozi_bg.png",
    lightCard: false,
  },
];

const BrowserMockup = ({
  imgSrc,
  alt,
  accentColor,
}: {
  imgSrc: string;
  alt: string;
  accentColor: string;
}) => (
  <div className="plat-browser-wrap">
    <div className="plat-browser" style={{ borderColor: `${accentColor}33` }}>
      <div className="plat-browser-bar">
        <span className="plat-dot" style={{ background: "#ff5f57" }} />
        <span className="plat-dot" style={{ background: "#febc2e" }} />
        <span className="plat-dot" style={{ background: "#28c840" }} />
      </div>
      <div className="plat-browser-screen">
        <img src={imgSrc} alt={alt} className="plat-screenshot" />
      </div>
    </div>
  </div>
);

const DeliveryPlatforms = () => {
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
            AFOSI operates a suite of purpose-built digital platforms, each designed
            to connect youth to learning, opportunity, and lasting impact across Kenya.
          </p>
          <div className="hero-pills">
            <div className="hero-pill"><strong>3</strong> Active Platforms</div>
            <div className="hero-pill"><strong>69,000+</strong> Youth Served</div>
          </div>
        </header>

        {/* ── PLATFORM CARDS ── */}
        <section className="platforms-section">
          <div className="platforms-list">
            {platforms.map((p) => (
              <div
                key={p.id}
                className="plat-card reveal"
                style={{ background: p.cardBg }}
              >
                {/* Copy side */}
                <div className="plat-copy">
                  <span className="plat-category" style={{ color: p.categoryColor }}>
                    {p.category}
                  </span>
                  <h2
                    className="plat-name"
                    style={{ color: p.lightCard ? "#111" : "#f4f0e6" }}
                  >
                    {p.name}
                  </h2>
                  <span
                    className="plat-acronym-badge"
                    style={
                      p.lightCard
                        ? { color: "#444", borderColor: "rgba(0,0,0,.2)" }
                        : {}
                    }
                  >
                    {p.acronym}
                  </span>
                  <p
                    className="plat-summary"
                    style={{
                      color: p.lightCard
                        ? "rgba(20,20,20,.72)"
                        : "rgba(232,236,225,.72)",
                    }}
                  >
                    {p.summary}
                  </p>
                  <div className="plat-actions">
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="plat-visit-btn"
                      style={{ background: p.btnColor, color: p.btnText }}
                    >
                      Visit Platform ↗
                    </a>
                    <span
                      className="plat-url"
                      style={{
                        color: p.lightCard
                          ? "rgba(20,20,20,.45)"
                          : "rgba(232,236,225,.5)",
                      }}
                    >
                      {p.displayUrl}
                    </span>
                  </div>
                </div>

                {/* Screenshot side */}
                <div className="plat-shot-wrap">
                  <BrowserMockup
                    imgSrc={p.screenshotImg}
                    alt={`${p.name} screenshot`}
                    accentColor={p.categoryColor}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
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
