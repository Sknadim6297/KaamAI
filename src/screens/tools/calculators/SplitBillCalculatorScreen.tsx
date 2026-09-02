import React, { useState } from 'react';
import { parseNonNegative, parseStrictPositive } from '../../../utils/formatNumber';
import {
  calculateSplitBill,
  splitBillToResult,
  validateSplitBillInput,
} from '../../../services/calculators';
import type { CalculatorResult } from '../../../types/calculator';
import { CalculatorScreenLayout } from '../components/CalculatorScreenLayout';
import { CalculatorInput } from '../components/CalculatorInput';

export default function SplitBillCalculatorScreen() {
  const [totalBill, setTotalBill] = useState('');
  const [people, setPeople] = useState('2');
  const [tipPercent, setTipPercent] = useState('10');
  const [discountPercent, setDiscountPercent] = useState('0');
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const reset = () => {
    setTotalBill('');
    setPeople('2');
    setTipPercent('10');
    setDiscountPercent('0');
    setResult(null);
    setFormError(null);
  };

  const calculate = () => {
    const bill = parseStrictPositive(totalBill);
    const count = parseStrictPositive(people);
    const tip = parseNonNegative(tipPercent);
    const discount = parseNonNegative(discountPercent);
    const validation = validateSplitBillInput({
      totalBill: bill ?? 0,
      people: count ? Math.round(count) : 0,
      tipPercent: tip ?? -1,
      discountPercent: discount ?? undefined,
    });
    if (!validation.valid || bill === null || count === null || tip === null) {
      setFormError(validation.error ?? 'Please enter valid values.');
      setResult(null);
      return;
    }
    const input = {
      totalBill: bill,
      people: Math.round(count),
      tipPercent: tip,
      discountPercent: discount ?? 0,
    };
    const output = calculateSplitBill(input);
    setFormError(null);
    setResult(splitBillToResult(input, output));
  };

  return (
    <CalculatorScreenLayout
      calculatorId="split-bill"
      title="Split Bill Calculator"
      subtitle="Split bills with tip & discount"
      onCalculate={calculate}
      onReset={reset}
      result={result}
      formError={formError}
    >
      <CalculatorInput label="Total Bill" value={totalBill} onChangeText={setTotalBill} placeholder="₹3,000" keyboardType="decimal-pad" />
      <CalculatorInput label="Number of People" value={people} onChangeText={setPeople} placeholder="3" keyboardType="number-pad" />
      <CalculatorInput label="Tip (%)" value={tipPercent} onChangeText={setTipPercent} placeholder="10" keyboardType="decimal-pad" />
      <CalculatorInput label="Discount (%) optional" value={discountPercent} onChangeText={setDiscountPercent} placeholder="0" keyboardType="decimal-pad" />
    </CalculatorScreenLayout>
  );
}
