import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Spacing } from '../../../theme';
import { AppText } from '../../../components/ui';
import { parseStrictPositive } from '../../../utils/formatNumber';
import {
  calculateEMI,
  emiToResult,
  validateEMIInput,
} from '../../../services/calculators';
import type { CalculatorResult } from '../../../types/calculator';
import { CalculatorScreenLayout } from '../components/CalculatorScreenLayout';
import { CalculatorInput } from '../components/CalculatorInput';
import { SegmentSelector } from '../components/SegmentSelector';

type TenureUnit = 'years' | 'months';

export default function EMICalculatorScreen() {
  const [loanAmount, setLoanAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [tenure, setTenure] = useState('');
  const [tenureUnit, setTenureUnit] = useState<TenureUnit>('years');
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const reset = () => {
    setLoanAmount('');
    setInterestRate('');
    setTenure('');
    setTenureUnit('years');
    setResult(null);
    setFormError(null);
  };

  const calculate = () => {
    const principal = parseStrictPositive(loanAmount);
    const rate = parseStrictPositive(interestRate);
    const tenureValue = parseStrictPositive(tenure);
    const tenureMonths =
      tenureUnit === 'years' ? (tenureValue ?? 0) * 12 : (tenureValue ?? 0);

    const validation = validateEMIInput({
      principal: principal ?? 0,
      annualRate: rate ?? -1,
      tenureMonths,
    });
    if (!validation.valid) {
      setFormError(validation.error ?? 'Please enter valid values.');
      setResult(null);
      return;
    }

    const output = calculateEMI({
      principal: principal!,
      annualRate: rate!,
      tenureMonths,
    });
    setFormError(null);
    setResult(emiToResult(output));
  };

  return (
    <CalculatorScreenLayout
      calculatorId="emi"
      title="EMI Calculator"
      subtitle="Plan your monthly loan payment"
      onCalculate={calculate}
      onReset={reset}
      result={result}
      formError={formError}
    >
      <CalculatorInput
        label="Loan Amount"
        value={loanAmount}
        onChangeText={setLoanAmount}
        placeholder="₹5,00,000"
        keyboardType="decimal-pad"
      />
      <CalculatorInput
        label="Annual Interest Rate (%)"
        value={interestRate}
        onChangeText={setInterestRate}
        placeholder="8.5"
        keyboardType="decimal-pad"
      />
      <CalculatorInput
        label="Loan Tenure"
        value={tenure}
        onChangeText={setTenure}
        placeholder={tenureUnit === 'years' ? '5' : '60'}
        keyboardType="number-pad"
      />
      <View style={styles.segmentWrap}>
        <AppText variant="bodySmall" color="secondary">
          Tenure Unit
        </AppText>
        <SegmentSelector
          options={[
            { id: 'years', label: 'Years' },
            { id: 'months', label: 'Months' },
          ]}
          value={tenureUnit}
          onChange={setTenureUnit}
        />
      </View>
    </CalculatorScreenLayout>
  );
}

const styles = StyleSheet.create({
  segmentWrap: {
    gap: Spacing.sm,
  },
});
