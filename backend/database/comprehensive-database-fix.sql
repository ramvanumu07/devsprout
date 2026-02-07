-- ============================================================================
-- COMPREHENSIVE DATABASE OPTIMIZATION & FIXES
-- Sara Learning Platform - Database Issues Resolution
-- ============================================================================
-- 
-- This script fixes all identified database issues:
-- 1. Progress table missing primary key and constraints
-- 2. Unused/nullable columns optimization
-- 3. Performance improvements
-- 4. Data integrity fixes
-- 
-- BACKUP YOUR DATA BEFORE RUNNING THIS SCRIPT!
-- ============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

BEGIN;

-- ============================================================================
-- STEP 1: ANALYZE CURRENT DATA QUALITY
-- ============================================================================

-- Create temporary analysis table
CREATE TEMP TABLE analysis_results (
    check_name TEXT,
    table_name TEXT,
    issue_count INTEGER,
    total_count INTEGER,
    issue_percentage DECIMAL,
    description TEXT
);

-- Analyze users table issues
INSERT INTO analysis_results
SELECT 
    'null_security_questions',
    'users',
    COUNT(CASE WHEN security_question IS NULL OR security_question = '' THEN 1 END),
    COUNT(*),
    ROUND(100.0 * COUNT(CASE WHEN security_question IS NULL OR security_question = '' THEN 1 END) / COUNT(*), 2),
    'Users without security questions'
FROM users;

INSERT INTO analysis_results
SELECT 
    'never_logged_in',
    'users',
    COUNT(CASE WHEN last_login IS NULL THEN 1 END),
    COUNT(*),
    ROUND(100.0 * COUNT(CASE WHEN last_login IS NULL THEN 1 END) / COUNT(*), 2),
    'Users who never logged in'
FROM users;

INSERT INTO analysis_results
SELECT 
    'email_unverified',
    'users',
    COUNT(CASE WHEN email_verified = false OR email_verified IS NULL THEN 1 END),
    COUNT(*),
    ROUND(100.0 * COUNT(CASE WHEN email_verified = false OR email_verified IS NULL THEN 1 END) / COUNT(*), 2),
    'Users with unverified emails'
FROM users;

-- Analyze progress table issues
INSERT INTO analysis_results
SELECT 
    'progress_null_ids',
    'progress',
    COUNT(CASE WHEN id IS NULL OR user_id IS NULL OR topic_id IS NULL THEN 1 END),
    COUNT(*),
    ROUND(100.0 * COUNT(CASE WHEN id IS NULL OR user_id IS NULL OR topic_id IS NULL THEN 1 END) / COUNT(*), 2),
    'Progress records with NULL critical fields'
FROM progress;

-- Display analysis results
SELECT 
    '=== DATABASE ANALYSIS RESULTS ===' as analysis_header,
    check_name,
    table_name,
    issue_count,
    total_count,
    issue_percentage || '%' as percentage,
    description
FROM analysis_results
ORDER BY table_name, issue_percentage DESC;

-- ============================================================================
-- STEP 2: BACKUP EXISTING DATA
-- ============================================================================

-- Backup progress table before major changes
CREATE TABLE IF NOT EXISTS progress_backup_comprehensive AS 
SELECT * FROM progress;

-- Backup users with problematic data
CREATE TABLE IF NOT EXISTS users_backup_comprehensive AS 
SELECT * FROM users 
WHERE security_question = '' OR security_answer = '' OR email_verified IS NULL;

-- ============================================================================
-- STEP 3: FIX PROGRESS TABLE STRUCTURE
-- ============================================================================

