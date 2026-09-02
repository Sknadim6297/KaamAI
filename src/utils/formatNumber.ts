import type { ValidationResult } from '../types/calculator';

export function formatINR(amount: number, decimals = 2): string {
  if (!Number.isFinite(amount)) return '—';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
}

export function formatNumber(value: number, decimals = 2): string {
  if (!Number.isFinite(value)) return '—';
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatPercent(value: number, decimals = 2): string {
  if (!Number.isFinite(value)) return '—';
  return `${formatNumber(value, decimals)}%`;
}

export function parsePositiveNumber(value: string): number | null {
  const cleaned = value.replace(/[₹,\s]/g, '').trim();
  if (!cleaned) return null;
  const num = Number(cleaned);
  if (!Number.isFinite(num) || num < 0) return null;
  return num;
}

export function parseStrictPositive(value: string): number | null {
  const num = parsePositiveNumber(value);
  if (num === null || num <= 0) return null;
  return num;
}

export function parseNonNegative(value: string): number | null {
  const num = parsePositiveNumber(value);
  if (num === null) return null;
  return num;
}

export function validatePositive(value: string, label = 'amount'): ValidationResult {
  const num = parseStrictPositive(value);
  if (num === null) {
    return { valid: false, error: `Please enter a valid ${label}.` };
  }
  return { valid: true };
}

export function validateNonNegative(value: string, label = 'amount'): ValidationResult {
  const num = parseNonNegative(value);
  if (num === null) {
    return { valid: false, error: `Please enter a valid ${label}.` };
  }
  return { valid: true };
}

export function validatePercent(value: string): ValidationResult {
  const num = parsePositiveNumber(value);
  if (num === null || num < 0 || num > 100) {
    return { valid: false, error: 'Please enter a valid percentage between 0 and 100.' };
  }
  return { valid: true };
}

export function validateIntegerMin(value: string, min: number, label: string): ValidationResult {
  const num = parsePositiveNumber(value);
  if (num === null || !Number.isInteger(num) || num < min) {
    return { valid: false, error: `Please enter a valid ${label}.` };
  }
  return { valid: true };
}

export function parseISODateParts(iso: string): Date | null {
  const match = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  const y = Number(match[1]);
  const m = Number(match[2]);
  const d = Number(match[3]);
  const date = new Date(y, m - 1, d);
  if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) {
    return null;
  }
  return date;
}

export function toISODateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function safeRound(value: number, decimals = 2): number {
  if (!Number.isFinite(value)) return 0;
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}
