import { formatINR, safeRound } from '../../utils/formatNumber';
import type { CalculatorResult, ValidationResult } from '../../types/calculator';

export interface SalaryInput {
  grossSalary: number;
  basicSalary?: number;
  hra?: number;
  otherAllowances?: number;
  pf?: number;
  professionalTax?: number;
  otherDeductions?: number;
}

export interface SalaryOutput {
  grossMonthly: number;
  totalDeductions: number;
  inHandMonthly: number;
  annualGross: number;
  annualDeductions: number;
  annualInHand: number;
}

export function validateSalaryInput(input: Partial<SalaryInput>): ValidationResult {
  if (!input.grossSalary || input.grossSalary <= 0) {
    return { valid: false, error: 'Please enter a valid gross salary.' };
  }
  return { valid: true };
}

export function calculateSalary(input: SalaryInput): SalaryOutput {
  const pf = input.pf ?? 0;
  const professionalTax = input.professionalTax ?? 0;
  const otherDeductions = input.otherDeductions ?? 0;
  const totalDeductions = safeRound(pf + professionalTax + otherDeductions);
  const inHandMonthly = safeRound(Math.max(input.grossSalary - totalDeductions, 0));

  return {
    grossMonthly: input.grossSalary,
    totalDeductions,
    inHandMonthly,
    annualGross: safeRound(input.grossSalary * 12),
    annualDeductions: safeRound(totalDeductions * 12),
    annualInHand: safeRound(inHandMonthly * 12),
  };
}

export function salaryToResult(output: SalaryOutput): CalculatorResult {
  return {
    title: 'Estimated In-hand',
    primaryLabel: 'Monthly In-hand',
    primaryValue: formatINR(output.inHandMonthly),
    rows: [
      { label: 'Gross Monthly', value: formatINR(output.grossMonthly) },
      { label: 'Total Deductions', value: formatINR(output.totalDeductions) },
      { label: 'Annual Gross', value: formatINR(output.annualGross) },
      { label: 'Annual In-hand', value: formatINR(output.annualInHand), highlight: true },
    ],
    note: 'Estimated — excludes detailed income-tax regime calculation.',
  };
}
