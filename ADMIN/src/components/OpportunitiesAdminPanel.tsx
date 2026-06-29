import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Plus, Edit2, Trash2, Save, X,
  Calendar, MapPin, Clock, AlertCircle, CheckCircle2,
  Mail, Link as LinkIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { opportunitiesAPI } from "@/services/api";
import { 
  isDeadlinePassed, 
  formatDeadline, 
  getOpportunityStatus,
  getDaysUntilDeadline 
} from "@/utils/opportunityHelpers";

interface OpportunityData {
  id: string;
  title: string;
  type: "consulting" | "employment" | "volunteering";
  description: string;
  location: string;
  duration: string;
  deadline: string;
  manually_disabled: boolean;
  slug?: string;
  full_description?: string;
  apply_link?: string;
}

const OpportunitiesAdminPanel = () => {
  const [opportunities, setOpportunities] = useState<OpportunityData[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [formData, setFormData] = useState<Partial<OpportunityData>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await opportunitiesAPI.getAll();
      setOpportunities(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch opportunities');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      const response = await opportunitiesAPI.toggleStatus(id);
      setOpportunities(opportunities.map(opp => 
        opp.id === id ? response.data : opp
      ));
    } catch (err: any) {
      alert('Failed to toggle status: ' + err.message);
    }
  };

  const handleEdit = (opp: OpportunityData) => {
    setEditingId(opp.id);
    setFormData({ ...opp });
  };

  const handleSave = async () => {
    try {
      const payload = {
        title: formData.title || '',
        type: (formData.type || 'employment') as "consulting" | "employment" | "volunteering",
        description: formData.description || '',
        location: formData.location || '',
        duration: formData.duration || '',
        deadline: formData.deadline || '',
        slug: formData.slug || '',
        full_description: formData.full_description || '',
        apply_link: formData.apply_link || '',
      };

      if (!payload.title || !payload.description || !payload.location || !payload.duration || !payload.deadline) {
        alert('Please fill in all required fields: Title, Description, Location, Duration, and Deadline.');
        return;
      }

      if (editingId) {
        const response = await opportunitiesAPI.update(editingId, payload);
        setOpportunities(opportunities.map(opp =>
          opp.id === editingId ? response.data : opp
        ));
        setEditingId(null);
      } else if (isAddingNew) {
        const response = await opportunitiesAPI.create(payload);
        setOpportunities([response.data, ...opportunities]);
        setIsAddingNew(false);
      }
      setFormData({});
    } catch (err: any) {
      alert('Failed to save: ' + err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this opportunity?')) {
      try {
        await opportunitiesAPI.delete(id);
        setOpportunities(opportunities.filter(opp => opp.id !== id));
      } catch (err: any) {
        alert('Failed to delete: ' + err.message);
      }
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsAddingNew(false);
    setFormData({});
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading opportunities...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-red-900 mb-2">Error Loading Opportunities</h3>
        <p className="text-red-700 mb-4">{error}</p>
        <Button onClick={fetchOpportunities}>Try Again</Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-heading font-bold text-foreground">
          All Opportunities ({opportunities.length})
        </h2>
        <Button 
          onClick={() => { setIsAddingNew(true); setFormData({ type: 'employment' }); }}
          className="flex items-center gap-2"
          disabled={isAddingNew || editingId !== null}
        >
          <Plus size={18} />
          Add New Opportunity
        </Button>
      </div>

      {isAddingNew && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-xl border-2 border-primary p-6 mb-6"
        >
          <h3 className="text-xl font-heading font-bold mb-4">Add New Opportunity</h3>
          <OpportunityForm 
            data={formData} 
            onChange={setFormData}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </motion.div>
      )}

      <div className="space-y-4">
        {opportunities.map((opp) => {
          const status = getOpportunityStatus(opp.deadline, opp.manually_disabled);
          const isExpired = isDeadlinePassed(opp.deadline);
          const daysLeft = getDaysUntilDeadline(opp.deadline);
          const isEditing = editingId === opp.id;

          return (
            <motion.div
              key={opp.id}
              layout
              className="bg-card rounded-xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              {isEditing ? (
                <div>
                  <h3 className="text-xl font-heading font-bold mb-4">Editing: {opp.title}</h3>
                  <OpportunityForm 
                    data={formData} 
                    onChange={setFormData}
                    onSave={handleSave}
                    onCancel={handleCancel}
                  />
                </div>
              ) : (
                <div>
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <Badge className={
                          opp.type === 'consulting' ? 'bg-secondary' : 
                          opp.type === 'volunteering' ? 'bg-green-500 text-white' : 
                          'bg-primary'
                        }>
                          {opp.type}
                        </Badge>
                        <Badge className={status === 'open' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                          {status === 'open' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                          <span className="ml-1">{status}</span>
                        </Badge>
                        {isExpired && (
                          <Badge className="bg-amber-100 text-amber-700">
                            <AlertCircle size={14} />
                            <span className="ml-1">Deadline Passed</span>
                          </Badge>
                        )}
                        {!isExpired && daysLeft <= 7 && (
                          <Badge className="bg-orange-100 text-orange-700">
                            <Clock size={14} />
                            <span className="ml-1">{daysLeft} days left</span>
                          </Badge>
                        )}
                      </div>
                      <h3 className="text-xl font-heading font-bold text-foreground mb-2">
                        {opp.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-3">{opp.description}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin size={14} className="text-primary" />
                          {opp.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={14} className="text-primary" />
                          {opp.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar size={14} className="text-primary" />
                          {formatDeadline(opp.deadline)}
                        </span>
                      </div>
                      {opp.full_description && (
                        <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                          <CheckCircle2 size={12} /> Full description added
                        </p>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(opp)}
                        disabled={isAddingNew || editingId !== null}
                      >
                        <Edit2 size={16} />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleStatus(opp.id)}
                        className={opp.manually_disabled ? 'border-green-500 text-green-600' : 'border-red-500 text-red-600'}
                      >
                        {opp.manually_disabled ? 'Enable' : 'Disable'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(opp.id)}
                        className="border-red-500 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

// ─── Simple Form Component ────────────────────────────────────────────────────

const CAREERS_EMAIL = 'mailto:careers@afosi.org';

const OpportunityForm = ({
  data,
  onChange,
  onSave,
  onCancel
}: {
  data: Partial<OpportunityData>;
  onChange: (data: Partial<OpportunityData>) => void;
  onSave: () => void;
  onCancel: () => void;
}) => {
  const generateSlug = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();

  const handleTitleChange = (title: string) => {
    const updates: Partial<OpportunityData> = { ...data, title };
    if (!data.slug || data.slug === generateSlug(data.title || '')) {
      updates.slug = generateSlug(title);
    }
    onChange(updates);
  };

  // Determine current application method from the stored apply_link value
  const isEmailMode = !data.apply_link || data.apply_link === CAREERS_EMAIL || data.apply_link.startsWith('mailto:');
  const formUrl = isEmailMode ? '' : (data.apply_link || '');

  const handleMethodToggle = (mode: 'email' | 'form') => {
    if (mode === 'email') {
      onChange({ ...data, apply_link: CAREERS_EMAIL });
    } else {
      onChange({ ...data, apply_link: '' }); // clear so admin can enter a URL
    }
  };

  const inputClass = "w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground";

  return (
    <div className="space-y-5">

      {/* Title + Type */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-1">Title <span className="text-red-500">*</span></label>
          <input
            type="text"
            value={data.title || ''}
            onChange={(e) => handleTitleChange(e.target.value)}
            className={inputClass}
            placeholder="e.g. District Coordinator — CGP Project"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Type <span className="text-red-500">*</span></label>
          <select
            value={data.type || 'employment'}
            onChange={(e) => onChange({ ...data, type: e.target.value as "consulting" | "employment" | "volunteering" })}
            className={inputClass}
          >
            <option value="employment">Employment</option>
            <option value="consulting">Consulting</option>
            <option value="volunteering">Volunteering/Mentorship</option>
          </select>
        </div>
      </div>

      {/* Short Description */}
      <div>
        <label className="block text-sm font-semibold mb-1">
          Short Description <span className="text-red-500">*</span>
          <span className="text-muted-foreground font-normal ml-1 text-xs">(shown on listing card)</span>
        </label>
        <textarea
          value={data.description || ''}
          onChange={(e) => onChange({ ...data, description: e.target.value })}
          className={inputClass}
          rows={2}
          placeholder="One-line summary of the role"
        />
      </div>

      {/* Location, Duration, Deadline */}
      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-1">Location <span className="text-red-500">*</span></label>
          <input
            type="text"
            value={data.location || ''}
            onChange={(e) => onChange({ ...data, location: e.target.value })}
            className={inputClass}
            placeholder="Nairobi, Kenya"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Duration <span className="text-red-500">*</span></label>
          <input
            type="text"
            value={data.duration || ''}
            onChange={(e) => onChange({ ...data, duration: e.target.value })}
            className={inputClass}
            placeholder="Full-time / 3 months"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Deadline <span className="text-red-500">*</span></label>
          <input
            type="date"
            value={data.deadline || ''}
            onChange={(e) => onChange({ ...data, deadline: e.target.value })}
            className={inputClass}
          />
        </div>
      </div>

      {/* URL Slug */}
      <div>
        <label className="block text-sm font-semibold mb-1">
          URL Slug
          <span className="text-muted-foreground font-normal ml-1 text-xs">(auto-generated)</span>
        </label>
        <div className="flex items-center">
          <span className="px-3 py-2 bg-muted border border-r-0 border-border rounded-l-lg text-xs text-muted-foreground whitespace-nowrap">
            /opportunities/
          </span>
          <input
            type="text"
            value={data.slug || ''}
            onChange={(e) => onChange({ ...data, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
            className="flex-1 px-4 py-2 border border-border rounded-r-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-sm"
            placeholder="my-opportunity-slug"
          />
        </div>
      </div>

      {/* Application Method Toggle */}
      <div>
        <label className="block text-sm font-semibold mb-2">
          Application Method
          <span className="text-muted-foreground font-normal ml-1 text-xs">(choose how applicants apply)</span>
        </label>

        {/* Toggle buttons */}
        <div className="flex gap-3 mb-3">
          <button
            type="button"
            onClick={() => handleMethodToggle('email')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg border-2 text-sm font-semibold transition-all ${
              isEmailMode
                ? 'border-primary bg-primary text-white shadow-md'
                : 'border-border bg-background text-muted-foreground hover:border-primary/50'
            }`}
          >
            <Mail size={15} />
            Email (careers@afosi.org)
          </button>
          <button
            type="button"
            onClick={() => handleMethodToggle('form')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg border-2 text-sm font-semibold transition-all ${
              !isEmailMode
                ? 'border-primary bg-primary text-white shadow-md'
                : 'border-border bg-background text-muted-foreground hover:border-primary/50'
            }`}
          >
            <LinkIcon size={15} />
            Online Form (URL)
          </button>
        </div>

        {/* Conditional content */}
        {isEmailMode ? (
          <div className="flex items-start gap-3 p-4 rounded-lg bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800">
            <Mail size={18} className="text-orange-600 mt-0.5 shrink-0" />
            <div className="text-sm">
              <p className="font-semibold text-orange-800 dark:text-orange-200">Email Application Active</p>
              <p className="text-orange-700 dark:text-orange-300 mt-0.5">
                The <strong>Apply Now</strong> button will open the applicant's email app addressed to{' '}
                <strong>careers@afosi.org</strong>. The detail page will instruct applicants to send their
                application to this email.
              </p>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 mb-3">
              <LinkIcon size={18} className="text-blue-600 mt-0.5 shrink-0" />
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Online Form Active</strong> — paste your Google Forms / Microsoft Forms / Typeform URL below.
                The <strong>Apply Now</strong> button will open this link in a new tab.
              </p>
            </div>
            <input
              type="url"
              value={formUrl}
              onChange={(e) => onChange({ ...data, apply_link: e.target.value })}
              className={inputClass}
              placeholder="https://forms.google.com/..."
            />
          </div>
        )}
      </div>

      {/* Full Description */}
      <div>
        <label className="block text-sm font-semibold mb-1">
          Full Description
          <span className="text-muted-foreground font-normal ml-1 text-xs">(shown on the detail page)</span>
        </label>
        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-2 text-xs text-blue-800 dark:text-blue-200">
          <strong>Tip:</strong> Use plain text. Start each section with a heading like <code>OVERVIEW</code>, <code>RESPONSIBILITIES</code>, <code>REQUIREMENTS</code>, <code>BENEFITS</code>, <code>HOW TO APPLY</code> — each on its own line. Bullet points: start lines with <code>-</code> or <code>•</code>.
        </div>
        <textarea
          value={data.full_description || ''}
          onChange={(e) => onChange({ ...data, full_description: e.target.value })}
          className={`${inputClass} font-mono text-sm`}
          rows={18}
          placeholder={`OVERVIEW
Brief introduction to this opportunity and what makes it unique.

ABOUT THE ROLE
Describe the role, its purpose, and how it fits into the organization.

RESPONSIBILITIES
- Lead project planning and execution
- Manage team and stakeholder relationships
- Develop and implement strategies
- Monitor progress and report outcomes

REQUIREMENTS
- Bachelor's degree or equivalent experience
- 3+ years relevant work experience
- Strong leadership and communication skills

BENEFITS
- Competitive salary and benefits package
- Professional development opportunities
- Meaningful work with social impact

HOW TO APPLY
Submit your application through our online form. Include your CV and cover letter.`}
        />
      </div>

      <div className="flex gap-3 pt-2">
        <Button onClick={onSave} className="flex items-center gap-2">
          <Save size={16} />
          Save Opportunity
        </Button>
        <Button onClick={onCancel} variant="outline" className="flex items-center gap-2">
          <X size={16} />
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default OpportunitiesAdminPanel;
