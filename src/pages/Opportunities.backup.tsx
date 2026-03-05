import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPin, Clock, CalendarDays, ArrowLeft, Briefcase, Users, 
  ChevronDown, ChevronUp, FileText, CheckCircle2, AlertCircle,
  Building2, DollarSign, Shield, TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

type OpportunityType = "consulting" | "employment";
type OpportunityStatus = "open" | "closed";

interface Opportunity {
  id: string;
  title: string;
  type: OpportunityType;
  status: OpportunityStatus;
  description: string;
  location: string;
  duration: string;
  deadline: string;
  fullContent: React.ReactNode;
}

const opportunities: Opportunity[] = [
  {
    id: "erp-consultant",
    title: "ERP System Consultant",
    type: "consulting",
    status: "closed",
    description: "Design and implement a robust ERP system integrating HR, finance, and operations",
    location: "Remote/Nairobi",
    duration: "3 months",
    deadline: "February 15, 2025 (Expired)",
    fullContent: null, // Will be defined below
  },
  {
    id: "field-officer",
    title: "Field Officer (APBET Teacher)",
    type: "employment",
    status: "open",
    description: "Lead Education for Sustainable Development in schools within informal settlements",
    location: "Nairobi, Kenya",
    duration: "Full-time",
    deadline: "February 27, 2025",
    fullContent: null,
  },
  {
    id: "external-audit",
    title: "External Audit Services",
    type: "consulting",
    status: "open",
    description: "Conduct external audit of financial statements for FY 2025 in compliance with ISA and Kenyan NGO regulations",
    location: "Nairobi, Kenya",
    duration: "6 weeks",
    deadline: "February 27, 2026",
    fullContent: null,
  },
];

