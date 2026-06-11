
-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA extensions;

-- Knowledge channels discovered from YouTube
CREATE TABLE IF NOT EXISTS public.knowledge_channels (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  channel_id TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  custom_url TEXT,
  subscribers INTEGER DEFAULT 0,
  video_count INTEGER DEFAULT 0,
  tags JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Raw transcript metadata (actual transcript stored in Drive)
CREATE TABLE IF NOT EXISTS public.knowledge_transcripts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  video_id TEXT UNIQUE NOT NULL,
  video_title TEXT NOT NULL,
  channel_id TEXT REFERENCES public.knowledge_channels(channel_id),
  language TEXT DEFAULT 'ar',
  duration_secs INTEGER,
  view_count INTEGER DEFAULT 0,
  published_at TIMESTAMPTZ,
  subjects TEXT[] DEFAULT '{}',
  countries TEXT[] DEFAULT '{}',
  grades INTEGER[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Embedded chunks for RAG retrieval
CREATE TABLE IF NOT EXISTS public.knowledge_chunks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chunk_id TEXT UNIQUE NOT NULL,
  video_id TEXT NOT NULL REFERENCES public.knowledge_transcripts(video_id),
  chunk_index INTEGER NOT NULL,
  text TEXT NOT NULL,
  language TEXT DEFAULT 'ar',
  subjects TEXT[] DEFAULT '{}',
  countries TEXT[] DEFAULT '{}',
  grades INTEGER[] DEFAULT '{}',
  topics TEXT[] DEFAULT '{}',
  embedding extensions.vector(1536),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- HNSW index for fast similarity search
CREATE INDEX IF NOT EXISTS knowledge_chunks_embedding_idx
  ON public.knowledge_chunks
  USING hnsw (embedding extensions.vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);

-- Index for filtering by subject + country + grade
CREATE INDEX IF NOT EXISTS knowledge_chunks_filter_idx
  ON public.knowledge_chunks (subjects, countries, grades);

-- Index for video_id lookups
CREATE INDEX IF NOT EXISTS knowledge_chunks_video_idx
  ON public.knowledge_chunks (video_id);

-- RLS policies
ALTER TABLE public.knowledge_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_transcripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_chunks ENABLE ROW LEVEL SECURITY;

-- Read-only access for authenticated users (service role bypasses RLS for writes)
CREATE POLICY "knowledge_channels_read" ON public.knowledge_channels
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "knowledge_transcripts_read" ON public.knowledge_transcripts
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "knowledge_chunks_read" ON public.knowledge_chunks
  FOR SELECT TO authenticated USING (true);

-- Allow anon to read chunks (needed for child chat which uses service role anyway)
CREATE POLICY "knowledge_chunks_anon_read" ON public.knowledge_chunks
  FOR SELECT TO anon USING (true);

-- RPC function for similarity search (used by chat API)
CREATE OR REPLACE FUNCTION public.match_knowledge_chunks(
  query_embedding extensions.vector(1536),
  match_threshold FLOAT DEFAULT 0.7,
  match_count INT DEFAULT 5,
  filter_subjects TEXT[] DEFAULT NULL,
  filter_countries TEXT[] DEFAULT NULL,
  filter_grades INTEGER[] DEFAULT NULL
)
RETURNS TABLE (
  chunk_id TEXT,
  video_id TEXT,
  text TEXT,
  language TEXT,
  subjects TEXT[],
  countries TEXT[],
  grades INTEGER[],
  topics TEXT[],
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    kc.chunk_id,
    kc.video_id,
    kc.text,
    kc.language,
    kc.subjects,
    kc.countries,
    kc.grades,
    kc.topics,
    1 - (kc.embedding <=> query_embedding) AS similarity
  FROM public.knowledge_chunks kc
  WHERE
    kc.embedding IS NOT NULL
    AND (filter_subjects IS NULL OR kc.subjects && filter_subjects)
    AND (filter_countries IS NULL OR kc.countries && filter_countries)
    AND (filter_grades IS NULL OR kc.grades && filter_grades)
    AND 1 - (kc.embedding <=> query_embedding) > match_threshold
  ORDER BY kc.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
