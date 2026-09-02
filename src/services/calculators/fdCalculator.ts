import { formatINR, safeRound } from '../../utils/formatNumber';
import type { CalculatorResult, ValidationResult } from '../../types/calculator';

export type FDTenureUnit = 'years' | 'months';

export interface FDInput {
  principal: number;
  annualRate: number;
  tenure: number;
  tenureUnit: FDTenureUnit;
}

export interface FDOutput {
  principal: number;
  estimatedInterest: number;
  maturityAmount: number;
}

export function validateFDInput(input: Partial<FDInput>): ValidationResult {
  if (!input.principal || input.principal <= 0) {
    return { valid: false, error: 'Please enter a valid principal amount.' };
  }
  if (input.annualRate === undefined || input.annualRate < 0) {
    return { valid: false, error: 'Please enter a valid interest rate.' };
  }
  if (!input.tenure || input.tenure <= 0) {
    return { valid: false, error: 'Please enter a valid tenure.' };
  }
  return { valid: true };
}

export function calculateFD(input: FDInput): FDOutput {
  const years = input.tenureUnit === 'years' ? input.tenure : input.tenure / 12;
  const maturityAmount = safeRound(input.principal * Math.pow(1 + input.annualRate / 100, years));
  const estimatedInterest = safeRound(maturityAmount - input.principal);
  return {
    principal: input.principal,
    estimatedInterest,
    maturityAmount,
  };
}

export function fdToResult(output: FDOutput): CalculatorResult {
  return {
    title: 'FD Maturity',
    primaryLabel: 'Maturity Amount',
    primaryValue: formatINR(output.maturityAmount),
    rows: [
      { label: 'Principal', value: formatINR(output.principal) },
      { label: 'Estimated Interest', value: formatINR(output.estimatedInterest), highlight: true },
    ],
    note: 'Estimate only — actual bank FD calculations may vary.',
  };
}
