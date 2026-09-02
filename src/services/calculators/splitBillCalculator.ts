import { formatINR, safeRound } from '../../utils/formatNumber';
import type { CalculatorResult, ValidationResult } from '../../types/calculator';

export interface SplitBillInput {
  totalBill: number;
  people: number;
  tipPercent: number;
  discountPercent?: number;
}

export interface SplitBillOutput {
  discountAmount: number;
  subtotalAfterDiscount: number;
  tipAmount: number;
  finalBill: number;
  perPerson: number;
}

export function validateSplitBillInput(input: Partial<SplitBillInput>): ValidationResult {
  if (!input.totalBill || input.totalBill <= 0) {
    return { valid: false, error: 'Please enter a valid bill amount.' };
  }
  if (!input.people || input.people < 1 || !Number.isInteger(input.people)) {
    return { valid: false, error: 'Number of people must be at least 1.' };
  }
  if (input.tipPercent === undefined || input.tipPercent < 0) {
    return { valid: false, error: 'Please enter a valid tip percentage.' };
  }
  if (input.discountPercent !== undefined && (input.discountPercent < 0 || input.discountPercent > 100)) {
    return { valid: false, error: 'Please enter a valid discount percentage.' };
  }
  return { valid: true };
}

export function calculateSplitBill(input: SplitBillInput): SplitBillOutput {
  const discountPercent = input.discountPercent ?? 0;
  const discountAmount = safeRound((input.totalBill * discountPercent) / 100);
  const subtotalAfterDiscount = safeRound(input.totalBill - discountAmount);
  const tipAmount = safeRound((subtotalAfterDiscount * input.tipPercent) / 100);
  const finalBill = safeRound(subtotalAfterDiscount + tipAmount);
  const perPerson = safeRound(finalBill / input.people);

  return {
    discountAmount,
    subtotalAfterDiscount,
    tipAmount,
    finalBill,
    perPerson,
  };
}

export function splitBillToResult(input: SplitBillInput, output: SplitBillOutput): CalculatorResult {
  return {
    title: 'Per Person',
    primaryLabel: `${input.people} people`,
    primaryValue: formatINR(output.perPerson),
    rows: [
      { label: 'Discount', value: formatINR(output.discountAmount) },
      { label: 'Tip', value: formatINR(output.tipAmount) },
      { label: 'Final Bill', value: formatINR(output.finalBill), highlight: true },
    ],
  };
}
