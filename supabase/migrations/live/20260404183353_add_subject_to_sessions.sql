-- Add subject column to sessions table for multi-subject V2 expansion
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS subject text NOT NULL DEFAULT 'math';

-- Add check constraint for valid subjects
ALTER TABLE sessions ADD CONSTRAINT sessions_subject_check CHECK (subject IN ('math', 'science', 'english'));

-- Create index for filtering sessions by subject
CREATE INDEX IF NOT EXISTS idx_sessions_subject ON sessions (subject);

-- Comment for documentation
COMMENT ON COLUMN sessions.subject IS 'Subject for this tutoring session: math, science, or english';