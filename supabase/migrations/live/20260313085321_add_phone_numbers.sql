
-- Parent phone (required for new signups, nullable for existing users)
ALTER TABLE public.profiles ADD COLUMN phone text;

-- Child phone (optional)
ALTER TABLE public.children ADD COLUMN phone text;
