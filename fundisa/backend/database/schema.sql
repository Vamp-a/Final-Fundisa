-- ============================================================
-- FUNDISA COMPLETE DATABASE SCHEMA
-- Run this entire file in Supabase SQL Editor (once)
-- Project: Fundisa — AI-Powered Multilingual Education Platform
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. INSTITUTIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS institutions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    province TEXT,
    institution_type TEXT CHECK (
        institution_type IN ('primary', 'secondary', 'university', 'tvet', 'other')
    ),
    subscription_plan TEXT DEFAULT 'starter',
    subscription_status TEXT DEFAULT 'trial',   -- trial, active, suspended
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 2. PROFILES  (extends Supabase auth.users)
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    institution_id UUID REFERENCES institutions(id) ON DELETE SET NULL,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    role TEXT NOT NULL CHECK (role IN ('student', 'educator', 'admin')),
    -- Student fields
    grade_level INTEGER CHECK (grade_level BETWEEN 1 AND 12),
    -- Educator fields
    department TEXT,
    -- Admin fields
    permissions JSONB DEFAULT '[]'::jsonb,
    -- Common
    phone_number TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 3. USER LANGUAGES
-- ============================================================
CREATE TABLE IF NOT EXISTS user_languages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    language_code TEXT NOT NULL,  -- 'en', 'zu', 'xh', 'af', 'st', 'tn', etc.
    proficiency_level TEXT DEFAULT 'learning',  -- 'native', 'learning', 'intermediate'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, language_code)
);

-- ============================================================
-- 4. COURSES
-- ============================================================
CREATE TABLE IF NOT EXISTS courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id UUID REFERENCES institutions(id) ON DELETE CASCADE,
    educator_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    subject TEXT,
    grade_level INTEGER,
    difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    primary_language TEXT DEFAULT 'en',
    status TEXT DEFAULT 'draft',   -- draft, published, archived
    total_modules INTEGER DEFAULT 0,
    total_points INTEGER DEFAULT 0,
    thumbnail_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 5. MODULES  (lessons inside a course)
-- ============================================================
CREATE TABLE IF NOT EXISTS modules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL,
    content TEXT,          -- Rich text / markdown lesson content
    video_url TEXT,
    ai_explainer_generated BOOLEAN DEFAULT FALSE,
    duration_minutes INTEGER,
    points_value INTEGER DEFAULT 10,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 6. QUIZZES
-- ============================================================
CREATE TABLE IF NOT EXISTS quizzes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    time_limit_minutes INTEGER,
    passing_score INTEGER DEFAULT 70,
    -- questions format: [{"question": "...", "options": ["a","b","c","d"], "correct_answer": "a", "points": 10}]
    questions JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 7. ENROLLMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMPTZ DEFAULT NOW(),
    progress_percent INTEGER DEFAULT 0,
    total_points_earned INTEGER DEFAULT 0,
    status TEXT DEFAULT 'active',   -- active, completed, dropped
    last_accessed TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, course_id)
);

-- ============================================================
-- 8. QUIZ ATTEMPTS
-- ============================================================
CREATE TABLE IF NOT EXISTS quiz_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
    score INTEGER,
    max_score INTEGER,
    percentage INTEGER,
    answers JSONB,
    time_spent_seconds INTEGER,
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 9. BADGES & USER BADGES
-- ============================================================
CREATE TABLE IF NOT EXISTS badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    icon_url TEXT,
    category TEXT,   -- 'streak', 'quiz', 'completion', 'engagement'
    points_required INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    badge_id UUID REFERENCES badges(id) ON DELETE CASCADE,
    earned_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, badge_id)
);

-- ============================================================
-- 10. POINTS LOG
-- ============================================================
CREATE TABLE IF NOT EXISTS points_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    points INTEGER NOT NULL,
    reason TEXT,   -- 'quiz_completed', 'module_completed', 'streak_bonus'
    reference_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 11. AI USAGE LOG
-- ============================================================
CREATE TABLE IF NOT EXISTS ai_usage_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id UUID REFERENCES institutions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    feature TEXT NOT NULL,   -- 'translation', 'quiz_generation', 'explainer', 'chat'
    language TEXT,
    tokens_used INTEGER DEFAULT 0,
    cost_estimate DECIMAL(10,6) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 12. ACTIVITY LOG
