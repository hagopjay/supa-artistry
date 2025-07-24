-- Create conversations table
CREATE TABLE conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  session_id TEXT NOT NULL,
  prompt_tiers_used TEXT[] DEFAULT '{}',
  user_request TEXT NOT NULL,
  ai_response TEXT NOT NULL,
  model_used TEXT NOT NULL DEFAULT 'gemini-1.5-pro',
  token_usage JSONB,
  response_time_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_memory table
CREATE TABLE user_memory (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  memory_key TEXT NOT NULL,
  memory_value TEXT NOT NULL,
  memory_type TEXT CHECK (memory_type IN ('preference', 'context', 'behavior', 'fact')) DEFAULT 'context',
  confidence_score DECIMAL(3,2) CHECK (confidence_score >= 0 AND confidence_score <= 1),
  last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, memory_key)
);

-- Create indexes for better performance
CREATE INDEX idx_conversations_user_session ON conversations(user_id, session_id);
CREATE INDEX idx_conversations_created_at ON conversations(created_at DESC);
CREATE INDEX idx_conversations_user_created ON conversations(user_id, created_at DESC);

CREATE INDEX idx_user_memory_user_id ON user_memory(user_id);
CREATE INDEX idx_user_memory_type ON user_memory(memory_type);
CREATE INDEX idx_user_memory_updated ON user_memory(updated_at DESC);
CREATE INDEX idx_user_memory_accessed ON user_memory(last_accessed DESC);

-- Create full-text search indexes
CREATE INDEX idx_conversations_search ON conversations USING gin(to_tsvector('english', user_request || ' ' || ai_response));
CREATE INDEX idx_user_memory_search ON user_memory USING gin(to_tsvector('english', memory_key || ' ' || memory_value));

-- Add RLS (Row Level Security) policies
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_memory ENABLE ROW LEVEL SECURITY;

-- Policy for conversations - users can only access their own data
CREATE POLICY "Users can access own conversations" ON conversations
  FOR ALL USING (auth.uid()::text = user_id);

-- Policy for user_memory - users can only access their own data  
CREATE POLICY "Users can access own memory" ON user_memory
  FOR ALL USING (auth.uid()::text = user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add trigger to user_memory table
CREATE TRIGGER update_user_memory_updated_at 
  BEFORE UPDATE ON user_memory 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Create analytics view for conversation insights
CREATE VIEW conversation_analytics AS
SELECT 
  c.user_id,
  DATE_TRUNC('day', c.created_at) as date,
  COUNT(*) as conversation_count,
  AVG(c.response_time_ms) as avg_response_time,
  SUM((c.token_usage->>'input_tokens')::int) as total_input_tokens,
  SUM((c.token_usage->>'output_tokens')::int) as total_output_tokens,
  SUM((c.token_usage->>'cached_tokens')::int) as total_cached_tokens,
  COALESCE(array_agg(DISTINCT t.tier), '{}') as tiers_used
FROM conversations c
LEFT JOIN LATERAL unnest(c.prompt_tiers_used) as t(tier) ON TRUE
WHERE c.token_usage IS NOT NULL
GROUP BY c.user_id, DATE_TRUNC('day', c.created_at);

-- Create memory effectiveness view
CREATE VIEW memory_effectiveness AS
SELECT 
  user_id,
  memory_type,
  COUNT(*) as memory_count,
  AVG(confidence_score) as avg_confidence,
  MAX(last_accessed) as most_recent_access,
  DATE_TRUNC('day', MAX(updated_at)) as last_updated_date
FROM user_memory 
GROUP BY user_id, memory_type;

-- Create function to clean old memories (optional maintenance)
CREATE OR REPLACE FUNCTION cleanup_old_memories(days_threshold INTEGER DEFAULT 90)
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM user_memory 
  WHERE last_accessed < NOW() - INTERVAL '1 day' * days_threshold
    AND confidence_score < 0.3;
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;