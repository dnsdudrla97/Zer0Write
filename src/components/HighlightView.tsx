import React from 'react';
import { theme } from '../theme/colors';
import type { Segment } from '../engine/types';
import { StealthBadge } from './StealthBadge';

interface HighlightViewProps {
  segments: Segment[];
}

/**
 * Renders processed text with inline stealth character badges.
 * Normal text flows naturally; detected stealth characters appear
 * as colored pills with their decoded content.
 */
export const HighlightView: React.FC<HighlightViewProps> = React.memo(({ segments }) => {
  if (segments.length === 0) {
    return (
      <section style={styles.container}>
        <div style={styles.content}>
          <p style={styles.emptyText}>Scan results appear here</p>
        </div>
      </section>
    );
  }

  return (
    <section style={styles.container}>
      <p style={styles.label}>DETECTED · DECODED</p>
      <div style={styles.scrollView}>
        <div style={styles.content}>
          {segments.map((seg, i) => {
            if (seg.kind === 'text') {
              return <React.Fragment key={i}>{seg.value}</React.Fragment>;
            }
            return <StealthBadge key={i} type={seg.type} decoded={seg.decoded} />;
          })}
        </div>
      </div>
    </section>
  );
});

HighlightView.displayName = 'HighlightView';

const mono = 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace';

const styles: Record<string, React.CSSProperties> = {
  container: {
    marginBottom: 16,
  },
  label: {
    margin: '0 0 8px',
    fontSize: 10,
    color: theme.textMuted,
    fontFamily: mono,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  scrollView: {
    maxHeight: 240,
    overflow: 'auto',
  },
  content: {
    backgroundColor: theme.surface,
    borderRadius: 16,
    border: `1px solid ${theme.surfaceBorder}`,
    padding: 16,
    minHeight: 100,
    color: theme.textPrimary,
    fontSize: 14,
    lineHeight: 1.6,
    fontFamily: mono,
    whiteSpace: 'pre-wrap',
    overflowWrap: 'anywhere',
  },
  emptyText: {
    margin: 0,
    color: theme.textDim,
    fontSize: 13,
    fontFamily: mono,
    fontStyle: 'italic',
  },
};
