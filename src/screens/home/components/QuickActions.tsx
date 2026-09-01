import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  Receipt,
  Bell,
  Calculator,
  FileText,
  LucideIcon,
} from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { Colors, Radius, Spacing } from '../../../theme';
import { AppText, PressableScale, SectionHeader } from '../../../components/ui';

interface QuickActionItem {
  id: string;
  label: string;
  subtitle: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  route: '/(tabs)/money' | '/(tabs)/tools' | '/(tabs)/ai';
}

const ACTIONS: QuickActionItem[] = [
  {
    id: 'expense',
    label: 'Expense',
    subtitle: 'Add money',
    icon: Receipt,
    color: Colors.danger,
    bgColor: Colors.dangerLight,
    route: '/(tabs)/money',
  },
  {
    id: 'reminder',
    label: 'Reminder',
    subtitle: 'Never forget',
    icon: Bell,
    color: Colors.warning,
    bgColor: Colors.warningLight,
    route: '/(tabs)/ai',
  },
  {
    id: 'calculator',
    label: 'Calculator',
    subtitle: 'Quick maths',
    icon: Calculator,
    color: Colors.primary,
    bgColor: Colors.primarySubtle,
    route: '/(tabs)/tools',
  },
  {
    id: 'document',
    label: 'Document',
    subtitle: 'Create document',
    icon: FileText,
    color: Colors.info,
    bgColor: Colors.infoLight,
    route: '/(tabs)/tools',
  },
];

interface ActionItemProps {
  action: QuickActionItem;
  onPress?: () => void;
  index: number;
}

function ActionItem({ action, onPress, index }: ActionItemProps) {
  const Icon = action.icon;

  return (
    <Animated.View
      entering={FadeInDown.delay(240 + index * 50).duration(480).springify()}
      style={styles.actionWrap}
    >
      <PressableScale
        onPress={onPress}
        style={styles.actionItem}
        accessibilityRole="button"
        accessibilityLabel={`${action.label}, ${action.subtitle}`}
      >
        <View style={[styles.iconContainer, { backgroundColor: action.bgColor }]}>
          <Icon color={action.color} size={22} strokeWidth={2} />
        </View>
        <AppText variant="bodyMedium" style={styles.label}>
          {action.label}
        </AppText>
        <AppText variant="caption" color="muted" style={styles.subtitle}>
          {action.subtitle}
        </AppText>
      </PressableScale>
    </Animated.View>
  );
}

interface QuickActionsProps {
  onActionPress?: (id: string) => void;
}

export function QuickActions({ onActionPress }: QuickActionsProps) {
  const router = useRouter();

  const handleActionPress = (action: QuickActionItem) => {
    if (onActionPress) {
      onActionPress(action.id);
    } else {
      router.push(action.route);
    }
  };

  return (
    <View style={styles.wrapper}>
      <SectionHeader title="Quick Actions" />
      <View style={styles.grid}>
        {ACTIONS.map((action, index) => (
          <ActionItem
            key={action.id}
            action={action}
            index={index}
            onPress={() => handleActionPress(action)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.lg,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  actionWrap: {
    width: '48%',
    flexGrow: 1,
    flexBasis: '45%',
  },
  actionItem: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.md,
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: Colors.borderLight,
    minHeight: 110,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  label: {
    marginBottom: 2,
  },
  subtitle: {
    lineHeight: 16,
  },
});
