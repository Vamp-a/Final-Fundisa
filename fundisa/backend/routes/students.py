from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
from auth_middleware import get_current_user_roles
from supabase_client import supabase
from datetime import datetime, timedelta

router = APIRouter(prefix="/api/students", tags=["students"])


@router.get("/dashboard")
async def get_student_dashboard(user=Depends(get_current_user_roles)):
    """Get all data for student dashboard"""
    if user["role"] != "student":
        raise HTTPException(status_code=403, detail="Student access required")

    user_id = user["id"]

    # Get enrolled courses
    enrollments = (
        supabase.table("enrollments")
        .select("*, courses(*)")
        .eq("user_id", user_id)
        .execute()
    )

    # Get total points
    points = (
        supabase.table("points_log")
        .select("points")
        .eq("user_id", user_id)
        .execute()
    )

    total_points = sum(p["points"] for p in points.data) if points.data else 0

    # Get badges
    badges = (
        supabase.table("user_badges")
        .select("*, badges(*)")
        .eq("user_id", user_id)
        .execute()
    )

    # Calculate study streak from activity (last 7 days)
    week_ago = datetime.now() - timedelta(days=7)
    activity = (
        supabase.table("activity_log")
        .select("created_at")
        .eq("user_id", user_id)
        .gte("created_at", week_ago.isoformat())
        .execute()
    )

    study_days = (
        len(set(a["created_at"][:10] for a in activity.data)) if activity.data else 0
    )

    return {
        "active_courses": len(enrollments.data) if enrollments.data else 0,
        "total_points": total_points,
        "badges_earned": len(badges.data) if badges.data else 0,
        "study_streak": study_days,
        "courses": (
            [
                {
                    "id": e["courses"]["id"],
                    "title": e["courses"]["title"],
                    "progress": e["progress_percent"],
                    "subject": e["courses"]["subject"],
                }
                for e in enrollments.data
            ]
            if enrollments.data
            else []
        ),
        "badges": (
            [
                {
                    "name": b["badges"]["name"],
                    "icon": b["badges"]["icon_url"],
                    "earned_at": b["earned_at"],
                }
                for b in badges.data
            ]
            if badges.data
            else []
        ),
    }


@router.get("/courses")
async def get_available_courses(user=Depends(get_current_user_roles)):
    """Get all courses available to student"""
    if user["role"] != "student":
        raise HTTPException(status_code=403, detail="Student access required")

    courses = (
        supabase.table("courses").select("*").eq("status", "published").execute()
    )

    enrollments = (
        supabase.table("enrollments")
        .select("course_id")
        .eq("user_id", user["id"])
        .execute()
    )

    enrolled_ids = (
        {e["course_id"] for e in enrollments.data} if enrollments.data else set()
    )

    return {
        "courses": (
            [
                {
                    "id": c["id"],
                    "title": c["title"],
                    "description": c["description"],
                    "subject": c["subject"],
                    "grade_level": c["grade_level"],
                    "primary_language": c["primary_language"],
                    "is_enrolled": c["id"] in enrolled_ids,
                    "total_modules": c["total_modules"],
                }
                for c in courses.data
            ]
            if courses.data
            else []
        )
    }


@router.post("/courses/{course_id}/enroll")
async def enroll_in_course(course_id: str, user=Depends(get_current_user_roles)):
    """Enroll student in a course"""
    if user["role"] != "student":
        raise HTTPException(status_code=403, detail="Student access required")

    existing = (
        supabase.table("enrollments")
        .select("*")
        .eq("user_id", user["id"])
        .eq("course_id", course_id)
        .execute()
    )

    if existing.data:
        raise HTTPException(status_code=400, detail="Already enrolled")

    supabase.table("enrollments").insert(
        {"user_id": user["id"], "course_id": course_id, "progress_percent": 0}
    ).execute()

    supabase.table("activity_log").insert(
        {
            "user_id": user["id"],
            "action": "enrolled_in_course",
            "resource_type": "course",
            "resource_id": course_id,
        }
    ).execute()

    return {"success": True, "message": "Enrolled successfully"}


@router.get("/progress")
async def get_progress(user=Depends(get_current_user_roles)):
    """Get student's learning progress"""
    if user["role"] != "student":
        raise HTTPException(status_code=403, detail="Student access required")

    attempts = (
        supabase.table("quiz_attempts")
        .select("*, quizzes(*)")
        .eq("user_id", user["id"])
        .execute()
    )

    avg_score = 0
    if attempts.data:
        avg_score = sum(a["percentage"] for a in attempts.data) / len(attempts.data)

    week_ago = datetime.now() - timedelta(days=7)
    weekly_activity = (
        supabase.table("activity_log")
        .select("created_at")
        .eq("user_id", user["id"])
        .gte("created_at", week_ago.isoformat())
        .execute()
    )

    daily_hours = {}
    for act in weekly_activity.data:
        day = act["created_at"][:10]
        daily_hours[day] = daily_hours.get(day, 0) + 1

    enrollments = (
        supabase.table("enrollments")
        .select("*, courses(*)")
        .eq("user_id", user["id"])
        .execute()
    )

    return {
        "average_score": round(avg_score, 1),
        "total_quizzes": len(attempts.data) if attempts.data else 0,
        "weekly_study": list(daily_hours.values()),
        "weekly_days": list(daily_hours.keys()),
        "course_progress": (
            [
                {
                    "title": e["courses"]["title"],
                    "progress": e["progress_percent"],
                    "subject": e["courses"]["subject"],
                }
                for e in enrollments.data
            ]
            if enrollments.data
            else []
        ),
    }


