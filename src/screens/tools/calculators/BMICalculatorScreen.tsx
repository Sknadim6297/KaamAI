import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Spacing } from '../../../theme';
import { AppText } from '../../../components/ui';
import { parseStrictPositive } from '../../../utils/formatNumber';
import {
  calculateBMI,
  bmiToResult,
  validateBMIInput,
  type HeightUnit,
  type WeightUnit,
} from '../../../services/calculators';
import type { CalculatorResult } from '../../../types/calculator';
import { CalculatorScreenLayout } from '../components/CalculatorScreenLayout';
import { CalculatorInput } from '../components/CalculatorInput';
import { SegmentSelector } from '../components/SegmentSelector';

export default function BMICalculatorScreen() {
  const [height, setHeight] = useState('');
  const [heightUnit, setHeightUnit] = useState<HeightUnit>('cm');
  const [weight, setWeight] = useState('');
  const [weightUnit, setWeightUnit] = useState<WeightUnit>('kg');
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const reset = () => {
    setHeight('');
    setWeight('');
    setHeightUnit('cm');
    setWeightUnit('kg');
    setResult(null);
    setFormError(null);
  };

  const calculate = () => {
    const h = parseStrictPositive(height);
    const w = parseStrictPositive(weight);
    const validation = validateBMIInput({
      height: h ?? 0,
      heightUnit,
      weight: w ?? 0,
      weightUnit,
    });
    if (!validation.valid || h === null || w === null) {
      setFormError(validation.error ?? 'Please enter valid values.');
      setResult(null);
      return;
    }
    const output = calculateBMI({ height: h, heightUnit, weight: w, weightUnit });
    setFormError(null);
    setResult(bmiToResult(output));
  };

  return (
    <CalculatorScreenLayout
      calculatorId="bmi"
      title="BMI Calculator"
      subtitle="Estimate body mass index"
      onCalculate={calculate}
      onReset={reset}
      result={result}
      formError={formError}
    >
      <CalculatorInput
        label="Height"
        value={height}
        onChangeText={setHeight}
        placeholder={heightUnit === 'cm' ? '175' : '5.7'}
        keyboardType="decimal-pad"
      />
      <View style={styles.segmentWrap}>
        <AppText variant="bodySmall" color="secondary">
          Height Unit
        </AppText>
        <SegmentSelector
          options={[
            { id: 'cm', label: 'cm' },
            { id: 'ft', label: 'ft' },
          ]}
          value={heightUnit}
          onChange={setHeightUnit}
        />
      </View>
      <CalculatorInput
        label="Weight"
        value={weight}
        onChangeText={setWeight}
        placeholder={weightUnit === 'kg' ? '70' : '154'}
        keyboardType="decimal-pad"
      />
      <View style={styles.segmentWrap}>
        <AppText variant="bodySmall" color="secondary">
          Weight Unit
        </AppText>
        <SegmentSelector
          options={[
            { id: 'kg', label: 'kg' },
            { id: 'lb', label: 'lb' },
          ]}
          value={weightUnit}
          onChange={setWeightUnit}
        />
      </View>
    </CalculatorScreenLayout>
  );
}

const styles = StyleSheet.create({
  segmentWrap: { gap: Spacing.sm },
});
