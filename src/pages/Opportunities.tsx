import { useState, useEffect, useMemo } from "react";
import { 
  MapPin, Clock, CalendarDays, ArrowLeft, Briefcase, Users, 
  FileText, CheckCircle2, AlertCircle,
  Building2, Shield, Lock, Zap, TrendingUp, Calendar, ArrowRight, Send
} from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { 
  getOpportunityStatus, 
  formatDeadline, 
  getDeadlineStatus,
  getDaysUntilDeadline 
} from "@/utils/opportunityHelpers";
import { opportunitiesAPI } from "@/services/api";

type OpportunityType = "consulting" | "employment" | "volunteering";
type OpportunityStatus = "open" | "closed";

interface OpportunityData {
  id: string;
  title: string;
  type: OpportunityType;
  description: string;
  location: string;
  duration: string;
  deadline: string;
  manuallyDisabled: boolean;
  slug?: string;
}

interface Opportunity extends OpportunityData {
  fullContent: React.ReactNode;
}

const opportunities: Opportunity[] = [
  {
    id: "erp-consultant",
    title: "ERP System Consultant",
    type: "consulting",
    description: "Design and implement a robust ERP system integrating HR, finance, and operations",
    location: "Remote/Nairobi",
    duration: "3 months",
    deadline: "February 15, 2025 (Expired)",
    manuallyDisabled: false,
    fullContent: null, // Will be defined below
  },
  {
    id: "field-officer",
    title: "Field Officer (APBET Teacher)",
    type: "employment",
    description: "Lead Education for Sustainable Development in schools within informal settlements",
    location: "Nairobi, Kenya",
    duration: "Full-time",
    deadline: "February 27, 2025",
    manuallyDisabled: false,
    fullContent: null,
  },
  {
    id: "external-audit",
    title: "External Audit Services",
    type: "consulting",
    description: "Conduct external audit of financial statements for FY 2025 in compliance with ISA and Kenyan NGO regulations",
    location: "Nairobi, Kenya",
    duration: "6 weeks",
    deadline: "February 27, 2026",
    manuallyDisabled: false,
    fullContent: null,
  },
  {
    id: "assistant-finance",
    title: "Assistant Finance Officer",
    type: "employment",
    description: "Support financial management, accounting, payroll, and donor compliance with accurate record-keeping",
    location: "Nairobi, Kenya",
    duration: "Full-time",
    deadline: "March 3, 2026",
    manuallyDisabled: false,
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

// Assistant Finance Officer Full Content
const AssistantFinanceContent = () => (
  <div className="space-y-8">
    <section className="bg-primary/5 rounded-xl p-6 border-l-4 border-primary">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground"><strong>Reports to:</strong> Finance Manager</p>
        <p className="text-sm text-muted-foreground"><strong>Location:</strong> Nairobi, Kenya</p>
        <p className="text-sm text-muted-foreground"><strong>Type:</strong> Full-time Employment</p>
        <p className="text-sm text-muted-foreground"><strong>Application Deadline:</strong> March 3, 2026</p>
      </div>
    </section>

    <section>
      <h3 className="text-xl font-heading font-bold text-foreground mb-3">Job Purpose</h3>
      <p className="text-muted-foreground leading-relaxed">
        The Assistant Finance Officer will support the Finance Officer in maintaining accurate financial records, ensuring compliance with donor requirements and statutory obligations, and providing timely financial information to support organizational decision-making. The role involves day-to-day bookkeeping, payroll support, budget monitoring, and donor financial reporting. The Assistant Finance Officer will uphold the highest standards of financial integrity and contribute to strengthening AFOSI's financial management systems.
      </p>
    </section>

    <section>
      <h3 className="text-xl font-heading font-bold text-foreground mb-4">Key Responsibilities</h3>
      <div className="space-y-4">
        {[
          {
            title: "Financial Management & Accounting",
            items: [
              "Process and record all financial transactions accurately and in a timely manner",
              "Maintain the general ledger and ensure accurate recording of expenses",
              "Reconcile bank accounts and petty cash on a monthly basis",
              "Process staff expense claims and advances in line with organizational policy",
              "Support month-end and year-end close processes",
              "Maintain proper filing of all financial documents and vouchers"
            ]
          },
          {
            title: "Budget Support & Donor Compliance",
            items: [
              "Assist in the preparation and monitoring of project and organizational budgets",
              "Track expenditure against approved budgets and flag variances to the Finance Officer",
              "Support preparation of donor financial reports in line with grant agreements",
              "Ensure all expenditures are supported by appropriate documentation and approvals",
              "Assist in audits by preparing schedules and retrieving supporting documents",
              "Ensure compliance with donor financial requirements and organizational policies"
            ]
          },
          {
            title: "Procurement Support & Payments Processing",
            items: [
              "Verify procurement documents (LPOs, invoices, delivery notes) before payment processing",
              "Prepare payment vouchers and ensure proper authorization before disbursement",
              "Process supplier payments and staff reimbursements accurately",
              "Maintain an updated creditors and debtors ledger",
              "Support the procurement committee with financial documentation as required",
              "Handle receipting and allocation"
            ]
          },
          {
            title: "Payroll & Statutory Compliance",
            items: [
              "Assist in the preparation of monthly payroll for staff and consultants",
              "Ensure timely deduction and remittance of statutory deductions (PAYE, NHIF, NSSF, NITA)",
              "File monthly and annual statutory returns with KRA and other relevant bodies",
              "Maintain up-to-date employee payroll records",
              "Respond to employee payroll queries in a timely and professional manner"
            ]
          },
          {
            title: "Reporting & Documentation",
            items: [
              "Prepare monthly, quarterly, and annual financial reports for management review",
              "Maintain comprehensive and well-organized financial records and archives",
              "Assist in the preparation of financial statements and management accounts",
              "Track and report on project expenditure for program staff"
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
      <h3 className="text-xl font-heading font-bold text-foreground mb-4">Key Performance Indicators</h3>
      <div className="grid md:grid-cols-2 gap-4">
        {[
          "Accurate and timely entries",
          "Monthly bank & mobile reconciliations",
          "Budget vs actual analysis",
          "Variance identification & reporting",
          "Timely supplier & staff payments",
          "Payroll accuracy & timeliness",
          "Statutory returns submitted on time",
          "Audit-ready documentation",
          "Cash flow monitoring reports",
          "Donor report submission deadlines met",
          "Inventory and asset accuracy",
          "Compliance with finance policies",
          "Reduced reconciliation discrepancies"
        ].map((kpi, idx) => (
          <div key={idx} className="flex items-start gap-2 bg-background rounded-lg p-3 border border-border">
            <CheckCircle2 size={16} className="text-primary mt-0.5 shrink-0" />
            <span className="text-sm text-muted-foreground">{kpi}</span>
          </div>
        ))}
      </div>
    </section>

    <section>
      <h3 className="text-xl font-heading font-bold text-foreground mb-4">Required Qualifications & Experience</h3>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-foreground mb-2">Education & Certification</h4>
            <ul className="space-y-1.5">
              <li className="text-sm text-muted-foreground flex items-start gap-2">
                <CheckCircle2 size={14} className="text-primary mt-1 shrink-0" />
                Bachelor's degree in Finance or Accounting
              </li>
              <li className="text-sm text-muted-foreground flex items-start gap-2">
                <CheckCircle2 size={14} className="text-primary mt-1 shrink-0" />
                CPA II or higher (or equivalent professional qualification)
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-2">Experience</h4>
            <ul className="space-y-1.5">
              <li className="text-sm text-muted-foreground flex items-start gap-2">
                <CheckCircle2 size={14} className="text-primary mt-1 shrink-0" />
                Minimum 2 years experience in NGO finance
              </li>
              <li className="text-sm text-muted-foreground flex items-start gap-2">
                <CheckCircle2 size={14} className="text-primary mt-1 shrink-0" />
                Financial reporting & reconciliation
              </li>
              <li className="text-sm text-muted-foreground flex items-start gap-2">
                <CheckCircle2 size={14} className="text-primary mt-1 shrink-0" />
                Budgeting and forecasting
              </li>
              <li className="text-sm text-muted-foreground flex items-start gap-2">
                <CheckCircle2 size={14} className="text-primary mt-1 shrink-0" />
                Treasury & cash management
              </li>
            </ul>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-foreground mb-2">Technical Skills</h4>
            <ul className="space-y-1.5">
              {[
                "ERP systems (SAP, QuickBooks, Sage, Dynamics 365)",
                "Tax compliance (PAYE, NHIF, NSSF, KRA)",
                "Audit support & internal controls",
                "Credit control & receivables management",
                "Inventory & asset tracking",
                "Advanced MS Excel & data analysis",
                "Strong documentation and filing skills"
              ].map((skill, i) => (
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

    <section>
      <h3 className="text-xl font-heading font-bold text-foreground mb-4">Core Competencies</h3>
      <div className="grid md:grid-cols-3 gap-3">
        {[
          "Numerical accuracy & analytical thinking",
          "Integrity and confidentiality",
          "Compliance orientation",
          "Attention to detail",
          "Time management & prioritization",
          "Problem solving & decision making",
          "Communication with non-finance staff",
          "Teamwork & collaboration",
          "Accountability and reliability",
          "Adaptability and initiative",
          "Process improvement mindset"
        ].map((comp, idx) => (
          <div key={idx} className="bg-primary/10 rounded-lg p-3 text-center">
            <p className="text-sm font-semibold text-foreground">{comp}</p>
          </div>
        ))}
      </div>
    </section>

    <section className="bg-amber-50 dark:bg-amber-950/20 rounded-xl p-6 border border-amber-200 dark:border-amber-800">
      <div className="flex items-start gap-3">
        <Shield className="text-amber-600 shrink-0 mt-1" size={24} />
        <div>
          <h4 className="font-semibold text-foreground mb-2">Safeguarding Commitment</h4>
          <p className="text-sm text-muted-foreground">
            AFOSI has zero tolerance of abuse and exploitation of vulnerable people. We will expect all our employees/volunteers to commit to protecting children, young people and vulnerable adults from harm and abide by our safeguarding policy.
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
opportunities[3].fullContent = <AssistantFinanceContent />;

const typeConfig: Record<OpportunityType, { label: string; color: string }> = {
  consulting: { label: "Consulting", color: "bg-secondary text-secondary-foreground" },
  employment: { label: "Employment", color: "bg-primary text-primary-foreground" },
  volunteering: { label: "Volunteering/Mentorship", color: "bg-green-500 text-white" },
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
  { value: "volunteering", label: "Volunteering/Mentorship" },
];

const Opportunities = () => {
  const [activeFilter, setActiveFilter] = useState<"all" | OpportunityType>("all");
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch opportunities from backend API
  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await opportunitiesAPI.getAll();
      
      // Map backend data to frontend format with fullContent
      const oppsWithContent = response.data.map((opp: any) => ({
        id: opp.id,
        title: opp.title,
        type: opp.type as OpportunityType,
        description: opp.description,
        location: opp.location,
        duration: opp.duration,
        deadline: opp.deadline,
        manuallyDisabled: opp.manually_disabled,
        slug: opp.slug,
        fullContent: getFullContent(opp.id)
      }));
      
      setOpportunities(oppsWithContent);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch opportunities');
      console.error('Error fetching opportunities:', err);
    } finally {
      setLoading(false);
    }
  };

  const getFullContent = (id: string): React.ReactNode => {
    switch(id) {
      case "erp-consultant":
        return <ERPContent />;
      case "field-officer":
        return <FieldOfficerContent />;
      case "external-audit":
        return <ExternalAuditContent />;
      case "assistant-finance":
        return <AssistantFinanceContent />;
      default:
        return null;
    }
  };

  // Filter out expired/closed opportunities automatically, then apply type filter
  const filtered = useMemo(() => {
    const active = opportunities.filter((o) => {
      const status = getOpportunityStatus(o.deadline, o.manuallyDisabled);
      return status === 'open';
    });
    return activeFilter === "all"
      ? active
      : active.filter((o) => o.type === activeFilter);
  }, [activeFilter, opportunities]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading opportunities...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <div className="container mx-auto px-4 sm:px-6 py-20 text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center max-w-2xl mx-auto">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-900 mb-2">Error Loading Opportunities</h3>
            <p className="text-red-700 mb-4">{error}</p>
            <button className="btn-fill" onClick={fetchOpportunities}>Try Again</button>
          </div>
        </div>
      </div>
    );
  }

  // Scroll Reveal Observer
  useEffect(() => {
    if (loading) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("on");
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    
    setTimeout(() => {
      document.querySelectorAll(".reveal").forEach((el) => obs.observe(el));
    }, 100);

    return () => obs.disconnect();
  }, [loading]);

  return (
    <>
      <Navbar />
      <main>
      <ScrollToTop />
      {/* PAGE HERO */}
      <div className="opp-hero">
        <div className="opp-hero-line"></div>
        <h1 className="opp-hero-title">
          <span className="t-fg">Career</span><br />
          <span className="t-or">Opportunities</span>
        </h1>
        <p className="opp-hero-sub">
          Join AFOSI in driving sustainable development and social impact across Kenya. Explore career and consulting opportunities to make a real difference.
        </p>
      </div>

      {/* WHY JOIN SECTION */}
      <section className="why-section">
        <div className="s-label reveal">Why AFOSI</div>
        <h2 className="opp-section-title reveal">
          <span className="t-fg">Why</span> <span className="t-or">Join Us?</span>
        </h2>
        <div className="why-grid">
          <div className="why-card reveal">
            <div className="why-icon"><Zap size={20} /></div>
            <div className="why-title">Innovation-Led</div>
            <p className="why-desc">Work at the intersection of technology and social impact, building digital tools that reach thousands of youth across Kenya.</p>
          </div>
          <div className="why-card reveal" style={{ transitionDelay: ".08s" }}>
            <div className="why-icon"><Users size={20} /></div>
            <div className="why-title">Community First</div>
            <p className="why-desc">Every role at AFOSI is rooted in community. Your work directly shapes the lives of young people in underserved communities.</p>
          </div>
          <div className="why-card reveal" style={{ transitionDelay: ".16s" }}>
            <div className="why-icon"><TrendingUp size={20} /></div>
            <div className="why-title">Real Impact</div>
            <p className="why-desc">We measure success by tangible change — 69K+ youth reached, 60+ schools supported, and growing every year since 2014.</p>
          </div>
        </div>
      </section>

      {/* OPENINGS SECTION */}
      <section className="opp-section">
        <div className="s-label">Current Openings</div>
        <h2 className="opp-section-title reveal">
          <span className="t-fg">Open</span> <span className="t-or">Positions</span>
        </h2>
        <p className="opp-intro reveal">If you think you might be a good fit for our team, we'd love to hear from you!</p>

        {/* Filter Tabs */}
        <div className="filter-tabs reveal">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setActiveFilter(f.value)}
              className={`filter-tab ${activeFilter === f.value ? "active" : ""}`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="empty-state reveal">
            <div className="empty-icon"><Briefcase size={56} /></div>
            <h3 className="empty-title">No Open Positions Right Now</h3>
            <p className="empty-text">
              There are no job openings at the moment. We regularly post new opportunities — check back soon or follow us on social media to be the first to know.
            </p>
          </div>
        )}

        {/* Job Cards */}
        <div className="job-list reveal">
          {filtered.map((opp) => {
            const status = getOpportunityStatus(opp.deadline, opp.manuallyDisabled);
            const canExpand = status === "open";

            return (
              <div 
                key={opp.id} 
                className="job-card"
                style={!canExpand ? { opacity: 0.6, filter: 'grayscale(100%)', pointerEvents: 'none' } : {}}
              >
                <div className="job-card-left">
                  <div className={`job-badge ${opp.type === 'consulting' ? 'consulting' : 'employment'}`}>
                    {opp.type}
                  </div>
                  <h3 className="job-title">{opp.title}</h3>
                  <div className="job-meta">
                    <span className="job-meta-item"><MapPin size={13} /> {opp.location}</span>
                    <span className="job-meta-item"><Clock size={13} /> {opp.duration}</span>
                    <span className="job-meta-item"><Calendar size={13} /> Deadline: {formatDeadline(opp.deadline)}</span>
                  </div>
                  <p className="job-desc">{opp.description}</p>
                </div>
                <div className="job-card-right">
                  <Link to={`/opportunities/${opp.slug || opp.id}`} className="btn-fill" style={!canExpand ? { pointerEvents: 'none' } : {}}>
                    {canExpand ? "View Details" : "Closed"} <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA SECTION */}
      <div className="opp-cta reveal">
        <div>
          <h2 className="opp-cta-title">Don't See the Right Fit?</h2>
          <p className="opp-cta-text">
            Send us your CV and area of interest. We're always looking for passionate individuals to join our mission of creating sustainable change across Kenya.
          </p>
        </div>
        <div className="opp-cta-btns">
          <a href="mailto:info@afosi.org?subject=General%20Application" className="btn-white">
            <Send size={16} /> Send Your CV
          </a>
          <Link to="/#projects" className="btn-ghost-white">
            <ArrowRight size={16} /> View Our Work
          </Link>
        </div>
      </div>
    </main>
    <Footer />
    </>
  );
};

export default Opportunities;
