# AFOSI Backend API

Node.js + Express + Supabase backend for AFOSI NGO Admin Dashboard.

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Supabase

1. Go to [Supabase](https://supabase.com) and create a new project
2. Once created, go to Project Settings > API
3. Copy your project URL and API keys

### 3. Set Up Database

1. In your Supabase project, go to SQL Editor
2. Copy the contents of `database/schema.sql`
3. Paste and run it in the SQL Editor
4. This will create the tables and insert default data

### 4. Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your Supabase credentials in `.env`:
   ```
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_KEY=your_supabase_service_role_key
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:8080
   ```

### 5. Run the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### Opportunities

- `GET /api/opportunities` - Get all opportunities
- `GET /api/opportunities/:id` - Get single opportunity
- `POST /api/opportunities` - Create new opportunity
- `PUT /api/opportunities/:id` - Update opportunity
- `DELETE /api/opportunities/:id` - Delete opportunity
- `PATCH /api/opportunities/:id/toggle` - Toggle opportunity status

### Gallery

- `GET /api/gallery` - Get all gallery images (optional query: ?category=programs)
- `GET /api/gallery/:id` - Get single image
- `POST /api/gallery` - Create new image
- `PUT /api/gallery/:id` - Update image
- `DELETE /api/gallery/:id` - Delete image

### Health Check

- `GET /api/health` - Check if API is running

## Project Structure

```
backend/
├── config/
│   └── supabase.js          # Supabase client configuration
├── controllers/
│   ├── opportunitiesController.js
│   └── galleryController.js
├── database/
│   └── schema.sql           # Database schema
├── routes/
│   ├── opportunities.js
│   └── gallery.js
├── .env.example
├── package.json
├── server.js                # Main server file
└── README.md
```

## Security Features

- Helmet.js for security headers
- CORS configuration
- Rate limiting (100 requests per 15 minutes)
- Environment variable protection

## Testing the API

You can test the API using:
- Postman
- Thunder Client (VS Code extension)
- cURL commands

Example cURL:
```bash
# Get all opportunities
curl http://localhost:5000/api/opportunities

# Create new opportunity
curl -X POST http://localhost:5000/api/opportunities \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Position",
    "type": "employment",
    "description": "Test description",
    "location": "Nairobi",
    "duration": "Full-time",
    "deadline": "2025-12-31"
  }'
```
