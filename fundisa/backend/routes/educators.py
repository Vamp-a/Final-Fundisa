from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional
from auth_middleware import get_current_user_roles
from supabase_client import supabase

router = APIRouter(prefix="/api/educator", tags=["educator"])


class CourseCreate(BaseModel):
    title: str
    description: str
    subject: str
    grade_level: int
    difficulty: str
    primary_language: str = "en"


class ModuleCreate(BaseModel):
    title: str
    description: str
    order_index: int
    content: str = ""
    duration_minutes: int = 30
    points_value: int = 10


class QuizCreate(BaseModel):
    title: str
    description: str = ""
    time_limit_minutes: Optional[int] = None
    passing_score: int = 70
    questions: list  # [{question, options, correct_answer, points}]


@router.get("/dashboard")
async def get_educator_dashboard(user=Depends(get_current_user_roles)):
    """Get educator's dashboard data"""
    if user["role"] != "educator":
        raise HTTPException(status_code=403, detail="Educator access required")

    courses = (
        supabase.table("courses")
        .select("*")
        .eq("educator_id", user["id"])
        .execute()
    )

    course_ids = [c["id"] for c in courses.data] if courses.data else []

    total_students = 0
    if course_ids:
        enrollments = (
            supabase.table("enrollments")
            .select("user_id")
            .in_("course_id", course_ids)
            .execute()
        )
        total_students = (
            len(set(e["user_id"] for e in enrollments.data))
            if enrollments.data
            else 0
        )

    # Average score across all students in educator's courses
    avg_score = 0
    if course_ids:
        # Get all quiz attempts for quizzes in educator's courses
        modules = (
            supabase.table("modules")
            .select("id")
            .in_("course_id", course_ids)
            .execute()
        )
        module_ids = [m["id"] for m in (modules.data or [])]
        if module_ids:
            quizzes = (
                supabase.table("quizzes")
                .select("id")
                .in_("module_id", module_ids)
                .execute()
            )
            quiz_ids = [q["id"] for q in (quizzes.data or [])]
            if quiz_ids:
                attempts = (
                    supabase.table("quiz_attempts")
                    .select("percentage")
                    .in_("quiz_id", quiz_ids)
                    .execute()
                )
                if attempts.data:
                    avg_score = round(
                        sum(a["percentage"] for a in attempts.data) / len(attempts.data), 1
                    )

    return {
        "active_courses": len(courses.data) if courses.data else 0,
        "total_students": total_students,
        "avg_score": avg_score,
        "courses": courses.data if courses.data else [],
    }


@router.post("/courses")
async def create_course(course: CourseCreate, user=Depends(get_current_user_roles)):
    """Create a new course"""
    if user["role"] != "educator":
        raise HTTPException(status_code=403, detail="Educator access required")

    profile = (
        supabase.table("profiles")
        .select("institution_id")
        .eq("id", user["id"])
        .execute()
    )
    institution_id = profile.data[0]["institution_id"] if profile.data else None

    new_course = supabase.table("courses").insert(
        {
            "title": course.title,
            "description": course.description,
            "subject": course.subject,
            "grade_level": course.grade_level,
            "difficulty": course.difficulty,
            "primary_language": course.primary_language,
            "educator_id": user["id"],
            "institution_id": institution_id,
            "status": "draft",
        }
    ).execute()

    return {
        "success": True,
        "course_id": new_course.data[0]["id"] if new_course.data else None,
        "message": "Course created successfully",
    }


@router.get("/courses")
async def get_educator_courses(user=Depends(get_current_user_roles)):
    """Get all courses created by educator"""
    if user["role"] != "educator":
        raise HTTPException(status_code=403, detail="Educator access required")

    courses = (
        supabase.table("courses")
        .select("*")
        .eq("educator_id", user["id"])
        .order("created_at", desc=True)
        .execute()
    )

    return {"courses": courses.data if courses.data else []}


