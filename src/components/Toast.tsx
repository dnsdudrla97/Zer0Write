import React, { useEffect } from 'react';
import { toastColors } from '../theme/colors';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  visible: boolean;
  onHide: () => void;
}

const DURATION = 2000;
const FADE_IN = 250;
const FADE_OUT = 300;

export const Toast: React.FC<ToastProps> = React.memo(({ message, type, visible, onHide }) => {
  useEffect(() => {
    if (!visible) {
      return undefined;
    }

    const timer = setTimeout(onHide, DURATION);
    return () => clearTimeout(timer);
  }, [visible, onHide]);

  if (!visible) return null;

  const colors = toastColors[type];

  return (
    <div
      style={{
        ...styles.container,
        color: colors.text,
        backgroundColor: colors.bg,
        borderColor: colors.border,
        animation: `Zer0Write-toast-in ${FADE_IN}ms ease forwards, Zer0Write-toast-out ${FADE_OUT}ms ease ${DURATION - FADE_OUT}ms forwards`,
      }}
      aria-live="polite"
      role="status"
    >
      {message}
    </div>
  );
});

Toast.displayName = 'Toast';

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'fixed',
    left: '50%',
    bottom: 24,
    transform: 'translateX(-50%)',
    padding: '10px 20px',
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'solid',
    fontSize: 12,
    zIndex: 1000,
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    pointerEvents: 'none',
  },
};
