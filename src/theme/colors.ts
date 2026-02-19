// ═══════════════════════════════════════════════════════════
//  Zer0Write — Theme & Color Constants
// ═══════════════════════════════════════════════════════════

import type { StealthType, CategoryStyle } from '../engine/types';

/** Base dark theme colors */
export const theme = {
  bg: '#09090b',          // zinc-950
  surface: '#18181b',     // zinc-900
  surfaceBorder: '#27272a33', // zinc-800/20
  border: '#27272a',      // zinc-800
  textPrimary: '#ffffff',
  textSecondary: '#a1a1aa', // zinc-400
  textMuted: '#71717a',    // zinc-500
  textDim: '#52525b',      // zinc-600
  accent: '#ffffff',
  success: '#34d399',      // emerald-400
  danger: '#f87171',       // red-400
  warning: '#fbbf24',      // yellow-400
} as const;

/** Per-category badge & bar styles */
export const categoryStyles: Record<StealthType, CategoryStyle> = {
  ZERO:     { bg: '#f87171', text: '#000000', barColor: '#ef4444' }, // red
  TAG:      { bg: '#facc15', text: '#000000', barColor: '#eab308' }, // yellow
  SNEAKY:   { bg: '#c084fc', text: '#ffffff', barColor: '#a855f7' }, // purple
  VS:       { bg: '#fb923c', text: '#000000', barColor: '#f97316' }, // orange
  BIDI:     { bg: '#60a5fa', text: '#000000', barColor: '#3b82f6' }, // blue
  SPACE:    { bg: '#94a3b8', text: '#000000', barColor: '#64748b' }, // slate
  REGIONAL: { bg: '#f472b6', text: '#000000', barColor: '#ec4899' }, // pink
  ANNO:     { bg: '#a78bfa', text: '#000000', barColor: '#8b5cf6' }, // violet
  QUOTE:    { bg: '#34d399', text: '#000000', barColor: '#10b981' }, // emerald
  BULLET:   { bg: '#818cf8', text: '#000000', barColor: '#6366f1' }, // indigo
  DASH:     { bg: '#2dd4bf', text: '#000000', barColor: '#14b8a6' }, // teal
  HBAR:     { bg: '#67e8f9', text: '#000000', barColor: '#06b6d4' }, // cyan
  MULT:     { bg: '#fda4af', text: '#000000', barColor: '#f43f5e' }, // rose
};

/** Toast color variants */
export const toastColors = {
  success: { bg: 'rgba(6,78,59,0.95)', border: 'rgba(52,211,153,0.3)', text: '#6ee7b7' },
  error:   { bg: 'rgba(127,29,29,0.95)', border: 'rgba(239,68,68,0.3)', text: '#fca5a5' },
  info:    { bg: 'rgba(39,39,42,0.95)', border: 'rgba(63,63,70,0.5)', text: '#a1a1aa' },
} as const;
