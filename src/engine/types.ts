// ═══════════════════════════════════════════════════════════
//  Zer0Write — Type Definitions
// ═══════════════════════════════════════════════════════════

/** Stealth character category identifiers */
export type StealthType =
  | 'ZERO'
  | 'TAG'
  | 'SNEAKY'
  | 'VS'
  | 'BIDI'
  | 'SPACE'
  | 'REGIONAL'
  | 'ANNO'
  | 'QUOTE'
  | 'BULLET'
  | 'DASH';

/** Result of isStealth() classification */
export interface StealthInfo {
  readonly type: StealthType;
  readonly label: string;
}

/** Result of position-based decoders */
export interface DecodeResult {
  readonly decoded: string;
  readonly len: number;
}

/** A single segment in the processed output */
export type Segment =
  | { kind: 'text'; value: string }
  | { kind: 'stealth'; type: StealthType; label: string; decoded: string; title: string; count: number };

/** Aggregated scan statistics */
export interface ScanStats {
  readonly totalChars: number;
  readonly stealthCount: number;
  readonly density: number;
  readonly entropy: number;
  readonly types: string[];
  readonly catCounts: Record<string, number>;
}

/** Full scan result returned by the processor */
export interface ScanResult {
  readonly segments: Segment[];
  readonly cleaned: string;
  readonly stats: ScanStats;
}

/** Category color mapping for UI */
export interface CategoryStyle {
  readonly bg: string;
  readonly text: string;
  readonly barColor: string;
}
