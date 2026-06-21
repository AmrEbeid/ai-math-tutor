import { Container } from '@zeluu/design-system';

export const Section = () => (
  <div style={{ background: 'var(--color-accent, #c8674b)', paddingBlock: 40 }}>
    <Container>
      <div
        style={{
          background: 'var(--color-bg, #fdf6ee)',
          borderRadius: 16,
          padding: 32,
        }}
      >
        <h2 style={{ margin: '0 0 8px' }}>Learning that fits your family</h2>
        <p style={{ margin: 0, color: 'var(--color-muted, #6b6257)', maxWidth: 560 }}>
          Zeluu keeps your child's tutoring centered on the page and aligned to the
          Zeluu grid — comfortable line lengths for reading, generous gutters on
          wide screens, and the same rhythm across Math, Science and English.
        </p>
      </div>
    </Container>
  </div>
);
