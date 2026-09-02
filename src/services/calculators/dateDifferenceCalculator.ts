import { parseISODateParts } from '../../utils/formatNumber';
import type { CalculatorResult, ValidationResult } from '../../types/calculator';

export interface DateDifferenceInput {
  startDate: string;
  endDate: string;
}

export interface DateDifferenceOutput {
  totalDays: number;
  weeks: number;
  years: number;
  months: number;
  days: number;
}

export function validateDateDifferenceInput(input: Partial<DateDifferenceInput>): ValidationResult {
  const start = input.startDate ? parseISODateParts(input.startDate) : null;
  const end = input.endDate ? parseISODateParts(input.endDate) : null;
  if (!start) return { valid: false, error: 'Please enter a valid start date (YYYY-MM-DD).' };
  if (!end) return { valid: false, error: 'Please enter a valid end date (YYYY-MM-DD).' };
  if (end < start) {
    return { valid: false, error: 'End date must be on or after start date.' };
  }
  return { valid: true };
}

function diffYMD(start: Date, end: Date): { years: number; months: number; days: number } {
  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  let days = end.getDate() - start.getDate();

  if (days < 0) {
    months -= 1;
    days += new Date(end.getFullYear(), end.getMonth(), 0).getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  return { years, months, days };
}

export function calculateDateDifference(input: DateDifferenceInput): DateDifferenceOutput {
  const start = parseISODateParts(input.startDate)!;
  const end = parseISODateParts(input.endDate)!;
  const msPerDay = 24 * 60 * 60 * 1000;
  const totalDays = Math.round((end.getTime() - start.getTime()) / msPerDay);
  const ymd = diffYMD(start, end);
  return {
    totalDays,
    weeks: Math.floor(totalDays / 7),
    years: ymd.years,
    months: ymd.months,
    days: ymd.days,
  };
}

export function dateDifferenceToResult(output: DateDifferenceOutput): CalculatorResult {
  return {
    title: 'Date Difference',
    primaryValue: `${output.totalDays} Days`,
    primaryLabel: `${output.weeks} weeks approx.`,
    rows: [
      { label: 'Years', value: String(output.years) },
      { label: 'Months', value: String(output.months) },
      { label: 'Days', value: String(output.days) },
    ],
  };
}
