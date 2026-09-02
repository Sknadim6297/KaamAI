import { formatNumber, safeRound } from '../../utils/formatNumber';
import type { CalculatorResult, ValidationResult } from '../../types/calculator';

export type HeightUnit = 'cm' | 'ft';
export type WeightUnit = 'kg' | 'lb';

export interface BMIInput {
  height: number;
  heightUnit: HeightUnit;
  weight: number;
  weightUnit: WeightUnit;
}

export interface BMIOutput {
  bmi: number;
  category: string;
}

function toMeters(height: number, unit: HeightUnit): number {
  if (unit === 'cm') return height / 100;
  return height * 0.3048;
}

function toKg(weight: number, unit: WeightUnit): number {
  if (unit === 'kg') return weight;
  return weight * 0.453592;
}

export function validateBMIInput(input: Partial<BMIInput>): ValidationResult {
  if (!input.height || input.height <= 0) {
    return { valid: false, error: 'Please enter a valid height.' };
  }
  if (!input.weight || input.weight <= 0) {
    return { valid: false, error: 'Please enter a valid weight.' };
  }
  return { valid: true };
}

export function calculateBMI(input: BMIInput): BMIOutput {
  const meters = toMeters(input.height, input.heightUnit);
  const kg = toKg(input.weight, input.weightUnit);
  const bmi = safeRound(kg / (meters * meters));
  let category = 'Normal';
  if (bmi < 18.5) category = 'Underweight';
  else if (bmi < 25) category = 'Normal';
  else if (bmi < 30) category = 'Overweight';
  else category = 'Obesity';
  return { bmi, category };
}

export function bmiToResult(output: BMIOutput): CalculatorResult {
  return {
    title: 'Your BMI',
    primaryValue: formatNumber(output.bmi),
    primaryLabel: output.category,
    rows: [{ label: 'Category', value: output.category }],
    note: 'General adult BMI estimate — not a medical diagnosis.',
  };
}
