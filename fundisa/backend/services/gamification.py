from supabase_client import supabase


def award_badge(user_id: str, badge_name: str) -> bool:
    """Award a badge to a user if they don't already have it. Returns True if awarded."""
    try:
        badge = (
            supabase.table("badges").select("id").eq("name", badge_name).execute()
        )
        if not badge.data:
            return False

        badge_id = badge.data[0]["id"]
        existing = (
            supabase.table("user_badges")
            .select("id")
            .eq("user_id", user_id)
            .eq("badge_id", badge_id)
            .execute()
        )
        if existing.data:
            return False  # Already has it

        supabase.table("user_badges").insert(
            {"user_id": user_id, "badge_id": badge_id}
        ).execute()
        return True
    except Exception as e:
        print(f"Error awarding badge '{badge_name}': {e}")
        return False


def add_points(
    user_id: str, points: int, reason: str, reference_id: str = None
) -> bool:
    """Add points to a user's log."""
    try:
        supabase.table("points_log").insert(
            {
                "user_id": user_id,
                "points": points,
                "reason": reason,
                "reference_id": reference_id,
            }
        ).execute()
        return True
    except Exception as e:
        print(f"Error adding points: {e}")
        return False


def get_user_total_points(user_id: str) -> int:
    """Get a user's total accumulated points."""
    try:
        result = (
            supabase.table("points_log")
            .select("points")
            .eq("user_id", user_id)
            .execute()
        )
        return sum(p["points"] for p in (result.data or []))
    except Exception:
        return 0


def check_and_award_streak_badge(user_id: str):
    """Check study streak and award streak badges."""
    from datetime import datetime, timedelta

    try:
        thirty_days_ago = datetime.now() - timedelta(days=30)
        activity = (
            supabase.table("activity_log")
            .select("created_at")
            .eq("user_id", user_id)
            .gte("created_at", thirty_days_ago.isoformat())
            .execute()
        )

        if not activity.data:
            return

        unique_days = sorted(
            set(a["created_at"][:10] for a in activity.data), reverse=True
        )

        # Calculate current streak
        streak = 0
        today = datetime.now().date()
        for i, day_str in enumerate(unique_days):
            day = datetime.strptime(day_str, "%Y-%m-%d").date()
            expected = today - timedelta(days=i)
            if day == expected:
                streak += 1
            else:
                break

        if streak >= 30:
            award_badge(user_id, "Consistent")
        if streak >= 7:
            award_badge(user_id, "Week Warrior")

    except Exception as e:
        print(f"Error checking streak: {e}")