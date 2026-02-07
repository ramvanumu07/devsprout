-- ============================================================================
-- OPTIMIZE UNUSED/NULLABLE COLUMNS
-- ============================================================================
-- This script analyzes and optimizes columns that are frequently NULL

-- Step 1: Analyze current NULL values in users table
SELECT 
    'users' as table_name,
    COUNT(*) as total_records,
    COUNT(access_expires_at) as access_expires_at_not_null,
    COUNT(email_verified) as email_verified_not_null,
    COUNT(last_login) as last_login_not_null,
    COUNT(security_question) as security_question_not_null,
    COUNT(security_answer) as security_answer_not_null,
    -- Calculate percentages
    ROUND(100.0 * COUNT(access_expires_at) / COUNT(*), 2) as access_expires_usage_pct,
    ROUND(100.0 * COUNT(email_verified) / COUNT(*), 2) as email_verified_usage_pct,
    ROUND(100.0 * COUNT(last_login) / COUNT(*), 2) as last_login_usage_pct,
    ROUND(100.0 * COUNT(security_question) / COUNT(*), 2) as security_question_usage_pct,
    ROUND(100.0 * COUNT(security_answer) / COUNT(*), 2) as security_answer_usage_pct
FROM users;

-- Step 2: Check if email_verified is always FALSE (unused feature)
SELECT 
    'email_verified_analysis' as analysis,
    COUNT(*) as total_users,
    COUNT(CASE WHEN email_verified = true THEN 1 END) as verified_users,
    COUNT(CASE WHEN email_verified = false THEN 1 END) as unverified_users,
    COUNT(CASE WHEN email_verified IS NULL THEN 1 END) as null_values
FROM users;

-- Step 3: Check security questions usage
SELECT 
    'security_questions_analysis' as analysis,
    COUNT(*) as total_users,
    COUNT(CASE WHEN security_question IS NOT NULL AND security_question != '' THEN 1 END) as users_with_security_questions,
    COUNT(CASE WHEN security_answer IS NOT NULL AND security_answer != '' THEN 1 END) as users_with_security_answers
FROM users;

-- Step 4: Check access_expires_at usage (temporary access)
SELECT 
    'access_expires_analysis' as analysis,
    COUNT(*) as total_users,
    COUNT(CASE WHEN access_expires_at IS NOT NULL THEN 1 END) as users_with_expiry,
    COUNT(CASE WHEN access_expires_at IS NOT NULL AND access_expires_at > NOW() THEN 1 END) as users_with_future_expiry
FROM users;

-- ============================================================================
-- OPTIMIZATION RECOMMENDATIONS
-- ============================================================================

-- Option A: If email verification is not used, consider removing the column
-- ONLY RUN THIS IF email_verified is always FALSE and you don't plan to use it
/*
ALTER TABLE users DROP COLUMN IF EXISTS email_verified;
-- Remove the index too
DROP INDEX IF EXISTS idx_users_email_verified;
*/

-- Option B: If security questions are rarely used, consider making them optional
-- This is already the case (they're nullable), so no change needed

-- Option C: Add index on security_question only if it's frequently used for lookups
-- Currently there's an index, but it might be unnecessary if rarely used
-- Check if this index is actually used:
/*
DROP INDEX IF EXISTS idx_users_security_question;
*/

-- Option D: Clean up empty security questions/answers (convert empty strings to NULL)
UPDATE users 
SET 
    security_question = NULL 
WHERE security_question = '' OR security_question = ' ';

UPDATE users 
SET 
    security_answer = NULL 
WHERE security_answer = '' OR security_answer = ' ';

-- ============================================================================
-- PERFORMANCE OPTIMIZATIONS
-- ============================================================================

-- Add partial indexes for frequently queried non-null values
CREATE INDEX IF NOT EXISTS idx_users_active_sessions 
ON users(id) 
WHERE last_login IS NOT NULL AND has_access = true;

-- Add index for users with temporary access
CREATE INDEX IF NOT EXISTS idx_users_temporary_access 
ON users(access_expires_at) 
WHERE access_expires_at IS NOT NULL;

-- Remove unnecessary index on security_question if it's rarely used
-- Uncomment if security questions are not frequently searched
-- DROP INDEX IF EXISTS idx_users_security_question;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Final verification of optimizations
SELECT 
    'final_verification' as check_type,
    COUNT(*) as total_users,
    COUNT(CASE WHEN security_question IS NOT NULL AND security_question != '' THEN 1 END) as clean_security_questions,
    COUNT(CASE WHEN security_answer IS NOT NULL AND security_answer != '' THEN 1 END) as clean_security_answers,
    COUNT(CASE WHEN last_login IS NOT NULL THEN 1 END) as users_who_logged_in,
    COUNT(CASE WHEN access_expires_at IS NOT NULL THEN 1 END) as users_with_temp_access
FROM users;

-- Check index usage (this would need to be run after some application usage)
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan as times_used,
    idx_tup_read as tuples_read,
    idx_tup_fetch as tuples_fetched
FROM pg_stat_user_indexes 
WHERE tablename = 'users'
ORDER BY idx_scan DESC;

-- ============================================================================
-- COLUMN OPTIMIZATION COMPLETE
-- ============================================================================