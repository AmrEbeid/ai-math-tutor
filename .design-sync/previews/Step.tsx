import { Step } from '@zeluu/design-system';

export const CreateProfile = () => (
  <div style={{ maxWidth: 260 }}>
    <Step number="1" title="Create a child profile">
      Add your child's name and grade (1–9) and pick the subjects they need — Math,
      Science or English.
    </Step>
  </div>
);

export const PickSubjects = () => (
  <div style={{ maxWidth: 260 }}>
    <Step number="2" title="Start a tutoring session">
      Your child asks a homework question or starts a practice set, and Zeluu walks
      them through it step by step.
    </Step>
  </div>
);

export const TrackProgress = () => (
  <div style={{ maxWidth: 260 }}>
    <Step number="3" title="Track their progress">
      Check the parent dashboard for session summaries, mastered topics and credits
      used — all in one place.
    </Step>
  </div>
);
