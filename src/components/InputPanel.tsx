import React, { useCallback } from 'react';
import { theme } from '../theme/colors';
import { formatNumber } from '../utils/format';

interface InputPanelProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
  charCount: number;
  lineCount: number;
  onScan?: () => void;
}

const PLACEHOLDER = `Paste LLM-generated text here...

Zer0Write detects hidden characters:
• Zero-Width (ZWSP, ZWNJ, ZWJ, BOM...)
• AWS Tag Smuggling (U+E0001–E007F)
• SneakyBits (U+2062/U+2064 binary)
• Bidi overrides & isolates
• Variation Selector watermarks
• Smart quotes, em-dashes, ellipsis
• LLM bullets (•◦‣⁃∙·)
• Variable-width spaces
• Regional Indicator flag chars`;

export const InputPanel: React.FC<InputPanelProps> = React.memo(
  ({ value, onChangeText, onClear, charCount, lineCount, onScan }) => {
    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (!onScan) return;
        if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
          event.preventDefault();
          onScan();
        }
      },
      [onScan],
    );

    return (
      <section style={styles.container}>
        <div style={styles.labelRow}>
          <span style={styles.label}>INPUT</span>
          <button type="button" onClick={onClear} style={styles.clearBtn}>
            Clear
          </button>
        </div>

        <textarea
          style={styles.input}
          value={value}
          onChange={(event) => onChangeText(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={PLACEHOLDER}
          spellCheck={false}
          autoCapitalize="none"
          autoCorrect="off"
          rows={12}
          aria-label="Input text"
        />

        {charCount > 0 && (
          <p style={styles.stats}>
            {formatNumber(charCount)} chars · {lineCount} lines
          </p>
        )}
      </section>
    );
  },
);

InputPanel.displayName = 'InputPanel';

const mono = 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace';

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    padding: 16,
    minHeight: 0,
  },
  labelRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 10,
    color: theme.textMuted,
    fontFamily: mono,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  clearBtn: {
    padding: 0,
    border: 'none',
    background: 'none',
    fontSize: 10,
    color: theme.textDim,
    fontFamily: mono,
    cursor: 'pointer',
  },
  input: {
    flex: 1,
    minHeight: 260,
    resize: 'vertical',
    width: '100%',
    boxSizing: 'border-box',
    backgroundColor: theme.surface,
    borderRadius: 16,
    padding: 16,
    color: theme.textPrimary,
    fontSize: 14,
    fontFamily: mono,
    lineHeight: 1.6,
    border: `1px solid ${theme.surfaceBorder}`,
    outline: 'none',
  },
  stats: {
    marginTop: 8,
    marginBottom: 0,
    textAlign: 'right',
    fontSize: 10,
    color: theme.textDim,
    fontFamily: mono,
  },
};
