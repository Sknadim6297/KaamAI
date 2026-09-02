import { formatINR, formatNumber, formatPercent, safeRound } from '../../utils/formatNumber';
import type { CalculatorResult, ValidationResult } from '../../types/calculator';

export interface EMIInput {
  principal: number;
  annualRate: number;
  tenureMonths: number;
}

export interface EMIOutput {
  emi: number;
  totalInterest: number;
  totalPayment: number;
  principal: number;
}

export function validateEMIInput(input: Partial<EMIInput>): ValidationResult {
  if (!input.principal || input.principal <= 0) {
    return { valid: false, error: 'Please enter a valid loan amount.' };
  }
  if (input.annualRate === undefined || input.annualRate < 0) {
    return { valid: false, error: 'Please enter a valid interest rate.' };
  }
  if (!input.tenureMonths || input.tenureMonths <= 0) {
    return { valid: false, error: 'Please enter a valid loan tenure.' };
  }
  return { valid: true };
}

export function calculateEMI(input: EMIInput): EMIOutput {
  const { principal, annualRate, tenureMonths } = input;
  if (annualRate === 0) {
    const emi = principal / tenureMonths;
    return {
      emi: safeRound(emi),
      totalInterest: 0,
      totalPayment: safeRound(principal),
      principal,
    };
  }
  const r = annualRate / 12 / 100;
  const n = tenureMonths;
  const factor = Math.pow(1 + r, n);
  const emi = (principal * r * factor) / (factor - 1);
  const totalPayment = emi * n;
  const totalInterest = totalPayment - principal;
  return {
    emi: safeRound(emi),
    totalInterest: safeRound(totalInterest),
    totalPayment: safeRound(totalPayment),
    principal,
  };
}

export function emiToResult(output: EMIOutput): CalculatorResult {
  return {
    title: 'Your EMI',
    primaryLabel: 'Monthly EMI',
    primaryValue: `${formatINR(output.emi)} / month`,
    rows: [
      { label: 'Loan Amount', value: formatINR(output.principal) },
      { label: 'Total Interest', value: formatINR(output.totalInterest) },
      { label: 'Total Payment', value: formatINR(output.totalPayment), highlight: true },
    ],
  };
}
