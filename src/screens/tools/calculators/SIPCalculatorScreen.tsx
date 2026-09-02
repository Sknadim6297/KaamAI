import React, { useState } from 'react';
import { parseStrictPositive } from '../../../utils/formatNumber';
import {
  calculateSIP,
  sipToResult,
  validateSIPInput,
} from '../../../services/calculators';
import type { CalculatorResult } from '../../../types/calculator';
import { CalculatorScreenLayout } from '../components/CalculatorScreenLayout';
import { CalculatorInput } from '../components/CalculatorInput';

export default function SIPCalculatorScreen() {
  const [monthly, setMonthly] = useState('');
  const [annualReturn, setAnnualReturn] = useState('');
  const [years, setYears] = useState('');
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const reset = () => {
    setMonthly('');
    setAnnualReturn('');
    setYears('');
    setResult(null);
    setFormError(null);
  };

  const calculate = () => {
    const investment = parseStrictPositive(monthly);
    const rate = parseStrictPositive(annualReturn);
    const duration = parseStrictPositive(years);
    const validation = validateSIPInput({
      monthlyInvestment: investment ?? 0,
      annualReturn: rate ?? -1,
      years: duration ?? 0,
    });
    if (!validation.valid || investment === null || rate === null || duration === null) {
      setFormError(validation.error ?? 'Please enter valid values.');
      setResult(null);
      return;
    }
    const output = calculateSIP({
      monthlyInvestment: investment,
      annualReturn: rate,
      years: duration,
    });
    setFormError(null);
    setResult(sipToResult(output));
  };

  return (
    <CalculatorScreenLayout
      calculatorId="sip"
      title="SIP Calculator"
      subtitle="Estimate mutual fund SIP returns"
      onCalculate={calculate}
      onReset={reset}
      result={result}
      formError={formError}
    >
      <CalculatorInput
        label="Monthly Investment"
        value={monthly}
        onChangeText={setMonthly}
        placeholder="₹5,000"
        keyboardType="decimal-pad"
      />
      <CalculatorInput
        label="Expected Annual Return (%)"
        value={annualReturn}
        onChangeText={setAnnualReturn}
        placeholder="12"
        keyboardType="decimal-pad"
      />
      <CalculatorInput
        label="Duration (Years)"
        value={years}
        onChangeText={setYears}
        placeholder="10"
        keyboardType="decimal-pad"
      />
    </CalculatorScreenLayout>
  );
}
