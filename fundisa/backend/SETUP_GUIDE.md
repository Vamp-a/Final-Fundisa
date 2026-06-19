# Fundisa Backend — Complete Setup Guide
## Everything is free. Total cost: $0

---

## STEP 1: Create Your Free Supabase Project

1. Go to https://supabase.com
2. Click **Start your project** → sign in with GitHub (free)
3. Click **New project**:
   - Organization: your personal org (free)
   - Name: `fundisa`
   - Database Password: create a strong one — **save it somewhere**
   - Region: **West EU (Ireland)** — closest free option to South Africa
4. Click **Create new project** — wait ~2 minutes for it to spin up

---

## STEP 2: Get Your Credentials

In your Supabase dashboard:

1. Click ⚙️ **Project Settings** (bottom left gear icon)
2. Click **API** in the left sidebar
3. Copy these three values:

```
Project URL:        https://xxxxxxxxxxxx.supabase.co
anon / public key:  eyJhbGciOiJIUzI1NiIs...  (long string)
service_role key:   eyJhbGciOiJIUzI1NiIs...  (different long string — keep SECRET)
```

---

## STEP 3: Create Your .env File

In your `backend/` folder, create a file called `.env`:

```env
SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_KEY=your_service_role_key_here
JWT_SECRET=fundisa-change-this-to-any-long-random-string-2024
```

Replace the values with what you copied in Step 2.
The JWT_SECRET can be anything long and random — it's just for your app.

⚠️  NEVER commit .env to GitHub. It's already in .gitignore.

---

## STEP 4: Run the Database Schema

1. In Supabase dashboard, click **SQL Editor** (left sidebar, looks like `</>`)
2. Click **New query**
3. Open the file `backend/database/schema.sql` from this project
4. Copy the ENTIRE contents and paste into the SQL editor
5. Click **Run** (green button, or Ctrl+Enter)
6. You should see: `Success. No rows returned`

This creates all 12 tables, indexes, RLS policies, and default badges.

---

## STEP 5: Configure Email Auth (Supabase)

By default Supabase requires email verification. For development, disable it:

1. Go to **Authentication** → **Providers** → **Email**
2. Toggle OFF **Confirm email** (for development)
3. Click **Save**

Re-enable this before going to production.

---

## STEP 6: Run the Backend

```powershell
# Make sure you're in the backend folder
cd "C:\Users\user\OneDrive\Desktop\All Contents\Hackathons\Fundisa\fundisa\backend"

# Activate virtual environment (if not already active)
.\venv\Scripts\activate

# You should see (venv) in your prompt

# Start the server
python run.py
```

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Application startup complete.
```

---

## STEP 7: Test It Works

Open your browser:

| URL | Expected |
|-----|----------|
| http://localhost:8000 | `{"message":"Welcome to Fundisa API 🎓"}` |
| http://localhost:8000/health | `{"status":"healthy"}` |
| http://localhost:8000/docs | Interactive API docs (Swagger UI) |

---

## STEP 8: Create Your First Test User

In the Swagger UI at http://localhost:8000/docs:

1. Click **POST /api/auth/signup**
2. Click **Try it out**
3. Use this body:
```json
{
  "email": "student@test.com",
  "password": "Test1234!",
  "full_name": "Test Student",
  "role": "student",
  "institution_name": "Test School",
  "grade_level": 10
}
```
4. Click Execute — you should get `{"success": true, ...}`

Then login:
1. Click **POST /api/auth/login**
2. Try it out with the same email/password
3. Copy the `access_token` from the response

Use that token to test protected routes:
1. Click the 🔒 **Authorize** button (top right of Swagger)
2. Enter: `Bearer YOUR_ACCESS_TOKEN`
3. Now you can test `/api/students/dashboard` etc.

---

## STEP 9: View Your Data in Supabase

1. Go to Supabase dashboard → **Table Editor**
2. You'll see all your tables
3. Click any table to view/edit data directly

---

## STEP 10: Deploy for Free (Optional — for sharing with team)

### Option A: Render (easiest, free tier)
1. Push your `backend/` folder to GitHub
2. Go to https://render.com → New → Web Service
3. Connect your GitHub repo
4. Build command: `pip install -r requirements.txt`
5. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Add your `.env` variables in Render's Environment settings
7. Deploy — you get a free `https://fundisa-api.onrender.com` URL

### Option B: Railway (also free)
1. Go to https://railway.app
2. New Project → Deploy from GitHub
3. Add environment variables
4. Done

---

## Troubleshooting

**"Missing Supabase credentials"** → Your `.env` file is missing or in the wrong folder. It must be inside `backend/`.

**"User profile not found"** → The signup completed but profile insert failed. Check Supabase Table Editor → profiles table.

**401 Unauthorized** → Your token expired (1 hour default). Use `/api/auth/refresh` with your refresh_token, or login again.

**CORS errors from Flutter** → The backend already allows all origins (`"*"`). Make sure your Flutter app is sending the `Authorization: Bearer TOKEN` header.

---

## Your Free Tier Limits

| Service | Free Limit | When you'll hit it |
|---------|-----------|-------------------|
| Supabase DB | 500MB | ~50,000 users |
| Supabase Auth | 50,000 users | When you grow |
| Supabase Storage | 1GB | Profile pictures |
| Render/Railway | 512MB RAM | Handles ~100 concurrent users |

All free until you get real users. More than enough for a hackathon + MVP.