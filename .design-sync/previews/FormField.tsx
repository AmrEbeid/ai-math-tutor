import { FormField } from '@zeluu/design-system';

export const Default = () => (
  <div style={{ maxWidth: 360 }}>
    <FormField label="Parent email" type="email" placeholder="you@example.com" name="email" />
  </div>
);

export const Filled = () => (
  <div style={{ maxWidth: 360 }}>
    <FormField label="Child's name" placeholder="First name" value="Layla" name="child" />
  </div>
);

export const WithError = () => (
  <div style={{ maxWidth: 360 }}>
    <FormField
      label="Password"
      type="password"
      placeholder="••••••••"
      error="Must be at least 8 characters"
      name="password"
    />
  </div>
);
