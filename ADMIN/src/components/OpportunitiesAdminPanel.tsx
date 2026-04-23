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
        const response = await opportunitiesAPI.update(editingId, formData);
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

      {/* Row 5: Full Description */}
      <div>
        <label className="block text-sm font-semibold mb-2">
          Full Description
          <span className="text-muted-foreground font-normal ml-1">(HTML supported — shown on the detail subpage)</span>
        </label>
        <textarea
          value={data.full_description || ''}
          onChange={(e) => onChange({ ...data, full_description: e.target.value })}
          className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary bg-background font-mono text-sm"
          rows={16}
          placeholder={`Use HTML for professional formatting. Example structure:

<h2>About the Role</h2>
<p>Brief overview of the position...</p>

<h3>Key Responsibilities</h3>
<ul>
  <li><strong>Primary Area:</strong> Description of main duties</li>
  <li><strong>Secondary Area:</strong> Additional responsibilities</li>
</ul>

<h3>Requirements</h3>
<ul>
  <li>Bachelor's degree or equivalent experience</li>
  <li>2+ years relevant experience</li>
</ul>

<h3>What We Offer</h3>
<ul>
  <li><strong>Impact:</strong> Meaningful work contributing to our mission</li>
  <li><strong>Growth:</strong> Professional development opportunities</li>
</ul>`}
        />
        <div className="mt-2 text-xs text-muted-foreground space-y-1">
          <p><strong>HTML Tips:</strong></p>
          <p>• Use <code>&lt;h2&gt;</code> for main sections, <code>&lt;h3&gt;</code> for subsections</p>
          <p>• Use <code>&lt;ul&gt;&lt;li&gt;</code> for bullet points, <code>&lt;ol&gt;&lt;li&gt;</code> for numbered lists</p>
          <p>• Use <code>&lt;strong&gt;</code> for bold text, <code>&lt;p&gt;</code> for paragraphs</p>
          <p>• Use <code>&lt;blockquote&gt;</code> for highlighted notes or quotes</p>
        </div>
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
