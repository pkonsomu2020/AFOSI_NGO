import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPin, Clock, CalendarDays, ArrowLeft, Briefcase, Users, 
  ChevronDown, ChevronUp, FileText, CheckCircle2, AlertCircle,
  Building2, Shield, Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import ScrollToTop from "@/components/ScrollToTop";
import { 
  getOpportunityStatus, 
  formatDeadline, 
  getDeadlineStatus,
  getDaysUntilDeadline 
} from "@/utils/opportunityHelpers";
import { opportunitiesAPI } from "@/services/api";

type OpportunityType = "consulting" | "employment";
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

  // Memoize filtered opportunities to prevent unnecessary recalculations
  const filtered = useMemo(() => {
    return activeFilter === "all"
      ? opportunities
      : opportunities.filter((o) => o.type === activeFilter);
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
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 sm:px-6 py-20">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center max-w-2xl mx-auto">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-900 mb-2">Error Loading Opportunities</h3>
            <p className="text-red-700 mb-4">{error}</p>
            <Button onClick={fetchOpportunities}>Try Again</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {/* Hero with Background Image */}
      <section className="relative py-20 sm:py-24 md:py-32 lg:py-40 overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/HERO_4.jpg')",
          }}
        />
        
        {/* Black Overlay */}
        <div className="absolute inset-0 bg-black/70" />
        
        {/* Content */}
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-6 sm:mb-8 group">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-semibold">Back to Home</span>
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm shrink-0">
                <Briefcase className="text-white" size={24} />
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white leading-tight">
                Career Opportunities
              </h1>
            </div>
            <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-2xl leading-relaxed">
              Join AFOSI in driving sustainable development and social impact. Explore career and consulting opportunities to make a difference.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters & Content */}
      <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* Filter pills */}
        <div className="flex flex-wrap gap-2 sm:gap-3 mb-8 sm:mb-12">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setActiveFilter(f.value)}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-semibold transition-all ${
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
        <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8 bg-accent/30 rounded-lg px-3 sm:px-4 py-2 sm:py-3 w-fit">
          <Users size={16} className="text-primary sm:w-[18px] sm:h-[18px]" />
          <span className="text-xs sm:text-sm font-semibold text-foreground">
            {filtered.length} {filtered.length === 1 ? "opportunity" : "opportunities"} available
          </span>
        </div>

        {/* Cards */}
        <div className="space-y-4 sm:space-y-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((opp, i) => {
              const config = typeConfig[opp.type];
              const status = getOpportunityStatus(opp.deadline, opp.manuallyDisabled);
              const statusConf = statusConfig[status];
              const deadlineInfo = getDeadlineStatus(opp.deadline);
              const isExpanded = expandedId === opp.id;
              const canExpand = status === 'open'; // Only allow expanding if opportunity is open

              return (
                <motion.div
                  key={opp.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: Math.min(i * 0.05, 0.2) }}
                  style={{ willChange: 'transform, opacity' }}
                  className={`bg-card rounded-xl sm:rounded-2xl border border-border shadow-sm transition-all overflow-hidden relative ${
                    status === 'closed' 
                      ? 'grayscale opacity-60 cursor-not-allowed' 
                      : 'hover:shadow-xl'
                  }`}
                >
                  {/* Locked Overlay for Expired Opportunities */}
                  {status === 'closed' && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-10 flex items-center justify-center">
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ 
                          type: "spring",
                          stiffness: 200,
                          damping: 15,
                          delay: 0.2 
                        }}
                        className="bg-red-500/90 backdrop-blur-sm rounded-full p-6 sm:p-8 shadow-2xl border-4 border-red-300/50"
                      >
                        <Lock className="w-12 h-12 sm:w-16 sm:h-16 text-white" strokeWidth={2.5} />
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="absolute bottom-6 sm:bottom-8 left-0 right-0 text-center"
                      >
                        <div className="bg-red-500/95 backdrop-blur-sm text-white px-6 py-3 rounded-full inline-block shadow-xl border-2 border-red-300/50">
                          <p className="text-sm sm:text-base font-bold">
                            {opp.manuallyDisabled ? 'OPPORTUNITY CLOSED' : 'DEADLINE PASSED'}
                          </p>
                          <p className="text-xs sm:text-sm opacity-90 mt-1">
                            Applications are no longer accepted
                          </p>
                        </div>
                      </motion.div>
                    </div>
                  )}

                  <div className="p-4 sm:p-6 md:p-8">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                      <Badge className={`${config.color} text-xs font-bold uppercase tracking-wider px-2 sm:px-3 py-1`}>
                        {config.label}
                      </Badge>
                      <Badge className={`${statusConf.color} text-xs font-bold uppercase tracking-wider px-2 sm:px-3 py-1 flex items-center gap-1`}>
                        {statusConf.icon}
                        {statusConf.label}
                      </Badge>
                      {deadlineInfo.status === 'urgent' && status === 'open' && (
                        <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 text-xs font-bold px-2 sm:px-3 py-1 flex items-center gap-1 animate-pulse">
                          <Clock size={14} />
                          <span className="hidden xs:inline">{deadlineInfo.message}</span>
                          <span className="xs:hidden">{getDaysUntilDeadline(opp.deadline)}d</span>
                        </Badge>
                      )}
                      {deadlineInfo.status === 'expired' && (
                        <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-xs font-bold px-2 sm:px-3 py-1">
                          {deadlineInfo.message}
                        </Badge>
                      )}
                    </div>

                    <h3 className="text-xl sm:text-2xl md:text-3xl font-heading font-bold text-foreground mb-2 sm:mb-3 leading-tight">
                      {opp.title}
                    </h3>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4 sm:mb-6">
                      {opp.description}
                    </p>

                    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
                      <div className="flex items-center gap-2 sm:gap-3 bg-accent/20 rounded-lg p-2.5 sm:p-3">
                        <MapPin size={16} className="text-primary shrink-0 sm:w-[18px] sm:h-[18px]" />
                        <div className="min-w-0">
                          <p className="text-xs text-muted-foreground">Location</p>
                          <p className="text-xs sm:text-sm font-semibold text-foreground truncate">{opp.location}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3 bg-accent/20 rounded-lg p-2.5 sm:p-3">
                        <Clock size={16} className="text-primary shrink-0 sm:w-[18px] sm:h-[18px]" />
                        <div className="min-w-0">
                          <p className="text-xs text-muted-foreground">Duration</p>
                          <p className="text-xs sm:text-sm font-semibold text-foreground truncate">{opp.duration}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3 bg-accent/20 rounded-lg p-2.5 sm:p-3 xs:col-span-2 sm:col-span-1">
                        <CalendarDays size={16} className="text-primary shrink-0 sm:w-[18px] sm:h-[18px]" />
                        <div className="min-w-0">
                          <p className="text-xs text-muted-foreground">Deadline</p>
                          <p className="text-xs sm:text-sm font-semibold text-foreground truncate">{formatDeadline(opp.deadline)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Expandable details - Only for open opportunities */}
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                      {canExpand ? (
                        <>
                          <button
                            onClick={() => setExpandedId(isExpanded ? null : opp.id)}
                            className="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg text-sm font-semibold transition-all"
                          >
                            <span className="hidden xs:inline">{isExpanded ? "Hide Details" : "View Full Details"}</span>
                            <span className="xs:hidden">{isExpanded ? "Hide" : "Details"}</span>
                            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                          </button>
                          <Button variant="hero" size="lg" className="text-sm sm:text-base" asChild>
                            <a href={`mailto:info@afosi.org?subject=Application: ${opp.title}`}>
                              Apply Now
                            </a>
                          </Button>
                        </>
                      ) : (
                        <div className="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-muted rounded-lg text-muted-foreground">
                          <AlertCircle size={16} className="shrink-0 sm:w-[18px] sm:h-[18px]" />
                          <span className="text-xs sm:text-sm font-semibold">
                            {opp.manuallyDisabled ? 'This opportunity has been closed' : 'Application deadline has passed'}
                          </span>
                        </div>
                      )}
                    </div>

                    <AnimatePresence>
                      {isExpanded && canExpand && (
                        <motion.div
                          initial={{ opacity: 0, scaleY: 0.95 }}
                          animate={{ opacity: 1, scaleY: 1 }}
                          exit={{ opacity: 0, scaleY: 0.95 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          style={{ 
                            transformOrigin: 'top',
                            willChange: 'transform, opacity'
                          }}
                          className="overflow-hidden"
                        >
                          <div className="border-t border-border mt-4 sm:mt-6 pt-4 sm:pt-6">
                            <div className="text-sm sm:text-base">
                              {opp.fullContent}
                            </div>
                            
                            <div className="mt-6 sm:mt-8 bg-primary/5 rounded-xl p-4 sm:p-6 border border-primary/20">
                              <h4 className="text-base sm:text-lg font-heading font-bold text-foreground mb-3">How to Apply</h4>
                              <p className="text-sm sm:text-base text-muted-foreground mb-4">
                                Interested candidates meeting the above requirements should submit their application via email:
                              </p>
                              <div className="space-y-2 mb-4 text-sm">
                                <p><strong>Deadline:</strong> {formatDeadline(opp.deadline)}</p>
                                <p><strong>Days Remaining:</strong> {getDaysUntilDeadline(opp.deadline)} days</p>
                                <p><strong>Submit to:</strong> info@afosi.org</p>
                                <p className="text-muted-foreground">Include your CV, cover letter, and references</p>
                              </div>
                              <Button variant="hero" size="lg" className="w-full sm:w-auto" asChild>
                                <a href={`mailto:info@afosi.org?subject=Application: ${opp.title}`}>
                                  Submit Application
                                </a>
                              </Button>
                            </div>
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
          <div className="text-center py-12 sm:py-16">
            <Briefcase size={40} className="mx-auto text-muted-foreground/40 mb-4 sm:w-12 sm:h-12" />
            <p className="text-sm sm:text-base text-muted-foreground">No opportunities found in this category.</p>
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="bg-accent/30 border-t border-border py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-foreground mb-3 sm:mb-4 leading-tight">
              Don't see the right fit?
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
              Send us your CV and area of interest. We're always looking for passionate individuals to join our mission of creating sustainable change.
            </p>
            <Button variant="hero" size="lg" className="shadow-xl w-full sm:w-auto" asChild>
              <a href="mailto:info@afosi.org?subject=General Application">Send Your CV</a>
            </Button>
          </motion.div>
        </div>
      </section>
      <ScrollToTop />
    </div>
  );
};

export default Opportunities;
