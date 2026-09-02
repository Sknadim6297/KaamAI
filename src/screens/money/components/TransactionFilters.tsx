import React from 'react';
import { View, StyleSheet, TextInput, ScrollView } from 'react-native';
import { Search } from 'lucide-react-native';
import { Colors, Radius, Spacing } from '../../../theme';
import { AppText, PressableScale } from '../../../components/ui';
import { getCategoriesByType } from '../../../constants/categories';
import type {
  CategoryId,
  DateRangeFilter,
  TransactionFilters,
  TransactionTypeFilter,
} from '../../../types/money';

interface TransactionFiltersBarProps {
  filters: TransactionFilters;
  onChange: (patch: Partial<TransactionFilters>) => void;
}

function Chip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <PressableScale
      onPress={onPress}
      style={[styles.chip, selected && styles.chipSelected]}
      scaleTo={0.96}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={label}
    >
      <AppText
        variant="bodySmall"
        style={{
          fontWeight: '600',
          color: selected ? Colors.primary : Colors.textSecondary,
        }}
      >
        {label}
      </AppText>
    </PressableScale>
  );
}

export function TransactionFiltersBar({ filters, onChange }: TransactionFiltersBarProps) {
  const typeOptions: Array<{ id: TransactionTypeFilter; label: string }> = [
    { id: 'all', label: 'All' },
    { id: 'income', label: 'Income' },
    { id: 'expense', label: 'Expense' },
  ];

  const dateOptions: Array<{ id: DateRangeFilter; label: string }> = [
    { id: 'this_month', label: 'This month' },
    { id: 'last_month', label: 'Last month' },
    { id: 'custom', label: 'Custom' },
  ];

  const categoryOptions: Array<{ id: CategoryId | 'all'; label: string }> = [
    { id: 'all', label: 'All' },
    ...getCategoriesByType(filters.type === 'income' ? 'income' : 'expense').map((c) => ({
      id: c.id as CategoryId,
      label: c.name,
    })),
  ];

  // When type is all, show expense categories as the common set + keep selection valid
  const categoriesForAll: Array<{ id: CategoryId | 'all'; label: string }> = [
    { id: 'all', label: 'All' },
    ...getCategoriesByType('expense').map((c) => ({ id: c.id as CategoryId, label: c.name })),
    ...getCategoriesByType('income').map((c) => ({ id: c.id as CategoryId, label: c.name })),
  ];

  const categoryChips = filters.type === 'all' ? categoriesForAll : categoryOptions;

  return (
    <View style={styles.container}>
      <View style={styles.searchWrap}>
        <Search color={Colors.textMuted} size={18} strokeWidth={2} />
        <TextInput
          value={filters.search}
          onChangeText={(search) => onChange({ search })}
          placeholder="Search transactions"
          placeholderTextColor={Colors.textMuted}
          style={styles.searchInput}
          accessibilityLabel="Search transactions"
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipRow}
      >
        {typeOptions.map((opt) => (
          <Chip
            key={opt.id}
            label={opt.label}
            selected={filters.type === opt.id}
            onPress={() => onChange({ type: opt.id, categoryId: 'all' })}
          />
        ))}
      </ScrollView>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipRow}
      >
        {dateOptions.map((opt) => (
          <Chip
            key={opt.id}
            label={opt.label}
            selected={filters.dateRange === opt.id}
            onPress={() => onChange({ dateRange: opt.id })}
          />
        ))}
      </ScrollView>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipRow}
      >
        {categoryChips.map((opt) => (
          <Chip
            key={opt.id}
            label={opt.label}
            selected={filters.categoryId === opt.id}
            onPress={() => onChange({ categoryId: opt.id })}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.md,
    gap: Spacing.sm,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 14,
    minHeight: 48,
  },
  searchInput: {
    flex: 1,
    color: Colors.text,
    fontSize: 15,
    paddingVertical: 10,
  },
  chipRow: {
    gap: 8,
    paddingRight: 4,
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
  chipSelected: {
    backgroundColor: Colors.primarySubtle,
    borderColor: Colors.primary + '55',
  },
});
