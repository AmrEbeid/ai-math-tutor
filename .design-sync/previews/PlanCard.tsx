import { PlanCard } from '@zeluu/design-system';

export const Solo = () => (
  <div style={{ maxWidth: 300 }}>
    <PlanCard
      name="Solo"
      credits="500 credits / month"
      price="$9"
      priceSuffix="/mo"
      period="Billed monthly"
      features={[
        '1 child profile',
        'Math, Science & English',
        'Homework help & exam prep',
        'Parent dashboard',
      ]}
      ctaLabel="Start free trial"
      note="7-day free trial, cancel anytime"
    />
  </div>
);

export const Featured = () => (
  <div style={{ maxWidth: 300 }}>
    <PlanCard
      featured
      popLabel="Most popular"
      name="Family"
      credits="2,000 credits / month"
      price="$29"
      priceSuffix="/mo"
      period="Billed monthly"
      features={[
        'Up to 4 child profiles',
        'All subjects, grades 1–9',
        'Unlimited homework help',
        'Progress reports & insights',
        'Priority support',
      ]}
      ctaLabel="Start free trial"
      note="7-day free trial, cancel anytime"
    />
  </div>
);
