from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional
from auth_middleware import get_current_user_roles
from supabase_client import supabase

router = APIRouter(prefix="/api/admin", tags=["admin"])


class UserRoleUpdate(BaseModel):
    role: str  # student, educator, admin


@router.get("/dashboard")
async def get_admin_dashboard(user=Depends(get_current_user_roles)):
    """Get admin dashboard stats"""
    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")

    institution_id = user.get("institution_id")

    users = (
        supabase.table("profiles")
        .select("id, role")
        .eq("institution_id", institution_id)
        .execute()
    )

    courses = (
        supabase.table("courses")
        .select("id, status")
        .eq("institution_id", institution_id)
        .execute()
    )

    # Count by role
    role_counts = {"student": 0, "educator": 0, "admin": 0}
    for u in (users.data or []):
        role_counts[u["role"]] = role_counts.get(u["role"], 0) + 1

    published = sum(1 for c in (courses.data or []) if c["status"] == "published")

    # AI usage this month
    ai_usage = (
        supabase.table("ai_usage_log")
        .select("tokens_used, cost_estimate")
        .eq("institution_id", institution_id)
        .execute()
    )
    total_tokens = sum(a["tokens_used"] for a in (ai_usage.data or []))
    total_cost = sum(float(a["cost_estimate"]) for a in (ai_usage.data or []))

    return {
        "total_users": len(users.data) if users.data else 0,
        "students": role_counts["student"],
        "educators": role_counts["educator"],
        "admins": role_counts["admin"],
        "total_courses": len(courses.data) if courses.data else 0,
        "published_courses": published,
        "ai_tokens_used": total_tokens,
        "ai_cost_estimate": round(total_cost, 4),
    }


@router.get("/users")
async def get_all_users(
    role: Optional[str] = None, user=Depends(get_current_user_roles)
):
    """Get all users in institution"""
    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")

    query = (
        supabase.table("profiles")
        .select("*")
        .eq("institution_id", user["institution_id"])
    )
    if role:
        query = query.eq("role", role)

    users = query.order("created_at", desc=True).execute()
    return {"users": users.data if users.data else []}


@router.patch("/users/{user_id}/role")
async def update_user_role(
    user_id: str, body: UserRoleUpdate, user=Depends(get_current_user_roles)
):
    """Change a user's role"""
    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")

    if body.role not in ["student", "educator", "admin"]:
        raise HTTPException(status_code=400, detail="Invalid role")

    supabase.table("profiles").update({"role": body.role}).eq("id", user_id).execute()

    return {"success": True, "message": f"User role updated to {body.role}"}


@router.delete("/users/{user_id}")
async def deactivate_user(user_id: str, user=Depends(get_current_user_roles)):
    """Remove a user from the institution (does not delete Supabase auth account)"""
    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")

    supabase.table("profiles").update({"institution_id": None}).eq(
        "id", user_id
    ).execute()

    return {"success": True, "message": "User removed from institution"}


@router.get("/analytics")
async def get_analytics(user=Depends(get_current_user_roles)):
    """Get institution-wide analytics"""
    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")

    institution_id = user.get("institution_id")

    # Enrollment trends
    enrollments = (
        supabase.table("enrollments")
        .select("enrolled_at, progress_percent, status")
        .execute()
    )

    # Quiz performance
    attempts = (
        supabase.table("quiz_attempts").select("percentage, completed_at").execute()
    )

    avg_score = 0
    if attempts.data:
        avg_score = round(
            sum(a["percentage"] for a in attempts.data) / len(attempts.data), 1
        )

    completed = sum(
        1 for e in (enrollments.data or []) if e["status"] == "completed"
    )
    completion_rate = (
        round(completed / len(enrollments.data) * 100, 1)
        if enrollments.data
        else 0
    )

    return {
        "total_enrollments": len(enrollments.data) if enrollments.data else 0,
        "completion_rate": completion_rate,
        "average_quiz_score": avg_score,
        "total_quiz_attempts": len(attempts.data) if attempts.data else 0,
    }