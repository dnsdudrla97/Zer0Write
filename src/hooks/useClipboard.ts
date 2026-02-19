import { useCallback, useRef } from 'react';

function fallbackCopy(text: string): boolean {
  if (typeof document === 'undefined') return false;

  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', 'true');
    textarea.style.position = 'fixed';
    textarea.style.top = '-9999px';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);

    textarea.focus();
    textarea.select();
    const copied = document.execCommand('copy');

    document.body.removeChild(textarea);
    return copied;
  } catch {
    return false;
  }
}

/**
 * Clipboard hook with cooldown to prevent double-tap spam.
 *
 * @returns { copy } copy function
 */
export function useClipboard() {
  const cooldownRef = useRef(false);

  const copy = useCallback(async (text: string): Promise<boolean> => {
    if (cooldownRef.current || !text) return false;

    try {
      cooldownRef.current = true;

      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const copied = fallbackCopy(text);
        if (!copied) {
          cooldownRef.current = false;
          return false;
        }
      }

      setTimeout(() => {
        cooldownRef.current = false;
      }, 500);

      return true;
    } catch {
      cooldownRef.current = false;
      return false;
    }
  }, []);

  return { copy };
}