@router.patch("/courses/{course_id}/publish")
async def publish_course(course_id: str, user=Depends(get_current_user_roles)):
    """Publish a draft course"""
    if user["role"] != "educator":
        raise HTTPException(status_code=403, detail="Educator access required")

    course = (
        supabase.table("courses")
        .select("educator_id")
        .eq("id", course_id)
        .execute()
    )
    if not course.data or course.data[0]["educator_id"] != user["id"]:
        raise HTTPException(status_code=403, detail="Not your course")

    supabase.table("courses").update({"status": "published"}).eq(
        "id", course_id
    ).execute()

    return {"success": True, "message": "Course published"}


@router.post("/courses/{course_id}/modules")
async def add_module(
    course_id: str, module: ModuleCreate, user=Depends(get_current_user_roles)
):
    """Add a module/lesson to a course"""
    if user["role"] != "educator":
        raise HTTPException(status_code=403, detail="Educator access required")

    course = (
        supabase.table("courses")
        .select("educator_id, total_modules")
        .eq("id", course_id)
        .execute()
    )
    if not course.data or course.data[0]["educator_id"] != user["id"]:
        raise HTTPException(status_code=403, detail="Not your course")

    new_module = supabase.table("modules").insert(
        {
            "course_id": course_id,
            "title": module.title,
            "description": module.description,
            "order_index": module.order_index,
            "content": module.content,
            "duration_minutes": module.duration_minutes,
            "points_value": module.points_value,
        }
    ).execute()

    # Update total_modules count
    current_count = course.data[0].get("total_modules", 0) or 0
    supabase.table("courses").update({"total_modules": current_count + 1}).eq(
        "id", course_id
    ).execute()

    return {
        "success": True,
        "module_id": new_module.data[0]["id"] if new_module.data else None,
        "message": "Module added successfully",
    }


@router.post("/modules/{module_id}/quizzes")
async def add_quiz(
    module_id: str, quiz: QuizCreate, user=Depends(get_current_user_roles)
):
    """Add a quiz to a module"""
    if user["role"] != "educator":
        raise HTTPException(status_code=403, detail="Educator access required")

    new_quiz = supabase.table("quizzes").insert(
        {
            "module_id": module_id,
            "title": quiz.title,
            "description": quiz.description,
            "time_limit_minutes": quiz.time_limit_minutes,
            "passing_score": quiz.passing_score,
            "questions": quiz.questions,
        }
    ).execute()

    return {
        "success": True,
        "quiz_id": new_quiz.data[0]["id"] if new_quiz.data else None,
        "message": "Quiz created successfully",
    }


@router.get("/students")
async def get_students(
    course_id: Optional[str] = None, user=Depends(get_current_user_roles)
):
    """Get students enrolled in educator's courses"""
    if user["role"] != "educator":
        raise HTTPException(status_code=403, detail="Educator access required")

    query = supabase.table("courses").select("id").eq("educator_id", user["id"])
    if course_id:
        query = query.eq("id", course_id)

    courses = query.execute()
    course_ids = [c["id"] for c in courses.data] if courses.data else []

    if not course_ids:
        return {"students": []}

    enrollments = (
        supabase.table("enrollments")
        .select("*, profiles(id, full_name, avatar_url, grade_level), courses(title)")
        .in_("course_id", course_ids)
        .execute()
    )

    student_ids = (
        list(set(e["user_id"] for e in enrollments.data)) if enrollments.data else []
    )

    # Calculate avg scores per student
    avg_scores = {}
    if student_ids:
        attempts = (
            supabase.table("quiz_attempts")
            .select("user_id, percentage")
            .in_("user_id", student_ids)
            .execute()
        )
        scores: dict = {}
        for att in (attempts.data or []):
            uid = att["user_id"]
            scores.setdefault(uid, []).append(att["percentage"])
        for uid, score_list in scores.items():
            avg_scores[uid] = round(sum(score_list) / len(score_list), 1)

    return {
        "students": [
            {
                "id": e["user_id"],
                "name": e["profiles"]["full_name"] if e.get("profiles") else "Unknown",
                "grade_level": e["profiles"]["grade_level"] if e.get("profiles") else None,
                "course_title": e["courses"]["title"] if e.get("courses") else None,
                "progress": e["progress_percent"],
                "avg_score": avg_scores.get(e["user_id"], 0),
                "enrolled_at": e["enrolled_at"],
                "status": e["status"],
            }
            for e in (enrollments.data or [])
        ]
    }