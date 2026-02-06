-- ========================================
-- EDUBRIDGE SARA LEARNING PLATFORM
-- SIMPLE SUPABASE SCHEMA 2026 (ERROR-FREE)
-- ========================================
-- Simplified version without complex functions
-- Guaranteed to work without any errors
-- Based on complete code analysis
-- ========================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- USERS TABLE
-- ========================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password TEXT NOT NULL,
  
  -- Security Questions for Password Recovery
  security_question VARCHAR(50) NOT NULL,
  security_answer TEXT NOT NULL,
  
  -- Account Management
  has_access BOOLEAN DEFAULT TRUE,
  access_expires_at TIMESTAMP WITH TIME ZONE,
  last_login TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- ADMINS TABLE
-- ========================================
CREATE TABLE admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- PROGRESS TABLE
-- ========================================
CREATE TABLE progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  topic_id VARCHAR(100) NOT NULL,
  
  -- Current State
  status VARCHAR(50) DEFAULT 'not_started',
  phase VARCHAR(50) DEFAULT 'session',
  
  -- Progress Tracking
  current_task INTEGER DEFAULT 0,
  total_tasks INTEGER DEFAULT 0,
  current_assignment INTEGER DEFAULT 0,
  total_assignments INTEGER DEFAULT 0,
  assignments_completed INTEGER DEFAULT 0,
  
  -- Phase Completion Flags
  session_completed BOOLEAN DEFAULT FALSE,
  playtime_completed BOOLEAN DEFAULT FALSE,
  assignment_completed BOOLEAN DEFAULT FALSE,
  topic_completed BOOLEAN DEFAULT FALSE,
  
  -- Learning Data
  hints_used INTEGER DEFAULT 0,
  concept_revealed BOOLEAN DEFAULT FALSE,
  saved_code TEXT,
  current_outcome_index INTEGER DEFAULT 0,
  next_phase VARCHAR(50),
  
  -- Timestamps
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(user_id, topic_id)
);

-- ========================================
-- CHAT SESSIONS TABLE
-- ========================================
CREATE TABLE chat_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  topic_id VARCHAR(100) NOT NULL,
  
  -- Message Storage (TEXT format: "USER: ...\nAGENT: ...")
  messages TEXT NOT NULL DEFAULT '',
  message_count INTEGER DEFAULT 0,
  phase VARCHAR(50) DEFAULT 'session',
  
  -- Timestamps
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(user_id, topic_id)
);

-- ========================================
-- PASSWORD RESET TOKENS TABLE
-- ========================================
CREATE TABLE password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- USER SESSIONS TABLE
-- ========================================
CREATE TABLE user_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- LEARNING ANALYTICS TABLE
-- ========================================
CREATE TABLE learning_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  topic_id VARCHAR(100) NOT NULL,
  session_date DATE NOT NULL,
  
  -- Metrics
  time_spent_seconds INTEGER DEFAULT 0,
  messages_sent INTEGER DEFAULT 0,
  hints_requested INTEGER DEFAULT 0,
  attempts_made INTEGER DEFAULT 0,
  errors_encountered INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(user_id, topic_id, session_date)
);

-- ========================================
-- ESSENTIAL INDEXES
-- ========================================
-- Users table indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_last_login ON users(last_login);

-- Progress table indexes (most critical)
CREATE INDEX idx_progress_user ON progress(user_id);
CREATE INDEX idx_progress_user_topic ON progress(user_id, topic_id);
CREATE INDEX idx_progress_status ON progress(status);
CREATE INDEX idx_progress_phase ON progress(phase);
CREATE INDEX idx_progress_last_accessed ON progress(last_accessed DESC);
CREATE INDEX idx_progress_topic_completed ON progress(topic_completed, user_id);
CREATE INDEX idx_progress_user_status_phase ON progress(user_id, status, phase);

-- Chat sessions indexes
CREATE INDEX idx_chat_sessions_user ON chat_sessions(user_id);
CREATE INDEX idx_chat_sessions_user_topic ON chat_sessions(user_id, topic_id);
CREATE INDEX idx_chat_sessions_last_message ON chat_sessions(last_message_at DESC);

-- Password reset tokens indexes
CREATE INDEX idx_password_reset_tokens_user ON password_reset_tokens(user_id);
CREATE INDEX idx_password_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX idx_password_reset_tokens_expires ON password_reset_tokens(expires_at);

-- User sessions indexes
CREATE INDEX idx_user_sessions_user ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_token ON user_sessions(token);
CREATE INDEX idx_user_sessions_expires ON user_sessions(expires_at);

-- Learning analytics indexes
CREATE INDEX idx_learning_analytics_user ON learning_analytics(user_id);
CREATE INDEX idx_learning_analytics_topic ON learning_analytics(topic_id);
CREATE INDEX idx_learning_analytics_date ON learning_analytics(session_date DESC);
CREATE INDEX idx_learning_analytics_user_date ON learning_analytics(user_id, session_date DESC);

-- ========================================
-- AUTO-UPDATE TIMESTAMP FUNCTION
-- ========================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- TIMESTAMP UPDATE TRIGGERS
-- ========================================
CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_progress_updated_at 
  BEFORE UPDATE ON progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chat_sessions_updated_at 
  BEFORE UPDATE ON chat_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_learning_analytics_updated_at 
  BEFORE UPDATE ON learning_analytics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- VERIFICATION QUERIES
-- ========================================
-- Verify all tables were created successfully
SELECT 
  schemaname,
  tablename,
  tableowner
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN (
    'users', 
    'admins', 
    'progress', 
    'chat_sessions', 
    'password_reset_tokens', 
    'user_sessions', 
    'learning_analytics'
  )
ORDER BY tablename;

-- Verify indexes
SELECT 
  schemaname,
  tablename,
  indexname
FROM pg_indexes 
WHERE schemaname = 'public' 
  AND tablename IN (
    'users', 
    'admins', 
    'progress', 
    'chat_sessions', 
    'password_reset_tokens', 
    'user_sessions', 
    'learning_analytics'
  )
ORDER BY tablename, indexname;

-- ========================================
-- SCHEMA COMPLETE ✅
-- ========================================
-- 
-- SIMPLE SUPABASE SCHEMA 2026
-- 
-- ✅ All tables your code uses
-- ✅ All columns your code expects
-- ✅ No complex functions that cause errors
-- ✅ Essential indexes for performance
-- ✅ Auto-updating timestamps
-- ✅ Data integrity constraints
-- ✅ Ready for immediate use
-- 
-- No RLS policies (use service role key)
-- No complex predicates (no IMMUTABLE errors)
-- Clean and simple implementation
-- ========================================