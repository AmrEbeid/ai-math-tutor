import { Toggle } from '@zeluu/design-system';

const billing = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'annual', label: 'Annual', badge: 'Save 20%' },
];

export const Monthly = () => (
  <div style={{ display: 'flex', justifyContent: 'center', padding: 8 }}>
    <Toggle value="monthly" options={billing} />
  </div>
);

export const Annual = () => (
  <div style={{ display: 'flex', justifyContent: 'center', padding: 8 }}>
    <Toggle value="annual" options={billing} />
  </div>
);

export const ThreeWay = () => (
  <div style={{ display: 'flex', justifyContent: 'center', padding: 8 }}>
    <Toggle
      value="science"
      options={[
        { value: 'math', label: 'Math' },
        { value: 'science', label: 'Science' },
        { value: 'english', label: 'English' },
      ]}
    />
  </div>
);
