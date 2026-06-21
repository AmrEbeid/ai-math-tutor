import { TopicTag } from '@zeluu/design-system';

const cloud: React.CSSProperties = {
  display: 'flex',
  gap: 8,
  flexWrap: 'wrap',
  maxWidth: 420,
};

export const MathCloud = () => (
  <div style={cloud}>
    <TopicTag>Fractions</TopicTag>
    <TopicTag>Long division</TopicTag>
    <TopicTag>Decimals</TopicTag>
    <TopicTag>Area & perimeter</TopicTag>
    <TopicTag>Word problems</TopicTag>
  </div>
);

export const ScienceCloud = () => (
  <div style={cloud}>
    <TopicTag>Photosynthesis</TopicTag>
    <TopicTag>Solar system</TopicTag>
    <TopicTag>States of matter</TopicTag>
    <TopicTag>The water cycle</TopicTag>
  </div>
);

export const EnglishCloud = () => (
  <div style={cloud}>
    <TopicTag>Past tense</TopicTag>
    <TopicTag>Adjectives</TopicTag>
    <TopicTag>Reading comprehension</TopicTag>
    <TopicTag>Punctuation</TopicTag>
  </div>
);

export const Single = () => <TopicTag>Fractions</TopicTag>;
