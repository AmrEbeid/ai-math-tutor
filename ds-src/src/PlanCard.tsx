import type { ReactNode } from 'react';

export interface PlanCardProps {
  /** Plan name (e.g. "Family", "Solo"). */
  name: ReactNode;
  /** Credits/usage line shown under the name, in accent terracotta. */
  credits?: ReactNode;
  /** Large price figure (number or string, e.g. "29"). */
  price: ReactNode;
  /** Small suffix after the price (e.g. "/mo"). */
  priceSuffix?: ReactNode;
  /** Billing period caption beneath the price. */
  period?: ReactNode;
  /** Feature lines; each is rendered with a leading check mark. */
  features?: ReactNode[];
  /** Call-to-action label for the plan button. */
  ctaLabel?: ReactNode;
  /** Small note under the CTA (e.g. trial terms). */
  note?: ReactNode;
  /** Eyebrow label above the name (e.g. "Most popular"). */
  popLabel?: ReactNode;
  /** Highlight this plan as the featured/dark card. */
  featured?: boolean;
  className?: string;
}

/**
 * Pricing plan column: optional eyebrow, name, credits, a large price with
 * suffix and period, a checked feature list, and a CTA button. Set `featured`
 * to render the inverted dark highlight card used for the recommended plan.
 */
export function PlanCard({
  name,
  credits,
  price,
  priceSuffix,
  period,
  features = [],
  ctaLabel = 'Choose plan',
  note,
  popLabel,
  featured,
  className,
}: PlanCardProps) {
  return (
    <div className={['plan-card', featured ? 'featured' : '', className].filter(Boolean).join(' ')}>
      {popLabel && <div className="pop-label">{popLabel}</div>}
      <h3>{name}</h3>
      {credits && <div className="plan-credits">{credits}</div>}
      <div className="plan-price">
        {price}
        {priceSuffix && <span>{priceSuffix}</span>}
      </div>
      {period && <div className="plan-period">{period}</div>}
      <ul>
        {features.map((f, i) => (
          <li key={i}>
            <span className="check">✓</span>
            {f}
          </li>
        ))}
      </ul>
      <button className="plan-btn">{ctaLabel}</button>
      {note && <span className="trial-note">{note}</span>}
    </div>
  );
}
