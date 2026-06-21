import { Button } from '@zeluu/design-system';

export const Primary = () => <Button>Start free trial</Button>;

export const Secondary = () => <Button variant="secondary">See how it works</Button>;

export const Sizes = () => (
  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
    <Button size="sm">Small</Button>
    <Button size="md">Medium</Button>
    <Button size="large">Large</Button>
  </div>
);

export const OnAccent = () => (
  <div style={{ background: 'var(--color-accent)', padding: 24, borderRadius: 12 }}>
    <Button variant="white">Get started</Button>
  </div>
);

export const Disabled = () => <Button disabled>Saving…</Button>;
