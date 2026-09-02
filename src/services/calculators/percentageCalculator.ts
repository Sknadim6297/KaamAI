import { formatINR, formatPercent, safeRound } from '../../utils/formatNumber';
import type { CalculatorResult, ValidationResult } from '../../types/calculator';

export type PercentageMode = 'of' | 'whatPercent';

export interface PercentageInput {
  mode: PercentageMode;
  valueA: number;
  valueB: number;
}

export function validatePercentageInput(input: Partial<PercentageInput>): ValidationResult {
  if (input.valueA === undefined || input.valueA < 0) {
    return { valid: false, error: 'Please enter a valid amount.' };
  }
  if (!input.valueB || input.valueB <= 0) {
    return { valid: false, error: 'Please enter a valid amount.' };
  }
  if (input.mode === 'of' && input.valueA > 100) {
    // allow >100% technically but warn? spec says 20% of 2500 - allow any percent
  }
  return { valid: true };
}

export function calculatePercentage(input: PercentageInput): number {
  if (input.mode === 'of') {
    return safeRound((input.valueA / 100) * input.valueB);
  }
  return safeRound((input.valueA / input.valueB) * 100);
}

export function percentageToResult(input: PercentageInput, result: number): CalculatorResult {
  if (input.mode === 'of') {
    return {
      title: 'Result',
      primaryValue: formatINR(result),
      primaryLabel: `${formatPercent(input.valueA, 0)} of ${formatINR(input.valueB, 0)}`,
      rows: [{ label: 'Percentage', value: formatPercent(input.valueA, 0) }],
    };
  }
  return {
    title: 'Result',
    primaryValue: formatPercent(result),
    primaryLabel: `${formatINR(input.valueA, 0)} is what % of ${formatINR(input.valueB, 0)}?`,
    rows: [{ label: 'Amount', value: formatINR(input.valueA) }],
  };
}