@router.post("/quiz/submit")
async def submit_quiz(quiz_data: dict, user=Depends(get_current_user_roles)):
    """Submit quiz answers and calculate score"""
    if user["role"] != "student":
        raise HTTPException(status_code=403, detail="Student access required")

    quiz_id = quiz_data.get("quiz_id")
    answers = quiz_data.get("answers")
    time_spent = quiz_data.get("time_spent_seconds", 0)

    quiz = supabase.table("quizzes").select("*").eq("id", quiz_id).execute()
    if not quiz.data:
        raise HTTPException(status_code=404, detail="Quiz not found")

    quiz_info = quiz.data[0]
    questions = quiz_info["questions"]

    correct_count = 0
    total_points = 0
    for i, answer in enumerate(answers):
        if i < len(questions):
            is_correct = answer == questions[i].get("correct_answer")
            if is_correct:
                correct_count += 1
                total_points += questions[i].get("points", 10)

    percentage = int((correct_count / len(questions)) * 100) if questions else 0

    supabase.table("quiz_attempts").insert(
        {
            "user_id": user["id"],
            "quiz_id": quiz_id,
            "score": total_points,
            "max_score": sum(q.get("points", 10) for q in questions),
            "percentage": percentage,
            "answers": answers,
            "time_spent_seconds": time_spent,
        }
    ).execute()

    supabase.table("points_log").insert(
        {
            "user_id": user["id"],
            "points": total_points,
            "reason": f"quiz_completed",
            "reference_id": quiz_id,
        }
    ).execute()

    # Check Quiz Master badge (5+ quizzes with 90%+)
    if percentage >= 90:
        high_scores = (
            supabase.table("quiz_attempts")
            .select("id")
            .eq("user_id", user["id"])
            .gte("percentage", 90)
            .execute()
        )
        if len(high_scores.data) >= 5:
            badge = (
                supabase.table("badges")
                .select("id")
                .eq("name", "Quiz Master")
                .execute()
            )
            if badge.data:
                existing_badge = (
                    supabase.table("user_badges")
                    .select("id")
                    .eq("user_id", user["id"])
                    .eq("badge_id", badge.data[0]["id"])
                    .execute()
                )
                if not existing_badge.data:
                    supabase.table("user_badges").insert(
                        {
                            "user_id": user["id"],
                            "badge_id": badge.data[0]["id"],
                        }
                    ).execute()

    # Check 100% Perfect badge
    if percentage == 100:
        badge = (
            supabase.table("badges")
            .select("id")
            .eq("name", "100% Perfect")
            .execute()
        )
        if badge.data:
            existing_badge = (
                supabase.table("user_badges")
                .select("id")
                .eq("user_id", user["id"])
                .eq("badge_id", badge.data[0]["id"])
                .execute()
            )
            if not existing_badge.data:
                supabase.table("user_badges").insert(
                    {"user_id": user["id"], "badge_id": badge.data[0]["id"]}
                ).execute()

    return {
        "success": True,
        "score": percentage,
        "points_earned": total_points,
        "correct_answers": correct_count,
        "total_questions": len(questions),
    }


@router.get("/leaderboard")
async def get_leaderboard(limit: int = 10, user=Depends(get_current_user_roles)):
    """Get top students by points"""
    if user["role"] != "student":
        raise HTTPException(status_code=403, detail="Student access required")

    all_points = supabase.table("points_log").select("user_id, points").execute()

    points_map = {}
    for p in (all_points.data or []):
        uid = p["user_id"]
        points_map[uid] = points_map.get(uid, 0) + p["points"]

    sorted_users = sorted(points_map.items(), key=lambda x: x[1], reverse=True)[:limit]

    # Fetch names for top users
    top_ids = [uid for uid, _ in sorted_users]
    profiles = {}
    if top_ids:
        prof_data = (
            supabase.table("profiles")
            .select("id, full_name, avatar_url")
            .in_("id", top_ids)
            .execute()
        )
        profiles = {p["id"]: p for p in (prof_data.data or [])}

    return {
        "leaderboard": [
            {
                "rank": i + 1,
                "user_id": uid,
                "name": profiles.get(uid, {}).get("full_name", "Unknown"),
                "avatar": profiles.get(uid, {}).get("avatar_url"),
                "total_points": pts,
            }
            for i, (uid, pts) in enumerate(sorted_users)
        ],
        "my_points": points_map.get(user["id"], 0),
    }