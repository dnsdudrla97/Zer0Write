// ═══════════════════════════════════════════════════════════
//  Zer0Write — Stealth Character Classifier
//  Determines if a character is stealth and its category.
// ═══════════════════════════════════════════════════════════

import type { StealthInfo } from './types';
import { ZERO_CHARS, BIDI_MAP, SMART_QUOTES, BULLET_CHARS, DASH_CHARS } from './constants';

/**
 * Classify a single character as stealth or null.
 *
 * Categories (priority order):
 *  ZERO     — Zero-width & invisible (ZWSP, ZWNJ, ZWJ, BOM, SHY, fillers)
 *  TAG      — AWS Tag characters (U+E0000–E007F)
 *  SNEAKY   — SneakyBits carriers (U+2062 Invisible Times, U+2064 Invisible Plus)
 *  VS       — Variation Selectors (U+FE00–FE0F, U+E0100–E01EF)
 *  BIDI     — Bidirectional controls (LRM, RLM, LRE, RLE, LRO, RLO, deprecated marks)
 *  SPACE    — Variable-width spaces (U+2000–200A) + NBSP (U+00A0) + Braille Blank (U+2800)
 *  REGIONAL — Regional Indicator Symbols (U+1F1E6–1F1FF)
 *  ANNO     — Interlinear (U+FFF9–FFFB) + Musical annotations (U+1D173–1D17A)
 *  QUOTE    — Smart/curly quotes (U+201C–201E, U+2018–201A)
 *  BULLET   — LLM-typical bullets (•◦‣⁃∙·)
 *  DASH     — LLM punctuation (–—…)
 *
 * @param c - A single character (may be multi-byte)
 * @returns StealthInfo or null if the character is normal
 */
export function isStealth(c: string): StealthInfo | null {
  const cp = c.codePointAt(0)!;

  // Zero-Width & invisible
  if (ZERO_CHARS.has(c)) {
    return { type: 'ZERO', label: 'Zero-Width' };
  }

  // AWS Tag Characters (U+E0000–U+E007F)
  if (cp >= 0xE0000 && cp <= 0xE007F) {
    return { type: 'TAG', label: 'AWS_Tag' };
  }

  // SneakyBits carriers: Invisible Times (0) and Invisible Plus (1)
  if (cp === 0x2062 || cp === 0x2064) {
    return { type: 'SNEAKY', label: 'SneakyBits' };
  }

  // Variation Selectors (basic + supplement)
  if ((cp >= 0xFE00 && cp <= 0xFE0F) || (cp >= 0xE0100 && cp <= 0xE01EF)) {
    return { type: 'VS', label: 'VarSelector' };
  }

  // Bidi controls
  if (BIDI_MAP[cp] !== undefined) {
    return { type: 'BIDI', label: 'BidiControl' };
  }

  // Variable-width spaces + NBSP + Braille blank
  if ((cp >= 0x2000 && cp <= 0x200A) || cp === 0x00A0 || cp === 0x2800) {
    return { type: 'SPACE', label: cp === 0x2800 ? 'BrailleBlank' : 'VarSpace' };
  }

  // Regional Indicator Symbols (flag emoji steganography)
  if (cp >= 0x1F1E6 && cp <= 0x1F1FF) {
    return { type: 'REGIONAL', label: 'Regional' };
  }

  // Annotations: Interlinear + Musical symbol
  if ((cp >= 0xFFF9 && cp <= 0xFFFB) || (cp >= 0x1D173 && cp <= 0x1D17A)) {
    return { type: 'ANNO', label: 'Annotation' };
  }

  // Smart quotes
  if (SMART_QUOTES.has(c)) {
    return { type: 'QUOTE', label: 'SmartQuote' };
  }

  // LLM-typical bullets
  if (BULLET_CHARS.has(c)) {
    return { type: 'BULLET', label: 'LLM-Bullet' };
  }

  // LLM punctuation
  if (DASH_CHARS.has(c)) {
    return { type: 'DASH', label: 'LLM-Punct' };
  }

  return null;
}
