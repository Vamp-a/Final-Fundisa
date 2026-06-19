from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from typing import Optional
from supabase_client import supabase, supabase_admin

router = APIRouter(prefix="/api/auth", tags=["auth"])


class SignupRequest(BaseModel):
    email: str
    password: str
    full_name: str
    role: str = "student"
    institution_name: Optional[str] = None
    grade_level: Optional[int] = None


class LoginRequest(BaseModel):
    email: str
    password: str


class RefreshRequest(BaseModel):
    refresh_token: str


@router.post("/signup")
async def signup(request: SignupRequest):
    """Create new user account"""
    if request.role not in ["student", "educator", "admin"]:
        raise HTTPException(status_code=400, detail="Invalid role")

    try:
        auth_response = supabase.auth.sign_up(
            {
                "email": request.email,
                "password": request.password,
                "options": {
                    "data": {"full_name": request.full_name, "role": request.role}
                },
            }
        )

        user = auth_response.user
        if not user:
            raise HTTPException(status_code=400, detail="Signup failed")

        # Create or find institution
        institution_id = None
        if request.institution_name:
            existing = (
                supabase_admin.table("institutions")
                .select("id")
                .eq("name", request.institution_name)
                .execute()
            )
            if existing.data:
                institution_id = existing.data[0]["id"]
            else:
                new_inst = supabase_admin.table("institutions").insert(
                    {
                        "name": request.institution_name,
                        "subscription_plan": "starter",
                        "subscription_status": "trial",
                    }
                ).execute()
                institution_id = new_inst.data[0]["id"] if new_inst.data else None

        # Create profile
        profile_data = {
            "id": user.id,
            "full_name": request.full_name,
            "role": request.role,
            "institution_id": institution_id,
        }
        if request.role == "student" and request.grade_level:
            profile_data["grade_level"] = request.grade_level

        supabase_admin.table("profiles").insert(profile_data).execute()

        return {
            "success": True,
            "user_id": user.id,
            "message": "Account created. Please check your email to verify your account.",
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/login")
async def login(request: LoginRequest):
    """Login and return session tokens"""
    try:
        response = supabase.auth.sign_in_with_password(
            {"email": request.email, "password": request.password}
        )

        profile = (
            supabase.table("profiles")
            .select("*")
            .eq("id", response.user.id)
            .execute()
        )

        profile_data = profile.data[0] if profile.data else {}

        return {
            "success": True,
            "access_token": response.session.access_token,
            "refresh_token": response.session.refresh_token,
            "expires_in": response.session.expires_in,
            "user": {
                "id": response.user.id,
                "email": response.user.email,
                "role": profile_data.get("role"),
                "full_name": profile_data.get("full_name"),
                "institution_id": profile_data.get("institution_id"),
                "grade_level": profile_data.get("grade_level"),
                "avatar_url": profile_data.get("avatar_url"),
            },
        }

    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Login error: {str(e)}")


@router.post("/refresh")
async def refresh_token(request: RefreshRequest):
    """Refresh access token using refresh token"""
    try:
        response = supabase.auth.refresh_session(request.refresh_token)
        return {
            "success": True,
            "access_token": response.session.access_token,
            "refresh_token": response.session.refresh_token,
            "expires_in": response.session.expires_in,
        }
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid or expired refresh token")


@router.post("/logout")
async def logout():
    """Logout — client should discard tokens"""
    return {"success": True, "message": "Logged out successfully"}


@router.get("/me")
async def get_me(user=None):
    """Get current user profile — requires Authorization header"""
    from auth_middleware import get_current_user_roles
    from fastapi import Depends, Request

    # This is a passthrough — see /api/students/dashboard for authenticated example
    return {"message": "Use Authorization: Bearer <token> header"}