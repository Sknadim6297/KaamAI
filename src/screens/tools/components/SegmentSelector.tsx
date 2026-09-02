import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors, Radius, Spacing } from '../../../theme';
import { AppText, PressableScale } from '../../../components/ui';

interface SegmentOption<T extends string> {
  id: T;
  label: string;
}

interface SegmentSelectorProps<T extends string> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

export function SegmentSelector<T extends string>({
  options,
  value,
  onChange,
}: SegmentSelectorProps<T>) {
  return (
    <View style={styles.container}>
      {options.map((option) => {
        const selected = option.id === value;
        return (
          <PressableScale
            key={option.id}
            onPress={() => onChange(option.id)}
            style={[styles.item, selected && styles.selected]}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            accessibilityLabel={option.label}
          >
            <AppText
              variant="bodySmall"
              style={{
                fontWeight: '600',
                color: selected ? Colors.white : Colors.textSecondary,
              }}
            >
              {option.label}
            </AppText>
          </PressableScale>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    borderRadius: Radius.lg,
    padding: 4,
    gap: 4,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: Radius.md,
    minHeight: 40,
  },
  selected: {
    backgroundColor: Colors.primary,
  },
});
