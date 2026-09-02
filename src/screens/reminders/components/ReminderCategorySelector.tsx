import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors, Radius, Spacing } from '../../../theme';
import { AppText, PressableScale } from '../../../components/ui';
import {
  REMINDER_CATEGORIES,
  getReminderCategoryIcon,
} from '../../../constants/reminders';
import type { ReminderCategoryId } from '../../../types/reminder';

interface ReminderCategorySelectorProps {
  value: ReminderCategoryId;
  onChange: (id: ReminderCategoryId) => void;
}

export function ReminderCategorySelector({ value, onChange }: ReminderCategorySelectorProps) {
  return (
    <View style={styles.container}>
      <AppText variant="bodySmall" color="secondary">
        Category
      </AppText>
      <View style={styles.grid}>
        {REMINDER_CATEGORIES.map((cat) => {
          const Icon = getReminderCategoryIcon(cat.iconKey);
          const selected = value === cat.id;
          return (
            <PressableScale
              key={cat.id}
              onPress={() => onChange(cat.id)}
              style={[styles.chip, selected && styles.chipSelected]}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              accessibilityLabel={`Category ${cat.name}`}
            >
              <View style={[styles.iconWrap, { backgroundColor: cat.bgColor }]}>
                <Icon color={cat.color} size={16} strokeWidth={2} />
              </View>
              <AppText
                variant="caption"
                numberOfLines={1}
                style={{ fontWeight: '600', color: selected ? Colors.primary : Colors.textSecondary }}
              >
                {cat.name}
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: Radius.full,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    minHeight: 40,
  },
  chipSelected: {
    backgroundColor: Colors.primarySubtle,
    borderColor: Colors.primary + '55',
  },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
