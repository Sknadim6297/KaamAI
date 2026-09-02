import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Spacing } from '../../../theme';
import { AppText } from '../../../components/ui';
import { parseStrictPositive } from '../../../utils/formatNumber';
import {
  calculateFD,
  fdToResult,
  validateFDInput,
  type FDTenureUnit,
} from '../../../services/calculators';
import type { CalculatorResult } from '../../../types/calculator';
import { CalculatorScreenLayout } from '../components/CalculatorScreenLayout';
import { CalculatorInput } from '../components/CalculatorInput';
import { SegmentSelector } from '../components/SegmentSelector';

export default function FDCalculatorScreen() {
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [tenure, setTenure] = useState('');
  const [tenureUnit, setTenureUnit] = useState<FDTenureUnit>('years');
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const reset = () => {
    setPrincipal('');
    setRate('');
    setTenure('');
    setTenureUnit('years');
    setResult(null);
    setFormError(null);
  };

  const calculate = () => {
    const p = parseStrictPositive(principal);
    const r = parseStrictPositive(rate);
    const t = parseStrictPositive(tenure);
    const validation = validateFDInput({
      principal: p ?? 0,
      annualRate: r ?? -1,
      tenure: t ?? 0,
      tenureUnit,
    });
    if (!validation.valid || p === null || r === null || t === null) {
      setFormError(validation.error ?? 'Please enter valid values.');
      setResult(null);
      return;
    }
    const output = calculateFD({
      principal: p,
      annualRate: r,
      tenure: t,
      tenureUnit,
    });
    setFormError(null);
    setResult(fdToResult(output));
  };

  return (
    <CalculatorScreenLayout
      calculatorId="fd"
      title="FD Calculator"
      subtitle="Estimate fixed deposit maturity"
      onCalculate={calculate}
      onReset={reset}
      result={result}
      formError={formError}
    >
      <CalculatorInput
        label="Principal"
        value={principal}
        onChangeText={setPrincipal}
        placeholder="₹1,00,000"
        keyboardType="decimal-pad"
      />
      <CalculatorInput
        label="Annual Interest Rate (%)"
        value={rate}
        onChangeText={setRate}
        placeholder="7"
        keyboardType="decimal-pad"
      />
      <CalculatorInput
        label="Tenure"
        value={tenure}
        onChangeText={setTenure}
        placeholder={tenureUnit === 'years' ? '5' : '60'}
        keyboardType="decimal-pad"
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
  segmentWrap: { gap: Spacing.sm },
});
