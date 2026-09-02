import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors, Radius, Spacing } from '../../../theme';
import { AppText } from '../../../components/ui';

interface CalculatorKeyValueProps {
  label: string;
  value: string;
  highlight?: boolean;
}

export function CalculatorKeyValue({ label, value, highlight }: CalculatorKeyValueProps) {
  return (
    <View style={styles.row}>
      <AppText variant="bodySmall" color="secondary">
        {label}
      </AppText>
      <AppText
        variant="bodyMedium"
        style={highlight ? styles.highlight : undefined}
      >
        {value}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  highlight: {
    color: Colors.primary,
    fontWeight: '700',
  },
});
