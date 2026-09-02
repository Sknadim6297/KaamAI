import React from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { Search } from 'lucide-react-native';
import { Colors, Radius, Spacing } from '../../../theme';

interface CalculatorSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function CalculatorSearch({ value, onChange }: CalculatorSearchProps) {
  return (
    <View style={styles.wrap}>
      <Search color={Colors.textMuted} size={18} strokeWidth={2} />
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder="Search calculators"
        placeholderTextColor={Colors.textMuted}
        style={styles.input}
        accessibilityLabel="Search calculators"
        returnKeyType="search"
        clearButtonMode="while-editing"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 14,
    minHeight: 48,
  },
  input: {
    flex: 1,
    color: Colors.text,
    fontSize: 15,
    paddingVertical: 10,
  },
});
