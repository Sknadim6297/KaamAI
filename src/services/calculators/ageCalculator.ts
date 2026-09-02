import { parseISODateParts } from '../../utils/formatNumber';
import type { CalculatorResult, ValidationResult } from '../../types/calculator';

export interface AgeInput {
  dateOfBirth: string;
  asOfDate: string;
}

export interface AgeOutput {
  years: number;
  months: number;
  days: number;
}

export function validateAgeInput(input: Partial<AgeInput>): ValidationResult {
  const dob = input.dateOfBirth ? parseISODateParts(input.dateOfBirth) : null;
  const asOf = input.asOfDate ? parseISODateParts(input.asOfDate) : null;
  if (!dob) return { valid: false, error: 'Please enter a valid date of birth (YYYY-MM-DD).' };
  if (!asOf) return { valid: false, error: 'Please enter a valid date.' };
  if (asOf < dob) return { valid: false, error: 'Calculate date must be on or after date of birth.' };
  return { valid: true };
}

export function calculateAge(input: AgeInput): AgeOutput {
  const dob = parseISODateParts(input.dateOfBirth)!;
  const asOf = parseISODateParts(input.asOfDate)!;

  let years = asOf.getFullYear() - dob.getFullYear();
  let months = asOf.getMonth() - dob.getMonth();
  let days = asOf.getDate() - dob.getDate();

  if (days < 0) {
    months -= 1;
    const prevMonth = new Date(asOf.getFullYear(), asOf.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return { years, months, days };
}

export function ageToResult(output: AgeOutput): CalculatorResult {
  return {
    title: 'Your Age',
    primaryValue: `${output.years} Years`,
    primaryLabel: `${output.months} Months · ${output.days} Days`,
    rows: [
      { label: 'Years', value: String(output.years) },
      { label: 'Months', value: String(output.months) },
      { label: 'Days', value: String(output.days) },
    ],
  };
}
