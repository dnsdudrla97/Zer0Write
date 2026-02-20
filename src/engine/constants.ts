// ═══════════════════════════════════════════════════════════
//  Zer0Write — Character Constants & Maps
// ═══════════════════════════════════════════════════════════

/**
 * Zero-Width & invisible characters (single codepoints).
 * Includes ZWSP, ZWNJ, ZWJ, BOM, Word Joiner, Soft Hyphen,
 * Mongolian/Arabic/Khmer/Hangul invisible chars.
 */
export const ZERO_CHARS = new Set<string>([
  '\u200B', // Zero Width Space
  '\u200C', // Zero Width Non-Joiner
  '\u200D', // Zero Width Joiner
  '\u2060', // Word Joiner
  '\uFEFF', // BOM / ZWNBSP
  '\u00AD', // Soft Hyphen
  '\u034F', // Combining Grapheme Joiner
  '\u202F', // Narrow No-Break Space
  '\u205F', // Medium Mathematical Space
  '\u3000', // Ideographic Space
  '\u3164', // Hangul Filler
  '\uFFA0', // Halfwidth Hangul Filler
  '\u180E', // Mongolian Vowel Separator
  '\u061C', // Arabic Letter Mark
  '\u17B4', // Khmer Vowel Inherent Aq
  '\u17B5', // Khmer Vowel Inherent Aa
  '\u115F', // Hangul Choseong Filler
  '\u1160', // Hangul Jungseong Filler
  '\u2061', // Function Application
  '\u2063', // Invisible Separator
]);

/** Bidi control codepoint → label map */
export const BIDI_MAP: Record<number, string> = {
  0x200E: 'LRM',
  0x200F: 'RLM',
  0x202A: 'LRE',
  0x202B: 'RLE',
  0x202C: 'PDF',
  0x202D: 'LRO',
  0x202E: 'RLO',
  0x2066: 'LRI',
  0x2067: 'RLI',
  0x2068: 'FSI',
  0x2069: 'PDI',
  // Deprecated (still observed in obfuscation payloads)
  0x206A: 'ISS',
  0x206B: 'ASS',
  0x206C: 'IAFS',
  0x206D: 'AAFS',
  0x206E: 'NADS',
  0x206F: 'NODS',
};

/** Smart quote characters */
export const SMART_QUOTES = new Set<string>([
  '\u201C', // "
  '\u201D', // "
  '\u2018', // '
  '\u2019', // '
  '\u201A', // ‚
  '\u201E', // „
]);

/** LLM-typical bullet characters */
export const BULLET_CHARS = new Set<string>([
  '\u2022', // •
  '\u25E6', // ◦
  '\u2023', // ‣
  '\u2043', // ⁃
  '\u2219', // ∙
  '\u00B7', // ·
]);

/** LLM punctuation (dashes, ellipsis) */
export const DASH_CHARS = new Set<string>([
  '\u2013', // –
  '\u2014', // —
  '\u2E3A', // ⸺
  '\u2E3B', // ⸻
  '\u2192', // →
  '\u2026', // …
]);

/** Horizontal bar punctuation */
export const HBAR_CHARS = new Set<string>([
  '\u2015', // ―
]);

/** Multiplication sign commonly used as obfuscated x */
export const MULT_CHARS = new Set<string>([
  '\u00D7', // ×
]);

/**
 * Characters that should be preserved as plain ASCII in cleaned output.
 */
export const CLEAN_REPLACEMENTS: Record<string, string> = {
  '\u2015': '-', // ―
  '\u00D7': 'x', // ×
  '\u2E3A': '--', // ⸺
  '\u2E3B': '---', // ⸻
  '\u2192': '->', // →
};
/**
 * Master stealth-strip regex.
 * Single-pass removal of ALL stealth characters after NFKC normalization.
 * Covers: Zero-Width, Tags, SneakyBits carriers, VarSelectors,
 * Bidi (incl. deprecated controls), VarSpaces, NBSP, Braille Blank,
 * Smart Quotes, Bullets, Dashes,
 * Annotations, Regional Indicators.
 */
export const STEALTH_REGEX =
  /[\u200B\u200C\u200D\u2060\uFEFF\u00AD\u034F\u202F\u205F\u3000\u3164\uFFA0\u180E\u061C\u17B4\u17B5\u115F\u1160\u2061\u2063\u200E\u200F\u202A-\u202E\u2066-\u206F\uFFF9-\uFFFB\uFE00-\uFE0F\u2000-\u200A\u00A0\u2062\u2064\u2800\u201C\u201D\u2018\u2019\u201A\u201E\u2022\u25E6\u2023\u2043\u2219\u00B7\u2013\u2014\u2015\u2E3A\u2E3B\u2192\u2026\u00D7\u{E0000}-\u{E007F}\u{E0100}-\u{E01EF}\u{1D173}-\u{1D17A}\u{1F1E6}-\u{1F1FF}]/gu;
