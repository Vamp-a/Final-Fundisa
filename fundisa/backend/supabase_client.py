import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

if not SUPABASE_URL or not SUPABASE_ANON_KEY:
    raise ValueError(
        "\n\n Missing Supabase credentials!\n"
        "Create a .env file in the backend/ folder with:\n"
        "  SUPABASE_URL=https://your-project-id.supabase.co\n"
        "  SUPABASE_ANON_KEY=your-anon-key\n"
        "  SUPABASE_SERVICE_KEY=your-service-role-key\n"
        "  JWT_SECRET=any-long-random-string\n\n"
        "See SETUP_GUIDE.md for step-by-step instructions.\n"
    )

# Public client — respects Row Level Security (use for user-facing operations)
supabase: Client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

# Admin client — bypasses RLS (use only for trusted backend operations)
supabase_admin: Client = (
    create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
    if SUPABASE_SERVICE_KEY
    else supabase
)