-- Check if progress table has proper primary key
DO $$
BEGIN
    -- If progress table doesn't have proper constraints, fix it
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'progress' 
        AND constraint_type = 'PRIMARY KEY'
        AND table_schema = 'public'
    ) THEN
        
        RAISE NOTICE 'Fixing progress table structure...';
        
        -- Drop existing progress table
        DROP TABLE IF EXISTS progress CASCADE;
        
        -- Recreate with proper structure
        CREATE TABLE progress (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            topic_id VARCHAR(100) NOT NULL,
            
            -- Progress tracking
            status VARCHAR(50) DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed', 'locked')),
            phase VARCHAR(50) DEFAULT 'session' CHECK (phase IN ('session', 'playtime', 'assignment', 'feedback', 'completed')),
            
            -- Task tracking
            current_task INTEGER DEFAULT 0,
            total_tasks INTEGER DEFAULT 0,
            assignments_completed INTEGER DEFAULT 0,
            hints_used INTEGER DEFAULT 0,
            
            -- Learning state
            concept_revealed BOOLEAN DEFAULT false,
            saved_code TEXT DEFAULT '',
            current_outcome_index INTEGER DEFAULT 0,
            
            -- Timestamps
            started_at TIMESTAMP WITH TIME ZONE,
            completed_at TIMESTAMP WITH TIME ZONE,
            last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            
            -- Constraints
            UNIQUE(user_id, topic_id),
            CONSTRAINT progress_task_bounds CHECK (current_task >= 0 AND current_task <= total_tasks),
            CONSTRAINT progress_hints_positive CHECK (hints_used >= 0),
            CONSTRAINT progress_outcome_positive CHECK (current_outcome_index >= 0)
        );
        
        -- Restore data from backup
        INSERT INTO progress (
            user_id, topic_id, status, phase, current_task, total_tasks, 
            assignments_completed, hints_used, concept_revealed, saved_code, 
            current_outcome_index, started_at, completed_at, last_accessed, 
            created_at, updated_at
        )
        SELECT 
            user_id, topic_id, 
            COALESCE(status, 'not_started'),
            COALESCE(phase, 'session'),
            COALESCE(current_task, 0),
            COALESCE(total_tasks, 0),
            COALESCE(assignments_completed, 0),
            COALESCE(hints_used, 0),
            COALESCE(concept_revealed, false),
            COALESCE(saved_code, ''),
            COALESCE(current_outcome_index, 0),
            started_at,
            completed_at,
            COALESCE(last_accessed, NOW()),
            COALESCE(created_at, NOW()),
            COALESCE(updated_at, NOW())
        FROM progress_backup_comprehensive
        WHERE user_id IS NOT NULL AND topic_id IS NOT NULL;
        
        RAISE NOTICE 'Progress table structure fixed and data restored.';
    ELSE
        RAISE NOTICE 'Progress table structure is already correct.';
    END IF;
END $$;

-- ============================================================================
-- STEP 4: CLEAN UP DATA QUALITY ISSUES
-- ============================================================================

-- Clean up empty security questions/answers
UPDATE users 
SET security_question = NULL 
WHERE security_question = '' OR security_question = ' ' OR TRIM(security_question) = '';

UPDATE users 
SET security_answer = NULL 
WHERE security_answer = '' OR security_answer = ' ' OR TRIM(security_answer) = '';

-- Ensure email_verified has proper default
UPDATE users 
SET email_verified = false 
WHERE email_verified IS NULL;

-- ============================================================================
-- STEP 5: OPTIMIZE INDEXES
-- ============================================================================

-- Drop potentially unused indexes
DROP INDEX IF EXISTS idx_users_security_question;

-- Create optimized indexes
CREATE INDEX IF NOT EXISTS idx_users_active_users 
ON users(id, has_access) 
WHERE has_access = true;

CREATE INDEX IF NOT EXISTS idx_users_recent_login 
ON users(last_login) 
WHERE last_login IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_users_temporary_access 
ON users(access_expires_at) 
WHERE access_expires_at IS NOT NULL;

