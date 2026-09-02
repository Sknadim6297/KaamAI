import { formatINR, formatPercent, safeRound } from '../../utils/formatNumber';
import type { CalculatorResult, ValidationResult } from '../../types/calculator';

export type GSTMode = 'add' | 'remove';

export interface GSTInput {
  mode: GSTMode;
  amount: number;
  gstPercent: number;
}

export interface GSTOutput {
  baseAmount: number;
  gstAmount: number;
  finalAmount: number;
}

export function validateGSTInput(input: Partial<GSTInput>): ValidationResult {
  if (!input.amount || input.amount <= 0) {
    return { valid: false, error: 'Please enter a valid amount.' };
  }
  if (input.gstPercent === undefined || input.gstPercent < 0) {
    return { valid: false, error: 'Please enter a valid GST rate.' };
  }
  return { valid: true };
}

export function calculateGST(input: GSTInput): GSTOutput {
  if (input.mode === 'add') {
    const gstAmount = safeRound((input.amount * input.gstPercent) / 100);
    const finalAmount = safeRound(input.amount + gstAmount);
    return { baseAmount: input.amount, gstAmount, finalAmount };
  }
  const baseAmount = safeRound(input.amount / (1 + input.gstPercent / 100));
  const gstAmount = safeRound(input.amount - baseAmount);
  return { baseAmount, gstAmount, finalAmount: input.amount };
}

export function gstToResult(input: GSTInput, output: GSTOutput): CalculatorResult {
  return {
    title: input.mode === 'add' ? 'GST Added' : 'GST Removed',
    primaryLabel: input.mode === 'add' ? 'Final Amount' : 'Base Amount',
    primaryValue: formatINR(input.mode === 'add' ? output.finalAmount : output.baseAmount),
    rows: [
      { label: 'Base Amount', value: formatINR(output.baseAmount) },
      { label: `GST (${formatPercent(input.gstPercent, 0)})`, value: formatINR(output.gstAmount) },
      { label: 'Total Amount', value: formatINR(output.finalAmount), highlight: true },
    ],
  };
}

export const GST_PRESET_RATES = [0, 5, 12, 18, 28];
