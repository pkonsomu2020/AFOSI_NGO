# Projects Management Setup Guide

## Overview
The Projects Management system allows admins to create, edit, and manage projects that appear on the AFOSI website. Changes made in the admin panel are immediately reflected on the frontend.

## Database Setup

### 1. Run the Projects Schema
Execute the SQL schema in your Supabase database:

```bash
# Navigate to backend/database
cd backend/database

# The schema file is: projects_schema.sql
```

Run this SQL in your Supabase SQL Editor:
- Go to Supabase Dashboard → SQL Editor
- Copy contents from `backend/database/projects_schema.sql`
- Execute the SQL

This will create:
- `projects` table with all necessary columns
- Indexes for performance
- Triggers for `updated_at` timestamp
- 6 default projects (Kiongozi, KYCH, Flarehub, We Lead, Robotics, Blancosy)

### 2. Verify Table Creation
Check that the `projects` table exists with these columns:
- `id` (UUID, Primary Key)
- `title` (VARCHAR)
- `description` (TEXT)
- `image_url` (VARCHAR)
- `icon` (VARCHAR) - Options: Lightbulb, Users, Leaf, Rocket
- `beneficiaries` (VARCHAR) - e.g., "1000+"
- `duration` (VARCHAR) - e.g., "Ongoing"
- `highlights` (TEXT[]) - Array of highlight strings
- `link` (VARCHAR) - Project URL
- `is_external` (BOOLEAN) - External link or internal page
- `is_featured` (BOOLEAN) - Show on homepage
- `display_order` (INTEGER) - Sort order
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## Backend Setup

### API Routes (Already Configured)
The backend has these endpoints:

**Public Routes:**
- `GET /api/projects` - Get all projects
  - Query params: `?featured=true&limit=2`
- `GET /api/projects/:id` - Get single project

**Admin Routes (Require Authentication):**
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `PATCH /api/projects/:id/toggle-featured` - Toggle featured status

### Files Involved:
- `backend/routes/projects.js` - Route definitions
- `backend/controllers/projectsController.js` - Business logic
- `backend/server.js` - Routes registered

## Frontend Setup

### Main Website (User-Facing)

**Files:**
- `src/services/api.ts` - API client with `projectsAPI`
- `src/components/ProgramsSection.tsx` - Homepage (shows 2 featured projects)
- `src/pages/Projects.tsx` - Full projects page (shows all projects)

**Features:**
- Fetches projects from API on page load
- Shows loading state while fetching
- Displays projects with images, icons, highlights
- Featured projects appear on homepage
- All projects appear on `/projects` page

### Admin Dashboard

**Files:**
- `ADMIN/src/services/api.ts` - Admin API client
- `ADMIN/src/components/ProjectsAdminPanel.tsx` - Projects management UI
- `ADMIN/src/App.tsx` - Main app with Projects tab

**Features:**
- Create new projects
- Edit existing projects
- Delete projects
- Upload project images
- Toggle featured status (for homepage)
- Set display order
- Manage highlights (add/remove)
- Set icon type
- Mark as external/internal link

## How to Use

### Access Admin Panel
1. Start the admin dashboard:
   ```bash
   cd ADMIN
   npm run dev
   ```
2. Login with admin credentials
3. Click on "Projects" tab in sidebar

### Create a New Project
1. Click "Add Project" button
2. Fill in the form:
   - **Title** (required): Project name
   - **Description** (required): Detailed description
   - **Image**: Upload project image
   - **Icon**: Select icon (Lightbulb, Users, Leaf, Rocket)
   - **Beneficiaries**: e.g., "1000+"
   - **Duration**: e.g., "Ongoing" or "12 Months"
   - **Link**: Project URL or internal path
   - **Highlights**: Add 3+ key features
   - **External Link**: Check if link goes to external website
   - **Featured**: Check to show on homepage (max 2 recommended)
   - **Display Order**: Number for sorting (lower = first)
3. Click "Save Project"

### Edit a Project
1. Click the edit icon (pencil) on any project card
2. Modify the fields
3. Click "Save Project"

### Delete a Project
1. Click the delete icon (trash) on any project card
2. Confirm deletion

### Toggle Featured Status
1. Click on the "Featured" or "Not Featured" badge
2. Status toggles immediately
3. Homepage will show up to 2 featured projects

### Manage Display Order
- Set lower numbers to appear first
- Example: Order 1, 2, 3, 4, 5, 6
- Projects are sorted by this field

## Frontend Display Logic

### Homepage (ProgramsSection)
- Fetches projects with `featured=true` and `limit=2`
- Shows only the 2 featured projects
- Displays in order by `display_order`

### Projects Page
- Fetches all projects
- Shows all projects in grid layout
- Sorted by `display_order`

## Icon Options
Available icons (from Lucide React):
- **Lightbulb**: Innovation, ideas, leadership
- **Users**: Community, people, collaboration
- **Leaf**: Environment, sustainability, green
- **Rocket**: Technology, startups, growth

## Image Guidelines
- Recommended size: 1200x800px or similar aspect ratio
- Format: PNG, JPG, WebP
- Upload through admin panel
- Images stored in Supabase Storage
- Path saved in `image_url` field

## Highlights Best Practices
- Keep highlights concise (2-4 words each)
- Use action-oriented language
- Minimum 3 highlights recommended
- Examples:
  - "Leadership Development"
  - "AI-Driven Insights"
  - "Climate Action"
  - "Job Creation"

## Troubleshooting

### Projects not showing on frontend
1. Check if backend is running (port 5000)
2. Verify database has projects data
3. Check browser console for API errors
4. Ensure `VITE_API_URL` is set correctly

### Can't upload images
1. Check Supabase Storage is configured
2. Verify upload endpoint works: `POST /api/upload`
3. Check file size limits
4. Ensure authentication token is valid

### Featured projects not appearing on homepage
1. Verify `is_featured` is set to `true`
2. Check `display_order` is set correctly
3. Homepage shows max 2 featured projects
4. Clear browser cache

## Environment Variables

### Backend (.env)
```env
PORT=5000
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
JWT_SECRET=your_jwt_secret
```

### Admin Dashboard (ADMIN/.env)
```env
VITE_API_URL=http://localhost:5000/api
```

### Main Website (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## Testing the Setup

1. **Create a test project in admin panel**
2. **Verify it appears in database** (Supabase Dashboard → Table Editor → projects)
3. **Check frontend homepage** (http://localhost:8080) - if featured
4. **Check projects page** (http://localhost:8080/projects) - should show all
5. **Edit the project** - changes should reflect immediately
6. **Toggle featured status** - homepage should update
7. **Delete the test project** - should remove from all views

## Success Checklist
- [ ] Database schema executed successfully
- [ ] Backend server running on port 5000
- [ ] Admin dashboard running on port 3000/3001
- [ ] Main website running on port 8080
- [ ] Can login to admin panel
- [ ] Can see Projects tab in admin sidebar
- [ ] Can create new project
- [ ] Can upload project image
- [ ] Can edit existing project
- [ ] Can delete project
- [ ] Can toggle featured status
- [ ] Projects appear on homepage (if featured)
- [ ] Projects appear on /projects page
- [ ] Changes in admin reflect on frontend immediately

## Support
If you encounter issues:
1. Check browser console for errors
2. Check backend logs for API errors
3. Verify database connection
4. Ensure all environment variables are set
5. Clear browser cache and reload
