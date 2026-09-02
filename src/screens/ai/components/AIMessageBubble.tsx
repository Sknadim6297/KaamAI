import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Colors, Radius, Spacing } from '../../../theme';
import { AppText } from '../../../components/ui';
import type { AIAction, AIMessage } from '../../../types/ai';
import { AIActionCard } from './AIActionCard';

interface AIMessageBubbleProps {
  message: AIMessage;
  onActionConfirm: (messageId: string, action: AIAction) => void;
  onActionCancel: (messageId: string, action: AIAction) => void;
  actionBusy?: boolean;
}

function AIMessageBubbleComponent({
  message,
  onActionConfirm,
  onActionCancel,
  actionBusy,
}: AIMessageBubbleProps) {
  if (message.role === 'system') {
    return (
      <Animated.View entering={FadeInUp.duration(280)} style={styles.systemWrap}>
        <View style={styles.systemCard}>
          <AppText variant="bodySmall" color="secondary" style={styles.systemText}>
            {message.content}
          </AppText>
        </View>
      </Animated.View>
    );
  }

  const isUser = message.role === 'user';

  return (
    <Animated.View
      entering={FadeInUp.duration(320)}
      style={[styles.row, isUser ? styles.rowUser : styles.rowAssistant]}
    >
      <View style={[styles.bubble, isUser ? styles.userBubble : styles.assistantBubble]}>
        <AppText
          variant="body"
          style={{ color: isUser ? Colors.white : Colors.text, lineHeight: 22 }}
        >
          {message.content}
        </AppText>

        {!isUser && message.action ? (
          <AIActionCard
            action={message.action}
            busy={actionBusy}
            onConfirm={() => onActionConfirm(message.id, message.action!)}
            onCancel={() => onActionCancel(message.id, message.action!)}
          />
        ) : null}
      </View>
    </Animated.View>
  );
}

export const AIMessageBubble = memo(AIMessageBubbleComponent);

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
  },
  rowUser: {
    alignItems: 'flex-end',
  },
  rowAssistant: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '86%',
    borderRadius: Radius.xl,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  userBubble: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 6,
  },
  assistantBubble: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderBottomLeftRadius: 6,
  },
  systemWrap: {
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
    alignItems: 'center',
  },
  systemCard: {
    backgroundColor: Colors.primarySubtle,
    borderRadius: Radius.lg,
    paddingHorizontal: 14,
    paddingVertical: 10,
    maxWidth: '90%',
  },
  systemText: {
    textAlign: 'center',
  },
});
