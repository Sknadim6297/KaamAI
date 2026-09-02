import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Platform,
} from 'react-native';
import { Plus, ArrowUp } from 'lucide-react-native';
import { Colors, Radius, Shadows, Spacing } from '../../../theme';
import { PressableScale } from '../../../components/ui';

interface AIInputBarProps {
  onSend: (text: string) => void;
  loading?: boolean;
  disabled?: boolean;
  draft?: string;
  onDraftChange?: (text: string) => void;
}

export function AIInputBar({
  onSend,
  loading,
  disabled,
  draft,
  onDraftChange,
}: AIInputBarProps) {
  const [internal, setInternal] = useState('');
  const value = draft !== undefined ? draft : internal;

  const setValue = (text: string) => {
    if (onDraftChange) onDraftChange(text);
    else setInternal(text);
  };

  const canSend = value.trim().length > 0 && !loading && !disabled;

  const handleSend = () => {
    if (!canSend) return;
    const text = value.trim();
    setValue('');
    onSend(text);
  };

  return (
    <View style={styles.container}>
      <View style={styles.bar}>
        <PressableScale
          onPress={() => undefined}
          style={styles.plusBtn}
          accessibilityRole="button"
          accessibilityLabel="More options"
          disabled
        >
          <Plus color={Colors.textMuted} size={20} strokeWidth={2} />
        </PressableScale>

        <TextInput
          value={value}
          onChangeText={setValue}
          placeholder="Ask anything..."
          placeholderTextColor={Colors.textMuted}
          style={styles.input}
          multiline
          maxLength={500}
          editable={!loading && !disabled}
          accessibilityLabel="Message input"
          returnKeyType="default"
          blurOnSubmit={false}
        />

        <PressableScale
          onPress={handleSend}
          disabled={!canSend}
          style={[styles.sendBtn, !canSend && styles.sendDisabled]}
          accessibilityRole="button"
          accessibilityLabel="Send message"
          accessibilityState={{ disabled: !canSend }}
        >
          <ArrowUp color={Colors.white} size={18} strokeWidth={2.5} />
        </PressableScale>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    paddingBottom: Platform.OS === 'ios' ? Spacing.sm : Spacing.md,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 8,
    paddingVertical: 8,
    minHeight: 52,
    ...Shadows.sm,
  },
  plusBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
  input: {
    flex: 1,
    maxHeight: 110,
    minHeight: 40,
    paddingVertical: Platform.OS === 'ios' ? 10 : 8,
    paddingHorizontal: 4,
    color: Colors.text,
    fontSize: 15,
    lineHeight: 20,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendDisabled: {
    backgroundColor: Colors.textMuted,
    opacity: 0.55,
  },
});
