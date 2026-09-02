import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Colors, Radius, Spacing } from '../../../theme';
import { AppText, PressableScale } from '../../../components/ui';
import { REMINDER_CATEGORIES } from '../../../constants/reminders';
import type { ReminderFilters, ReminderStatusFilter } from '../../../types/reminder';

interface ReminderFiltersBarProps {
  filters: ReminderFilters;
  onChange: (patch: Partial<ReminderFilters>) => void;
}

const STATUS_FILTERS: { id: ReminderStatusFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'today', label: 'Today' },
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'overdue', label: 'Overdue' },
  { id: 'completed', label: 'Completed' },
];

export function ReminderFiltersBar({ filters, onChange }: ReminderFiltersBarProps) {
  return (
    <Animated.View entering={FadeIn.duration(260)} style={styles.wrap}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {STATUS_FILTERS.map((item) => {
          const selected = filters.status === item.id;
          return (
            <PressableScale
              key={item.id}
              onPress={() => onChange({ status: item.id })}
              style={[styles.chip, selected && styles.chipSelected]}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              accessibilityLabel={`Filter ${item.label}`}
            >
              <AppText
                variant="bodySmall"
                style={{ fontWeight: '600', color: selected ? Colors.primary : Colors.textSecondary }}
              >
                {item.label}
              </AppText>
            </PressableScale>
          );
        })}
      </ScrollView>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        <PressableScale
          onPress={() => onChange({ categoryId: 'all' })}
          style={[styles.chip, filters.categoryId === 'all' && styles.chipSelected]}
          accessibilityRole="button"
          accessibilityState={{ selected: filters.categoryId === 'all' }}
          accessibilityLabel="All categories"
        >
          <AppText
            variant="caption"
            style={{
              fontWeight: '600',
              color: filters.categoryId === 'all' ? Colors.primary : Colors.textSecondary,
            }}
          >
            All categories
          </AppText>
        </PressableScale>
        {REMINDER_CATEGORIES.map((cat) => {
          const selected = filters.categoryId === cat.id;
          return (
            <PressableScale
              key={cat.id}
              onPress={() => onChange({ categoryId: cat.id })}
              style={[styles.chip, selected && styles.chipSelected]}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              accessibilityLabel={`Category ${cat.name}`}
            >
              <AppText
                variant="caption"
                style={{ fontWeight: '600', color: selected ? Colors.primary : Colors.textSecondary }}
              >
                {cat.name}
              </AppText>
            </PressableScale>
          );
        })}
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 8,
    paddingBottom: Spacing.sm,
  },
  row: {
    paddingHorizontal: Spacing.md,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    minHeight: 38,
    justifyContent: 'center',
  },
  chipSelected: {
    backgroundColor: Colors.primarySubtle,
    borderColor: Colors.primary + '55',
  },
});
