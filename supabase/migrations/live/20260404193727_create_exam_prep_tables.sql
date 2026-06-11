
-- ============================================
-- Exam Prep Mode - Phase 2C #20
-- Tables: exams, exam_questions, exam_attempts, exam_answers
-- ============================================

-- 1. Exams: stores generated exam sets
CREATE TABLE public.exams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id uuid NOT NULL REFERENCES public.profiles(id),
  child_id uuid NOT NULL REFERENCES public.children(id),
  subject text NOT NULL CHECK (subject IN ('math', 'science', 'english')),
  grade integer NOT NULL CHECK (grade >= 1 AND grade <= 9),
  country text NOT NULL DEFAULT 'UAE',
  topic text,
  difficulty text NOT NULL DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard', 'mixed')),
  question_count integer NOT NULL DEFAULT 10,
  time_limit_seconds integer, -- NULL = untimed
  status text NOT NULL DEFAULT 'generated' CHECK (status IN ('generated', 'in_progress', 'completed', 'abandoned')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. Exam Questions: individual questions within an exam
CREATE TABLE public.exam_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id uuid NOT NULL REFERENCES public.exams(id) ON DELETE CASCADE,
  question_index integer NOT NULL, -- order within exam (1-based)
  question_text text NOT NULL,
  question_type text NOT NULL DEFAULT 'multiple_choice' CHECK (question_type IN ('multiple_choice', 'true_false', 'short_answer', 'fill_blank')),
  options jsonb, -- for MCQ: ["option A", "option B", "option C", "option D"]
  correct_answer text NOT NULL,
  explanation text, -- AI-generated explanation of correct answer
  topic text, -- specific topic this question covers
  difficulty text NOT NULL DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  points integer NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

-- 3. Exam Attempts: child's attempt at an exam
CREATE TABLE public.exam_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id uuid NOT NULL REFERENCES public.exams(id) ON DELETE CASCADE,
  child_id uuid NOT NULL REFERENCES public.children(id),
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  score integer, -- points earned
  max_score integer, -- total possible points
  percentage numeric(5,2), -- score as percentage
  time_spent_seconds integer, -- actual time taken
  weak_topics text[], -- topics the child got wrong
  strong_topics text[], -- topics the child got right
  status text NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'timed_out', 'abandoned'))
);

-- 4. Exam Answers: individual answers within an attempt
CREATE TABLE public.exam_answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id uuid NOT NULL REFERENCES public.exam_attempts(id) ON DELETE CASCADE,
  question_id uuid NOT NULL REFERENCES public.exam_questions(id) ON DELETE CASCADE,
  child_answer text, -- what the child answered
  is_correct boolean,
  time_spent_seconds integer, -- time on this question
  answered_at timestamptz DEFAULT now()
);

-- 5. Indexes for performance
CREATE INDEX idx_exams_child_id ON public.exams(child_id);
CREATE INDEX idx_exams_parent_id ON public.exams(parent_id);
CREATE INDEX idx_exam_questions_exam_id ON public.exam_questions(exam_id);
CREATE INDEX idx_exam_attempts_child_id ON public.exam_attempts(child_id);
CREATE INDEX idx_exam_attempts_exam_id ON public.exam_attempts(exam_id);
CREATE INDEX idx_exam_answers_attempt_id ON public.exam_answers(attempt_id);

-- 6. RLS policies
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_answers ENABLE ROW LEVEL SECURITY;

-- Parents can see their own exams
CREATE POLICY "Parents can manage their exams" ON public.exams
  FOR ALL USING (auth.uid() = parent_id);

-- Questions visible if parent owns the exam
CREATE POLICY "Parents can view exam questions" ON public.exam_questions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.exams WHERE exams.id = exam_questions.exam_id AND exams.parent_id = auth.uid())
  );

-- Attempts visible if parent owns the child
CREATE POLICY "Parents can view exam attempts" ON public.exam_attempts
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.children WHERE children.id = exam_attempts.child_id AND children.parent_id = auth.uid())
  );

-- Answers visible if parent owns the attempt's child
CREATE POLICY "Parents can view exam answers" ON public.exam_answers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.exam_attempts a
      JOIN public.children c ON c.id = a.child_id
      WHERE a.id = exam_answers.attempt_id AND c.parent_id = auth.uid()
    )
  );

-- Service role bypass (for API endpoints using service key)
CREATE POLICY "Service role full access exams" ON public.exams
  FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access exam_questions" ON public.exam_questions
  FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access exam_attempts" ON public.exam_attempts
  FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access exam_answers" ON public.exam_answers
  FOR ALL USING (auth.role() = 'service_role');

-- 7. Update notifications type check to include exam results
ALTER TABLE public.notifications DROP CONSTRAINT IF EXISTS notifications_type_check;
ALTER TABLE public.notifications ADD CONSTRAINT notifications_type_check
  CHECK (type IN ('stuck_loop', 'credits_low', 'credits_empty', 'session_flagged', 'weekly_report', 'credit_limit_reached', 'child_distress', 'personal_info_shared', 'exam_completed'));
