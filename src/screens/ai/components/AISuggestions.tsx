import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import {
  Receipt,
  Calculator,
  Bell,
  PieChart,
  Wallet,
  Percent,
  LucideIcon,
} from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Colors, Radius, Spacing } from '../../../theme';
import { AppText, PressableScale } from '../../../components/ui';

interface Suggestion {
  id: string;
  label: string;
  prompt: string;
  icon: LucideIcon;
}

const SUGGESTIONS: Suggestion[] = [
  {
    id: 'expense',
    label: 'Track an expense',
    prompt: 'Add expense 450 food',
    icon: Receipt,
  },
  {
    id: 'emi',
    label: 'Calculate EMI',
    prompt: 'Calculate EMI for 5 lakh',
    icon: Calculator,
  },
  {
    id: 'reminder',
    label: 'Set a reminder',
    prompt: 'Remind me to pay electricity bill on 5th',
    icon: Bell,
  },
  {
    id: 'spending',
    label: 'Show my spending',
    prompt: 'How much did I spend this month?',
    icon: PieChart,
  },
  {
    id: 'budget',
    label: 'Create a budget',
    prompt: 'Create a budget of 10000',
    icon: Wallet,
  },
  {
    id: 'discount',
    label: 'Calculate discount',
    prompt: 'Calculate 20% discount on 2500',
    icon: Percent,
  },
];

interface AISuggestionsProps {
  onSelect: (prompt: string) => void;
  disabled?: boolean;
}

export function AISuggestions({ onSelect, disabled }: AISuggestionsProps) {
  return (
    <Animated.View entering={FadeInDown.delay(120).duration(420)} style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {SUGGESTIONS.map((item) => {
          const Icon = item.icon;
          return (
            <PressableScale
              key={item.id}
              onPress={() => onSelect(item.prompt)}
              disabled={disabled}
              style={styles.chip}
              scaleTo={0.96}
              accessibilityRole="button"
              accessibilityLabel={item.label}
            >
              <View style={styles.iconWrap}>
                <Icon color={Colors.primary} size={16} strokeWidth={2} />
              </View>
              <AppText variant="bodySmall" style={styles.label}>
                {item.label}
              </AppText>
            </PressableScale>
          );
        })}
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: Spacing.md,
  },
  row: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.surface,
    borderRadius: Radius.full,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    minHeight: 44,
  },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primarySubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontWeight: '600',
    color: Colors.text,
  },
});
