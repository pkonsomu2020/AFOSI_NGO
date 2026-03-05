import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, ExternalLink, MoveUp, MoveDown } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { projectsAPI, uploadAPI } from '../services/api';

interface Project {
  id: string;
  title: string;
  description: string;
  image_url: string;
  icon: string;
  beneficiaries: string;
  duration: string;
  highlights: string[];
  link: string;
  is_external: boolean;
  is_featured: boolean;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

const iconOptions = ['Lightbulb', 'Users', 'Leaf', 'Rocket'];

const ProjectsAdminPanel = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    icon: 'Lightbulb',
    beneficiaries: '',
    duration: '',
    highlights: ['', '', ''],
    link: '',
    is_external: false,
    is_featured: false,
    display_order: 0,
    has_subpage: false,
    excerpt: '',
    full_content: '',
    slug: '',
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await projectsAPI.getAll();
      setProjects(response.data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      alert('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const response = await uploadAPI.uploadImage(file);
      setFormData({ ...formData, image_url: response.url });
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleCreate = () => {
    setIsCreating(true);
    setFormData({
      title: '',
      description: '',
      image_url: '',
      icon: 'Lightbulb',
      beneficiaries: '',
      duration: '',
      highlights: ['', '', ''],
      link: '',
      is_external: false,
      is_featured: false,
      display_order: projects.length + 1,
      has_subpage: false,
      excerpt: '',
      full_content: '',
      slug: '',
    });
  };

  const handleEdit = (project: Project) => {
    setEditingId(project.id);
    setFormData({
      title: project.title,
      description: project.description,
      image_url: project.image_url,
      icon: project.icon,
      beneficiaries: project.beneficiaries,
      duration: project.duration,
      highlights: project.highlights.length >= 3 ? project.highlights : [...project.highlights, '', '', ''].slice(0, 3),
      link: project.link,
      is_external: project.is_external,
      is_featured: project.is_featured,
      display_order: project.display_order,
      has_subpage: (project as any).has_subpage || false,
      excerpt: (project as any).excerpt || '',
      full_content: (project as any).full_content || '',
      slug: (project as any).slug || '',
    });
  };

  const handleSave = async () => {
    try {
      if (!formData.title || !formData.description) {
        alert('Title and description are required');
        return;
      }

      const highlights = formData.highlights.filter(h => h.trim() !== '');

      const data = {
        ...formData,
        highlights,
      };

      if (isCreating) {
        await projectsAPI.create(data);
      } else if (editingId) {
        await projectsAPI.update(editingId, data);
      }

      await fetchProjects();
      handleCancel();
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save project');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      await projectsAPI.delete(id);
      await fetchProjects();
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete project');
    }
  };

  const handleToggleFeatured = async (id: string) => {
    try {
      await projectsAPI.toggleFeatured(id);
      await fetchProjects();
    } catch (error) {
      console.error('Toggle error:', error);
      alert('Failed to toggle featured status');
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingId(null);
    setFormData({
      title: '',
      description: '',
      image_url: '',
      icon: 'Lightbulb',
      beneficiaries: '',
      duration: '',
      highlights: ['', '', ''],
      link: '',
      is_external: false,
      is_featured: false,
      display_order: 0,
      has_subpage: false,
      excerpt: '',
      full_content: '',
      slug: '',
    });
  };

  const handleHighlightChange = (index: number, value: string) => {
    const newHighlights = [...formData.highlights];
    newHighlights[index] = value;
    setFormData({ ...formData, highlights: newHighlights });
  };

  const addHighlight = () => {
    setFormData({ ...formData, highlights: [...formData.highlights, ''] });
  };

  const removeHighlight = (index: number) => {
    const newHighlights = formData.highlights.filter((_, i) => i !== index);
    setFormData({ ...formData, highlights: newHighlights });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading projects...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Projects Management</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage projects displayed on the website
          </p>
        </div>
        {!isCreating && !editingId && (
          <Button onClick={handleCreate} className="gap-2">
            <Plus size={16} />
            Add Project
          </Button>
        )}
      </div>

      {/* Create/Edit Form */}
      {(isCreating || editingId) && (
        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
              {isCreating ? 'Create New Project' : 'Edit Project'}
            </h3>
            <Button variant="ghost" size="sm" onClick={handleCancel}>
              <X size={16} />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-md bg-background"
                placeholder="Project title"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-md bg-background"
                rows={4}
                placeholder="Project description"
              />
            </div>

            {/* Image Upload */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Project Image</label>
              <div className="flex gap-4 items-start">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                  className="flex-1 px-3 py-2 border border-border rounded-md bg-background"
                />
                {formData.image_url && (
                  <img
                    src={formData.image_url}
                    alt="Preview"
                    className="w-24 h-24 object-cover rounded-md"
                  />
                )}
              </div>
              {uploadingImage && <p className="text-sm text-muted-foreground mt-2">Uploading...</p>}
            </div>

            {/* Icon */}
            <div>
              <label className="block text-sm font-medium mb-2">Icon</label>
              <select
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-md bg-background"
              >
                {iconOptions.map((icon) => (
                  <option key={icon} value={icon}>
                    {icon}
                  </option>
                ))}
              </select>
            </div>

            {/* Beneficiaries */}
            <div>
              <label className="block text-sm font-medium mb-2">Beneficiaries</label>
              <input
                type="text"
                value={formData.beneficiaries}
                onChange={(e) => setFormData({ ...formData, beneficiaries: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-md bg-background"
                placeholder="e.g., 1000+"
              />
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium mb-2">Duration</label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-md bg-background"
                placeholder="e.g., Ongoing"
              />
            </div>

            {/* Link */}
            <div>
              <label className="block text-sm font-medium mb-2">Link</label>
              <input
                type="text"
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-md bg-background"
                placeholder="https://example.com"
              />
            </div>

            {/* Has Subpage Toggle */}
            <div className="md:col-span-2">
              <label className="flex items-center gap-3 p-4 border border-border rounded-md bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.has_subpage}
                  onChange={(e) => setFormData({ ...formData, has_subpage: e.target.checked })}
                  className="w-5 h-5"
                />
                <div>
                  <span className="text-sm font-medium">Create Dedicated Subpage</span>
                  <p className="text-xs text-muted-foreground mt-1">
                    Enable this to create a detailed project page with full content. The main projects page will show only an excerpt.
                  </p>
                </div>
              </label>
            </div>

            {/* Conditional Subpage Fields */}
            {formData.has_subpage && (
              <>
                {/* Slug */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">URL Slug</label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">/projects/</span>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') })}
                      className="flex-1 px-3 py-2 border border-border rounded-md bg-background"
                      placeholder="project-name"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Auto-generated from title if left empty. Use lowercase letters, numbers, and hyphens only.
                  </p>
                </div>

                {/* Excerpt */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Excerpt (Short Description)</label>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background"
                    rows={3}
                    placeholder="Brief description shown on project cards (recommended: 150-200 characters)"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {formData.excerpt.length} characters
                  </p>
                </div>

                {/* Full Content */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Full Content (Detailed Description)</label>
                  <textarea
                    value={formData.full_content}
                    onChange={(e) => setFormData({ ...formData, full_content: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background"
                    rows={8}
                    placeholder="Detailed project description shown on the dedicated subpage. Include all relevant information, features, impact, and details."
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    This content will be displayed on the project's dedicated page
                  </p>
                </div>
              </>
            )}

            {/* Highlights */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Highlights</label>
              <div className="space-y-2">
                {formData.highlights.map((highlight, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={highlight}
                      onChange={(e) => handleHighlightChange(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-border rounded-md bg-background"
                      placeholder={`Highlight ${index + 1}`}
                    />
                    {formData.highlights.length > 3 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeHighlight(index)}
                      >
                        <X size={16} />
                      </Button>
                    )}
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={addHighlight}>
                  <Plus size={16} className="mr-2" />
                  Add Highlight
                </Button>
              </div>
            </div>

            {/* Checkboxes */}
            <div className="flex gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.is_external}
                  onChange={(e) => setFormData({ ...formData, is_external: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-sm">External Link</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-sm">Featured (Homepage)</span>
              </label>
            </div>

            {/* Display Order */}
            <div>
              <label className="block text-sm font-medium mb-2">Display Order</label>
              <input
                type="number"
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-border rounded-md bg-background"
                min="0"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button onClick={handleSave} className="gap-2">
              <Save size={16} />
              Save Project
            </Button>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Projects List */}
      <div className="grid gap-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex gap-4">
              {/* Image */}
              {project.image_url && (
                <img
                  src={project.image_url}
                  alt={project.title}
                  className="w-32 h-32 object-cover rounded-md"
                />
              )}

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                      {project.title}
                      {project.is_external && <ExternalLink size={14} className="text-muted-foreground" />}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {project.description}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(project)}
                      disabled={isCreating || editingId !== null}
                    >
                      <Edit2 size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(project.id)}
                      disabled={isCreating || editingId !== null}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>

                {/* Meta Info */}
                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge variant="secondary" className="text-xs">
                    {project.icon}
                  </Badge>
                  {project.beneficiaries && (
                    <Badge variant="secondary" className="text-xs">
                      {project.beneficiaries} Youth
                    </Badge>
                  )}
                  {project.duration && (
                    <Badge variant="secondary" className="text-xs">
                      {project.duration}
                    </Badge>
                  )}
                  <Badge variant="secondary" className="text-xs">
                    Order: {project.display_order}
                  </Badge>
                  <Badge
                    variant={project.is_featured ? 'default' : 'outline'}
                    className="text-xs cursor-pointer"
                    onClick={() => handleToggleFeatured(project.id)}
                  >
                    {project.is_featured ? 'Featured' : 'Not Featured'}
                  </Badge>
                </div>

                {/* Highlights */}
                {project.highlights.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs text-muted-foreground mb-1">Highlights:</p>
                    <div className="flex flex-wrap gap-1">
                      {project.highlights.map((highlight, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-primary/10 text-primary px-2 py-1 rounded"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {projects.length === 0 && !isCreating && (
          <div className="text-center py-12 text-muted-foreground">
            <p>No projects yet. Click "Add Project" to create one.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsAdminPanel;
