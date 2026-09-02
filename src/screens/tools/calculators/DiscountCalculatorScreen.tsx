import React, { useState } from 'react';
import { parseStrictPositive } from '../../../utils/formatNumber';
import {
  calculateDiscount,
  discountToResult,
  validateDiscountInput,
} from '../../../services/calculators';
import type { CalculatorResult } from '../../../types/calculator';
import { CalculatorScreenLayout } from '../components/CalculatorScreenLayout';
import { CalculatorInput } from '../components/CalculatorInput';

export default function DiscountCalculatorScreen() {
  const [originalPrice, setOriginalPrice] = useState('');
  const [discountPercent, setDiscountPercent] = useState('');
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const reset = () => {
    setOriginalPrice('');
    setDiscountPercent('');
    setResult(null);
    setFormError(null);
  };

  const calculate = () => {
    const original = parseStrictPositive(originalPrice);
    const discount = parseStrictPositive(discountPercent);
    const validation = validateDiscountInput({
      originalPrice: original ?? 0,
      discountPercent: discount ?? -1,
    });
    if (!validation.valid || original === null || discount === null) {
      setFormError(validation.error ?? 'Please enter valid values.');
      setResult(null);
      return;
    }
    const input = { originalPrice: original, discountPercent: discount };
    const output = calculateDiscount(input);
    setFormError(null);
    setResult(discountToResult(input, output));
  };

  return (
    <CalculatorScreenLayout
      calculatorId="discount"
      title="Discount Calculator"
      subtitle="Calculate savings on discounts"
      onCalculate={calculate}
      onReset={reset}
      result={result}
      formError={formError}
    >
      <CalculatorInput
        label="Original Price"
        value={originalPrice}
        onChangeText={setOriginalPrice}
        placeholder="₹2,500"
        keyboardType="decimal-pad"
      />
      <CalculatorInput
        label="Discount (%)"
        value={discountPercent}
        onChangeText={setDiscountPercent}
        placeholder="20"
        keyboardType="decimal-pad"
      />
    </CalculatorScreenLayout>
  );
}
