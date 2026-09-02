import { formatINR, formatNumber, safeRound } from '../../utils/formatNumber';
import type { CalculatorResult, ValidationResult } from '../../types/calculator';

export interface FuelCostInput {
  distanceKm: number;
  mileageKmPerLitre: number;
  fuelPricePerLitre: number;
}

export interface FuelCostOutput {
  fuelRequiredLitres: number;
  estimatedCost: number;
  costPerKm: number;
}

export function validateFuelCostInput(input: Partial<FuelCostInput>): ValidationResult {
  if (!input.distanceKm || input.distanceKm <= 0) {
    return { valid: false, error: 'Please enter a valid distance.' };
  }
  if (!input.mileageKmPerLitre || input.mileageKmPerLitre <= 0) {
    return { valid: false, error: 'Please enter a valid mileage.' };
  }
  if (!input.fuelPricePerLitre || input.fuelPricePerLitre <= 0) {
    return { valid: false, error: 'Please enter a valid fuel price.' };
  }
  return { valid: true };
}

export function calculateFuelCost(input: FuelCostInput): FuelCostOutput {
  const fuelRequiredLitres = safeRound(input.distanceKm / input.mileageKmPerLitre);
  const estimatedCost = safeRound(fuelRequiredLitres * input.fuelPricePerLitre);
  const costPerKm = safeRound(estimatedCost / input.distanceKm);
  return { fuelRequiredLitres, estimatedCost, costPerKm };
}

export function fuelCostToResult(output: FuelCostOutput): CalculatorResult {
  return {
    title: 'Estimated Fuel Cost',
    primaryLabel: 'Total Cost',
    primaryValue: formatINR(output.estimatedCost),
    rows: [
      { label: 'Fuel Required', value: `${formatNumber(output.fuelRequiredLitres)} L` },
      { label: 'Cost per km', value: formatINR(output.costPerKm) },
    ],
    note: 'Estimated trip fuel cost.',
  };
}
