import { formatINR, formatPercent, safeRound } from '../../utils/formatNumber';
import type { CalculatorResult, ValidationResult } from '../../types/calculator';

export interface DiscountInput {
  originalPrice: number;
  discountPercent: number;
}

export interface DiscountOutput {
  discountAmount: number;
  finalPrice: number;
  amountSaved: number;
}

export function validateDiscountInput(input: Partial<DiscountInput>): ValidationResult {
  if (!input.originalPrice || input.originalPrice <= 0) {
    return { valid: false, error: 'Please enter a valid amount.' };
  }
  if (input.discountPercent === undefined || input.discountPercent < 0 || input.discountPercent > 100) {
    return { valid: false, error: 'Please enter a valid discount percentage.' };
  }
  return { valid: true };
}

export function calculateDiscount(input: DiscountInput): DiscountOutput {
  const discountAmount = safeRound((input.originalPrice * input.discountPercent) / 100);
  const finalPrice = safeRound(input.originalPrice - discountAmount);
  return {
    discountAmount,
    finalPrice,
    amountSaved: discountAmount,
  };
}

export function discountToResult(input: DiscountInput, output: DiscountOutput): CalculatorResult {
  return {
    title: 'Discount Result',
    primaryLabel: 'Final Price',
    primaryValue: formatINR(output.finalPrice),
    rows: [
      { label: 'Original Price', value: formatINR(input.originalPrice) },
      { label: 'Discount', value: formatPercent(input.discountPercent, 0) },
      { label: 'You Save', value: formatINR(output.amountSaved), highlight: true },
    ],
  };
}
