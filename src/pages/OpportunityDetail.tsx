import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  CalendarDays, Clock, MapPin, FileText, 
  Shield, ExternalLink, Lock, AlertCircle, ArrowLeft, ArrowRight,
  Target, Users, Star, ChevronRight, Briefcase, CheckCircle2
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import {
  getOpportunityStatus,
  formatDeadline,
  getDaysUntilDeadline,
} from "@/utils/opportunityHelpers";
import { opportunitiesAPI } from "@/services/api";

interface OpportunityDetail {
  id: string;
  title: string;
  type: "consulting" | "employment" | "volunteering";
  description: string;
  location: string;
  duration: string;
  deadline: string;
  manually_disabled: boolean;
  full_description: string | null;
  apply_link: string | null;
  slug: string;
}

// ─── Icon + accent lookup by keyword ─────────────────────────────────────────
function getSectionMeta(heading: string): { icon: React.ElementType; accent: string } {
  const u = heading.toUpperCase();
  if (/RESPONSIBILIT|ACTIVIT|DELIVERABLE|SCOPE/.test(u)) return { icon: Target,       accent: "border-secondary" };
  if (/REQUIREMENT|QUALIF|LOOKING FOR|WHO (WE|CAN)/.test(u))  return { icon: CheckCircle2, accent: "border-amber-500" };
  if (/BENEFIT|OFFER|GAIN|COMPENSATION|REMUNERATION/.test(u)) return { icon: Star,        accent: "border-green-500" };
  if (/HOW TO APPLY|APPLICATION/.test(u))                      return { icon: ChevronRight, accent: "border-primary" };
  if (/ABOUT|BACKGROUND|CONTEXT|OVERVIEW/.test(u))             return { icon: Briefcase,   accent: "border-primary" };
  if (/TIMELINE|SCHEDULE/.test(u))                             return { icon: Clock,       accent: "border-primary" };
  if (/TEAM|STAFF|PEOPLE|VOLUNTEER/.test(u))                   return { icon: Users,       accent: "border-primary" };
  return { icon: FileText, accent: "border-primary" };
}

