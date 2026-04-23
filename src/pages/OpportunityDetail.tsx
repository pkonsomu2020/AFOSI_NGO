import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MapPin, Clock, CalendarDays, ArrowLeft, Briefcase,
  ExternalLink, AlertCircle, CheckCircle2, Shield, Lock,
  Target, Users, Star, FileText, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
          <motion.div
            key={si}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: si * 0.04 }}
          >
            {/* Section heading */}
            {section.heading && (
              <div className={`flex items-center gap-3 mb-4 pb-3 border-b-2 ${accent}`}>
                <Icon size={20} className="text-primary shrink-0" />
                <h2 className="text-xl font-heading font-bold text-foreground">
                  {toTitleCase(section.heading)}
                </h2>
              </div>
            )}

            {/* Content */}
            {section.items.length > 0 && (
              mostlyBullets ? (
                <div className="bg-accent/20 rounded-xl p-5 space-y-2.5">
                  {section.items.map((line, li) => renderLine(line, li))}
                </div>
              ) : (
                <div className="space-y-3">
                  {section.items.map((line, li) => renderLine(line, li))}
                </div>
              )
            )}
          </motion.div>
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
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
            <Link to="/opportunities">
              <Button className="mt-2">
                <ArrowLeft size={16} className="mr-2" />
                Back to Opportunities
              </Button>
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

  const typeLabel =
    opportunity.type === "consulting" ? "Consulting" :
    opportunity.type === "volunteering" ? "Volunteering / Mentorship" :
    "Employment";

  const typeBadgeClass =
    opportunity.type === "consulting" ? "bg-secondary text-secondary-foreground" :
    opportunity.type === "volunteering" ? "bg-green-500 text-white" :
    "bg-primary text-primary-foreground";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <ScrollToTop />

      {/* ── Hero Banner ── */}
      <section className="relative py-12 md:py-20 bg-primary overflow-hidden">
        <div className="absolute inset-0 bg-[url('/afosi_pad.jpg')] bg-cover bg-center opacity-10" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              to="/opportunities"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-6 text-sm"
            >
              <ArrowLeft size={16} />
              Back to Opportunities
            </Link>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge className={typeBadgeClass}>
                <Briefcase size={12} className="mr-1" />
                {typeLabel}
              </Badge>
              <Badge className={
                isOpen
                  ? "bg-white/20 backdrop-blur-sm text-white border-0"
                  : "bg-red-500/80 text-white border-0"
              }>
                {isOpen
                  ? <><CheckCircle2 size={12} className="mr-1" />Open</>
                  : <><Lock size={12} className="mr-1" />Closed</>
                }
              </Badge>
              {isOpen && daysLeft <= 7 && daysLeft >= 0 && (
                <Badge className="bg-orange-400/90 text-white border-0">
                  <Clock size={12} className="mr-1" />
                  {daysLeft === 0 ? "Closes Today!" : `${daysLeft} day${daysLeft > 1 ? "s" : ""} left`}
                </Badge>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-white mb-4 leading-tight">
              {opportunity.title}
            </h1>
            <p className="text-lg text-white/80 mb-8 leading-relaxed max-w-2xl">
              {opportunity.description}
            </p>

            {/* Meta row */}
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/70 mb-8">
              <span className="flex items-center gap-1.5">
                <MapPin size={15} className="text-white/60" />
                {opportunity.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={15} className="text-white/60" />
                {opportunity.duration}
              </span>
              <span className="flex items-center gap-1.5">
                <CalendarDays size={15} className="text-white/60" />
                Deadline: {formatDeadline(opportunity.deadline)}
              </span>
            </div>

            {/* Apply CTA */}
            {isOpen ? (
              opportunity.apply_link ? (
                <a href={opportunity.apply_link} target="_blank" rel="noopener noreferrer">
                  <Button size="lg" variant="secondary" className="gap-2 font-semibold">
                    Apply Now
                    <ExternalLink size={16} />
                  </Button>
                </a>
              ) : (
                <Button size="lg" disabled className="gap-2 opacity-60 bg-white/20 text-white">
                  Apply Now
                </Button>
              )
            ) : (
              <Button size="lg" disabled className="gap-2 bg-white/10 text-white/60 cursor-not-allowed">
                <Lock size={16} />
                Applications Closed
              </Button>
            )}
          </motion.div>
        </div>
      </section>

      {/* ── Body ── */}
      <section className="py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-3 gap-8">

            {/* Main content */}
            <div className="md:col-span-2">
              {opportunity.full_description && opportunity.full_description.trim() ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  {renderContent(opportunity.full_description)}
                </motion.div>
              ) : (
                <div className="text-center py-16 text-muted-foreground">
                  <AlertCircle className="w-10 h-10 mx-auto mb-3 opacity-40" />
                  <p>Full details for this opportunity have not been added yet.</p>
                </div>
              )}

              {/* Safeguarding note */}
              <div className="mt-10 p-5 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl flex items-start gap-3">
                <Shield className="text-amber-600 shrink-0 mt-0.5" size={20} />
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Safeguarding:</strong> AFOSI has zero tolerance of abuse and exploitation of vulnerable people. All employees and volunteers are expected to commit to protecting children, young people, and vulnerable adults from harm and to abide by our safeguarding policy.
                </p>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">

              {/* Quick info card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-card border border-border rounded-xl p-6"
              >
                <h3 className="text-lg font-heading font-bold text-foreground mb-4">
                  Opportunity Details
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Type</span>
                    <p className="text-foreground font-medium mt-0.5">{typeLabel}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Location</span>
                    <p className="text-foreground font-medium mt-0.5">{opportunity.location}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Duration</span>
                    <p className="text-foreground font-medium mt-0.5">{opportunity.duration}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Deadline</span>
                    <p className="text-foreground font-medium mt-0.5">{formatDeadline(opportunity.deadline)}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Status</span>
                    <p className={`font-semibold mt-0.5 ${isOpen ? 'text-green-600' : 'text-red-500'}`}>
                      {isOpen ? 'Open' : 'Closed'}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Apply CTA card */}
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-primary/10 border border-primary/20 rounded-xl p-6"
                >
                  <h3 className="text-lg font-heading font-bold text-foreground mb-2">
                    Ready to Apply?
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Deadline: <span className="font-medium text-foreground">{formatDeadline(opportunity.deadline)}</span>
                    {daysLeft > 0 && daysLeft <= 14 && (
                      <span className="block text-orange-600 font-semibold mt-1">{daysLeft} days remaining</span>
                    )}
                  </p>
                  {opportunity.apply_link ? (
                    <a href={opportunity.apply_link} target="_blank" rel="noopener noreferrer">
                      <Button className="w-full gap-2">
                        Apply Now
                        <ExternalLink size={15} />
                      </Button>
                    </a>
                  ) : (
                    <Button disabled className="w-full opacity-60">
                      Apply Now
                    </Button>
                  )}
                </motion.div>
              )}

              {/* Get Involved */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-card border border-border rounded-xl p-6"
              >
                <h3 className="text-lg font-heading font-bold text-foreground mb-2">
                  Questions?
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Interested in learning more about this opportunity or partnering with AFOSI?
                </p>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link to="/#contact">Contact Us</Link>
                </Button>
              </motion.div>

            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default OpportunityDetail;
