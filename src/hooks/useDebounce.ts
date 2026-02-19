import { useRef, useCallback, useEffect } from 'react';

type DebouncedFn<T extends (...args: any[]) => void> = ((...args: Parameters<T>) => void) & {
  cancel: () => void;
};

/**
 * Returns a debounced version of the callback.
 * Timer resets on each call. Cleans up on unmount.
 *
 * @param callback - Function to debounce
 * @param delayMs  - Debounce delay in milliseconds
 */
export function useDebounce<T extends (...args: any[]) => void>(
  callback: T,
  delayMs: number,
): DebouncedFn<T> {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const callbackRef = useRef(callback);

  // Keep callback ref fresh without re-creating the debounced fn
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const cancel = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => cancel, [cancel]);

  const debounced = useCallback(
    (...args: Parameters<T>) => {
      cancel();
      timerRef.current = setTimeout(() => {
        timerRef.current = null;
        callbackRef.current(...args);
      }, delayMs);
    },
    [delayMs, cancel],
  ) as DebouncedFn<T>;

  debounced.cancel = cancel;

  return debounced;
}