-- Progress table indexes
CREATE INDEX IF NOT EXISTS idx_progress_user ON progress(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_user_topic ON progress(user_id, topic_id);
CREATE INDEX IF NOT EXISTS idx_progress_status ON progress(status);
CREATE INDEX IF NOT EXISTS idx_progress_phase ON progress(phase);
CREATE INDEX IF NOT EXISTS idx_progress_last_accessed ON progress(last_accessed);
CREATE INDEX IF NOT EXISTS idx_progress_updated ON progress(updated_at);

-- Chat sessions indexes (ensure they exist)
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user ON chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_topic ON chat_sessions(user_id, topic_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_last_message ON chat_sessions(last_message_at);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_phase ON chat_sessions(phase);

-- ============================================================================
-- STEP 6: ADD MISSING TRIGGERS
-- ============================================================================

-- Ensure update timestamp function exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for all tables that need them
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_progress_updated_at ON progress;
CREATE TRIGGER update_progress_updated_at 
    BEFORE UPDATE ON progress 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- STEP 7: ADD USEFUL UTILITY FUNCTIONS
-- ============================================================================

-- Function to clean up old sessions
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM user_sessions WHERE expires_at < NOW();
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    DELETE FROM password_reset_tokens WHERE expires_at < NOW();
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Function to get user statistics
CREATE OR REPLACE FUNCTION get_user_statistics()
RETURNS TABLE (
    total_users INTEGER,
    active_users INTEGER,
    users_with_progress INTEGER,
    users_with_chat_history INTEGER,
    avg_topics_per_user DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::INTEGER as total_users,
        COUNT(CASE WHEN has_access = true THEN 1 END)::INTEGER as active_users,
        (SELECT COUNT(DISTINCT user_id) FROM progress)::INTEGER as users_with_progress,
        (SELECT COUNT(DISTINCT user_id) FROM chat_sessions)::INTEGER as users_with_chat_history,
        COALESCE((SELECT ROUND(AVG(topic_count), 2) FROM (
            SELECT COUNT(*) as topic_count FROM progress GROUP BY user_id
        ) t), 0) as avg_topics_per_user
    FROM users;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- STEP 8: FINAL VERIFICATION
-- ============================================================================

-- Verify all tables have proper structure
SELECT 
    'table_verification' as check_type,
    table_name,
    CASE 
        WHEN table_name = 'users' THEN 'Users table'
        WHEN table_name = 'progress' THEN 'Progress table (fixed)'
        WHEN table_name = 'chat_sessions' THEN 'Chat sessions table'
        WHEN table_name = 'admins' THEN 'Admins table'
        WHEN table_name = 'password_reset_tokens' THEN 'Password reset tokens'
        WHEN table_name = 'user_sessions' THEN 'User sessions'
        WHEN table_name = 'learning_analytics' THEN 'Learning analytics'
    END as description,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name AND table_schema = 'public') as column_count
FROM (VALUES 
    ('users'), ('progress'), ('chat_sessions'), ('admins'), 
    ('password_reset_tokens'), ('user_sessions'), ('learning_analytics')
) t(table_name)
ORDER BY table_name;

-- Check for any remaining NULL critical fields
SELECT 
    'data_integrity_check' as check_type,
    'progress' as table_name,
    COUNT(*) as total_records,
    COUNT(CASE WHEN id IS NULL THEN 1 END) as null_ids,
    COUNT(CASE WHEN user_id IS NULL THEN 1 END) as null_user_ids,
    COUNT(CASE WHEN topic_id IS NULL THEN 1 END) as null_topic_ids
FROM progress;

-- Display optimization results
SELECT 
    '=== OPTIMIZATION COMPLETE ===' as result_header,
    (SELECT COUNT(*) FROM users) as total_users,
    (SELECT COUNT(*) FROM progress) as total_progress_records,
    (SELECT COUNT(*) FROM chat_sessions) as total_chat_sessions,
    (SELECT COUNT(*) FROM user_sessions WHERE expires_at > NOW()) as active_sessions;

-- Show final analysis
SELECT * FROM get_user_statistics();

COMMIT;

-- ============================================================================
-- CLEANUP COMMANDS (Run separately if needed)
-- ============================================================================

-- Clean up backup tables (uncomment to run)
-- DROP TABLE IF EXISTS progress_backup_comprehensive;
-- DROP TABLE IF EXISTS users_backup_comprehensive;

-- ============================================================================
-- COMPREHENSIVE DATABASE FIX COMPLETE
-- ============================================================================

-- Summary of changes made:
-- ✅ Fixed progress table structure (added primary key and constraints)
-- ✅ Cleaned up empty string data in security fields
-- ✅ Optimized indexes for better performance
-- ✅ Added proper triggers for timestamp updates
-- ✅ Created utility functions for maintenance
-- ✅ Verified data integrity
-- 
-- Your database is now optimized and all issues have been resolved!