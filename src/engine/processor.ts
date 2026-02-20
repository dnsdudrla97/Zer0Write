// ═══════════════════════════════════════════════════════════
//  Zer0Write — Main Processing Pipeline
//  Walks raw text, classifies & decodes stealth characters,
//  produces segments for rendering + cleaned output + stats.
// ═══════════════════════════════════════════════════════════

import type { Segment, ScanResult, ScanStats, StealthType } from './types';
import { isStealth } from './classifier';
import { decodeTags, decodeSneakyBits, decodeBIDI, decodeVS, decodeRegional } from './decoders';
import { DASH_REPLACEMENTS, STEALTH_REGEX } from './constants';

/**
 * Calculate Shannon entropy of a string.
 * Higher entropy suggests more randomness / hidden data.
 */
function shannonEntropy(text: string): number {
  const cps = [...text].map((ch) => ch.codePointAt(0)!);
  const freq: Record<number, number> = {};

  for (const cp of cps) {
    freq[cp] = (freq[cp] || 0) + 1;
  }

  let entropy = 0;
  const len = cps.length;
  for (const key in freq) {
    const p = freq[key] / len;
    if (p > 0) entropy -= p * Math.log2(p);
  }

  return entropy;
}

/**
 * Build a tooltip string for a stealth character.
 */
function buildTitle(label: string, cp: number, extra?: string): string {
  const hex = 'U+' + cp.toString(16).toUpperCase().padStart(4, '0');
  if (extra) return `${label} (${extra})`;
  return `${label} (${hex})`;
}

function applyDashReplacements(text: string): string {
  return text.replace(/[—⸺⸻→]/g, (char) => DASH_REPLACEMENTS[char] ?? char);
}

/**
 * Process raw text and produce a complete scan result.
 *
 * Pipeline:
 *  1. Walk characters with position tracking
 *  2. Classify each character via isStealth()
 *  3. For run-based types (TAG, SNEAKY, VS, BIDI, REGIONAL),
 *     consume entire run and decode
 *  4. Build segment array for UI rendering
 *  5. Generate cleaned text via NFKC + regex strip
 *  6. Compute statistics
 *
 * @param raw - The input text to scan
 * @returns ScanResult with segments, cleaned text, and stats
 */
export function processText(raw: string): ScanResult {
  if (!raw) {
    return {
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
  }

  const segments: Segment[] = [];
  const types = new Set<string>();
  const catCounts: Record<string, number> = {};
  let stealthCount = 0;

  // Accumulator for consecutive normal text (batching optimization)
  let textAccum = '';

  const flushText = () => {
    if (textAccum) {
      segments.push({ kind: 'text', value: textAccum });
      textAccum = '';
    }
  };

  const addStealth = (
    type: StealthType,
    label: string,
    decoded: string,
    title: string,
    count: number,
  ) => {
    flushText();
    types.add(label);
    catCounts[type] = (catCounts[type] || 0) + count;
    stealthCount += count;
    segments.push({ kind: 'stealth', type, label, decoded, title, count });
  };

  // ── Walk through raw string ──
  let i = 0;
  while (i < raw.length) {
    const cp = raw.codePointAt(i)!;
    const charLen = cp > 0xFFFF ? 2 : 1;
    const c = String.fromCodePoint(cp);
    const info = isStealth(c);

    if (!info) {
      textAccum += c;
      i += charLen;
      continue;
    }

    switch (info.type) {
      case 'TAG': {
        const r = decodeTags(raw, i);
        addStealth('TAG', info.label, r.decoded || '[TAG]', `AWS Tag (${r.len} chars)`, r.len);
        i += r.len;
        break;
      }

      case 'SNEAKY': {
        const r = decodeSneakyBits(raw, i);
        addStealth('SNEAKY', info.label, r.decoded, `SneakyBits (${r.len} carriers)`, r.len);
        i += r.len;
        break;
      }

      case 'BIDI': {
        const r = decodeBIDI(raw, i);
        const title = r.decoded.includes('[UNBALANCED') ? 'BIDI Control (Unbalanced)' : 'BIDI Control';
        addStealth('BIDI', info.label, r.decoded, title, r.len);
        i += r.len;
        break;
      }

      case 'VS': {
        const r = decodeVS(raw, i);
        addStealth('VS', info.label, r.decoded, `VS Watermark (${r.len} selectors)`, r.len);
        i += r.len;
        break;
      }

      case 'REGIONAL': {
        const r = decodeRegional(raw, i);
        const count = r.len / 2; // each regional indicator is a surrogate pair
        addStealth('REGIONAL', info.label, r.decoded, 'Flag Indicator', count);
        i += r.len;
        break;
      }

      case 'ZERO': {
        const hex = 'U+' + cp.toString(16).toUpperCase().padStart(4, '0');
        addStealth('ZERO', info.label, hex, buildTitle(info.label, cp), 1);
        i += charLen;
        break;
      }

      case 'SPACE': {
        const decoded = cp === 0x2800 ? 'BRAILLE_BLANK' : 'SP:' + cp.toString(16).toUpperCase();
        addStealth('SPACE', info.label, decoded, buildTitle(info.label, cp), 1);
        i += charLen;
        break;
      }

      case 'QUOTE': {
        addStealth('QUOTE', info.label, c, buildTitle('Smart Quote', cp), 1);
        i += charLen;
        break;
      }

      case 'BULLET': {
        addStealth('BULLET', info.label, c, buildTitle(info.label, cp), 1);
        i += charLen;
        break;
      }

      case 'DASH': {
        addStealth('DASH', info.label, c, buildTitle(info.label, cp), 1);
        i += charLen;
        break;
      }

      case 'ANNO': {
        const name = cp >= 0x1D173 ? 'MusAnn' : 'IntAnn';
        addStealth('ANNO', info.label, name, buildTitle(info.label, cp), 1);
        i += charLen;
        break;
      }

      default: {
        const hex = 'U+' + cp.toString(16).toUpperCase().padStart(4, '0');
        addStealth(info.type, info.label, hex, buildTitle(info.label, cp), 1);
        i += charLen;
        break;
      }
    }
  }

  flushText(); // flush any remaining normal text

  // ── Cleaned output: NFKC + targeted replacements + single-pass regex strip ──
  const cleaned = applyDashReplacements(raw.normalize('NFKC')).replace(STEALTH_REGEX, '');

  // ── Stats ──
  const totalChars = [...raw].length;
  const density = totalChars > 0 ? (stealthCount / totalChars) * 100 : 0;
  const entropy = shannonEntropy(raw);

  const stats: ScanStats = {
    totalChars,
    stealthCount,
    density,
    entropy,
    types: Array.from(types),
    catCounts,
  };

  return { segments, cleaned, stats };
}
