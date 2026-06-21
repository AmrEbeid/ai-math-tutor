import { ChatBubble } from '@zeluu/design-system';

export const Conversation = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 480 }}>
    <ChatBubble role="user">How do I add 1/3 and 1/4?</ChatBubble>
    <ChatBubble role="assistant">
      Great question! First we find a common denominator. The smallest number both
      3 and 4 divide into is 12, so we rewrite each fraction over 12.
    </ChatBubble>
    <ChatBubble role="user">So 1/3 becomes 4/12?</ChatBubble>
    <ChatBubble role="assistant">
      Exactly right. And 1/4 becomes 3/12. Now add the tops: 4 + 3 = 7, which gives
      you 7/12. Want to try one on your own?
    </ChatBubble>
  </div>
);

export const WithCode = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 480 }}>
    <ChatBubble role="user">What does this Python line do? print(7 % 3)</ChatBubble>
    <ChatBubble role="assistant">
      The <code>%</code> symbol is the modulo operator — it gives the remainder after
      division. Since 7 divided by 3 is 2 with 1 left over, <code>print(7 % 3)</code>{' '}
      outputs <strong>1</strong>.
    </ChatBubble>
  </div>
);
