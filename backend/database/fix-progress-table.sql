-- ============================================================================
-- CRITICAL FIX: Progress Table Structure
-- ============================================================================
-- This fixes the progress table which is missing primary key and constraints

-- Step 1: Backup existing data (if any)
CREATE TABLE IF NOT EXISTS progress_backup AS 
SELECT * FROM progress WHERE user_id IS NOT NULL AND topic_id IS NOT NULL;

-- Step 2: Drop and recreate progress table with proper structure
DROP TABLE IF EXISTS progress CASCADE;

CREATE TABLE progress (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
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

-- Step 3: Restore data from backup (if any exists)
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
FROM progress_backup
WHERE user_id IS NOT NULL AND topic_id IS NOT NULL;

-- Step 4: Recreate indexes
CREATE INDEX IF NOT EXISTS idx_progress_user ON progress(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_user_topic ON progress(user_id, topic_id);
CREATE INDEX IF NOT EXISTS idx_progress_status ON progress(status);
CREATE INDEX IF NOT EXISTS idx_progress_phase ON progress(phase);
CREATE INDEX IF NOT EXISTS idx_progress_last_accessed ON progress(last_accessed);
CREATE INDEX IF NOT EXISTS idx_progress_updated ON progress(updated_at);

-- Step 5: Add trigger for auto-update timestamps
CREATE TRIGGER update_progress_updated_at 
    BEFORE UPDATE ON progress 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Step 6: Clean up backup table
DROP TABLE IF EXISTS progress_backup;

-- Verification
SELECT 
    'progress' as table_name,
    COUNT(*) as record_count,
    COUNT(CASE WHEN user_id IS NULL THEN 1 END) as null_user_ids,
    COUNT(CASE WHEN topic_id IS NULL THEN 1 END) as null_topic_ids
FROM progress;

COMMENT ON TABLE progress IS 'Learning progress tracking per topic (fixed structure)';
COMMENT ON COLUMN progress.topic_id IS 'Single-level topic ID (e.g., console-log, variables)';
COMMENT ON COLUMN progress.status IS 'Progress status: not_started, in_progress, completed, locked';
COMMENT ON COLUMN progress.phase IS 'Current learning phase: session, playtime, assignment, feedback, completed';

-- ============================================================================
-- PROGRESS TABLE FIX COMPLETE
-- ============================================================================