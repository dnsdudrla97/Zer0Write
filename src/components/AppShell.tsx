'use client';

import React, { useCallback, useState } from 'react';
import { theme } from '../theme/colors';
import { useScanner } from '../hooks/useScanner';
import { Header } from './Header';
import { InputPanel } from './InputPanel';
import { StatsBar } from './StatsBar';
import { HighlightView } from './HighlightView';
import { CleanedOutput } from './CleanedOutput';
import { BreakdownChart } from './BreakdownChart';
import { Toast } from './Toast';

type ToastState = {
  message: string;
  type: 'success' | 'error' | 'info';
  visible: boolean;
};

const INITIAL_TOAST: ToastState = { message: '', type: 'info', visible: false };

/**
 * Web app shell used by Next.js pages.
 * Uses one DOM tree for both mobile/desktop layouts to keep hydration deterministic.
 */
export const AppShell: React.FC = () => {
  const { input, setInput, liveScan, toggleLiveScan, scan, clear, result, lineCount, charCount } =
    useScanner(120);

  const [toast, setToast] = useState<ToastState>(INITIAL_TOAST);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type, visible: true });
  }, []);

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, visible: false }));
  }, []);

  const handleScan = useCallback(() => {
    scan();
  }, [scan]);

  const { segments, cleaned, stats } = result;

  const outputContent = (
    <>
      <HighlightView segments={segments} />
      <CleanedOutput text={cleaned} onToast={showToast} />
      <BreakdownChart catCounts={stats.catCounts} totalFound={stats.stealthCount} />
    </>
  );

  return (
    <main style={styles.app}>
      <Header liveScan={liveScan} onToggleLiveScan={toggleLiveScan} onScan={handleScan} />

      <div className="Zer0Write-shell-body">
        <section className="Zer0Write-shell-input">
          <InputPanel
            value={input}
            onChangeText={setInput}
            onClear={clear}
            charCount={charCount}
            lineCount={lineCount}
            onScan={handleScan}
          />
        </section>

        <section className="Zer0Write-shell-output">
          <StatsBar stats={stats} />
          <div className="Zer0Write-shell-output-scroll">
            {outputContent}
          </div>
        </section>
      </div>

      <footer style={styles.footer}>
        <a
          href="https://x.com/Zer0Luck"
          target="_blank"
          rel="noopener noreferrer"
          style={styles.footerLink}
          aria-label="Developed by Zer0Luck"
        >
          Developed by Zer0Luck
        </a>
      </footer>

      <Toast message={toast.message} type={toast.type} visible={toast.visible} onHide={hideToast} />
    </main>
  );
};

const styles: Record<string, React.CSSProperties> = {
  app: {
    minHeight: '100dvh',
    backgroundColor: theme.bg,
    color: theme.textPrimary,
    display: 'flex',
    flexDirection: 'column',
  },
  footer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '8px 12px 12px',
  },
  footerLink: {
    fontSize: 10,
    color: theme.textDim,
    textDecoration: 'none',
    letterSpacing: 0.2,
    opacity: 0.9,
  },
};
