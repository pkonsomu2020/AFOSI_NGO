import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Team = () => {
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
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal").forEach((el) => obs.observe(el));

    return () => obs.disconnect();
  }, []);

  return (
    <>
      <Navbar />
      <main className="font-montserrat">
      {/* PAGE HERO */}
      <div className="team-hero">
        <div className="hero-line"></div>
        <h1 className="team-hero-title">
          <span className="t-fg">Meet the</span>
          <br />
          <span className="t-or">Team</span>
        </h1>
        <p className="team-hero-sub">
          A passionate group of professionals dedicated to creating sustainable impact across Kenya.
        </p>
      </div>

      {/* BOARD MEMBERS */}
      <section className="team-section">
        <div className="s-label reveal">Leadership</div>
        <h2 className="section-title reveal">
          <span className="t-fg">Board</span> <span className="t-or">Members</span>
        </h2>
        <div className="team-grid reveal" style={{ transitionDelay: ".1s" }}>
          <div className="team-card">
            <div className="team-card-img">
              <img src="https://afosi.org/TEAMS/eva.jpg" alt="Eva Nchogu" loading="lazy" />
            </div>
            <div className="team-card-body">
              <div className="team-name">Eva Nchogu</div>
              <div className="team-role">Board Chairperson</div>
            </div>
          </div>

          <div className="team-card">
            <div className="team-card-img">
              <img src="https://afosi.org/TEAMS/winnie.jpg" alt="Winnie Osoro" loading="lazy" />
            </div>
            <div className="team-card-body">
              <div className="team-name">Winnie Osoro</div>
              <div className="team-role">Board Treasurer</div>
            </div>
          </div>

          <div className="team-card">
            <div className="team-card-img">
              <img src="https://afosi.org/TEAMS/LUCY_2.jpeg" alt="Lucy Mogesi" loading="lazy" />
            </div>
            <div className="team-card-body">
              <div className="team-name">Lucy Mogesi</div>
              <div className="team-role">Board Member</div>
            </div>
          </div>

          <div className="team-card">
            <div className="team-card-img">
              <img src="https://afosi.org/TEAMS/anne.jpg" alt="Anne Nderitu" loading="lazy" />
            </div>
            <div className="team-card-body">
              <div className="team-name">Anne Nderitu</div>
              <div className="team-role">Board Member</div>
            </div>
          </div>
        </div>
      </section>

      {/* MANAGEMENT TEAM */}
      <section className="team-section alt">
        <div className="s-label reveal">Leadership</div>
        <h2 className="section-title reveal">
          <span className="t-fg">Management</span> <span className="t-or">Team</span>
        </h2>
        <div className="team-grid two-col reveal" style={{ transitionDelay: ".1s" }}>
          <div className="team-card">
            <div className="team-card-img">
              <img src="https://afosi.org/TEAMS/ERIC_2.jpeg" alt="Eric Nyamwaro" loading="lazy" />
            </div>
            <div className="team-card-body">
              <div className="team-name">Eric Nyamwaro</div>
              <div className="team-role">Executive Director</div>
            </div>
          </div>

          <div className="team-card">
            <div className="team-card-img">
              <img src="https://afosi.org/TEAMS/esther.jpg" alt="Esther Mwikali" loading="lazy" />
            </div>
            <div className="team-card-body">
              <div className="team-name">Esther Mwikali</div>
              <div className="team-role">National Coordinator</div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE TEAM */}
      <section className="team-section">
        <div className="s-label reveal">Staff</div>
        <h2 className="section-title reveal">
          <span className="t-fg">Core</span> <span className="t-or">Team</span>
        </h2>

        {/* Programs */}
        <div className="dept-label reveal">Programs Department</div>
        <div className="team-grid three-col reveal" style={{ transitionDelay: ".08s" }}>
          <div className="team-card">
            <div className="team-card-img">
              <img src="https://afosi.org/TEAMS/prisca.jpg" alt="Prisca Achieng" loading="lazy" />
            </div>
            <div className="team-card-body">
              <div className="team-name">Prisca Achieng</div>
              <div className="team-role">Program Assistant</div>
            </div>
          </div>

          <div className="team-card">
            <div className="team-card-img">
              <img src="https://afosi.org/TEAMS/davin.jpg" alt="Davin Omollo" loading="lazy" />
            </div>
            <div className="team-card-body">
              <div className="team-name">Davin Omollo</div>
              <div className="team-role">Project Associate</div>
            </div>
          </div>

          <div className="team-card">
            <div className="team-card-img">
              <img src="https://afosi.org/TEAMS/ivy.jpg" alt="Ivy Awuor" loading="lazy" />
            </div>
            <div className="team-card-body">
              <div className="team-name">Ivy Awuor</div>
              <div className="team-role">Programs</div>
            </div>
          </div>

          <div className="team-card">
            <div className="team-card-img">
              <img src="https://afosi.org/TEAMS/FELIX%20OMONDI.png" alt="Felix Omondi" loading="lazy" />
            </div>
            <div className="team-card-body">
              <div className="team-name">Felix Omondi</div>
              <div className="team-role">Programs</div>
            </div>
          </div>

          <div className="team-card">
            <div className="team-card-img">
              <img src="https://afosi.org/TEAMS/magda.jpg" alt="Magdaline Watahi" loading="lazy" />
            </div>
            <div className="team-card-body">
              <div className="team-name">Magdaline Watahi</div>
              <div className="team-role">Programs</div>
            </div>
          </div>

          <div className="team-card">
            <div className="team-card-img">
              <img src="https://afosi.org/TEAMS/Barbra%20Wanjiru.jpeg" alt="Barbra Wanjiku" loading="lazy" />
            </div>
            <div className="team-card-body">
              <div className="team-name">Barbra Wanjiku</div>
              <div className="team-role">Programs</div>
            </div>
          </div>
        </div>

        {/* MEAL */}
        <div className="dept-label reveal" style={{ marginTop: "64px" }}>
          MEAL Department
        </div>
        <div className="team-grid two-col reveal" style={{ transitionDelay: ".08s" }}>
          <div className="team-card">
            <div className="team-card-img">
              <img src="https://afosi.org/TEAMS/vanessa-pic.jpeg" alt="Vanessa Wambui" loading="lazy" />
            </div>
            <div className="team-card-body">
              <div className="team-name">Vanessa Wambui</div>
              <div className="team-role">Data Specialist</div>
            </div>
          </div>

          <div className="team-card">
            <div className="team-card-img">
              <img src="https://afosi.org/TEAMS/ongaki.jpg" alt="Fredrick Ongaki" loading="lazy" />
            </div>
            <div className="team-card-body">
              <div className="team-name">Fredrick Ongaki</div>
              <div className="team-role">MEAL Specialist</div>
            </div>
          </div>
        </div>

        {/* IT & Comms */}
        <div className="dept-label reveal" style={{ marginTop: "64px" }}>
          IT &amp; Communication
        </div>
        <div className="team-grid reveal" style={{ transitionDelay: ".08s" }}>
          <div className="team-card">
            <div className="team-card-img">
              <img src="https://afosi.org/TEAMS/papa.jpg" alt="Elisha Papa" loading="lazy" />
            </div>
            <div className="team-card-body">
              <div className="team-name">Elisha Papa</div>
              <div className="team-role">IT Specialist</div>
            </div>
          </div>

          <div className="team-card">
            <div className="team-card-img">
              <img src="https://afosi.org/TEAMS/virginia.jpg" alt="Virginia Kerubo" loading="lazy" />
            </div>
            <div className="team-card-body">
              <div className="team-name">Virginia Kerubo</div>
              <div className="team-role">Communications Lead</div>
            </div>
          </div>

          <div className="team-card">
            <div className="team-card-img">
              <div className="img-placeholder">JL</div>
            </div>
            <div className="team-card-body">
              <div className="team-name">Joe Liban</div>
              <div className="team-role">IT &amp; Communication</div>
            </div>
          </div>

          <div className="team-card">
            <div className="team-card-img">
              <img src="https://afosi.org/TEAMS/Peter%20Onsomu.jpg" alt="Peter Onsomu" loading="lazy" />
            </div>
            <div className="team-card-body">
              <div className="team-name">Peter Onsomu</div>
              <div className="team-role">IT &amp; Communication</div>
            </div>
          </div>
        </div>

        {/* Finance */}
        <div className="dept-label reveal" style={{ marginTop: "64px" }}>
          Finance Department
        </div>
        <div className="team-grid two-col reveal" style={{ transitionDelay: ".08s" }}>
          <div className="team-card">
            <div className="team-card-img">
              <img src="https://afosi.org/TEAMS/muthoni.jpg" alt="Elizabeth Muthoni" loading="lazy" />
            </div>
            <div className="team-card-body">
              <div className="team-name">Elizabeth Muthoni</div>
              <div className="team-role">Finance Officer</div>
            </div>
          </div>

          <div className="team-card">
            <div className="team-card-img">
              <img src="https://afosi.org/TEAMS/titus.jpeg" alt="Titus" loading="lazy" />
            </div>
            <div className="team-card-body">
              <div className="team-name">Titus</div>
              <div className="team-role">Finance</div>
            </div>
          </div>
        </div>
      </section>
    </main>
    <Footer />
    </>
  );
};

export default Team;
