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
  type: "consulting" | "employment";
  description: string;
  location: string;
  duration: string;
  deadline: string;
  manually_disabled: boolean;
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
                        <Badge className={opp.type === 'consulting' ? 'bg-secondary' : 'bg-primary'}>
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
  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-2">Title</label>
          <input
            type="text"
            value={data.title || ''}
            onChange={(e) => onChange({ ...data, title: e.target.value })}
            className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary"
            placeholder="Job Title"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">Type</label>
          <select
            value={data.type || 'employment'}
            onChange={(e) => onChange({ ...data, type: e.target.value as "consulting" | "employment" })}
            className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary"
          >
            <option value="employment">Employment</option>
            <option value="consulting">Consulting</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-semibold mb-2">Description</label>
        <textarea
          value={data.description || ''}
          onChange={(e) => onChange({ ...data, description: e.target.value })}
          className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary"
          rows={3}
          placeholder="Brief description"
        />
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-2">Location</label>
          <input
            type="text"
            value={data.location || ''}
            onChange={(e) => onChange({ ...data, location: e.target.value })}
            className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary"
            placeholder="Nairobi, Kenya"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">Duration</label>
          <input
            type="text"
            value={data.duration || ''}
            onChange={(e) => onChange({ ...data, duration: e.target.value })}
            className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary"
            placeholder="Full-time"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">Deadline</label>
          <input
            type="date"
            value={data.deadline || ''}
            onChange={(e) => onChange({ ...data, deadline: e.target.value })}
            className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>
      <div className="flex gap-2 pt-4">
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
