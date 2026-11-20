/**
 * Applies a masking transformation to a value.
 * @param value  The raw value to mask.
 * @param maskType  One of: 'code', 'hash', 'full', 'nullify'.
 *   - code: replace characters with fixed code mask (first 2, last 2 visible).
 *   - hash: return SHA-256 hex of the value.
 *   - full: mask the entire value (e.g. '****').
 *   - nullify: return null.
 */
import { createHash } from 'node:crypto';

export function maskValue(
  value: unknown,
  maskType: string,
): string | null | unknown {
  if (value === null || value === undefined) return null;
  const str = String(value);
  switch (maskType) {
    case 'code': {
      if (str.length <= 4) return '****';
      return `${str.slice(0, 2)}${'*'.repeat(str.length - 4)}${str.slice(-2)}`;
    }
    case 'hash':
      return createHash('sha256').update(str).digest('hex');
    case 'full':
      return '****';
    case 'nullify':
      return null;
    default:
      return value;
  }
}
