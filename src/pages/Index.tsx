import { useEffect, useState, useRef } from "react";
import { ArrowRight, HeartPulse, Leaf, Briefcase, BookOpen, HandHeart, Landmark, MapPin, Phone, Mail, Globe } from "lucide-react";
import TextReveal from "@/components/animations/TextReveal";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Helper function for counters
function countUp(el: Element, target: number, suffix: string, dur = 1400) {
  const big = target >= 1000;
  let start: number | null = null;
  function step(ts: number) {
    if (!start) start = ts;
    const p = Math.min((ts - start) / dur, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    const val = Math.floor(ease * target);
    el.textContent = big ? (val / 1000).toFixed(0) + "K" + suffix : val + suffix;
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = big ? (target / 1000) + "K" + suffix : target + suffix;
  }
  requestAnimationFrame(step);
}

const Index = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadPct, setLoadPct] = useState(0);

  const heroSlides = [
    "https://afosi.org/afosi_pad2.jpg",
    "https://afosi.org/afosi_pad1.jpg",
    "https://pmigmljjnyucethipdtk.supabase.co/storage/v1/object/public/afosi-projects/1776244075815-WE_LEAD_BG.jpg"
  ];

  // Loader Effect
  useEffect(() => {
    let p = 0;
    const iv = setInterval(() => {
      p += Math.random() * 18 + 4;
      if (p >= 100) {
        p = 100;
        clearInterval(iv);
        setTimeout(() => {
          setLoading(false);
          setTimeout(() => {
            document.getElementById("heroTitle")?.classList.add("fired");
            setTimeout(() => document.getElementById("heroRow")?.classList.add("fired"), 700);
          }, 300);
        }, 300);
      }
      setLoadPct(Math.floor(p));
    }, 60);
    return () => clearInterval(iv);
  }, []);

  // Hero Slider Effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  // Global Observers & Cursor
  useEffect(() => {
    // Scroll Reveal
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("on");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll(".reveal, .reveal-l, .reveal-r").forEach((el) => obs.observe(el));

    // Counters
    const cntObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.querySelectorAll(".stat-num[data-target], .count[data-target]").forEach((el) => {
            const t = parseInt((el as HTMLElement).dataset.target || "0");
            const s = (el as HTMLElement).dataset.suffix || "";
            countUp(el, t, s);
          });
          cntObs.unobserve(e.target);
        });
      },
      { threshold: 0.3 }
    );
    document.querySelectorAll(".about-stats, #numbers").forEach((el) => cntObs.observe(el));

    return () => {
      obs.disconnect();
      cntObs.disconnect();
    };
  }, [loading]);

  return (
    <>
      {loading && (
        <div id="loader">
          <div className="loader-logo">
            AF<span>O</span>SI
          </div>
          <div className="loader-bar-wrap">
            <div className="loader-bar" style={{ width: `${loadPct}%` }}></div>
          </div>
          <div className="loader-pct">{loadPct}%</div>
        </div>
      )}

      <Navbar />

      <main>
        {/* HERO */}
        <section id="hero">
          <div className="hero-bg-slider">
            {heroSlides.map((src, index) => (
              <div
                key={index}
                className={`hero-slide ${index === currentSlide ? "active" : ""}`}
                style={{ backgroundImage: `url('${src}')` }}
              ></div>
            ))}
          </div>
          <div className="hero-grad"></div>
          <div className="hero-grain"></div>

          <div className="hero-content">
            <div className="split-title" id="heroTitle">
              <TextReveal text="Empowering Youth" className="text-white" delay={0.2} />
              <TextReveal text="through Innovation" className="text-orange-500" delay={0.4} />
            </div>
            <div className="hero-row" id="heroRow">
              <p className="hero-sub">
                Empowering youth through Health, Education, Environment, Leadership, and Livelihoods — powered by innovative technology and digital solutions across Kenya.
              </p>
              <div className="hero-actions">
                <a href="#pillars" className="btn-fill">
                  Explore Solutions
                </a>
                <a href="#about" className="btn-ghost">
                  Who We Are{" "}
                  <span className="arr">
                    <ArrowRight size={16} />
                  </span>
                </a>
              </div>
            </div>
          </div>

          <div className="hero-scroll-ind">
            <div className="scroll-line"></div>
            <span>Scroll</span>
          </div>
        </section>

        {/* TICKER */}
        <div className="ticker">
          <div className="ticker-track">
            {/* Repeated for infinite scroll */}
            {[...Array(2)].map((_, i) => (
              <div key={i} style={{ display: "contents" }}>
                <div className="ticker-item">We Lead Project</div>
                <div className="ticker-item">Sheria Ya Vijana</div>
                <div className="ticker-item">M.A.T.H Project</div>
                <div className="ticker-item">YOMA Marketplace</div>
                <div className="ticker-item">Youth Voices Lab</div>
                <div className="ticker-item">Robotics &amp; Coding</div>
                <div className="ticker-item">Forest Explorer</div>
                <div className="ticker-item">Kiongozi Platform</div>
              </div>
            ))}
          </div>
        </div>

        {/* ABOUT (sticky scroll) */}
        <section id="about">
          <div className="about-sticky">
            <img src="https://afosi.org/afosi_pad1.jpg" alt="AFOSI community work" />
            <div className="about-img-overlay"></div>
            <div className="about-badge">
              <strong>12+</strong>
              <small>
                Years of<br />
                Impact
              </small>
            </div>
          </div>
          <div className="about-scroll">
            <div className="reveal">
              <div className="s-label">Who We Are</div>
              <h2 className="about-title">
                <TextReveal text="Building" className="word-black block" />
                <TextReveal text="Resilient" className="word-orange block" delay={0.1} />
                <TextReveal text="Communities" className="word-black block" delay={0.2} />
              </h2>
            </div>
            <p className="about-body reveal" style={{ transitionDelay: ".1s" }}>
              Action For Sustainability Initiative (AFOSI) is a lean, technology-backed local NGO addressing challenges across health, education, livelihoods, leadership and governance, climate justice and humanitarian support.
            </p>
            <p className="about-body reveal" style={{ transitionDelay: ".18s" }}>
              Our flagship initiatives — Sheria ya Vijana, M.A.T.H, Youth Voices Lab, and YOMA Projects — are implemented through our digital tools, including the Kiongozi Platform, Kenya Youth Climate Hub (KYCH), and Flare Hub startup management platform.
            </p>
            <p className="about-body reveal" style={{ transitionDelay: ".22s" }}>
              We adopt a hybrid implementation model combining the community reach and trust of a grassroots NGO with the innovation and agility of social enterprises, creating sustainable impact across Kenya.
            </p>
            <div className="reveal" style={{ transitionDelay: ".28s" }}>
              <a href="#pillars" className="btn-fill">
                Our Pillars
              </a>
            </div>
            <div className="about-stats reveal" style={{ transitionDelay: ".36s" }}>
              <div>
                <div className="stat-num" data-target="69" data-suffix="K+">0</div>
                <div className="stat-lbl">Youth Reached</div>
              </div>
              <div>
                <div className="stat-num" data-target="8" data-suffix="+">0</div>
                <div className="stat-lbl">Counties Active</div>
              </div>
              <div>
                <div className="stat-num" data-target="12" data-suffix="+">0</div>
                <div className="stat-lbl">Years of Impact</div>
              </div>
            </div>
          </div>
        </section>

        {/* PILLARS */}
        <section id="pillars">
          <div className="pillars-header">
            <div className="reveal-l">
              <div className="s-label">What We Do</div>
              <h2 className="pillars-ttl">
                <TextReveal text="Our" className="word-black block" />
                <TextReveal text="Pillars" className="word-orange block" delay={0.1} />
              </h2>
            </div>
            <p className="pillars-body reveal-r">
              Six interconnected areas of focus, each addressing a critical dimension of youth well-being and community resilience across Kenya.
            </p>
          </div>

          <div className="pillars-track-wrap reveal">
            <div className="pillars-track" id="pillarsTrack">
              {/* Duplicate set for seamless loop */}
              {[...Array(2)].map((_, i) => (
                <div key={i} style={{ display: "contents" }}>
                  <div className="pillar-card">
                    <div className="p-num">01</div>
                    <div className="p-icon"><HeartPulse size={24} strokeWidth={1.5} /></div>
                    <div className="p-name">Health &amp; SRHR</div>
                    <p className="p-desc">Advancing Sexual and Reproductive Health and Rights for young women living with HIV and those with disabilities.</p>
                    <div className="p-arrow"><ArrowRight size={16} /></div>
                  </div>
                  <div className="pillar-card">
                    <div className="p-num">02</div>
                    <div className="p-icon"><Leaf size={24} strokeWidth={1.5} /></div>
                    <div className="p-name">Environment</div>
                    <p className="p-desc">Climate justice, eco-enterprise and green skills training equipping communities to adapt and advocate.</p>
                    <div className="p-arrow"><ArrowRight size={16} /></div>
                  </div>
                  <div className="pillar-card">
                    <div className="p-num">03</div>
                    <div className="p-icon"><Briefcase size={24} strokeWidth={1.5} /></div>
                    <div className="p-name">Livelihoods</div>
                    <p className="p-desc">Economic empowerment programs building sustainable income streams and entrepreneurship capacity among youth.</p>
                    <div className="p-arrow"><ArrowRight size={16} /></div>
                  </div>
                  <div className="pillar-card">
                    <div className="p-num">04</div>
                    <div className="p-icon"><BookOpen size={24} strokeWidth={1.5} /></div>
                    <div className="p-name">Education</div>
                    <p className="p-desc">Pathways to quality education, digital literacy and skills training for marginalized youth communities.</p>
                    <div className="p-arrow"><ArrowRight size={16} /></div>
                  </div>
                  <div className="pillar-card">
                    <div className="p-num">05</div>
                    <div className="p-icon"><HandHeart size={24} strokeWidth={1.5} /></div>
                    <div className="p-name">Humanitarian</div>
                    <p className="p-desc">Emergency response and community aid delivering direct relief to the most vulnerable populations.</p>
                    <div className="p-arrow"><ArrowRight size={16} /></div>
                  </div>
                  <div className="pillar-card">
                    <div className="p-num">06</div>
                    <div className="p-icon"><Landmark size={24} strokeWidth={1.5} /></div>
                    <div className="p-name">Governance</div>
                    <p className="p-desc">Championing youth leadership in governance, policy and civic engagement at every level.</p>
                    <div className="p-arrow"><ArrowRight size={16} /></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* IMPACT NUMBERS */}
        <section id="numbers">
          <div className="num-grid">
            <div className="num-card reveal" style={{ transitionDelay: ".05s" }}>
              <div className="num-val"><span className="count" data-target="69">0</span><span className="num-suffix">K+</span></div>
              <div className="num-lbl">Youth Reached</div>
              <div className="num-sub">Across Nairobi, Kisumu & Mombasa</div>
            </div>
            <div className="num-card reveal" style={{ transitionDelay: ".12s" }}>
              <div className="num-val"><span className="count" data-target="60">0</span><span className="num-suffix">+</span></div>
              <div className="num-lbl">Schools Supported</div>
              <div className="num-sub">APBET schools in Kibera & Mukuru</div>
            </div>
            <div className="num-card reveal" style={{ transitionDelay: ".19s" }}>
              <div className="num-val"><span className="count" data-target="12">0</span><span className="num-suffix">+</span></div>
              <div className="num-lbl">Years of Impact</div>
              <div className="num-sub">Established in Nairobi, Kenya</div>
            </div>
            <div className="num-card reveal" style={{ transitionDelay: ".26s" }}>
              <div className="num-val"><span className="count" data-target="15">0</span><span className="num-suffix">+</span></div>
              <div className="num-lbl">Countries Reached</div>
              <div className="num-sub">Through Youth Voices Lab advocacy</div>
            </div>
          </div>
        </section>

        {/* PROJECTS */}
        <section id="projects">
          <div className="proj-top reveal">
            <div>
              <div className="s-label">Featured Work</div>
              <h2 className="proj-ttl">
                <TextReveal text="Our" className="word-black block" />
                <TextReveal text="Projects" className="word-orange block" delay={0.1} />
              </h2>
            </div>
            <a href="/projects" className="link-arr">
              View All <span className="arr"><ArrowRight size={16} /></span>
            </a>
          </div>

          <div className="proj-grid">
            <div className="proj-card reveal">
              <div className="proj-img" style={{ backgroundImage: "url('https://pmigmljjnyucethipdtk.supabase.co/storage/v1/object/public/afosi-projects/1776244075815-WE_LEAD_BG.jpg')" }}></div>
              <div className="proj-content">
                <h3 className="proj-title">We Lead Project</h3>
                <p className="proj-desc">Strengthening the influence of young women whose sexual and reproductive health and rights are neglected — targeting those living with HIV, facing disability, vulnerability, or displacement.</p>
                <div className="proj-footer">
                  <div className="proj-tags-inline">
                    <span className="proj-tag-inline">SRHR</span>
                    <span className="proj-tag-inline">500+ Youth</span>
                  </div>
                  <a href="/programs/we-lead" className="proj-link"><ArrowRight size={16} /></a>
                </div>
              </div>
            </div>

            <div className="proj-card reveal" style={{ transitionDelay: ".08s" }}>
              <div className="proj-img" style={{ backgroundImage: "url('https://pmigmljjnyucethipdtk.supabase.co/storage/v1/object/public/afosi-projects/1776244163145-SHERIA_BG.jpg')" }}></div>
              <div className="proj-content">
                <h3 className="proj-title">Sheria Ya Vijana</h3>
                <p className="proj-desc">Empowering youth in Nairobi and Kwale through skills, leadership, and participation in the green and digital economy via training, mentorship, digital tools, and policy engagement.</p>
                <div className="proj-footer">
                  <div className="proj-tags-inline">
                    <span className="proj-tag-inline">Governance</span>
                    <span className="proj-tag-inline">5,875 Youth</span>
                  </div>
                  <a href="/programs/sheria-ya-vijana" className="proj-link"><ArrowRight size={16} /></a>
                </div>
              </div>
            </div>

            <div className="proj-card reveal" style={{ transitionDelay: ".16s" }}>
              <div className="proj-img" style={{ backgroundImage: "url('https://pmigmljjnyucethipdtk.supabase.co/storage/v1/object/public/afosi-projects/1776244146444-MATH_BG.jpg')" }}></div>
              <div className="proj-content">
                <h3 className="proj-title">The M.A.T.H Project</h3>
                <p className="proj-desc">A three-year initiative in 60 APBET schools in Kibera and Mukuru, supporting Kenya's Education for Sustainable Development (ESD) Policy through climate innovation and youth advocacy.</p>
                <div className="proj-footer">
                  <div className="proj-tags-inline">
                    <span className="proj-tag-inline">Climate</span>
                    <span className="proj-tag-inline">10,000+ Youth</span>
                  </div>
                  <a href="/programs/math-project" className="proj-link"><ArrowRight size={16} /></a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA MARQUEE */}
        <div id="cta-marquee">
          <div className="cta-track" id="ctaTrack">
            <span className="cta-item filled">GET INVOLVED</span>
            <span className="cta-item">PARTNER WITH US</span>
            <span className="cta-item filled">DONATE NOW</span>
            <span className="cta-item">VOLUNTEER</span>
            <span className="cta-item filled">GET INVOLVED</span>
            <span className="cta-item">PARTNER WITH US</span>
            <span className="cta-item filled">DONATE NOW</span>
            <span className="cta-item">VOLUNTEER</span>
          </div>
        </div>

        {/* VISION / MISSION */}
        <section id="vm">
          <div className="vm-panel">
            <div className="vm-label-top">Vision</div>
            <div className="vm-title reveal">A Sustainable World!</div>
            <p className="vm-body reveal" style={{ transitionDelay: ".1s" }}>
              We envision a world where every young person — regardless of gender, ability or background — can harness their full potential to build sustainable, thriving communities.
            </p>
          </div>
          <div className="vm-panel">
            <div className="vm-label-top">Mission</div>
            <div className="vm-title reveal">Harnessing &amp; Protecting Human Potential</div>
            <p className="vm-body reveal" style={{ transitionDelay: ".1s" }}>
              To promote actions that are geared towards harnessing and protecting the full potential of youth and women through innovation, technology and community-led solutions.
            </p>
          </div>
        </section>

        {/* PARTNERS */}
        <section id="partners">
          <p className="p-label reveal">Trusted Partners &amp; Supporters</p>
          <div className="p-row reveal" style={{ transitionDelay: ".1s" }}>
            <div className="p-name">UNFPA</div>
            <div className="p-name">USAID</div>
            <div className="p-name">STEM Impact Center</div>
            <div className="p-name">UN Women</div>
            <div className="p-name">YOMA</div>
            <div className="p-name">AMREF</div>
            <div className="p-name">GIZ</div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact">
          <div className="contact-inner">
            <div className="contact-left reveal-l">
              <div className="s-label">Get In Touch</div>
              <h2 className="contact-title">
                <TextReveal text="Let's Create" className="ct-fg block" />
                <TextReveal text="Change Together" className="ct-or block" delay={0.1} />
              </h2>
              <p className="contact-sub">Ready to make a difference? Whether you want to partner, volunteer, donate or simply learn more — we'd love to hear from you.</p>
            </div>

            <div className="contact-right reveal-r">
              <div className="contact-card">
                <div className="cc-icon"><MapPin size={20} strokeWidth={2} /></div>
                <div>
                  <div className="cc-label">Address</div>
                  <div className="cc-value">
                    Manga Hse, Kiambere RD
                    <br />
                    Upper Hill — Nairobi, Kenya
                  </div>
                </div>
              </div>
              <div className="contact-card">
                <div className="cc-icon"><Phone size={20} strokeWidth={2} /></div>
                <div>
                  <div className="cc-label">Phone</div>
                  <div className="cc-value">(+254) 0115963306</div>
                </div>
              </div>
              <div className="contact-card">
                <div className="cc-icon"><Mail size={20} strokeWidth={2} /></div>
                <div>
                  <div className="cc-label">Email</div>
                  <div className="cc-value">
                    <a href="mailto:info@afosi.org">info@afosi.org</a>
                  </div>
                </div>
              </div>
              <div className="contact-card">
                <div className="cc-icon"><Globe size={20} strokeWidth={2} /></div>
                <div>
                  <div className="cc-label">Website</div>
                  <div className="cc-value">
                    <a href="https://afosi.org" target="_blank" rel="noopener noreferrer">www.afosi.org</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Index;
