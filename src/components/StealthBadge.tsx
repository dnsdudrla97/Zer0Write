import React from 'react';
import type { StealthType } from '../engine/types';
import { categoryStyles } from '../theme/colors';

interface StealthBadgeProps {
  type: StealthType;
  decoded: string;
}

/**
 * Colored pill badge that displays decoded stealth character content.
 * Inline with normal text in the HighlightView.
 */
export const StealthBadge: React.FC<StealthBadgeProps> = React.memo(({ type, decoded }) => {
  const style = categoryStyles[type];

  return (
    <span
      style={{
        ...styles.badge,
        backgroundColor: style.bg,
        color: style.text,
      }}
      title={type}
    >
      {decoded}
    </span>
  );
});

StealthBadge.displayName = 'StealthBadge';

const styles: Record<string, React.CSSProperties> = {
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    margin: '0 2px',
    padding: '3px 8px',
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 700,
    lineHeight: 1.2,
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    verticalAlign: 'baseline',
  },
};
