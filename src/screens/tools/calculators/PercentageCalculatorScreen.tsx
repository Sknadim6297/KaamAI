import React, { useState } from 'react';
import { parseStrictPositive } from '../../../utils/formatNumber';
import {
  calculatePercentage,
  percentageToResult,
  validatePercentageInput,
  type PercentageMode,
} from '../../../services/calculators';
import type { CalculatorResult } from '../../../types/calculator';
import { CalculatorScreenLayout } from '../components/CalculatorScreenLayout';
import { CalculatorInput } from '../components/CalculatorInput';
import { SegmentSelector } from '../components/SegmentSelector';

export default function PercentageCalculatorScreen() {
  const [mode, setMode] = useState<PercentageMode>('of');
  const [valueA, setValueA] = useState('');
  const [valueB, setValueB] = useState('');
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const reset = () => {
    setValueA('');
    setValueB('');
    setResult(null);
    setFormError(null);
  };

  const calculate = () => {
    const a = parseStrictPositive(valueA);
    const b = parseStrictPositive(valueB);
    const validation = validatePercentageInput({
      mode,
      valueA: mode === 'of' ? (a ?? -1) : (a ?? -1),
      valueB: b ?? 0,
    });
    if (!validation.valid || a === null || b === null) {
      setFormError(validation.error ?? 'Please enter valid amounts.');
      setResult(null);
      return;
    }
    const input = { mode, valueA: a, valueB: b };
    const output = calculatePercentage(input);
    setFormError(null);
    setResult(percentageToResult(input, output));
  };

  return (
    <CalculatorScreenLayout
      calculatorId="percentage"
      title="Percentage Calculator"
      subtitle="Find percentages quickly"
      onCalculate={calculate}
      onReset={reset}
      result={result}
      formError={formError}
    >
      <SegmentSelector
        options={[
          { id: 'of', label: 'X% of Y' },
          { id: 'whatPercent', label: 'X is % of Y' },
        ]}
        value={mode}
        onChange={setMode}
      />
      <CalculatorInput
        label={mode === 'of' ? 'Percentage (X)' : 'Amount (X)'}
        value={valueA}
        onChangeText={setValueA}
        placeholder={mode === 'of' ? '20' : '500'}
        keyboardType="decimal-pad"
      />
      <CalculatorInput
        label={mode === 'of' ? 'Of Amount (Y)' : 'Total Amount (Y)'}
        value={valueB}
        onChangeText={setValueB}
        placeholder="2500"
        keyboardType="decimal-pad"
      />
    </CalculatorScreenLayout>
  );
}
