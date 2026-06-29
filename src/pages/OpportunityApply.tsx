import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, ArrowRight, Upload, Check, AlertCircle
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { opportunitiesAPI } from "@/services/api";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.afosi.org/api';

// ─── Data ─────────────────────────────────────────────────────────────────────
const SUPPLIER_CATEGORIES = [
  "Office Stationery and Supplies",
  "Foodstuffs and Groceries",
  "Cleaning Materials and Detergents",
  "Drinking Water Supply and Dispenser Services",
  "Insurance Brokerage Services",
  "Pension Administration Services",
  "Airtime and Data Solutions",
  "Office Furniture and Interior Solutions",
  "Kitchenware and Catering Equipment",
  "Printing, Branding, and Promotional Materials",
  "Internet and Connectivity Services",
  "Transport and Vehicle Hire Services",
  "Hotel Accommodation and Conference Facilities",
  "Travel Management Services",
  "Event Management Services",
  "Professional Consultancy Services",
  "ICT Equipment, Software, and Technical Support",
  "Building Maintenance Services",
  "Fire Safety and First Aid Equipment",
  "Research, Monitoring, and Evaluation Services",
  "Media, Photography, Videography, and Communications",
  "Training and Capacity Building Services"
];

const SPECIALISATIONS = [
  "Education & Learning",
  "Research, Monitoring & Evaluation",
  "Training & Capacity Building",
  "Community Engagement & Mobilization",
  "Policy Advocacy & Governance",
  "Digital Innovation & ICT",
  "Communications & Media",
  "Gender & Social Inclusion",
  "Environmental Sustainability",
  "Financial & Procurement Services",
  "Workshop & Event Facilitation",
  "Printing, Supplies & Logistics",
  "Consultancy & Advisory Services"
];

const GEOGRAPHIC_REGIONS = [
  "National (Kenya-wide)",
  "Nairobi Region",
  "Coast Region",
  "Central Region",
  "Western Region",
  "Nyanza Region",
  "Rift Valley Region",
  "Eastern Region",
  "North Eastern Region"
];

// ─── Types ────────────────────────────────────────────────────────────────────
interface Opportunity {
  id: string;
  title: string;
  slug: string;
  deadline: string;
  apply_link: string | null;
}

