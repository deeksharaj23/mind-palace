-- Mind Palace: nodes table
CREATE TABLE IF NOT EXISTS nodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('thought', 'journal', 'dream', 'mood', 'health')),
  content TEXT,
  tags TEXT[] DEFAULT '{}',
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  emotion TEXT,
  intensity NUMERIC,
  embedding vector(1536) -- Stubbed for future pgvector use
);

-- Index for timestamp queries (last 7 days patterns)
CREATE INDEX IF NOT EXISTS idx_nodes_timestamp ON nodes(timestamp DESC);

-- Index for tag searches
CREATE INDEX IF NOT EXISTS idx_nodes_tags ON nodes USING GIN(tags);

-- Enable RLS (Row Level Security) - optional, configure as needed
-- ALTER TABLE nodes ENABLE ROW LEVEL SECURITY;
