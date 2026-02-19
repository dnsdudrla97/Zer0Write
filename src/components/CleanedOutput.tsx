import React, { useCallback } from 'react';
import { theme } from '../theme/colors';
import { useClipboard } from '../hooks/useClipboard';

interface CleanedOutputProps {
  text: string;
  onToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

function downloadTextFile(content: string): boolean {
  if (typeof document === 'undefined') return false;

  try {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = `Zer0Write-cleaned-${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => URL.revokeObjectURL(url), 1000);
    return true;
  } catch {
    return false;
  }
}

export const CleanedOutput: React.FC<CleanedOutputProps> = React.memo(({ text, onToast }) => {
  const { copy } = useClipboard();

  const handleCopy = useCallback(async () => {
    if (!text) {
      onToast('Nothing to copy', 'info');
      return;
    }

    const ok = await copy(text);
    onToast(ok ? 'Copied to clipboard ✓' : 'Copy failed', ok ? 'success' : 'error');
  }, [text, copy, onToast]);

  const handleSave = useCallback(async () => {
    if (!text) {
      onToast('Nothing to save', 'info');
      return;
    }

    const canShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

    if (canShare) {
      try {
        await navigator.share({
          title: 'Zer0Write cleaned output',
          text,
        });
        onToast('Shared ✓', 'success');
        return;
      } catch (error) {
        const wasDismissed =
          typeof error === 'object' &&
          error !== null &&
          'name' in error &&
          (error as { name?: string }).name === 'AbortError';

        if (wasDismissed) {
          onToast('Share canceled', 'info');
          return;
        }
      }
    }

    const downloaded = downloadTextFile(text);
    onToast(downloaded ? 'Downloaded ✓' : 'Save failed', downloaded ? 'success' : 'error');
  }, [text, onToast]);

  return (
    <section style={styles.container}>
      <div style={styles.labelRow}>
        <p style={styles.label}>CLEANED OUTPUT</p>
        <div style={styles.buttons}>
          <button type="button" style={styles.saveBtn} onClick={handleSave}>
            ↓ Save
          </button>
          <button type="button" style={styles.copyBtn} onClick={handleCopy}>
            Copy
          </button>
        </div>
      </div>

      <div style={styles.scrollView}>
        <div style={styles.content}>
          <pre style={styles.text}>{text || ''}</pre>
        </div>
      </div>
    </section>
  );
});

CleanedOutput.displayName = 'CleanedOutput';

const mono = 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace';

const styles: Record<string, React.CSSProperties> = {
  container: {
    marginBottom: 16,
  },
  labelRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    gap: 12,
    flexWrap: 'wrap',
  },
  label: {
    margin: 0,
    fontSize: 10,
    color: theme.textMuted,
    fontFamily: mono,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  buttons: {
    display: 'flex',
    gap: 8,
  },
  saveBtn: {
    backgroundColor: theme.border,
    padding: '5px 12px',
    borderRadius: 8,
    border: 'none',
    color: theme.textPrimary,
    fontSize: 10,
    fontFamily: mono,
    cursor: 'pointer',
  },
  copyBtn: {
    backgroundColor: '#059669',
    padding: '5px 16px',
    borderRadius: 8,
    border: 'none',
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 600,
    fontFamily: mono,
    cursor: 'pointer',
  },
  scrollView: {
    maxHeight: 200,
    overflow: 'auto',
  },
  content: {
    backgroundColor: theme.surface,
    borderRadius: 16,
    padding: 16,
    border: `1px solid ${theme.surfaceBorder}`,
  },
  text: {
    margin: 0,
    color: theme.textPrimary,
    fontSize: 14,
    fontFamily: mono,
    lineHeight: 1.6,
    whiteSpace: 'pre-wrap',
    overflowWrap: 'anywhere',
    userSelect: 'text',
  },
};
