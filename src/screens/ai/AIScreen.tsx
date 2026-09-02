import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ListRenderItem,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MessageSquarePlus, Info } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Colors, Spacing } from '../../theme';
import { AppText, AppIconButton } from '../../components/ui';
import { useAI } from '../../context/AIContext';
import { useMoney } from '../../context/MoneyContext';
import { useReminders } from '../../context/RemindersContext';
import { formatCurrency, toISODate } from '../../utils/money';
import { getCalculatorNavigationPath } from '../../constants/calculators';
import type { AIAction, AIMessage } from '../../types/ai';
import type { CategoryId, CreateTransactionInput } from '../../types/money';
import type { CreateReminderInput, ReminderCategoryId, ReminderPriority, ReminderType } from '../../types/reminder';
import { formatReminderDateLabel, formatReminderTime } from '../../utils/reminderDate';
import { AIEmptyState } from './components/AIEmptyState';
import { AISuggestions } from './components/AISuggestions';
import { AIMessageBubble } from './components/AIMessageBubble';
import { AIInputBar } from './components/AIInputBar';
import { AITypingIndicator } from './components/AITypingIndicator';

export function AIScreen() {
  const router = useRouter();
  const listRef = useRef<FlatList<AIMessage>>(null);
  const {
    messages,
    loading,
    sendMessage,
    clearConversation,
    updateMessageAction,
    appendSystemMessage,
  } = useAI();
  const { transactions, addTransaction } = useMoney();
  const { addReminder } = useReminders();
  const [draft, setDraft] = useState('');
  const [actionBusy, setActionBusy] = useState(false);

  const moneyContext = useMemo(() => {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    let expense = 0;
    let income = 0;
    let expenseCount = 0;
    let incomeCount = 0;

    for (const txn of transactions) {
      const d = new Date(txn.date + 'T00:00:00');
      if (d.getMonth() !== month || d.getFullYear() !== year) continue;
      if (txn.type === 'expense') {
        expense += txn.amount;
        expenseCount += 1;
      } else {
        income += txn.amount;
        incomeCount += 1;
      }
    }

    return {
      money: {
        expenseThisMonth: expense,
        incomeThisMonth: income,
        balanceThisMonth: income - expense,
        expenseCountThisMonth: expenseCount,
        incomeCountThisMonth: incomeCount,
      },
    };
  }, [transactions]);

  const handleSend = useCallback(
    async (text: string) => {
      await sendMessage(text, moneyContext);
      requestAnimationFrame(() => {
        listRef.current?.scrollToEnd({ animated: true });
      });
    },
    [sendMessage, moneyContext],
  );

  const handleSuggestion = useCallback(
    (prompt: string) => {
      setDraft('');
      void handleSend(prompt);
    },
    [handleSend],
  );

  const handleActionConfirm = useCallback(
    async (messageId: string, action: AIAction) => {
      if (actionBusy) return;

      try {
        setActionBusy(true);

        if (action.type === 'create_expense' || action.type === 'create_income') {
          const amount = Number(action.payload?.amount);
          const categoryId = String(action.payload?.categoryId ?? '') as CategoryId;
          const categoryName = String(action.payload?.categoryName ?? 'Other');
          const title = String(action.payload?.title ?? categoryName);
          const note = String(action.payload?.note ?? '');

          if (!Number.isFinite(amount) || amount <= 0 || !categoryId) {
            Alert.alert('Invalid action', 'This action is missing required details.');
            return;
          }

          const input: CreateTransactionInput = {
            type: action.type === 'create_expense' ? 'expense' : 'income',
            amount,
            categoryId,
            title,
            note,
            date: toISODate(new Date()),
            paymentMethod: null,
          };

          await addTransaction(input);

          const successLabel =
            action.type === 'create_expense'
              ? `✓ Added ${formatCurrency(amount)} ${categoryName} expense.`
              : `✓ Added ${formatCurrency(amount)} ${categoryName} income.`;

          updateMessageAction(messageId, {
            ...action,
            status: 'completed',
            label: successLabel,
          });
          appendSystemMessage(successLabel);
          return;
        }

        if (action.type === 'show_spending') {
          router.push('/(tabs)/money');
          return;
        }

        if (action.type === 'open_calculator') {
          router.push(getCalculatorNavigationPath(action.payload) as never);
          return;
        }

        if (action.type === 'create_reminder') {
          const title = String(action.payload?.title ?? '').trim();
          const date = String(action.payload?.date ?? '');
          const time = String(action.payload?.time ?? '09:00');
          const categoryId = String(action.payload?.categoryId ?? 'personal') as ReminderCategoryId;
          const type = String(action.payload?.type ?? 'one-time') as ReminderType;
          const priority = String(action.payload?.priority ?? 'medium') as ReminderPriority;
          const note = String(action.payload?.note ?? '');

          if (!title || !date) {
            Alert.alert('Invalid action', 'This reminder is missing required details.');
            return;
          }

          const input: CreateReminderInput = {
            title,
            note: note || undefined,
            date,
            time,
            categoryId,
            type,
            priority,
            recurrence: action.payload?.recurrence as CreateReminderInput['recurrence'],
          };

          await addReminder(input);

          const successLabel = `✓ Reminder created`;
          updateMessageAction(messageId, {
            ...action,
            status: 'completed',
            label: successLabel,
          });
          appendSystemMessage(
            `${successLabel}\n${title}\n${formatReminderDateLabel(date)} · ${formatReminderTime(time)}`,
          );
          return;
        }

        if (action.type === 'create_budget') {
          appendSystemMessage('Budget module coming next. Your request is noted.');
          updateMessageAction(messageId, {
            ...action,
            status: 'completed',
            label: 'Budget request saved for later',
          });
        }
      } catch {
        Alert.alert('Something went wrong', 'Please try again.');
      } finally {
        setActionBusy(false);
      }
    },
    [
      actionBusy,
      addTransaction,
      addReminder,
      updateMessageAction,
      appendSystemMessage,
      router,
    ],
  );

  const handleActionCancel = useCallback(
    (messageId: string, action: AIAction) => {
      updateMessageAction(messageId, {
        ...action,
        status: 'cancelled',
      });
    },
    [updateMessageAction],
  );

  const renderItem: ListRenderItem<AIMessage> = useCallback(
    ({ item }) => (
      <AIMessageBubble
        message={item}
        onActionConfirm={handleActionConfirm}
        onActionCancel={handleActionCancel}
        actionBusy={actionBusy}
      />
    ),
    [handleActionConfirm, handleActionCancel, actionBusy],
  );

  const isEmpty = messages.length === 0 && !loading;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}
      >
        <Animated.View entering={FadeIn.duration(280)} style={styles.header}>
          <View style={styles.headerText}>
            <AppText variant="h2">KaamAI</AppText>
            <AppText variant="bodySmall" color="secondary">
              Your everyday AI assistant
            </AppText>
          </View>
          <View style={styles.headerActions}>
            <AppIconButton
              onPress={clearConversation}
              icon={<MessageSquarePlus color={Colors.textSecondary} size={20} strokeWidth={2} />}
              accessibilityLabel="New chat"
              accessibilityHint="Clear conversation and start over"
            />
            <AppIconButton
              onPress={() =>
                Alert.alert(
                  'About KaamAI',
                  'Chat to manage money, reminders, budgets, and everyday tasks. AI responses are simulated locally for now.',
                )
              }
              icon={<Info color={Colors.textSecondary} size={20} strokeWidth={2} />}
              accessibilityLabel="About KaamAI"
            />
          </View>
        </Animated.View>

        {isEmpty ? (
          <View style={styles.emptyWrap}>
            <AIEmptyState />
            <AISuggestions onSelect={handleSuggestion} disabled={loading} />
          </View>
        ) : (
          <FlatList
            ref={listRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            style={styles.list}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
            ListFooterComponent={loading ? <AITypingIndicator /> : null}
            keyboardShouldPersistTaps="handled"
          />
        )}

        <AIInputBar
          draft={draft}
          onDraftChange={setDraft}
          onSend={(text) => {
            void handleSend(text);
          }}
          loading={loading}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.sm,
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  emptyWrap: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
    flexGrow: 1,
  },
});
