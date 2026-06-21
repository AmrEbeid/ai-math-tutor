import type { ReactNode } from 'react';

export type ChatRole = 'user' | 'assistant';

export interface ChatBubbleProps {
  /** Who is speaking: `user` (child, terracotta, right) or `assistant` (tutor, cream, left). */
  role: ChatRole;
  children?: ReactNode;
  className?: string;
}

/**
 * A single message bubble in the AI tutor chat. `user` messages are terracotta
 * and align right; `assistant` (tutor) messages are cream with a hairline
 * border and align left.
 */
export function ChatBubble({ role, children, className }: ChatBubbleProps) {
  return (
    <div className={['chat-bubble', role, className].filter(Boolean).join(' ')}>{children}</div>
  );
}
