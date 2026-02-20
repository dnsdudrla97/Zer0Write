import { describe, expect, it } from 'vitest';
import { isStealth } from '../classifier';
import { decodeBIDI, decodeSneakyBits, decodeTags } from '../decoders';
import { processText } from '../processor';

function encodeSneakyBits(text: string): string {
  let out = '';
  for (const char of text) {
    const bits = char.codePointAt(0)!.toString(2).padStart(8, '0');
    for (const bit of bits) {
      out += bit === '1' ? '\u2064' : '\u2062';
    }
  }
  return out;
}

describe('engine classifier', () => {
  it('classifies representative stealth categories', () => {
    expect(isStealth('\u200B')?.type).toBe('ZERO');
    expect(isStealth(String.fromCodePoint(0xE0001))?.type).toBe('TAG');
    expect(isStealth('\u2062')?.type).toBe('SNEAKY');
    expect(isStealth('―')?.type).toBe('HBAR');
    expect(isStealth('×')?.type).toBe('MULT');
    expect(isStealth('⸺')?.type).toBe('DASH');
    expect(isStealth('⸻')?.type).toBe('DASH');
    expect(isStealth('→')?.type).toBe('DASH');
    expect(isStealth('A')).toBeNull();
  });
});

describe('engine decoders', () => {
  it('decodes consecutive AWS tag characters', () => {
    const tags = String.fromCodePoint(0xE0041, 0xE0042);
    const result = decodeTags(`${tags}Z`, 0);

    expect(result.decoded).toBe('AB');
    expect(result.len).toBe(tags.length);
  });

  it('decodes sneaky bit payload to ASCII', () => {
    const payload = encodeSneakyBits('A');
    const result = decodeSneakyBits(`${payload}x`, 0);

    expect(result.decoded).toBe('A');
    expect(result.len).toBe(payload.length);
  });

  it('marks unbalanced bidi runs', () => {
    const result = decodeBIDI('\u202A', 0);
    expect(result.decoded).toContain('[UNBALANCED');
  });
});

describe('processText', () => {
  it('returns empty defaults for empty input', () => {
    const result = processText('');
    expect(result.cleaned).toBe('');
    expect(result.stats.stealthCount).toBe(0);
    expect(result.segments).toHaveLength(0);
  });

  it('strips stealth chars and tracks stats', () => {
    const result = processText('A\u200BB');

    expect(result.cleaned).toBe('AB');
    expect(result.stats.stealthCount).toBe(1);
    expect(result.stats.types).toContain('Zero-Width');
    expect(result.stats.catCounts.ZERO).toBe(1);
  });

  it('decodes sneaky runs inside mixed text', () => {
    const hidden = encodeSneakyBits('C');
    const result = processText(`x${hidden}y`);
    const stealthSegment = result.segments.find((segment) => segment.kind === 'stealth');

    expect(result.cleaned).toBe('xy');
    expect(result.stats.catCounts.SNEAKY).toBe(hidden.length);
    expect(stealthSegment && stealthSegment.kind === 'stealth' ? stealthSegment.decoded : '').toBe(
      'C',
    );
  });

  it('replaces hbar/mult and dash variants in cleaned output', () => {
    const result = processText('A―B×C⸺D⸻E→F');

    expect(result.cleaned).toBe('A-BxC--D---E->F');
    expect(result.stats.catCounts.HBAR).toBe(1);
    expect(result.stats.catCounts.MULT).toBe(1);
    expect(result.stats.catCounts.DASH).toBe(3);
  });
});
