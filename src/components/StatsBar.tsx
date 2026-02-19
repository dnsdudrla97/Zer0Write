import React from 'react';
import { theme } from '../theme/colors';
import type { ScanStats } from '../engine/types';
import { formatDensity, formatEntropy } from '../utils/format';

interface StatsBarProps {
  stats: ScanStats;
}

interface StatCardProps {
  label: string;
  value: string;
  valueColor?: string;
}

const mono = 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace';

const StatCard: React.FC<StatCardProps> = React.memo(({ label, value, valueColor }) => (
  <div style={styles.card}>
    <span style={styles.cardLabel}>{label}</span>
    <span style={{ ...styles.cardValue, color: valueColor ?? theme.textPrimary }}>{value}</span>
  </div>
));

StatCard.displayName = 'StatCard';

export const StatsBar: React.FC<StatsBarProps> = React.memo(({ stats }) => {
  const { stealthCount, density, entropy, types } = stats;

  const countColor = stealthCount > 0 ? theme.danger : theme.success;
  const densityColor = density > 1 ? theme.danger : density > 0 ? theme.warning : undefined;

  return (
    <section style={styles.container}>
      <StatCard label="FOUND" value={String(stealthCount)} valueColor={countColor} />
      <StatCard label="DENSITY" value={formatDensity(density)} valueColor={densityColor} />
      <StatCard label="ENTROPY" value={formatEntropy(entropy)} />
      <div style={styles.card}>
        <span style={styles.cardLabel}>TYPES</span>
        {types.length === 0 ? (
          <span style={{ ...styles.typesText, color: theme.success }}>✓ Clean</span>
        ) : (
          <span style={{ ...styles.typesText, color: theme.danger }} title={types.join(' • ')}>
            {types.join(' • ')}
          </span>
        )}
      </div>
    </section>
  );
});

StatsBar.displayName = 'StatsBar';

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: 8,
    padding: 12,
    borderBottom: `1px solid ${theme.border}`,
    backgroundColor: theme.bg,
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 72,
    backgroundColor: theme.surface,
    borderRadius: 12,
    padding: '10px 8px',
    textAlign: 'center',
  },
  cardLabel: {
    fontSize: 9,
    color: theme.textMuted,
    fontFamily: mono,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  cardValue: {
    fontSize: 22,
    fontWeight: 700,
    fontFamily: mono,
    marginTop: 2,
    lineHeight: 1.1,
    fontVariantNumeric: 'tabular-nums',
  },
  typesText: {
    marginTop: 4,
    fontSize: 10,
    fontFamily: mono,
    lineHeight: 1.4,
    maxWidth: '100%',
    overflowWrap: 'anywhere',
  },
};
