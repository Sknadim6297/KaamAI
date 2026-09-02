import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors, Radius, Spacing } from '../../../theme';
import { AppText, PressableScale } from '../../../components/ui';
import type { PaymentMethod } from '../../../types/money';

const METHODS: Array<{ id: PaymentMethod; label: string }> = [
  { id: 'cash', label: 'Cash' },
  { id: 'upi', label: 'UPI' },
  { id: 'card', label: 'Card' },
  { id: 'bank', label: 'Bank' },
  { id: 'other', label: 'Other' },
];

interface PaymentMethodSelectorProps {
  value: PaymentMethod | null;
  onChange: (value: PaymentMethod | null) => void;
}

export function PaymentMethodSelector({ value, onChange }: PaymentMethodSelectorProps) {
  return (
    <View style={styles.container}>
      <AppText variant="bodySmall" color="secondary" style={styles.label}>
        Payment method (optional)
      </AppText>
      <View style={styles.row}>
        {METHODS.map((method) => {
          const selected = value === method.id;
          return (
            <PressableScale
              key={method.id}
              onPress={() => onChange(selected ? null : method.id)}
              style={[styles.chip, selected && styles.chipSelected]}
              scaleTo={0.96}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              accessibilityLabel={method.label}
            >
              <AppText
                variant="bodySmall"
                style={{
                  fontWeight: '600',
                  color: selected ? Colors.primary : Colors.textSecondary,
                }}
              >
                {method.label}
              </AppText>
            </PressableScale>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.sm,
  },
  label: {
    marginBottom: 2,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: Radius.full,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    minHeight: 40,
    justifyContent: 'center',
  },
  chipSelected: {
    backgroundColor: Colors.primarySubtle,
    borderColor: Colors.primary + '55',
  },
});