-- ============================================================
CREATE TABLE IF NOT EXISTS activity_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    resource_type TEXT,
    resource_id UUID,
    metadata JSONB,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INDEXES  (for fast queries)
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_institution ON profiles(institution_id);
CREATE INDEX IF NOT EXISTS idx_courses_educator ON courses(educator_id);
CREATE INDEX IF NOT EXISTS idx_courses_institution ON courses(institution_id);
CREATE INDEX IF NOT EXISTS idx_courses_status ON courses(status);
CREATE INDEX IF NOT EXISTS idx_enrollments_user ON enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course ON enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_modules_course ON modules(course_id);
CREATE INDEX IF NOT EXISTS idx_quizzes_module ON quizzes(module_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user ON quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_quiz ON quiz_attempts(quiz_id);
CREATE INDEX IF NOT EXISTS idx_points_log_user ON points_log(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_user ON activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_created ON activity_log(created_at);

-- ============================================================
-- TRIGGER: auto-update updated_at timestamps
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_courses_updated_at
    BEFORE UPDATE ON courses
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_modules_updated_at
    BEFORE UPDATE ON modules
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE points_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_usage_log ENABLE ROW LEVEL SECURITY;

-- PROFILES policies
CREATE POLICY "Users can view their own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles in their institution"
    ON profiles FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles admin_p
            WHERE admin_p.id = auth.uid()
              AND admin_p.role = 'admin'
              AND admin_p.institution_id = profiles.institution_id
        )
    );

CREATE POLICY "Educators can view student profiles in their institution"
    ON profiles FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles edu_p
            WHERE edu_p.id = auth.uid()
              AND edu_p.role = 'educator'
              AND edu_p.institution_id = profiles.institution_id
        )
    );

-- COURSES policies
CREATE POLICY "Anyone in institution can view published courses"
    ON courses FOR SELECT
    USING (
        status = 'published'
        AND EXISTS (
            SELECT 1 FROM profiles p
            WHERE p.id = auth.uid()
              AND p.institution_id = courses.institution_id
        )
    );

CREATE POLICY "Educators can manage their own courses"
    ON courses FOR ALL
    USING (educator_id = auth.uid());

CREATE POLICY "Admins can manage institution courses"
    ON courses FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM profiles p
            WHERE p.id = auth.uid()
              AND p.role = 'admin'
              AND p.institution_id = courses.institution_id
        )
    );

-- MODULES policies
CREATE POLICY "Enrolled students can view modules"
    ON modules FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM enrollments e
            WHERE e.user_id = auth.uid()
              AND e.course_id = modules.course_id
        )
    );

CREATE POLICY "Educators can manage modules in their courses"
    ON modules FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM courses c
            WHERE c.id = modules.course_id
              AND c.educator_id = auth.uid()
        )
    );

-- ENROLLMENTS policies
CREATE POLICY "Students can view their own enrollments"
    ON enrollments FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Students can create their own enrollments"
    ON enrollments FOR INSERT
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Educators can view enrollments for their courses"
    ON enrollments FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM courses c
            WHERE c.id = enrollments.course_id
              AND c.educator_id = auth.uid()
        )
    );

-- QUIZ ATTEMPTS policies
CREATE POLICY "Students can view and create their own quiz attempts"
    ON quiz_attempts FOR ALL
    USING (user_id = auth.uid());

CREATE POLICY "Educators can view attempts for their quizzes"
    ON quiz_attempts FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM quizzes q
            JOIN modules m ON m.id = q.module_id
            JOIN courses c ON c.id = m.course_id
            WHERE q.id = quiz_attempts.quiz_id
              AND c.educator_id = auth.uid()
        )
    );

-- BADGES — everyone can read
CREATE POLICY "Anyone can view badges"
    ON badges FOR SELECT USING (true);

-- USER BADGES
CREATE POLICY "Users can view their own badges"
    ON user_badges FOR SELECT
    USING (user_id = auth.uid());

-- POINTS LOG
CREATE POLICY "Users can view their own points"
    ON points_log FOR SELECT
    USING (user_id = auth.uid());

-- ACTIVITY LOG
CREATE POLICY "Users can view their own activity"
    ON activity_log FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own activity"
    ON activity_log FOR INSERT
    WITH CHECK (user_id = auth.uid());

-- ============================================================
-- SEED DATA — Default badges
-- ============================================================
INSERT INTO badges (name, description, category, points_required) VALUES
('Week Warrior',   '7-day study streak',              'streak',     7),
('Consistent',     '30-day study streak',             'streak',     30),
('Quiz Master',    'Score 90%+ on 5 quizzes',         'quiz',       5),
('100% Perfect',   'Score 100% on any quiz',          'quiz',       1),
('Early Bird',     'Study before 8AM for 7 days',     'engagement', 7),
('Night Owl',      'Study after 10PM for 7 days',     'engagement', 7),
('Speed Demon',    'Complete 5 lessons in one day',   'completion', 5),
('Marathon',       'Study for 6+ hours in one day',   'engagement', 360)
ON CONFLICT (name) DO NOTHING;  