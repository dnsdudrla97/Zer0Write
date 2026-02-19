import React from 'react';
import { theme, categoryStyles } from '../theme/colors';
import type { StealthType } from '../engine/types';
import { clamp } from '../utils/format';

interface BreakdownChartProps {
  catCounts: Record<string, number>;
  totalFound: number;
}

interface BarRowProps {
  category: string;
  count: number;
  totalFound: number;
}

const mono = 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace';

const BarRow: React.FC<BarRowProps> = React.memo(({ category, count, totalFound }) => {
  const ratio = totalFound > 0 ? count / totalFound : 0;
  const pct = (ratio * 100).toFixed(2);
  const barWidth = clamp(ratio * 100, 0, 100);
  const style = categoryStyles[category as StealthType];
  const barColor = style?.barColor ?? '#71717a';

  return (
    <div style={styles.row}>
      <span style={styles.catName}>{category}</span>
      <div style={styles.barTrack}>
        <div style={{ ...styles.barFill, width: `${barWidth}%`, backgroundColor: barColor }} />
      </div>
      <span style={styles.countText}>{count}</span>
      <span style={styles.pctText}>{pct}%</span>
    </div>
  );
});

BarRow.displayName = 'BarRow';

export const BreakdownChart: React.FC<BreakdownChartProps> = React.memo(
  ({ catCounts, totalFound }) => {
    const entries = Object.entries(catCounts).sort((a, b) => b[1] - a[1]);

    if (entries.length === 0) return null;

    return (
      <section style={styles.container}>
        <p style={styles.label}>BREAKDOWN</p>
        <div style={styles.chart}>
          {entries.map(([cat, cnt]) => (
            <BarRow key={cat} category={cat} count={cnt} totalFound={totalFound} />
          ))}
        </div>
      </section>
    );
  },
);

BreakdownChart.displayName = 'BreakdownChart';

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
  chart: {
    backgroundColor: theme.surface,
    borderRadius: 16,
    padding: 12,
    border: `1px solid ${theme.surfaceBorder}`,
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '72px minmax(80px, 1fr) 50px 60px',
    alignItems: 'center',
    columnGap: 10,
    padding: '6px 0',
  },
  catName: {
    color: theme.textSecondary,
    fontSize: 11,
    fontFamily: mono,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  barTrack: {
    width: '100%',
    height: 6,
    backgroundColor: theme.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 3,
  },
  countText: {
    textAlign: 'right',
    color: theme.textPrimary,
    fontSize: 11,
    fontFamily: mono,
    fontVariantNumeric: 'tabular-nums',
  },
  pctText: {
    textAlign: 'right',
    color: theme.textMuted,
    fontSize: 11,
    fontFamily: mono,
    fontVariantNumeric: 'tabular-nums',
  },
};
