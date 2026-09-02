import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Colors, Radius, Spacing } from '../../../theme';
import { AppText, PressableScale } from '../../../components/ui';
import { CALCULATOR_CATEGORIES, type CalculatorCategoryFilter } from '../../../constants/calculators';

interface CalculatorCategoryTabsProps {
  selected: CalculatorCategoryFilter;
  onSelect: (category: CalculatorCategoryFilter) => void;
}

export function CalculatorCategoryTabs({ selected, onSelect }: CalculatorCategoryTabsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {CALCULATOR_CATEGORIES.map((category) => {
        const active = selected === category;
        return (
          <PressableScale
            key={category}
            onPress={() => onSelect(category)}
            style={[styles.chip, active && styles.chipActive]}
            scaleTo={0.96}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            accessibilityLabel={category}
          >
            <AppText
              variant="bodySmall"
              style={{
                fontWeight: '600',
                color: active ? Colors.primary : Colors.textSecondary,
              }}
            >
              {category}
            </AppText>
          </PressableScale>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: Spacing.md,
    gap: 8,
    paddingVertical: Spacing.sm,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    minHeight: 36,
    justifyContent: 'center',
  },
  chipActive: {
    backgroundColor: Colors.primarySubtle,
    borderColor: Colors.primary + '55',
  },
});