// ERP Consultant Full Content
const ERPContent = () => (
  <div className="space-y-8">
    <section>
      <h3 className="text-2xl font-heading font-bold text-foreground mb-4 flex items-center gap-2">
        <Building2 className="text-primary" size={24} />
        1. Background
      </h3>
      <div className="space-y-4 text-muted-foreground">
        <div>
          <h4 className="font-semibold text-foreground mb-2">1.1 About AFOSI</h4>
          <p className="leading-relaxed">
            Action for Sustainability Initiative (AFOSI) is a youth-led, non-government organization committed to advancing sustainable development, social justice, gender equality, health and inclusive community empowerment.
          </p>
          <p className="leading-relaxed mt-2">
            As AFOSI continues to grow in programmatic scope, partnerships, staffing and financial accountability requirements, there is an increasing need for an integrated, efficient and secure Enterprise Resource Planning (ERP) system. Currently, AFOSI utilizes Dynamics Business Central 365 version. The current system which is automated include the Finance components and which needs improvement to onboard all its projects.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-foreground mb-2">1.2 Purpose of the Assignment</h4>
          <p className="leading-relaxed">
            The primary purpose of this assignment is to design and implement a robust, scalable and user-friendly ERP system that integrates AFOSI's core management and operational functions, with a primary focus on:
          </p>
          <ul className="mt-2 space-y-2 ml-6">
            <li className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-primary mt-1 shrink-0" />
              <span>Financial management and reporting</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-primary mt-1 shrink-0" />
              <span>Streamlining human resource and payroll processes</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-primary mt-1 shrink-0" />
              <span>Enhancing monitoring and evaluation capabilities</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-primary mt-1 shrink-0" />
              <span>Optimizing procurement processes</span>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <section className="bg-accent/30 rounded-xl p-6">
      <h3 className="text-2xl font-heading font-bold text-foreground mb-4">2. Objectives of the ERP System</h3>
      <div className="space-y-4">
        <div>
          <h4 className="font-semibold text-foreground mb-2">General Objective</h4>
          <p className="text-muted-foreground">
            To establish an integrated ERP system that enhances organizational efficiency, financial accountability, human resource management and evidence-based decision-making at AFOSI.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-foreground mb-3">Specific Objectives</h4>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { title: "HR Automation", desc: "Automate and streamline HR processes, including staff records, leave management and performance tracking" },
              { title: "Financial Systems", desc: "Strengthen financial systems through integrated accounting, budgeting and donor/project financial reporting" },
              { title: "Internal Controls", desc: "Improve internal controls, compliance and audit readiness" },
              { title: "Management Reporting", desc: "Provide real-time dashboards and management reports for leadership and the Board" },
              { title: "Data Security", desc: "Enhance data security, access control and system integrity" },
              { title: "Scalability", desc: "Ensure system scalability to support AFOSI's future growth" },
            ].map((obj, idx) => (
              <div key={idx} className="bg-background rounded-lg p-4 border border-border">
                <h5 className="font-semibold text-foreground mb-1">{obj.title}</h5>
                <p className="text-sm text-muted-foreground">{obj.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  </div>
);

// Field Officer Full Content
const FieldOfficerContent = () => (
  <div className="space-y-8">
    <section className="bg-primary/5 rounded-xl p-6 border-l-4 border-primary">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground"><strong>Reports to:</strong> Programs Manager</p>
        <p className="text-sm text-muted-foreground"><strong>Location:</strong> Nairobi, Kenya (Informal Settlement)</p>
        <p className="text-sm text-muted-foreground"><strong>Type:</strong> Full-time Employment</p>
        <p className="text-sm text-muted-foreground"><strong>Application Deadline:</strong> February 28, 2025</p>
      </div>
    </section>

    <section>
      <h3 className="text-xl font-heading font-bold text-foreground mb-3">Job Purpose</h3>
      <p className="text-muted-foreground leading-relaxed">
        The Field Officer will lead the integration of Education for Sustainable Development (ESD) within schools through the M.A.T.H Project. Based within an informal settlement, the role will mobilize learners, establish and mentor climate clubs, and coordinate school-based initiatives such as tree planting, clean-up campaigns, and creative climate education activities.
      </p>
    </section>

    <section>
      <h3 className="text-xl font-heading font-bold text-foreground mb-4">Key Responsibilities</h3>
      <div className="space-y-4">
        {[
          {
            title: "Program Support",
            items: [
              "Integrate ESD principles into teaching and extracurricular activities",
              "Establish and mentor climate clubs and student-led initiatives",
              "Organize school-based outreach activities (tree planting, clean-up campaigns, awareness sessions)",
              "Mobilize learners, teachers and parents for community participation",
              "Document and report on school-level activities and success stories"
            ]
          },
          {
            title: "MEAL Support",
            items: [
              "Support data collection and reporting on school-based activities",
              "Conduct regular monitoring of climate clubs and outreach initiatives",
              "Collaborate with the M&E Officer to ensure quality and integrity of data",
              "Provide timely updates and reports to the Programs Manager",
              "Assist in preparing progress reports for donors"
            ]
          },
          {
            title: "Administrative Support",
            items: [
              "Schedule meetings, take minutes, and prepare agendas",
              "Ensure timely submission of travel requests and expense claims",
              "Track and manage inventory and supplies for program activities",
              "Handle correspondence and follow up on pending actions"
            ]
          },
          {
            title: "Stakeholder Engagement",
            items: [
              "Liaise with parents, school leaders, and community groups",
              "Facilitate inclusive participation of girls, children with disabilities, and marginalized groups",
              "Represent the project at school and community events",
              "Uphold safeguarding, child protection, and gender equity principles"
            ]
          }
        ].map((section, idx) => (
          <div key={idx} className="bg-accent/20 rounded-lg p-4">
            <h4 className="font-semibold text-foreground mb-2">{section.title}</h4>
            <ul className="space-y-1.5">
              {section.items.map((item, i) => (
                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>

    <section>
      <h3 className="text-xl font-heading font-bold text-foreground mb-4">Required Qualifications & Experience</h3>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-foreground mb-2">Education</h4>
            <p className="text-sm text-muted-foreground">Diploma/Bachelor's in Education or equivalent knowledge and experience</p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-2">Experience</h4>
            <ul className="space-y-1.5">
              <li className="text-sm text-muted-foreground flex items-start gap-2">
                <CheckCircle2 size={14} className="text-primary mt-1 shrink-0" />
                Minimum 2 years teaching experience in APBET or similar schools
              </li>
              <li className="text-sm text-muted-foreground flex items-start gap-2">
                <CheckCircle2 size={14} className="text-primary mt-1 shrink-0" />
                Experience in leading extracurricular clubs or community initiatives
              </li>
              <li className="text-sm text-muted-foreground flex items-start gap-2">
                <CheckCircle2 size={14} className="text-primary mt-1 shrink-0" />
                Prior involvement in youth mentorship, climate action, or education projects (advantage)
              </li>
            </ul>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-foreground mb-2">Essential Skills</h4>
            <ul className="space-y-1.5">
              {["Classroom management and learner engagement", "Event organization and community mobilization", "Basic monitoring and reporting skills", "Proficiency in Microsoft Office"].map((skill, i) => (
                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-secondary mt-1 shrink-0" />
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>

    <section className="bg-amber-50 dark:bg-amber-950/20 rounded-xl p-6 border border-amber-200 dark:border-amber-800">
      <div className="flex items-start gap-3">
        <Shield className="text-amber-600 shrink-0 mt-1" size={24} />
        <div>
          <h4 className="font-semibold text-foreground mb-2">Safeguarding Commitment</h4>
          <p className="text-sm text-muted-foreground">
            AFOSI has zero tolerance of abuse and exploitation of vulnerable people. This position will have direct access to children and requires adherence to our safeguarding policy. A criminal background check will be obtained prior to the start date.
          </p>
        </div>
      </div>
    </section>
  </div>
);

// External Audit Full Content
const ExternalAuditContent = () => (
  <div className="space-y-8">
    <section className="bg-primary/5 rounded-xl p-6 border-l-4 border-primary">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground"><strong>Period:</strong> Financial Year 1 January 2025 – 31 December 2025</p>
        <p className="text-sm text-muted-foreground"><strong>Location:</strong> Nairobi, Kenya</p>
        <p className="text-sm text-muted-foreground"><strong>Type:</strong> Professional Services / Consulting</p>
        <p className="text-sm text-muted-foreground"><strong>Submission Deadline:</strong> February 27, 2026 (11:59pm EAT)</p>
      </div>
    </section>

    <section>
      <h3 className="text-xl font-heading font-bold text-foreground mb-3">Background</h3>
      <p className="text-muted-foreground leading-relaxed">
        AFOSI is registered with the NGO Coordination Board of Kenya and is obligated to submit audited financial statements annually in compliance with the Public Benefit Organizations Act 2013 (PBO Act 2013) six (6) months of their financial year-end.
      </p>
      <p className="text-muted-foreground leading-relaxed mt-3">
        During the financial year (FY) 2025, AFOSI implemented donor-funded programs. In line with statutory requirements and donor accountability standards, AFOSI seeks to engage a qualified independent audit firm to conduct an external audit of its financial statements and related processes.
      </p>
    </section>

    <section>
      <h3 className="text-xl font-heading font-bold text-foreground mb-4">Purpose of the Assignment</h3>
      <div className="grid md:grid-cols-3 gap-4">
        {[
          { title: "Financial Audit", desc: "Audit AFOSI's financial statements for FY 2025 in accordance with International Standards on Auditing (ISA)" },
          { title: "Compliance Review", desc: "Ensure compliance with PBORA, KRA regulations (PAYE, SHA, NSSF, VAT), and donor agreements" },
          { title: "Independent Assurance", desc: "Provide AFOSI, its Board and donors with independent assurance on financial performance" }
        ].map((item, idx) => (
          <div key={idx} className="bg-accent/20 rounded-lg p-4 border border-border">
            <h4 className="font-semibold text-foreground mb-2">{item.title}</h4>
            <p className="text-sm text-muted-foreground">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>

    <section>
      <h3 className="text-xl font-heading font-bold text-foreground mb-4">Scope of Work</h3>
      <div className="space-y-4">
        <div className="bg-background rounded-lg p-5 border border-border">
          <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <FileText className="text-primary" size={20} />
            Financial Audit
          </h4>
          <ul className="space-y-2">
            {[
              "Examine financial statements and supporting accounting records",
              "Verify statements comply with applicable NGO financial reporting standards",
              "Express independent audit opinion per ISA requirements",
              "Assess financial reports against approved budgets"
            ].map((item, i) => (
              <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-background rounded-lg p-5 border border-border">
          <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <Shield className="text-secondary" size={20} />
            Compliance & Controls Review
          </h4>
          <ul className="space-y-2">
            {[
              "Verify compliance with donor agreements and statutory obligations",
              "Review salary costs, supporting documentation and statutory compliance",
              "Confirm supplier screening against regulatory requirements",
              "Assess adequacy of internal controls and financial management systems"
            ].map((item, i) => (
              <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-2 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>

    <section className="bg-accent/30 rounded-xl p-6">
      <h3 className="text-xl font-heading font-bold text-foreground mb-4">Selection Criteria</h3>
      <div className="grid md:grid-cols-3 gap-4">
        {[
          { percent: "40%", label: "Technical Capacity & Methodology" },
          { percent: "30%", label: "Experience & Qualifications" },
          { percent: "30%", label: "Financial Proposal & Cost-Effectiveness" }
        ].map((item, idx) => (
          <div key={idx} className="bg-background rounded-lg p-4 text-center border border-border">
            <div className="text-3xl font-heading font-bold text-primary mb-1">{item.percent}</div>
            <p className="text-sm text-muted-foreground">{item.label}</p>
          </div>
        ))}
      </div>
    </section>

    <section>
      <h3 className="text-xl font-heading font-bold text-foreground mb-4">Timeline</h3>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-primary/10 rounded-lg p-5 border-l-4 border-primary">
          <div className="text-4xl font-heading font-bold text-primary mb-2">4 Weeks</div>
          <p className="text-sm text-muted-foreground">For Draft Reports from commencement of audit</p>
        </div>
        <div className="bg-secondary/10 rounded-lg p-5 border-l-4 border-secondary">
          <div className="text-4xl font-heading font-bold text-secondary mb-2">6 Weeks</div>
          <p className="text-sm text-muted-foreground">For Final Reports from commencement of audit</p>
        </div>
      </div>
    </section>
  </div>
);

// Assign content to opportunities
opportunities[0].fullContent = <ERPContent />;
opportunities[1].fullContent = <FieldOfficerContent />;
opportunities[2].fullContent = <ExternalAuditContent />;

const typeConfig: Record<OpportunityType, { label: string; color: string }> = {
  consulting: { label: "Consulting", color: "bg-secondary text-secondary-foreground" },
  employment: { label: "Employment", color: "bg-primary text-primary-foreground" },
};

const statusConfig: Record<OpportunityStatus, { label: string; color: string; icon: React.ReactNode }> = {
  open: { 
    label: "Open", 
    color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    icon: <CheckCircle2 size={14} />
  },
  closed: { 
    label: "Closed", 
    color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    icon: <AlertCircle size={14} />
  },
};

const filters: { value: "all" | OpportunityType; label: string }[] = [
  { value: "all", label: "All Opportunities" },
  { value: "employment", label: "Employment" },
  { value: "consulting", label: "Consulting" },
];

const Opportunities = () => {
  const [activeFilter, setActiveFilter] = useState<"all" | OpportunityType>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = activeFilter === "all"
    ? opportunities
    : opportunities.filter((o) => o.type === activeFilter);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative bg-hero-gradient py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground transition-colors mb-8 group">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-semibold">Back to Home</span>
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 bg-primary-foreground/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <Briefcase className="text-primary-foreground" size={28} />
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-primary-foreground">
                Career Opportunities
              </h1>
            </div>
            <p className="text-lg md:text-xl text-primary-foreground/90 max-w-2xl leading-relaxed">
              Join AFOSI in driving sustainable development and social impact. Explore career and consulting opportunities to make a difference.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters & Content */}
      <section className="container mx-auto px-4 py-16">
        {/* Filter pills */}
        <div className="flex flex-wrap gap-3 mb-12">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setActiveFilter(f.value)}
              className={`px-6 py-3 rounded-full text-sm font-semibold transition-all ${
                activeFilter === f.value
                  ? "bg-primary text-primary-foreground shadow-lg scale-105"
                  : "bg-card text-foreground/70 hover:bg-muted border border-border hover:scale-105"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Stats bar */}
        <div className="flex items-center gap-3 mb-8 bg-accent/30 rounded-lg px-4 py-3 w-fit">
          <Users size={18} className="text-primary" />
          <span className="text-sm font-semibold text-foreground">
            {filtered.length} {filtered.length === 1 ? "opportunity" : "opportunities"} available
          </span>
        </div>

        {/* Cards */}
        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((opp, i) => {
              const config = typeConfig[opp.type];
              const statusConf = statusConfig[opp.status];
              const isExpanded = expandedId === opp.id;

              return (
                <motion.div
                  key={opp.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, delay: i * 0.08 }}
                  className="bg-card rounded-2xl border border-border shadow-sm hover:shadow-xl transition-all overflow-hidden"
                >
                  <div className="p-6 md:p-8">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <Badge className={`${config.color} text-xs font-bold uppercase tracking-wider px-3 py-1`}>
                        {config.label}
                      </Badge>
                      <Badge className={`${statusConf.color} text-xs font-bold uppercase tracking-wider px-3 py-1 flex items-center gap-1`}>
                        {statusConf.icon}
                        {statusConf.label}
                      </Badge>
                    </div>

                    <h3 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-3">
                      {opp.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      {opp.description}
                    </p>

                    <div className="grid sm:grid-cols-3 gap-4 mb-6">
                      <div className="flex items-center gap-3 bg-accent/20 rounded-lg p-3">
                        <MapPin size={18} className="text-primary shrink-0" />
                        <div>
                          <p className="text-xs text-muted-foreground">Location</p>
                          <p className="text-sm font-semibold text-foreground">{opp.location}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 bg-accent/20 rounded-lg p-3">
                        <Clock size={18} className="text-primary shrink-0" />
                        <div>
                          <p className="text-xs text-muted-foreground">Duration</p>
                          <p className="text-sm font-semibold text-foreground">{opp.duration}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 bg-accent/20 rounded-lg p-3">
                        <CalendarDays size={18} className="text-primary shrink-0" />
                        <div>
                          <p className="text-xs text-muted-foreground">Deadline</p>
                          <p className="text-sm font-semibold text-foreground">{opp.deadline}</p>
                        </div>
                      </div>
                    </div>

                    {/* Expandable details */}
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : opp.id)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg font-semibold transition-all"
                      >
                        {isExpanded ? "Hide Details" : "View Full Details"}
                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </button>
                      {opp.status === "open" && (
                        <Button variant="hero" size="lg" asChild>
                          <a href={`mailto:info@afosi.org?subject=Application: ${opp.title}`}>
                            Apply Now
                          </a>
                        </Button>
                      )}
                    </div>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.4 }}
                          className="overflow-hidden"
                        >
                          <div className="border-t border-border mt-6 pt-6">
                            {opp.fullContent}
                            
                            {opp.status === "open" && (
                              <div className="mt-8 bg-primary/5 rounded-xl p-6 border border-primary/20">
                                <h4 className="text-lg font-heading font-bold text-foreground mb-3">How to Apply</h4>
                                <p className="text-muted-foreground mb-4">
                                  Interested candidates meeting the above requirements should submit their application via email:
                                </p>
                                <div className="space-y-2 mb-4">
                                  <p className="text-sm"><strong>Deadline:</strong> {opp.deadline}</p>
                                  <p className="text-sm"><strong>Submit to:</strong> info@afosi.org</p>
                                  <p className="text-sm text-muted-foreground">Include your CV, cover letter, and references</p>
                                </div>
                                <Button variant="hero" size="lg" asChild>
                                  <a href={`mailto:info@afosi.org?subject=Application: ${opp.title}`}>
                                    Submit Application
                                  </a>
                                </Button>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <Briefcase size={48} className="mx-auto text-muted-foreground/40 mb-4" />
            <p className="text-muted-foreground">No opportunities found in this category.</p>
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="bg-section-gradient border-t border-border py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
              Don't see the right fit?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto text-lg">
              Send us your CV and area of interest. We're always looking for passionate individuals to join our mission of creating sustainable change.
            </p>
            <Button variant="hero" size="lg" className="shadow-xl" asChild>
              <a href="mailto:info@afosi.org?subject=General Application">Send Your CV</a>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Opportunities;
