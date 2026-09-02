import React, { useState } from 'react';
import { parseStrictPositive } from '../../../utils/formatNumber';
import {
  calculateFuelCost,
  fuelCostToResult,
  validateFuelCostInput,
} from '../../../services/calculators';
import type { CalculatorResult } from '../../../types/calculator';
import { CalculatorScreenLayout } from '../components/CalculatorScreenLayout';
import { CalculatorInput } from '../components/CalculatorInput';

export default function FuelCostCalculatorScreen() {
  const [distance, setDistance] = useState('');
  const [mileage, setMileage] = useState('');
  const [fuelPrice, setFuelPrice] = useState('');
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const reset = () => {
    setDistance('');
    setMileage('');
    setFuelPrice('');
    setResult(null);
    setFormError(null);
  };

  const calculate = () => {
    const distanceKm = parseStrictPositive(distance);
    const mileageKmPerLitre = parseStrictPositive(mileage);
    const fuelPricePerLitre = parseStrictPositive(fuelPrice);
    const validation = validateFuelCostInput({
      distanceKm: distanceKm ?? 0,
      mileageKmPerLitre: mileageKmPerLitre ?? 0,
      fuelPricePerLitre: fuelPricePerLitre ?? 0,
    });
    if (!validation.valid || distanceKm === null || mileageKmPerLitre === null || fuelPricePerLitre === null) {
      setFormError(validation.error ?? 'Please enter valid values.');
      setResult(null);
      return;
    }
    const output = calculateFuelCost({
      distanceKm,
      mileageKmPerLitre,
      fuelPricePerLitre,
    });
    setFormError(null);
    setResult(fuelCostToResult(output));
  };

  return (
    <CalculatorScreenLayout
      calculatorId="fuel-cost"
      title="Fuel Cost Calculator"
      subtitle="Estimate trip fuel expense"
      onCalculate={calculate}
      onReset={reset}
      result={result}
      formError={formError}
    >
      <CalculatorInput label="Distance (km)" value={distance} onChangeText={setDistance} placeholder="500" keyboardType="decimal-pad" />
      <CalculatorInput label="Vehicle Mileage (km/l)" value={mileage} onChangeText={setMileage} placeholder="20" keyboardType="decimal-pad" />
      <CalculatorInput label="Fuel Price (₹/litre)" value={fuelPrice} onChangeText={setFuelPrice} placeholder="100" keyboardType="decimal-pad" />
    </CalculatorScreenLayout>
  );
}
