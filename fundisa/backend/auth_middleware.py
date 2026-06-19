from fastapi import HTTPException, Depends, Request
from supabase_client import supabase


async def get_current_user(request: Request):
    """Extract and validate JWT token from Authorization header"""
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(
            status_code=401, detail="Missing or invalid Authorization header"
        )

    token = auth_header.replace("Bearer ", "")
    try:
        user_response = supabase.auth.get_user(token)
        return user_response.user
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid or expired token")


async def get_current_user_roles(user=Depends(get_current_user)):
    """Get user's profile (with role) from database"""
    try:
        profile = (
            supabase.table("profiles").select("*").eq("id", user.id).execute()
        )
        if not profile.data:
            raise HTTPException(
                status_code=404,
                detail="User profile not found. Please complete registration.",
            )
        return profile.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching profile: {str(e)}")