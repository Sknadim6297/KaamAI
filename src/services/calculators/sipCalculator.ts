import { formatINR, safeRound } from '../../utils/formatNumber';
import type { CalculatorResult, ValidationResult } from '../../types/calculator';

export interface SIPInput {
  monthlyInvestment: number;
  annualReturn: number;
  years: number;
}

export interface SIPOutput {
  investedAmount: number;
  estimatedReturns: number;
  totalValue: number;
}

export function validateSIPInput(input: Partial<SIPInput>): ValidationResult {
  if (!input.monthlyInvestment || input.monthlyInvestment <= 0) {
    return { valid: false, error: 'Please enter a valid monthly investment.' };
  }
  if (input.annualReturn === undefined || input.annualReturn < 0) {
    return { valid: false, error: 'Please enter a valid expected return.' };
  }
  if (!input.years || input.years <= 0) {
    return { valid: false, error: 'Please enter a valid duration.' };
  }
  return { valid: true };
}

export function calculateSIP(input: SIPInput): SIPOutput {
  const P = input.monthlyInvestment;
  const n = input.years * 12;
  const investedAmount = P * n;

  if (input.annualReturn === 0) {
    return {
      investedAmount: safeRound(investedAmount),
      estimatedReturns: 0,
      totalValue: safeRound(investedAmount),
    };
  }

  const r = input.annualReturn / 12 / 100;
  const factor = Math.pow(1 + r, n);
  const totalValue = safeRound(P * ((factor - 1) / r) * (1 + r));
  const estimatedReturns = safeRound(totalValue - investedAmount);

  return {
    investedAmount: safeRound(investedAmount),
    estimatedReturns,
    totalValue,
  };
}

export function sipToResult(output: SIPOutput): CalculatorResult {
  return {
    title: 'Estimated Value',
    primaryLabel: 'Total Value',
    primaryValue: formatINR(output.totalValue),
    rows: [
      { label: 'Invested Amount', value: formatINR(output.investedAmount) },
      { label: 'Estimated Returns', value: formatINR(output.estimatedReturns), highlight: true },
    ],
    note: 'Estimated value — returns are not guaranteed.',
  };
}
