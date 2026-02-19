import { useState, useCallback, useMemo } from 'react';
import { processText } from '../engine/processor';
import type { ScanResult } from '../engine/types';
import { useDebounce } from './useDebounce';

const EMPTY_RESULT: ScanResult = {
  segments: [],
  cleaned: '',
  stats: {
    totalChars: 0,
    stealthCount: 0,
    density: 0,
    entropy: 0,
    types: [],
    catCounts: {},
  },
};

/**
 * Core scanning hook.
 *
 * Manages input state, live-scan toggle, debounced processing,
 * and exposes scan results for the UI layer.
 *
 * @param debounceMs - Live scan debounce delay (default 120ms)
 */
export function useScanner(debounceMs = 120) {
  const [input, setInput] = useState('');
  const [liveScan, setLiveScan] = useState(true);
  const [result, setResult] = useState<ScanResult>(EMPTY_RESULT);

  // Manual scan (button press or Ctrl+Enter)
  const scan = useCallback(
    (text?: string) => {
      const raw = text ?? input;
      setResult(raw ? processText(raw) : EMPTY_RESULT);
    },
    [input],
  );

  // Debounced live scan
  const debouncedScan = useDebounce((text: string) => {
    setResult(text ? processText(text) : EMPTY_RESULT);
  }, debounceMs);

  // Input change handler (triggers live scan if enabled)
  const handleInput = useCallback(
    (text: string) => {
      setInput(text);
      if (liveScan) {
        debouncedScan(text);
      } else {
        debouncedScan.cancel();
      }
    },
    [liveScan, debouncedScan],
  );

  // Clear everything
  const clear = useCallback(() => {
    debouncedScan.cancel();
    setInput('');
    setResult(EMPTY_RESULT);
  }, [debouncedScan]);

  // Toggle live scan
  const toggleLiveScan = useCallback(() => {
    setLiveScan((prev) => {
      const next = !prev;
      if (!next) {
        debouncedScan.cancel();
      }
      // If enabling live scan, run immediately
      if (next && input) {
        setResult(processText(input));
      }
      return next;
    });
  }, [input, debouncedScan]);

  // Input line count (memoized)
  const lineCount = useMemo(() => (input ? input.split('\n').length : 0), [input]);
  const charCount = useMemo(() => (input ? [...input].length : 0), [input]);

  return {
    input,
    setInput: handleInput,
    liveScan,
    toggleLiveScan,
    scan,
    clear,
    result,
    lineCount,
    charCount,
  };
}