function toTitleCase(str: string) {
  return str.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

// ─── Heading detection ────────────────────────────────────────────────────────
// Only treat a line as a heading if it is clearly a label/title.
// Key rule: must be followed by longer body text or bullets — not another short line.
function isHeadingLine(line: string, nextLine: string): boolean {
  const trimmed = line.trim();
  if (!trimmed) return false;
  if (trimmed.length > 70) return false;                        // too long
  if (/^[-•*]\s/.test(trimmed)) return false;                   // bullet
  if (/[.!?,;]$/.test(trimmed)) return false;                   // ends with punctuation → sentence
  if (!/^[A-Z]/.test(trimmed)) return false;                    // must start with capital
  const wordCount = trimmed.split(/\s+/).length;
  if (wordCount > 7) return false;                              // too many words
  // Reject if colon appears mid-sentence with many words
  if (trimmed.includes(':') && wordCount > 4) return false;
  // Must be followed by a longer line (body text) or a bullet
  if (!nextLine) return false;
  const nextIsBullet = /^[-•*]\s/.test(nextLine.trim());
  const nextIsLonger = nextLine.trim().length > trimmed.length + 10;
  return nextIsBullet || nextIsLonger;
}

// ─── Parse plain text into sections ──────────────────────────────────────────
function parseSections(text: string) {
  const tagged = text.split('\n').map(raw => raw.trim());

  const sections: { heading: string | null; items: string[] }[] = [];
  let current: { heading: string | null; items: string[] } = { heading: null, items: [] };

  for (let i = 0; i < tagged.length; i++) {
    const line = tagged[i];
    if (!line) continue;

    // Find next non-empty line for look-ahead
    let nextLine = '';
    for (let j = i + 1; j < tagged.length; j++) {
      if (tagged[j]) { nextLine = tagged[j]; break; }
    }

    if (isHeadingLine(line, nextLine)) {
      if (current.items.length > 0 || current.heading) {
        sections.push(current);
      }
      current = { heading: line.replace(/[:\-–—]+$/, '').trim(), items: [] };
    } else {
      current.items.push(line);
    }
  }
  if (current.items.length > 0 || current.heading) {
    sections.push(current);
  }
  return sections;
}

// ─── Render a single content line ────────────────────────────────────────────
function renderLine(line: string, idx: number) {
  const isBullet = /^[-•*]\s/.test(line);
  if (isBullet) {
    return (
      <div key={idx} className="flex items-start gap-3">
        <span className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
        <span className="text-muted-foreground leading-relaxed text-sm sm:text-base">
          {line.replace(/^[-•*]\s+/, '')}
        </span>
      </div>
    );
  }
  return (
    <p key={idx} className="text-muted-foreground leading-relaxed text-sm sm:text-base">
      {line}
    </p>
  );
}

// ─── Render full content ──────────────────────────────────────────────────────
function renderContent(text: string) {
  const sections = parseSections(text);

  // Single block with no headings — plain paragraphs
  if (sections.length === 1 && !sections[0].heading) {
    return (
      <div className="space-y-4">
        {sections[0].items.map((line, i) => renderLine(line, i))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {sections.map((section, si) => {
        const { icon: Icon, accent } = section.heading
          ? getSectionMeta(section.heading)
          : { icon: FileText, accent: "border-primary" };

        const bulletCount = section.items.filter(l => /^[-•*]\s/.test(l)).length;
        const mostlyBullets = section.items.length > 0 && bulletCount >= section.items.length / 2;

        return (
          <div key={si} className="reveal" style={{ transitionDelay: `${si * 0.05}s` }}>
            {/* Section heading */}
            {section.heading && (
              <div className={`flex items-center gap-3 mb-4 pb-3 border-b border-border`}>
                <Icon size={20} className="text-primary shrink-0" style={{ color: 'var(--or)' }} />
                <h2 className="text-xl font-heading font-bold" style={{ fontSize: '24px' }}>
                  {toTitleCase(section.heading)}
                </h2>
              </div>
            )}

            {/* Content */}
            {section.items.length > 0 && (
              mostlyBullets ? (
                <div className="rounded-xl p-5 space-y-2.5" style={{ background: 'var(--bg2)' }}>
                  {section.items.map((line, li) => renderLine(line, li))}
                </div>
              ) : (
                <div className="space-y-3">
                  {section.items.map((line, li) => renderLine(line, li))}
                </div>
              )
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
const OpportunityDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [opportunity, setOpportunity] = useState<OpportunityDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);

    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);

    const fetchOpportunity = async () => {
      try {
        let response;
        if (isUUID) {
          response = await opportunitiesAPI.getById(slug);
        } else {
          try {
            response = await opportunitiesAPI.getBySlug(slug);
          } catch {
            response = await opportunitiesAPI.getById(slug);
          }
        }
        setOpportunity(response.data);
      } catch (err: any) {
        setError(err.message || 'Opportunity not found');
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunity();
  }, [slug]);

  useEffect(() => {
    if (loading) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("on");
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    
    setTimeout(() => {
      document.querySelectorAll(".reveal").forEach((el) => obs.observe(el));
    }, 100);

    return () => obs.disconnect();
  }, [loading, opportunity]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" style={{ borderColor: 'var(--or)' }} />
            <p className="text-muted-foreground">Loading opportunity...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !opportunity) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto" />
            <h2 className="text-2xl font-heading font-bold">Opportunity Not Found</h2>
            <p className="text-muted-foreground">This opportunity may have been removed or the link is incorrect.</p>
            <Link to="/opportunities" className="btn-fill" style={{ display: 'inline-flex', marginTop: '16px' }}>
              <ArrowLeft size={16} className="mr-2" />
              Back to Opportunities
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const status = getOpportunityStatus(opportunity.deadline, opportunity.manually_disabled);
  const daysLeft = getDaysUntilDeadline(opportunity.deadline);
  const isOpen = status === "open";

  // Detect application method from apply_link value
  const applyLink = opportunity.apply_link || '';
  const isEmailApply = !applyLink ||
    applyLink === 'mailto:careers@afosi.org' ||
    applyLink.startsWith('mailto:');
  const isInternalApply = applyLink === 'internal' || applyLink.startsWith('internal');
  const applyEmail = 'careers@afosi.org';

  const typeLabel =
    opportunity.type === "consulting" ? "Consulting" :
    opportunity.type === "volunteering" ? "Volunteering / Mentorship" :
    "Employment";

  const typeBadgeClass =
    opportunity.type === "consulting" ? "bg-secondary text-secondary-foreground" :
    opportunity.type === "volunteering" ? "bg-green-500 text-white" :
    "bg-primary text-primary-foreground";

  return (
    <main className="min-h-screen font-montserrat" style={{ background: 'var(--bg)' }}>
      <ScrollToTop />
      <Navbar />

      {/* ── Hero Banner ── */}
      <div className="opp-hero" style={{ minHeight: '55vh', paddingBottom: '60px' }}>
        <Link
          to="/opportunities"
          className="inline-flex items-center gap-2 transition-colors mb-12 font-semibold text-sm"
          style={{ color: 'var(--fg)', textDecoration: 'none' }}
        >
          <ArrowLeft size={18} /> Back to Opportunities
        </Link>
        
        <div className="flex flex-wrap gap-2 mb-6">
          <div className={`job-badge ${opportunity.type === 'consulting' ? 'consulting' : 'employment'}`} style={{ marginBottom: 0 }}>
            {typeLabel}
          </div>
          <div className="job-badge" style={{ marginBottom: 0, background: isOpen ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: isOpen ? '#22c55e' : '#ef4444', border: '1px solid currentColor' }}>
            {isOpen ? 'Open' : 'Closed'}
          </div>
        </div>

        <div className="opp-hero-line"></div>
        <h1 className="opp-hero-title" style={{ fontSize: 'clamp(42px,6vw,72px)' }}>
          <span className="t-fg">{opportunity.title}</span>
        </h1>
        <p className="opp-hero-sub" style={{ maxWidth: '800px', marginBottom: '32px' }}>
          {opportunity.description}
        </p>

        {/* Meta row */}
        <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm" style={{ color: 'var(--fg2)' }}>
          <span className="flex items-center gap-2">
            <MapPin size={16} style={{ color: 'var(--or)' }} />
            {opportunity.location}
          </span>
          <span className="flex items-center gap-2">
            <Clock size={16} style={{ color: 'var(--or)' }} />
            {opportunity.duration}
          </span>
          <span className="flex items-center gap-2">
            <CalendarDays size={16} style={{ color: 'var(--or)' }} />
            Deadline: {formatDeadline(opportunity.deadline)}
          </span>
        </div>
      </div>

      {/* ── Body ── */}
      <section className="opp-section" style={{ paddingTop: '80px', paddingBottom: '120px' }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12">

            {/* Main content */}
            <div className="md:col-span-2">
              {opportunity.full_description && opportunity.full_description.trim() ? (
                <div className="reveal">
                  {renderContent(opportunity.full_description)}
                </div>
              ) : (
                <div className="empty-state reveal" style={{ margin: 0, padding: '60px 24px' }}>
                  <div className="empty-icon"><FileText size={48} /></div>
                  <h3 className="empty-title" style={{ fontSize: '24px' }}>No Details Provided</h3>
                  <p className="empty-text" style={{ fontSize: '14px', marginBottom: 0 }}>
                    Full details for this opportunity have not been added yet.
                  </p>
                </div>
              )}

              {/* Safeguarding note */}
              <div className="mt-12 p-6 rounded-xl flex items-start gap-4 reveal" style={{ background: 'var(--bg3)', border: '1px solid var(--border)' }}>
                <Shield style={{ color: 'var(--or)', flexShrink: 0 }} size={24} />
                <p style={{ fontSize: '14px', color: 'var(--fg2)', lineHeight: 1.7 }}>
                  <strong style={{ color: 'var(--fg)' }}>Safeguarding:</strong> AFOSI has zero tolerance of abuse and exploitation of vulnerable people. All employees and volunteers are expected to commit to protecting children, young people, and vulnerable adults from harm and to abide by our safeguarding policy.
                </p>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">

              {/* Apply CTA card */}
              <div className="rounded-xl p-8 reveal" style={{ background: 'var(--or)', color: '#F5EFE6' }}>
                <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '32px', letterSpacing: '1px', marginBottom: '16px' }}>
                  {isOpen ? 'Ready to Apply?' : 'Opportunity Closed'}
                </h3>
                <p style={{ fontSize: '14px', lineHeight: 1.7, marginBottom: '24px', opacity: 0.9 }}>
                  Deadline: <strong>{formatDeadline(opportunity.deadline)}</strong>
                  {isOpen && daysLeft > 0 && daysLeft <= 14 && (
                    <span style={{ display: 'block', marginTop: '4px', fontWeight: 600 }}>{daysLeft} days remaining</span>
                  )}
                </p>

                {isOpen ? (
                  isEmailApply ? (
                    <a
                      href={`mailto:${applyEmail}?subject=Application: ${encodeURIComponent(opportunity.title)}`}
                      className="btn-white"
                      style={{ display: 'flex', justifyContent: 'center', width: '100%' }}
                    >
                      Apply via Email <ExternalLink size={15} />
                    </a>
                  ) : isInternalApply ? (
                    <Link
                      to={`/opportunities/${opportunity.slug}/apply`}
                      className="btn-white"
                      style={{ display: 'flex', justifyContent: 'center', width: '100%', alignItems: 'center', gap: '8px' }}
                    >
                      Apply Now <ArrowRight size={15} />
                    </Link>
                  ) : opportunity.apply_link ? (
                    <a href={opportunity.apply_link} target="_blank" rel="noopener noreferrer" className="btn-white" style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                      Apply Now <ExternalLink size={15} />
                    </a>
                  ) : (
                    <button className="btn-white" disabled style={{ width: '100%', opacity: 0.6, cursor: 'not-allowed' }}>
                      Apply Now
                    </button>
                  )
                ) : (
                  <button className="btn-ghost" disabled style={{ width: '100%', opacity: 0.6, cursor: 'not-allowed', color: '#F5EFE6', borderColor: 'rgba(245,239,230,0.3)', justifyContent: 'center' }}>
                    <Lock size={16} /> Applications Closed
                  </button>
                )}

                {/* Submission instruction */}
                {isOpen && (
                  <p style={{ fontSize: '12px', marginTop: '16px', opacity: 0.8, lineHeight: 1.6, textAlign: 'center' }}>
                    {isEmailApply
                      ? <>Send your CV & cover letter to <strong>{applyEmail}</strong> with the job title as the subject line.</>
                      : isInternalApply
                        ? <>Fill in and submit the application form directly on this website.</>
                        : <>Click <strong>Apply Now</strong> to open the online application form.</>
                    }
                  </p>
                )}
              </div>

              {/* Quick info card */}
              <div className="rounded-xl p-8 reveal" style={{ background: 'var(--bg2)', border: '1px solid var(--border)', transitionDelay: '0.1s' }}>
                <h3 style={{ fontFamily: "'Crimson Text', serif", fontSize: '22px', fontStyle: 'italic', fontWeight: 600, marginBottom: '20px', color: 'var(--fg)' }}>
                  Summary
                </h3>
                <div className="space-y-4" style={{ fontSize: '14px' }}>
                  <div>
                    <span style={{ color: 'var(--silver)' }}>Type</span>
                    <p style={{ color: 'var(--fg)', fontWeight: 500, marginTop: '2px' }}>{typeLabel}</p>
                  </div>
                  <div>
                    <span style={{ color: 'var(--silver)' }}>Location</span>
                    <p style={{ color: 'var(--fg)', fontWeight: 500, marginTop: '2px' }}>{opportunity.location}</p>
                  </div>
                  <div>
                    <span style={{ color: 'var(--silver)' }}>Duration</span>
                    <p style={{ color: 'var(--fg)', fontWeight: 500, marginTop: '2px' }}>{opportunity.duration}</p>
                  </div>
                  <div>
                    <span style={{ color: 'var(--silver)' }}>Deadline</span>
                    <p style={{ color: 'var(--fg)', fontWeight: 500, marginTop: '2px' }}>{formatDeadline(opportunity.deadline)}</p>
                  </div>
                </div>
              </div>

              {/* Get Involved */}
              <div className="rounded-xl p-8 reveal" style={{ background: 'var(--bg2)', border: '1px solid var(--border)', transitionDelay: '0.2s' }}>
                <h3 style={{ fontFamily: "'Crimson Text', serif", fontSize: '22px', fontStyle: 'italic', fontWeight: 600, marginBottom: '12px', color: 'var(--fg)' }}>
                  Questions?
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--fg2)', lineHeight: 1.7, marginBottom: '24px' }}>
                  Interested in learning more about this opportunity or partnering with AFOSI?
                </p>
                <Link to="/#contact" className="btn-ghost" style={{ justifyContent: 'center' }}>
                  Contact Us
                </Link>
              </div>

            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default OpportunityDetail;
