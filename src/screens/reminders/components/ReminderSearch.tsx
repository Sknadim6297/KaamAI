import React from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { Search, X } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Colors, Radius, Spacing } from '../../../theme';
import { AppText, PressableScale } from '../../../components/ui';

interface ReminderSearchProps {
  value: string;
  onChange: (text: string) => void;
  onClose: () => void;
  resultCount: number;
}

export function ReminderSearch({ value, onChange, onClose, resultCount }: ReminderSearchProps) {
  return (
    <Animated.View entering={FadeInDown.duration(280)} style={styles.wrap}>
      <View style={styles.inputRow}>
        <Search color={Colors.textMuted} size={18} />
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder="Search reminders..."
          placeholderTextColor={Colors.textMuted}
          style={styles.input}
          autoFocus
          accessibilityLabel="Search reminders"
          returnKeyType="search"
        />
        <PressableScale
          onPress={onClose}
          style={styles.closeBtn}
          accessibilityRole="button"
          accessibilityLabel="Close search"
        >
          <X color={Colors.textSecondary} size={18} />
        </PressableScale>
      </View>
      {value.trim() ? (
        <AppText variant="caption" color="muted" style={styles.meta}>
          {resultCount === 0 ? 'No results found' : `${resultCount} result${resultCount === 1 ? '' : 's'}`}
        </AppText>
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
    gap: 6,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 12,
    gap: 8,
    minHeight: 48,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: Colors.text,
    paddingVertical: 10,
  },
  closeBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  meta: {
    paddingHorizontal: 4,
  },
});
