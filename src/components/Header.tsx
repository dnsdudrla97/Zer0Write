import React from 'react';
import { theme } from '../theme/colors';

interface HeaderProps {
  liveScan: boolean;
  onToggleLiveScan: () => void;
  onScan: () => void;
}

export const Header: React.FC<HeaderProps> = React.memo(
  ({ liveScan, onToggleLiveScan, onScan }) => {
    return (
      <header style={styles.container}>
        <div style={styles.left}>
          <div style={styles.logo}>
            <img src="/brand/zw.svg" alt="Zer0Write logo" style={styles.logoImage} />
          </div>
          <h1 style={styles.title}>Zer0Write</h1>
        </div>

        <div style={styles.right}>
          <label style={styles.liveToggle}>
            <span style={styles.liveLabel}>Live</span>
            <input
              type="checkbox"
              checked={liveScan}
              onChange={() => onToggleLiveScan()}
              style={styles.switch}
              aria-label="Toggle live scan"
            />
          </label>
          <button type="button" style={styles.scanBtn} onClick={onScan}>
            Scan
          </button>
        </div>
      </header>
    );
  },
);

Header.displayName = 'Header';

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    borderBottom: `1px solid ${theme.border}`,
    backgroundColor: theme.bg,
    gap: 12,
    flexWrap: 'wrap',
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  logo: {
    width: 30,
    height: 30,
    backgroundColor: '#0a0a0a',
    borderRadius: 8,
    border: '1px solid transparent',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  logoImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  title: {
    margin: 0,
    color: theme.textPrimary,
    fontSize: 18,
    fontWeight: 600,
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    letterSpacing: -0.5,
    lineHeight: 1,
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  liveToggle: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    cursor: 'pointer',
    userSelect: 'none',
  },
  liveLabel: {
    color: theme.textSecondary,
    fontSize: 12,
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  },
  switch: {
    width: 34,
    height: 18,
    accentColor: '#4ade80',
    cursor: 'pointer',
  },
  scanBtn: {
    backgroundColor: theme.border,
    padding: '6px 14px',
    borderRadius: 8,
    border: 'none',
    color: theme.textPrimary,
    fontSize: 12,
    fontWeight: 500,
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    cursor: 'pointer',
  },
};
