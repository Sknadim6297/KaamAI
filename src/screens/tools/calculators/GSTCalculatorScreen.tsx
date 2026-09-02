import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors, Radius, Spacing } from '../../../theme';
import { AppText, PressableScale } from '../../../components/ui';
import { parseStrictPositive } from '../../../utils/formatNumber';
import {
  calculateGST,
  gstToResult,
  validateGSTInput,
  GST_PRESET_RATES,
  type GSTMode,
} from '../../../services/calculators';
import type { CalculatorResult } from '../../../types/calculator';
import { CalculatorScreenLayout } from '../components/CalculatorScreenLayout';
import { CalculatorInput } from '../components/CalculatorInput';
import { SegmentSelector } from '../components/SegmentSelector';

export default function GSTCalculatorScreen() {
  const [mode, setMode] = useState<GSTMode>('add');
  const [amount, setAmount] = useState('');
  const [gstPercent, setGstPercent] = useState('18');
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const reset = () => {
    setAmount('');
    setGstPercent('18');
    setMode('add');
    setResult(null);
    setFormError(null);
  };

  const calculate = () => {
    const value = parseStrictPositive(amount);
    const rate = parseStrictPositive(gstPercent);
    const validation = validateGSTInput({
      mode,
      amount: value ?? 0,
      gstPercent: rate ?? -1,
    });
    if (!validation.valid || value === null || rate === null) {
      setFormError(validation.error ?? 'Please enter valid values.');
      setResult(null);
      return;
    }
    const input = { mode, amount: value, gstPercent: rate };
    const output = calculateGST(input);
    setFormError(null);
    setResult(gstToResult(input, output));
  };

  return (
    <CalculatorScreenLayout
      calculatorId="gst"
      title="GST Calculator"
      subtitle="Add or remove GST easily"
      onCalculate={calculate}
      onReset={reset}
      result={result}
      formError={formError}
    >
      <SegmentSelector
        options={[
          { id: 'add', label: 'Add GST' },
          { id: 'remove', label: 'Remove GST' },
        ]}
        value={mode}
        onChange={setMode}
      />
      <CalculatorInput
        label={mode === 'add' ? 'Base Amount' : 'Inclusive Amount'}
        value={amount}
        onChangeText={setAmount}
        placeholder="₹10,000"
        keyboardType="decimal-pad"
      />
      <CalculatorInput
        label="GST Rate (%)"
        value={gstPercent}
        onChangeText={setGstPercent}
        placeholder="18"
        keyboardType="decimal-pad"
      />
      <View style={styles.presets}>
        <AppText variant="bodySmall" color="secondary">
          Quick rates
        </AppText>
        <View style={styles.presetRow}>
          {GST_PRESET_RATES.map((rate) => (
            <PressableScale
              key={rate}
              onPress={() => setGstPercent(String(rate))}
              style={[styles.preset, gstPercent === String(rate) && styles.presetActive]}
              accessibilityLabel={`${rate} percent GST`}
            >
              <AppText variant="caption" style={{ fontWeight: '600' }}>
                {rate}%
              </AppText>
            </PressableScale>
          ))}
        </View>
      </View>
    </CalculatorScreenLayout>
  );
}

const styles = StyleSheet.create({
  presets: { gap: Spacing.sm },
  presetRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  preset: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  presetActive: {
    backgroundColor: Colors.primarySubtle,
    borderColor: Colors.primary,
  },
});
