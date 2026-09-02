import React, { useState } from 'react';
import { toISODateString } from '../../../utils/formatNumber';
import {
  calculateDateDifference,
  dateDifferenceToResult,
  validateDateDifferenceInput,
} from '../../../services/calculators';
import type { CalculatorResult } from '../../../types/calculator';
import { CalculatorScreenLayout } from '../components/CalculatorScreenLayout';
import { CalculatorInput } from '../components/CalculatorInput';
import { AppButton } from '../../../components/ui';

export default function DateDifferenceCalculatorScreen() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState(toISODateString(new Date()));
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const reset = () => {
    setStartDate('');
    setEndDate(toISODateString(new Date()));
    setResult(null);
    setFormError(null);
  };

  const calculate = () => {
    const validation = validateDateDifferenceInput({ startDate, endDate });
    if (!validation.valid) {
      setFormError(validation.error ?? 'Please enter valid dates.');
      setResult(null);
      return;
    }
    const output = calculateDateDifference({ startDate, endDate });
    setFormError(null);
    setResult(dateDifferenceToResult(output));
  };

  return (
    <CalculatorScreenLayout
      calculatorId="date-difference"
      title="Date Difference"
      subtitle="Days between two dates"
      onCalculate={calculate}
      onReset={reset}
      result={result}
      formError={formError}
    >
      <CalculatorInput label="Start Date" value={startDate} onChangeText={setStartDate} placeholder="YYYY-MM-DD" />
      <CalculatorInput label="End Date" value={endDate} onChangeText={setEndDate} placeholder="YYYY-MM-DD" />
      <AppButton
        label="Use Today as End Date"
        variant="secondary"
        size="sm"
        onPress={() => setEndDate(toISODateString(new Date()))}
      />
    </CalculatorScreenLayout>
  );
}
