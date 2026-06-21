import { SubjectTab } from '@zeluu/design-system';

export const SubjectRow = () => (
  <div className="subject-tabs">
    <SubjectTab label="Math" icon="🧮" active />
    <SubjectTab label="Science" icon="🔬" />
    <SubjectTab label="English" icon="📖" />
  </div>
);

export const ScienceActive = () => (
  <div className="subject-tabs">
    <SubjectTab label="Math" icon="🧮" />
    <SubjectTab label="Science" icon="🔬" active />
    <SubjectTab label="English" icon="📖" />
  </div>
);

export const NoIcons = () => (
  <div className="subject-tabs">
    <SubjectTab label="Homework" active />
    <SubjectTab label="Practice" />
    <SubjectTab label="Exam prep" />
  </div>
);
