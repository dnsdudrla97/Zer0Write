// ═══════════════════════════════════════════════════════════
//  Zer0Write — Position-Based Decoders
//  Each decoder walks from `start` and returns {decoded, len}.
//  This allows accurate inline processing of consecutive runs.
// ═══════════════════════════════════════════════════════════

import type { DecodeResult } from './types';
import { BIDI_MAP } from './constants';

/**
 * Decode AWS Tag Characters (U+E0000–U+E007F → ASCII).
 *
 * Tag Smuggling technique: invisible Unicode tag characters that
 * map directly to ASCII by subtracting 0xE0000. Used in prompt
 * injection and data exfiltration attacks.
 *
 * @param raw  - Full input string
 * @param start - Position to begin walking
 * @returns Decoded ASCII string and number of chars consumed
 */
export function decodeTags(raw: string, start: number): DecodeResult {
  let decoded = '';
  let i = start;

  while (i < raw.length) {
    const cp = raw.codePointAt(i)!;
    if (cp >= 0xE0000 && cp <= 0xE007F) {
      const ch = String.fromCharCode(cp - 0xE0000);
      decoded += ch >= ' ' && ch <= '~' ? ch : '?';
      i += cp > 0xFFFF ? 2 : 1; // surrogate pair handling
    } else {
      break;
    }
  }

  return { decoded, len: i - start };
}

/**
 * Decode SneakyBits encoding.
 *
 * Uses U+2062 (Invisible Times) = 0 and U+2064 (Invisible Plus) = 1.
 * Every 8 bits form one ASCII character.
 * Based on arXiv steganographic watermarking research.
 *
 * @param raw   - Full input string
 * @param start - Position to begin walking
 * @returns Decoded ASCII string and number of chars consumed
 */
export function decodeSneakyBits(raw: string, start: number): DecodeResult {
  let binary = '';
  let i = start;

  while (i < raw.length) {
    const cp = raw.codePointAt(i)!;
    if (cp === 0x2062) {
      binary += '0';
      i++;
    } else if (cp === 0x2064) {
      binary += '1';
      i++;
    } else {
      break;
    }
  }

  let decoded = '';
  for (let j = 0; j + 7 < binary.length; j += 8) {
    const byte = binary.slice(j, j + 8);
    if (byte.length === 8) {
      const v = parseInt(byte, 2);
      decoded += v >= 0x20 && v <= 0x7E ? String.fromCharCode(v) : '.';
    }
  }

  return { decoded: decoded || '[SneakyBits]', len: i - start };
}

/**
 * Decode Bidi control sequences to human-readable labels.
 *
 * Walks consecutive bidi control characters and returns their
 * standard abbreviations (LRE, RLE, LRO, RLO, LRI, RLI, etc.).
 * Also performs stack validation for paired controls:
 * - Embedding/override openers (LRE/RLE/LRO/RLO) must close with PDF
 * - Isolate openers (LRI/RLI/FSI) must close with PDI
 *
 * @param raw   - Full input string
 * @param start - Position to begin walking
 * @returns Space-separated bidi labels and number of chars consumed
 */
export function decodeBIDI(raw: string, start: number): DecodeResult {
  const labels: string[] = [];
  const expectedClosers: Array<'PDF' | 'PDI'> = [];
  let mismatchCount = 0;
  let i = start;

  while (i < raw.length) {
    const cp = raw.codePointAt(i)!;
    const label = BIDI_MAP[cp];
    if (!label) {
      break;
    }

    labels.push(label);

    // Embedding / override openers -> PDF closer
    if (cp === 0x202A || cp === 0x202B || cp === 0x202D || cp === 0x202E) {
      expectedClosers.push('PDF');
    }

    // Isolate openers -> PDI closer
    if (cp === 0x2066 || cp === 0x2067 || cp === 0x2068) {
      expectedClosers.push('PDI');
    }

    // Closers with stack validation
    if (cp === 0x202C) {
      if (expectedClosers[expectedClosers.length - 1] === 'PDF') {
        expectedClosers.pop();
      } else {
        mismatchCount++;
      }
    } else if (cp === 0x2069) {
      if (expectedClosers[expectedClosers.length - 1] === 'PDI') {
        expectedClosers.pop();
      } else {
        mismatchCount++;
      }
    }

    i++;
  }

  if (labels.length === 0) {
    return { decoded: '[BIDI]', len: i - start };
  }

  let decoded = labels.join(' ');
  if (mismatchCount > 0 || expectedClosers.length > 0) {
    const detail: string[] = [];
    if (mismatchCount > 0) detail.push(`mismatch:${mismatchCount}`);
    if (expectedClosers.length > 0) {
      detail.push(`unclosed:${expectedClosers.slice().reverse().join(',')}`);
    }
    decoded += ` [UNBALANCED ${detail.join(' ')}]`;
  }

  return { decoded, len: i - start };
}

/**
 * Decode Variation Selector watermark.
 *
 * Treats even codepoints as 0, odd as 1. Every 8 bits form
 * one ASCII character. Used as an invisible watermarking technique.
 *
 * Covers both basic VS (U+FE00–FE0F) and supplement (U+E0100–E01EF).
 *
 * @param raw   - Full input string
 * @param start - Position to begin walking
 * @returns Decoded ASCII string and number of chars consumed
 */
export function decodeVS(raw: string, start: number): DecodeResult {
  let bits = '';
  let i = start;

  while (i < raw.length) {
    const cp = raw.codePointAt(i)!;
    if ((cp >= 0xFE00 && cp <= 0xFE0F) || (cp >= 0xE0100 && cp <= 0xE01EF)) {
      bits += cp % 2 === 0 ? '0' : '1';
      i += cp > 0xFFFF ? 2 : 1;
    } else {
      break;
    }
  }

  let decoded = '';
  for (let j = 0; j + 7 < bits.length; j += 8) {
    const byte = bits.slice(j, j + 8);
    if (byte.length === 8) {
      const v = parseInt(byte, 2);
      decoded += v >= 0x20 && v <= 0x7E ? String.fromCharCode(v) : '.';
    }
  }

  return { decoded: decoded || `[VS:${bits}]`, len: i - start };
}

/**
 * Decode Regional Indicator Symbols (U+1F1E6–U+1F1FF → A-Z).
 *
 * Flag emoji steganography: pairs of regional indicators form
 * country flag emojis, but individual chars encode letters A-Z.
 *
 * @param raw   - Full input string
 * @param start - Position to begin walking
 * @returns Decoded letters and number of chars consumed
 */
export function decodeRegional(raw: string, start: number): DecodeResult {
  let decoded = '';
  let i = start;

  while (i < raw.length) {
    const cp = raw.codePointAt(i)!;
    if (cp >= 0x1F1E6 && cp <= 0x1F1FF) {
      decoded += String.fromCharCode(cp - 0x1F1E6 + 65);
      i += 2; // always surrogate pair
    } else {
      break;
    }
  }

  return { decoded: decoded || '[Flag]', len: i - start };
}
