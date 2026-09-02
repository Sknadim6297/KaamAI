import React from 'react';
import { View, StyleSheet, TextInput, TextInputProps } from 'react-native';
import { Colors, Radius, Typography } from '../../../theme';
import { AppText } from '../../../components/ui';

interface CalculatorInputProps extends TextInputProps {
  label: string;
  error?: string;
}

export function CalculatorInput({ label, error, style, ...rest }: CalculatorInputProps) {
  return (
    <View style={styles.container}>
      <AppText variant="bodySmall" color="secondary">
        {label}
      </AppText>
      <TextInput
        {...rest}
        placeholderTextColor={Colors.textMuted}
        style={[styles.input, error ? styles.inputError : null, style]}
        accessibilityLabel={label}
      />
      {error ? (
        <AppText variant="caption" color="danger">
          {error}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingHorizontal: 14,
    paddingVertical: 13,
    color: Colors.text,
    ...Typography.body,
    minHeight: 50,
  },
  inputError: {
    borderColor: Colors.danger,
  },
});