// ─── File Uploader Sub-Component ──────────────────────────────────────────────
const FileUploader = ({
  state,
  onFileSelect
}: {
  state?: { url: string; name: string; loading: boolean; error: string | null };
  onFileSelect: (file: File) => void;
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
  };

  if (state?.loading) {
    return (
      <div className="flex items-center gap-2 text-xs font-semibold text-[#e86c24]">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#e86c24]" />
        <span>Uploading...</span>
      </div>
    );
  }

  if (state?.url) {
    return (
      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 px-3 py-1.5 rounded-full">
        <Check size={14} />
        <span>Uploaded</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1.5">
      <label className="px-4 py-2 bg-background border border-border hover:bg-muted/50 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm text-foreground">
        <Upload size={14} className="text-[#e86c24]" />
        <span>Select File</span>
        <input
          type="file"
          onChange={handleChange}
          accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
          className="hidden"
        />
      </label>
      {state?.error && (
        <span className="text-[10px] text-destructive font-medium">{state.error}</span>
      )}
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const OpportunityApply = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // File upload states
  const [uploads, setUploads] = useState<Record<string, { url: string; name: string; loading: boolean; error: string | null }>>({});

  // Multi-step
  const [step, setStep] = useState(1);

  // Form data
  const [formData, setFormData] = useState<Record<string, any>>({
    // Supplier
    fullName: "", applyingAs: "Individual Consultant", organizationName: "",
    supplierType: "Consultant", yearsInOperation: "1–3 years",
    categoryApplied: SUPPLIER_CATEGORIES[0],
    primaryContact: "", jobTitle: "", phoneNumber: "", altPhoneNumber: "", emailAddress: "",
    specialisations: [] as string[], geographicCoverage: [] as string[],
    legallyRegistered: "Yes", taxCompliance: "Yes", activeBankAccount: "Yes",
    bankAccountDetails: "", consentData: false, confirmTruth: false,
    howHeard: [] as string[], howHeardOther: "",
    // Job
    applicantName: "", applicantEmail: "", applicantPhone: "",
    linkedinUrl: "", coverLetterText: "", consentJob: false, confirmTruthJob: false
  });

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    opportunitiesAPI.getBySlug(slug)
      .then(res => setOpportunity(res.data))
      .catch(() => setSubmitError("Failed to load opportunity details."))
      .finally(() => setLoading(false));
  }, [slug]);

  // Detect form type from slug/title
  const isSupplierForm = !!(
    opportunity?.slug?.toLowerCase().includes("prequalification") ||
    opportunity?.slug?.toLowerCase().includes("supplier") ||
    opportunity?.title?.toLowerCase().includes("supplier") ||
    opportunity?.title?.toLowerCase().includes("prequalification")
  );

  const totalSteps = isSupplierForm ? 5 : 3;

  // ── File upload handler ──────────────────────────────────────────────────────
  const handleFileUpload = async (fieldName: string, file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      setUploads(prev => ({ ...prev, [fieldName]: { url: "", name: file.name, loading: false, error: "File exceeds 10 MB limit." } }));
      return;
    }

    setUploads(prev => ({ ...prev, [fieldName]: { url: "", name: file.name, loading: true, error: null } }));

    try {
      const fd = new FormData();
      fd.append('file', file);
      const response = await fetch(`${API_BASE_URL}/apply/upload`, { method: 'POST', body: fd });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || 'Upload failed.');
      }
      const data = await response.json();
      setUploads(prev => ({ ...prev, [fieldName]: { url: data.url, name: file.name, loading: false, error: null } }));
    } catch (err: any) {
      setUploads(prev => ({ ...prev, [fieldName]: { url: "", name: file.name, loading: false, error: err.message || "Upload failed." } }));
    }
  };

  const handleCheckbox = (field: string, value: string, checked: boolean) => {
    setFormData(prev => {
      const list = (prev[field] as string[]) || [];
      return { ...prev, [field]: checked ? [...list, value] : list.filter(v => v !== value) };
    });
  };

  const set = (key: string, value: any) => setFormData(prev => ({ ...prev, [key]: value }));

  // ── Step validation ──────────────────────────────────────────────────────────
  const validateStep = (): string | null => {
    if (isSupplierForm) {
      if (step === 1) {
        if (!formData.fullName.trim()) return "Full Name of Applicant is required.";
        if (formData.applyingAs !== "Individual Consultant" && !formData.organizationName.trim())
          return "Organization / Business Name is required.";
      }
      if (step === 2) {
        if (!formData.primaryContact.trim()) return "Primary Contact Person is required.";
        if (!formData.phoneNumber.trim()) return "Phone Number is required.";
        if (!formData.emailAddress.trim()) return "Email Address is required.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailAddress)) return "Enter a valid email address.";
      }
      if (step === 3) {
        if (!formData.specialisations.length) return "Select at least one area of specialisation.";
        if (!formData.geographicCoverage.length) return "Select at least one geographic region.";
      }
      if (step === 4) {
        if (formData.applyingAs !== "Individual Consultant" && !uploads.registrationCertificate?.url)
          return "Please upload your Certificate of Registration / Incorporation.";
        if (!uploads.taxComplianceCert?.url) return "Please upload your Tax Compliance Certificate.";
        if (!uploads.leadCv?.url) return "Please upload the CV / Resume.";
      }
      if (step === 5) {
        if (!formData.consentData) return "You must agree to the data protection consent.";
        if (!formData.confirmTruth) return "You must confirm the accuracy of your information.";
      }
    } else {
      if (step === 1) {
        if (!formData.applicantName.trim()) return "Full Name is required.";
        if (!formData.applicantEmail.trim()) return "Email Address is required.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.applicantEmail)) return "Enter a valid email address.";
        if (!formData.applicantPhone.trim()) return "Phone Number is required.";
      }
      if (step === 2) {
        if (!uploads.jobCv?.url) return "Please upload your CV / Resume.";
      }
      if (step === 3) {
        if (!formData.consentJob) return "You must agree to the data protection consent.";
        if (!formData.confirmTruthJob) return "You must confirm the accuracy of your information.";
      }
    }
    return null;
  };

  const handleNext = () => {
    const err = validateStep();
    if (err) { alert(err); return; }
    setStep(s => s + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setStep(s => s - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ── Submit handler — calls our own backend which emails via Resend ────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validateStep();
    if (err) { alert(err); return; }
    if (!opportunity) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          opportunity: { id: opportunity.id, title: opportunity.title, slug: opportunity.slug },
          fields: formData,
          uploads,
          isSupplier: isSupplierForm
        })
      });

      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || 'Submission failed.');

      setSubmitSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setSubmitError(err.message || "An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Input styles ─────────────────────────────────────────────────────────────
  const inputCls = "w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e86c24] bg-background text-foreground transition-shadow";

  // ── Loading state ─────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e86c24] mx-auto mb-4" />
          <p className="text-muted-foreground font-medium">Loading application form...</p>
        </div>
      </div>
    );
  }

  if (!opportunity) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <AlertCircle className="w-16 h-16 text-destructive mb-4" />
        <h2 className="text-2xl font-bold mb-2">Opportunity Not Found</h2>
        <p className="text-muted-foreground mb-6">This opportunity may no longer be active.</p>
        <Link to="/opportunities" className="inline-flex items-center gap-2 text-[#e86c24] font-semibold">
          <ArrowLeft size={16} /> Back to Opportunities
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F5EFE6] dark:bg-[#0C0A08] font-montserrat transition-colors">
      <ScrollToTop />
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 py-28 md:py-32">

        <Link
          to={`/opportunities/${opportunity.slug}`}
          className="inline-flex items-center gap-2 text-foreground/70 hover:text-[#e86c24] transition-colors mb-8 font-semibold text-sm"
        >
          <ArrowLeft size={16} /> Back to Opportunity
        </Link>

        {/* ── Success screen ── */}
        {submitSuccess ? (
          <div className="bg-card rounded-2xl border border-border p-10 shadow-2xl text-center">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/30 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600">
              <Check className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-black text-foreground mb-3">Application Submitted!</h2>
            <p className="text-muted-foreground max-w-lg mx-auto mb-2 leading-relaxed">
              Your application for <strong>{opportunity.title}</strong> has been received by our HR team.
            </p>
            <p className="text-sm text-muted-foreground mb-8">
              A confirmation email has been sent to your inbox. Our team will reach out within <strong>7–14 business days</strong>.
            </p>
            <button
              onClick={() => navigate("/opportunities")}
              className="px-8 py-3 bg-[#e86c24] text-white rounded-full font-bold shadow-md hover:bg-orange-600 transition-colors"
            >
              Browse More Opportunities
            </button>
          </div>
        ) : (

          <div className="bg-card rounded-2xl border border-border p-6 md:p-10 shadow-xl">

            {/* Header */}
            <div className="border-b border-border pb-6 mb-6">
              <span className="text-xs uppercase tracking-widest text-[#e86c24] font-bold">Online Application Form</span>
              <h2 className="text-2xl md:text-3xl font-black text-foreground mt-2 mb-1">{opportunity.title}</h2>
              <p className="text-muted-foreground text-sm">
                Complete all fields below. Your submission goes directly to our HR team at <strong>careers@afosi.org</strong>.
              </p>
            </div>

            {/* Step progress bar */}
            <div className="flex items-center gap-4 mb-8">
              <span className="text-xs font-bold text-muted-foreground whitespace-nowrap">Step {step} of {totalSteps}</span>
              <div className="flex gap-1.5 flex-1">
                {[...Array(totalSteps)].map((_, i) => (
                  <div key={i} className={`h-1.5 rounded-full flex-1 transition-all duration-300 ${i + 1 <= step ? 'bg-[#e86c24]' : 'bg-muted'}`} />
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* ================================================================== */}
              {/* SUPPLIER PREQUALIFICATION FORM                                     */}
              {/* ================================================================== */}
              {isSupplierForm && (
                <>
                  {step === 1 && (
                    <div className="space-y-5">
                      <h3 className="text-base font-bold border-b border-border pb-2">Section 1 — Applicant Identity</h3>
                      <div>
                        <label className="block text-sm font-semibold mb-1">Full Name of Applicant <span className="text-red-500">*</span></label>
                        <input type="text" value={formData.fullName} onChange={e => set('fullName', e.target.value)} className={inputCls} placeholder="e.g. John Doe / Acme Services Ltd" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-1">Applying as <span className="text-red-500">*</span></label>
                        <select value={formData.applyingAs} onChange={e => set('applyingAs', e.target.value)} className={inputCls}>
                          <option>Individual Consultant</option>
                          <option>Registered Organization / Company</option>
                          <option>Both (Individual within an Organization)</option>
                        </select>
                      </div>
                      {formData.applyingAs !== "Individual Consultant" && (
                        <div>
                          <label className="block text-sm font-semibold mb-1">Name of Organization / Business <span className="text-red-500">*</span></label>
                          <input type="text" value={formData.organizationName} onChange={e => set('organizationName', e.target.value)} className={inputCls} placeholder="Legal business name" />
                        </div>
                      )}
                      <div>
                        <label className="block text-sm font-semibold mb-1">Type of Supplier / Service Provider <span className="text-red-500">*</span></label>
                        <select value={formData.supplierType} onChange={e => set('supplierType', e.target.value)} className={inputCls}>
                          {["Qualified Supplier","Service Provider","Consultant","Trainer / Facilitator","Researcher / Evaluator","OTHER"].map(o => <option key={o}>{o}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-1">Years in Operation / Practice <span className="text-red-500">*</span></label>
                        <select value={formData.yearsInOperation} onChange={e => set('yearsInOperation', e.target.value)} className={inputCls}>
                          {["Less than 1 year","1–3 years","4–6 years","7–10 years","Over 10 years"].map(o => <option key={o}>{o}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-1">Category you are applying for <span className="text-red-500">*</span></label>
                        <select value={formData.categoryApplied} onChange={e => set('categoryApplied', e.target.value)} className={inputCls}>
                          {SUPPLIER_CATEGORIES.map((c, i) => <option key={i} value={c}>{i + 1}. {c}</option>)}
                        </select>
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-5">
                      <h3 className="text-base font-bold border-b border-border pb-2">Section 2 — Contact Information</h3>
                      <div>
                        <label className="block text-sm font-semibold mb-1">Primary Contact Person <span className="text-red-500">*</span></label>
                        <input type="text" value={formData.primaryContact} onChange={e => set('primaryContact', e.target.value)} className={inputCls} placeholder="e.g. Jane Smith" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-1">Job Title / Designation</label>
                        <input type="text" value={formData.jobTitle} onChange={e => set('jobTitle', e.target.value)} className={inputCls} placeholder="e.g. Director / Managing Partner" />
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold mb-1">Phone Number <span className="text-red-500">*</span></label>
                          <input type="tel" value={formData.phoneNumber} onChange={e => set('phoneNumber', e.target.value)} className={inputCls} placeholder="+254 700 000 000" />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold mb-1">Alternative Phone</label>
                          <input type="tel" value={formData.altPhoneNumber} onChange={e => set('altPhoneNumber', e.target.value)} className={inputCls} placeholder="Optional" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-1">Email Address <span className="text-red-500">*</span></label>
                        <input type="email" value={formData.emailAddress} onChange={e => set('emailAddress', e.target.value)} className={inputCls} placeholder="contact@business.com" />
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-5">
                      <h3 className="text-base font-bold border-b border-border pb-2">Section 3 — Areas of Specialisation</h3>
                      <div>
                        <label className="block text-sm font-semibold mb-2">Primary Area of Specialisation <span className="text-red-500">*</span></label>
                        <div className="grid sm:grid-cols-2 gap-2 bg-muted/20 p-4 rounded-xl border border-border">
                          {SPECIALISATIONS.map(s => (
                            <label key={s} className="flex items-start gap-2 text-sm cursor-pointer p-1">
                              <input type="checkbox" checked={formData.specialisations.includes(s)} onChange={e => handleCheckbox('specialisations', s, e.target.checked)} className="mt-1 accent-[#e86c24]" />
                              <span>{s}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">Geographic Coverage <span className="text-red-500">*</span></label>
                        <div className="grid sm:grid-cols-3 gap-2 bg-muted/20 p-4 rounded-xl border border-border">
                          {GEOGRAPHIC_REGIONS.map(r => (
                            <label key={r} className="flex items-start gap-2 text-sm cursor-pointer p-1">
                              <input type="checkbox" checked={formData.geographicCoverage.includes(r)} onChange={e => handleCheckbox('geographicCoverage', r, e.target.checked)} className="mt-1 accent-[#e86c24]" />
                              <span>{r}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 4 && (
                    <div className="space-y-5">
                      <h3 className="text-base font-bold border-b border-border pb-2">Section 4 — Compliance & Uploads</h3>
                      <div className="grid sm:grid-cols-3 gap-4">
                        {[
                          { label: "Legally Registered?", key: "legallyRegistered", opts: ["Yes","No"] },
                          { label: "Valid Tax Compliance?", key: "taxCompliance", opts: ["Yes","No","In Progress"] },
                          { label: "Active Bank Account?", key: "activeBankAccount", opts: ["Yes","No"] }
                        ].map(f => (
                          <div key={f.key}>
                            <label className="block text-sm font-semibold mb-1">{f.label}</label>
                            <select value={formData[f.key]} onChange={e => set(f.key, e.target.value)} className={inputCls}>
                              {f.opts.map(o => <option key={o}>{o}</option>)}
                            </select>
                          </div>
                        ))}
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-1">Bank Account Details <span className="text-red-500">*</span></label>
                        <input type="text" value={formData.bankAccountDetails} onChange={e => set('bankAccountDetails', e.target.value)} className={inputCls} placeholder="Bank Name, Account Name (must match registration)" />
                      </div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground pt-2">Document Uploads — PDF, JPG, PNG (max 10 MB each)</p>
                      {[
                        formData.applyingAs !== "Individual Consultant" && { key: "registrationCertificate", label: "Certificate of Registration / Incorporation", required: true },
                        { key: "taxComplianceCert", label: "Tax Compliance Certificate", required: true },
                        { key: "leadCv", label: "CV / Resume of Lead Consultant or Key Contact", required: true },
                        { key: "licenses", label: "Professional Certificates or Licenses", required: false }
                      ].filter(Boolean).map((f: any) => (
                        <div key={f.key} className="p-4 bg-muted/20 border border-dashed border-border rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold">{f.label} {f.required && <span className="text-red-500">*</span>}</p>
                            {uploads[f.key]?.name && <p className="text-xs text-muted-foreground font-mono mt-0.5">{uploads[f.key].name}</p>}
                          </div>
                          <FileUploader state={uploads[f.key]} onFileSelect={file => handleFileUpload(f.key, file)} />
                        </div>
                      ))}
                    </div>
                  )}

                  {step === 5 && (
                    <div className="space-y-5">
                      <h3 className="text-base font-bold border-b border-border pb-2">Section 5 — Consent & Declaration</h3>
                      <label className="flex items-start gap-3 text-sm cursor-pointer p-4 bg-muted/20 border border-border rounded-xl">
                        <input type="checkbox" checked={formData.consentData} onChange={e => set('consentData', e.target.checked)} className="mt-1 accent-[#e86c24]" />
                        <span>I consent to AFOSI collecting, storing, and using my submitted information for prequalification, program engagement, and procurement purposes, in line with applicable data protection laws. <span className="text-red-500">*</span></span>
                      </label>
                      <label className="flex items-start gap-3 text-sm cursor-pointer p-4 bg-muted/20 border border-border rounded-xl">
                        <input type="checkbox" checked={formData.confirmTruth} onChange={e => set('confirmTruth', e.target.checked)} className="mt-1 accent-[#e86c24]" />
                        <span>I confirm that all information and documents submitted in this form are accurate, complete, and truthful. I understand that providing false information may lead to immediate disqualification. <span className="text-red-500">*</span></span>
                      </label>
                      <div className="border-t border-border pt-4">
                        <label className="block text-sm font-semibold mb-2">How did you hear about this opportunity?</label>
                        <div className="grid sm:grid-cols-2 gap-2">
                          {["LinkedIn","AFOSI Network","AFOSI Website","Facebook"].map(s => (
                            <label key={s} className="flex items-center gap-2 text-sm cursor-pointer">
                              <input type="checkbox" checked={formData.howHeard.includes(s)} onChange={e => handleCheckbox('howHeard', s, e.target.checked)} className="accent-[#e86c24]" />
                              <span>{s}</span>
                            </label>
                          ))}
                        </div>
                        <input type="text" value={formData.howHeardOther} onChange={e => set('howHeardOther', e.target.value)} className={`${inputCls} mt-3`} placeholder="Other (please specify)" />
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* ================================================================== */}
              {/* STANDARD JOB APPLICATION FORM                                      */}
              {/* ================================================================== */}
              {!isSupplierForm && (
                <>
                  {step === 1 && (
                    <div className="space-y-5">
                      <h3 className="text-base font-bold border-b border-border pb-2">Section 1 — Personal Details</h3>
                      <div>
                        <label className="block text-sm font-semibold mb-1">Full Name <span className="text-red-500">*</span></label>
                        <input type="text" value={formData.applicantName} onChange={e => set('applicantName', e.target.value)} className={inputCls} placeholder="e.g. John Doe" />
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold mb-1">Email Address <span className="text-red-500">*</span></label>
                          <input type="email" value={formData.applicantEmail} onChange={e => set('applicantEmail', e.target.value)} className={inputCls} placeholder="john@example.com" />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold mb-1">Phone Number <span className="text-red-500">*</span></label>
                          <input type="tel" value={formData.applicantPhone} onChange={e => set('applicantPhone', e.target.value)} className={inputCls} placeholder="+254 700 000 000" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-1">LinkedIn Profile</label>
                        <input type="url" value={formData.linkedinUrl} onChange={e => set('linkedinUrl', e.target.value)} className={inputCls} placeholder="https://linkedin.com/in/username" />
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-5">
                      <h3 className="text-base font-bold border-b border-border pb-2">Section 2 — CV & Documents</h3>
                      <p className="text-xs text-muted-foreground">Accepted: PDF, DOC, DOCX, JPG, PNG — max 10 MB each</p>
                      {[
                        { key: "jobCv", label: "CV / Resume", required: true },
                        { key: "jobCoverLetter", label: "Cover Letter Document", required: false },
                        { key: "jobCertificates", label: "Certificates / Academic Transcripts", required: false }
                      ].map(f => (
                        <div key={f.key} className="p-4 bg-muted/20 border border-dashed border-border rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold">{f.label} {f.required && <span className="text-red-500">*</span>}</p>
                            {uploads[f.key]?.name && <p className="text-xs text-muted-foreground font-mono mt-0.5">{uploads[f.key].name}</p>}
                          </div>
                          <FileUploader state={uploads[f.key]} onFileSelect={file => handleFileUpload(f.key, file)} />
                        </div>
                      ))}
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-5">
                      <h3 className="text-base font-bold border-b border-border pb-2">Section 3 — Cover Letter & Review</h3>
                      <div>
                        <label className="block text-sm font-semibold mb-1">Cover Letter / Brief Pitch</label>
                        <textarea value={formData.coverLetterText} onChange={e => set('coverLetterText', e.target.value)} className={`${inputCls} text-sm`} rows={6} placeholder="Briefly pitch yourself and why you're the best fit for this role..." />
                      </div>
                      <label className="flex items-start gap-3 text-sm cursor-pointer p-4 bg-muted/20 border border-border rounded-xl">
                        <input type="checkbox" checked={formData.consentJob} onChange={e => set('consentJob', e.target.checked)} className="mt-1 accent-[#e86c24]" />
                        <span>I consent to AFOSI collecting, storing, and using my submitted information for recruitment purposes, in line with applicable data protection laws. <span className="text-red-500">*</span></span>
                      </label>
                      <label className="flex items-start gap-3 text-sm cursor-pointer p-4 bg-muted/20 border border-border rounded-xl">
                        <input type="checkbox" checked={formData.confirmTruthJob} onChange={e => set('confirmTruthJob', e.target.checked)} className="mt-1 accent-[#e86c24]" />
                        <span>I confirm that all information and documents in this application are accurate and truthful. <span className="text-red-500">*</span></span>
                      </label>
                    </div>
                  )}
                </>
              )}

              {/* Error */}
              {submitError && (
                <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-3 text-sm text-red-700 dark:text-red-300">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              {/* Nav buttons */}
              <div className="flex justify-between items-center border-t border-border pt-6 mt-4">
                {step > 1 ? (
                  <button type="button" onClick={handleBack} className="px-6 py-2.5 border border-border text-foreground hover:bg-muted/50 rounded-full font-semibold transition-all flex items-center gap-2">
                    <ArrowLeft size={16} /> Back
                  </button>
                ) : <div />}

                {step < totalSteps ? (
                  <button type="button" onClick={handleNext} className="px-6 py-2.5 bg-[#e86c24] text-white hover:bg-orange-600 rounded-full font-bold transition-all flex items-center gap-2 shadow">
                    Continue <ArrowRight size={16} />
                  </button>
                ) : (
                  <button type="submit" disabled={submitting} className="px-8 py-3 bg-[#e86c24] text-white hover:bg-orange-600 disabled:opacity-50 rounded-full font-bold transition-all flex items-center gap-2 shadow-md">
                    {submitting ? (
                      <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> Submitting...</>
                    ) : "Submit Application"}
                  </button>
                )}
              </div>
            </form>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
};

export default OpportunityApply;
