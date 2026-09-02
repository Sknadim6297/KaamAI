import React from 'react';
import { View, StyleSheet } from 'react-native';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Colors, Spacing } from '../../../theme';
import { AppText, AppIconButton } from '../../../components/ui';
import { formatMonthLabel } from '../../../utils/money';

interface MoneyHeaderProps {
  month: number;
  year: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onCalendarPress?: () => void;
}

export function MoneyHeader({
  month,
  year,
  onPrevMonth,
  onNextMonth,
  onCalendarPress,
}: MoneyHeaderProps) {
  return (
    <Animated.View entering={FadeInDown.duration(450).springify()} style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.titles}>
          <AppText variant="h2">Money</AppText>
          <AppText variant="bodySmall" color="secondary">
            Track your everyday finances
          </AppText>
        </View>
        <AppIconButton
          onPress={onCalendarPress}
          icon={<CalendarDays color={Colors.textSecondary} size={22} strokeWidth={2} />}
          accessibilityLabel="Date filter"
          accessibilityHint="Open month and date filters"
        />
      </View>

      <View style={styles.monthRow}>
        <AppIconButton
          onPress={onPrevMonth}
          icon={<ChevronLeft color={Colors.text} size={20} strokeWidth={2.5} />}
          size="sm"
          variant="ghost"
          accessibilityLabel="Previous month"
          style={styles.chevron}
        />
        <AppText variant="bodySemiBold" style={styles.monthLabel}>
          {formatMonthLabel(month, year)}
        </AppText>
        <AppIconButton
          onPress={onNextMonth}
          icon={<ChevronRight color={Colors.text} size={20} strokeWidth={2.5} />}
          size="sm"
          variant="ghost"
          accessibilityLabel="Next month"
          style={styles.chevron}
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    gap: Spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  titles: {
    flex: 1,
    gap: 4,
  },
  monthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  monthLabel: {
    minWidth: 160,
    textAlign: 'center',
  },
  chevron: {
    width: 44,
    height: 44,
  },
});
