import React, { useState } from 'react';
import { toISODateString } from '../../../utils/formatNumber';
import {
  calculateAge,
  ageToResult,
  validateAgeInput,
} from '../../../services/calculators';
import type { CalculatorResult } from '../../../types/calculator';
import { CalculatorScreenLayout } from '../components/CalculatorScreenLayout';
import { CalculatorInput } from '../components/CalculatorInput';

export default function AgeCalculatorScreen() {
  const [dob, setDob] = useState('');
  const [asOf, setAsOf] = useState(toISODateString(new Date()));
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const reset = () => {
    setDob('');
    setAsOf(toISODateString(new Date()));
    setResult(null);
    setFormError(null);
  };

  const calculate = () => {
    const validation = validateAgeInput({ dateOfBirth: dob, asOfDate: asOf });
    if (!validation.valid) {
      setFormError(validation.error ?? 'Please enter valid dates.');
      setResult(null);
      return;
    }
    const output = calculateAge({ dateOfBirth: dob, asOfDate: asOf });
    setFormError(null);
    setResult(ageToResult(output));
  };

  return (
    <CalculatorScreenLayout
      calculatorId="age"
      title="Age Calculator"
      subtitle="Calculate exact age from dates"
      onCalculate={calculate}
      onReset={reset}
      result={result}
      formError={formError}
    >
      <CalculatorInput
        label="Date of Birth"
        value={dob}
        onChangeText={setDob}
        placeholder="YYYY-MM-DD"
        autoCapitalize="none"
      />
      <CalculatorInput
        label="Calculate Age On"
        value={asOf}
        onChangeText={setAsOf}
        placeholder="YYYY-MM-DD"
        autoCapitalize="none"
      />
    </CalculatorScreenLayout>
  );
}
