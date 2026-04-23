import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Plus, Edit2, Trash2, Save, X, 
  Calendar, MapPin, Clock, AlertCircle, CheckCircle2 
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
  // New structured fields
  overview?: string;
  about_role?: string;
  responsibilities?: string;
  requirements?: string;
  benefits?: string;
  how_to_apply?: string;
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
      console.error('Error fetching opportunities:', err);
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
    setFormData(opp);
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        // CRITICAL FIX: Include all structured fields when updating existing opportunities
        const updateData = {
          title: formData.title || '',
          type: formData.type || 'employment',
          description: formData.description || '',
          location: formData.location || '',
          duration: formData.duration || '',
          deadline: formData.deadline || '',
          slug: formData.slug || '',
          full_description: formData.full_description || '',
          apply_link: formData.apply_link || '',
          // Include new structured fields
          overview: formData.overview || '',
          about_role: formData.about_role || '',
          responsibilities: formData.responsibilities || '',
          requirements: formData.requirements || '',
          benefits: formData.benefits || '',
          how_to_apply: formData.how_to_apply || '',
        };
        const response = await opportunitiesAPI.update(editingId, updateData);
        setOpportunities(opportunities.map(opp => 
          opp.id === editingId ? response.data : opp
        ));
        setEditingId(null);
      } else if (isAddingNew && formData.title) {
        const response = await opportunitiesAPI.create({
          title: formData.title || '',
          type: formData.type || 'employment',
          description: formData.description || '',
          location: formData.location || '',
          duration: formData.duration || '',
          deadline: formData.deadline || '',
          slug: formData.slug || '',
          full_description: formData.full_description || '',
          apply_link: formData.apply_link || '',
          // Include new structured fields
          overview: formData.overview || '',
          about_role: formData.about_role || '',
          responsibilities: formData.responsibilities || '',
          requirements: formData.requirements || '',
          benefits: formData.benefits || '',
          how_to_apply: formData.how_to_apply || '',
        });
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
          onClick={() => setIsAddingNew(true)}
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
                <OpportunityForm 
                  data={formData} 
                  onChange={setFormData}
                  onSave={handleSave}
                  onCancel={handleCancel}
                />
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
  // Auto-generate slug from title
  const generateSlug = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();

  const handleTitleChange = (title: string) => {
    const updates: Partial<OpportunityData> = { ...data, title };
    // Only auto-fill slug if it hasn't been manually edited
    if (!data.slug || data.slug === generateSlug(data.title || '')) {
      updates.slug = generateSlug(title);
    }
    onChange(updates);
  };

  return (
    <div className="space-y-5">
      {/* Row 1: Title + Type */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-2">Title *</label>
          <input
            type="text"
            value={data.title || ''}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary bg-background"
            placeholder="e.g. District Coordinator — CGP Project"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">Type *</label>
          <select
            value={data.type || 'employment'}
            onChange={(e) => onChange({ ...data, type: e.target.value as "consulting" | "employment" | "volunteering" })}
            className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary bg-background"
          >
            <option value="employment">Employment</option>
            <option value="consulting">Consulting</option>
            <option value="volunteering">Volunteering/Mentorship</option>
          </select>
        </div>
      </div>

      {/* Row 2: Short Description */}
      <div>
        <label className="block text-sm font-semibold mb-2">Short Description * <span className="text-muted-foreground font-normal">(shown on listing card)</span></label>
        <textarea
          value={data.description || ''}
          onChange={(e) => onChange({ ...data, description: e.target.value })}
          className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary bg-background"
          rows={2}
          placeholder="Brief one-line summary of the role"
        />
      </div>

      {/* Row 3: Location, Duration, Deadline */}
      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-2">Location *</label>
          <input
            type="text"
            value={data.location || ''}
            onChange={(e) => onChange({ ...data, location: e.target.value })}
            className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary bg-background"
            placeholder="Nairobi, Kenya"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">Duration *</label>
          <input
            type="text"
            value={data.duration || ''}
            onChange={(e) => onChange({ ...data, duration: e.target.value })}
            className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary bg-background"
            placeholder="Full-time / 3 months"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">Deadline *</label>
          <input
            type="date"
            value={data.deadline || ''}
            onChange={(e) => onChange({ ...data, deadline: e.target.value })}
            className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary bg-background"
          />
        </div>
      </div>

      {/* Row 4: Slug + Apply Link */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-2">
            URL Slug
            <span className="text-muted-foreground font-normal ml-1">(auto-generated from title)</span>
          </label>
          <div className="flex items-center gap-0">
            <span className="px-3 py-2 bg-muted border border-r-0 border-border rounded-l-lg text-xs text-muted-foreground whitespace-nowrap">
              /opportunities/
            </span>
            <input
              type="text"
              value={data.slug || ''}
              onChange={(e) => onChange({ ...data, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
              className="flex-1 px-4 py-2 border border-border rounded-r-lg focus:ring-2 focus:ring-primary bg-background text-sm"
              placeholder="district-coordinator-cgp-project"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Full URL: afosi.org/opportunities/{data.slug || 'your-slug'}
          </p>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">
            Apply Link
            <span className="text-muted-foreground font-normal ml-1">(Google Forms, Microsoft Forms, or external URL)</span>
          </label>
          <input
            type="text"
            value={data.apply_link || ''}
            onChange={(e) => onChange({ ...data, apply_link: e.target.value })}
            className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary bg-background"
            placeholder="https://forms.google.com/... or https://forms.office.com/..."
          />
          <p className="text-xs text-muted-foreground mt-1">
            Leave blank to hide the Apply button. Use Google Forms, Microsoft Forms, or other external application links.
          </p>
        </div>
      </div>

      {/* Row 5: Structured Content Fields */}
      <div className="space-y-6">
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Structured Content (Recommended)
          </h3>
          <p className="text-sm text-muted-foreground mb-6">
            Fill out these structured fields for better formatting and presentation. Leave blank to use the legacy "Full Description" field below.
          </p>
        </div>

        {/* Overview */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Overview
            <span className="text-muted-foreground font-normal ml-1">(Brief introduction to the opportunity)</span>
          </label>
          <textarea
            value={data.overview || ''}
            onChange={(e) => onChange({ ...data, overview: e.target.value })}
            className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary bg-background"
            rows={3}
            placeholder="Provide a compelling overview of this opportunity and what makes it unique..."
          />
        </div>

        {/* About the Role/Project */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            {data.type === 'volunteering' ? 'About the Project' : 
             data.type === 'consulting' ? 'About the Assignment' : 
             'About the Role'}
            <span className="text-muted-foreground font-normal ml-1">(Detailed description)</span>
          </label>
          <textarea
            value={data.about_role || ''}
            onChange={(e) => onChange({ ...data, about_role: e.target.value })}
            className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary bg-background"
            rows={4}
            placeholder={
              data.type === 'volunteering' ? 
              "Describe the project, its goals, timeline, and impact..." :
              data.type === 'consulting' ? 
              "Describe the assignment, objectives, and expected outcomes..." :
              "Describe the role, its purpose, and how it fits into the organization..."
            }
          />
        </div>

        {/* Responsibilities/Activities */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            {data.type === 'volunteering' ? 'Volunteer Activities' : 
             data.type === 'consulting' ? 'Key Deliverables' : 
             'Key Responsibilities'}
            <span className="text-muted-foreground font-normal ml-1">(One per line)</span>
          </label>
          <textarea
            value={data.responsibilities || ''}
            onChange={(e) => onChange({ ...data, responsibilities: e.target.value })}
            className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary bg-background"
            rows={6}
            placeholder={
              data.type === 'volunteering' ? 
              `Community engagement and outreach
Environmental education and awareness
Event planning and coordination
Mentoring and capacity building` :
              data.type === 'consulting' ? 
              `Conduct comprehensive assessment
Develop strategic recommendations
Deliver final report and presentation
Provide implementation roadmap` :
              `Lead project planning and execution
Manage team and stakeholder relationships
Develop and implement strategies
Monitor progress and report outcomes`
            }
          />
        </div>

        {/* Requirements */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            {data.type === 'volunteering' ? 'Who We Are Looking For' : 
             data.type === 'consulting' ? 'Consultant Requirements' : 
             'Requirements & Qualifications'}
            <span className="text-muted-foreground font-normal ml-1">(One per line)</span>
          </label>
          <textarea
            value={data.requirements || ''}
            onChange={(e) => onChange({ ...data, requirements: e.target.value })}
            className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary bg-background"
            rows={5}
            placeholder={
              data.type === 'volunteering' ? 
              `Passionate about environmental sustainability
Age 18-35 years
Strong communication skills
Commitment to community service
Available for minimum 3 months` :
              data.type === 'consulting' ? 
              `Master's degree in relevant field
5+ years consulting experience
Proven track record in organizational development
Strong analytical and communication skills
Experience with NGOs/development sector` :
              `Bachelor's degree or equivalent experience
3+ years relevant work experience
Strong leadership and communication skills
Proficiency in relevant software/tools
Commitment to organizational mission`
            }
          />
        </div>

        {/* Benefits */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            {data.type === 'volunteering' ? 'What You Will Gain' : 
             data.type === 'consulting' ? 'What We Offer' : 
             'Benefits & What We Offer'}
            <span className="text-muted-foreground font-normal ml-1">(One per line)</span>
          </label>
          <textarea
            value={data.benefits || ''}
            onChange={(e) => onChange({ ...data, benefits: e.target.value })}
            className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary bg-background"
            rows={4}
            placeholder={
              data.type === 'volunteering' ? 
              `Valuable skills development and training
Certificate of volunteer service
Networking opportunities with professionals
Meaningful impact in community development
Reference letters for future opportunities` :
              data.type === 'consulting' ? 
              `Competitive consulting fees
Flexible working arrangements
Professional development opportunities
Access to organizational resources
Potential for future collaborations` :
              `Competitive salary and benefits package
Professional development opportunities
Flexible working arrangements
Meaningful work with social impact
Collaborative and supportive team environment`
            }
          />
        </div>

        {/* How to Apply */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            How to Apply
            <span className="text-muted-foreground font-normal ml-1">(Application instructions)</span>
          </label>
          <textarea
            value={data.how_to_apply || ''}
            onChange={(e) => onChange({ ...data, how_to_apply: e.target.value })}
            className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary bg-background"
            rows={3}
            placeholder="To apply, please submit your application through our online form. Include your CV, cover letter, and any relevant documents. Applications will be reviewed on a rolling basis."
          />
        </div>
      </div>

      {/* Legacy Full Description Field */}
      <div className="border-t pt-6">
        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-4">
          <p className="text-sm text-amber-800 dark:text-amber-200">
            <strong>Legacy Field:</strong> Use the structured fields above for better formatting. This field is kept for backward compatibility.
          </p>
        </div>
        <label className="block text-sm font-semibold mb-2">
          Full Description (Legacy)
          <span className="text-muted-foreground font-normal ml-1">(Plain text - only use if structured fields above are empty)</span>
        </label>
        <textarea
          value={data.full_description || ''}
          onChange={(e) => onChange({ ...data, full_description: e.target.value })}
          className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary bg-background font-mono text-sm"
          rows={8}
          placeholder="Legacy field for plain text content. Recommended to use the structured fields above instead."
        />
      </div>

      <div className="flex gap-2 pt-2">
        <Button onClick={onSave} className="flex items-center gap-2">
          <Save size={16} />
          Save
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
