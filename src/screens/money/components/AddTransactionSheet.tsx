import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Pressable,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { ChevronDown, X } from 'lucide-react-native';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import { Colors, Radius, Spacing } from '../../../theme';
import { AppText, AppButton, PressableScale } from '../../../components/ui';
import { getCategoryById } from '../../../constants/categories';
import { parseAmountInput, toISODate } from '../../../utils/money';
import type {
  CategoryId,
  CreateTransactionInput,
  PaymentMethod,
  Transaction,
  TransactionType,
  UpdateTransactionInput,
} from '../../../types/money';
import { CategorySelector } from './CategorySelector';
import { DateSelector } from './DateSelector';
import { PaymentMethodSelector } from './PaymentMethodSelector';

interface AddTransactionSheetProps {
  visible: boolean;
  mode: 'add' | 'edit';
  initialType?: TransactionType;
  transaction?: Transaction | null;
  onClose: () => void;
  onSubmitAdd: (input: CreateTransactionInput) => Promise<void>;
  onSubmitEdit: (id: string, input: UpdateTransactionInput) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}

export function AddTransactionSheet({
  visible,
  mode,
  initialType = 'expense',
  transaction,
  onClose,
  onSubmitAdd,
  onSubmitEdit,
  onDelete,
}: AddTransactionSheetProps) {
  const [type, setType] = useState<TransactionType>(initialType);
  const [amountText, setAmountText] = useState('');
  const [categoryId, setCategoryId] = useState<CategoryId | null>(null);
  const [note, setNote] = useState('');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(toISODate(new Date()));
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [amountError, setAmountError] = useState<string | null>(null);
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!visible) return;

    if (mode === 'edit' && transaction) {
      setType(transaction.type);
      setAmountText(String(transaction.amount));
      setCategoryId(transaction.categoryId);
      setNote(transaction.note);
      setTitle(transaction.title);
      setDate(transaction.date);
      setPaymentMethod(transaction.paymentMethod);
    } else {
      setType(initialType);
      setAmountText('');
      setCategoryId(null);
      setNote('');
      setTitle('');
      setDate(toISODate(new Date()));
      setPaymentMethod(null);
    }
    setAmountError(null);
    setCategoryError(null);
    setFormError(null);
  }, [visible, mode, transaction, initialType]);

  const selectedCategory = categoryId ? getCategoryById(categoryId) : undefined;

  const validate = (): { amount: number; categoryId: CategoryId } | null => {
    const amount = parseAmountInput(amountText);
    let valid = true;

    if (amount === null) {
      setAmountError('Enter a valid amount greater than 0.');
      valid = false;
    } else {
      setAmountError(null);
    }

    if (!categoryId) {
      setCategoryError('Please select a category.');
      valid = false;
    } else {
      setCategoryError(null);
    }

    if (!valid || amount === null || !categoryId) return null;
    return { amount, categoryId };
  };

  const handleSubmit = async () => {
    const validated = validate();
    if (!validated) return;

    const category = getCategoryById(validated.categoryId);
    const resolvedTitle =
      title.trim() || note.trim() || category?.name || (type === 'income' ? 'Income' : 'Expense');

    setSubmitting(true);
    setFormError(null);

    try {
      if (mode === 'edit' && transaction) {
        await onSubmitEdit(transaction.id, {
          type,
          amount: validated.amount,
          categoryId: validated.categoryId,
          title: resolvedTitle,
          note,
          date,
          paymentMethod,
        });
      } else {
        await onSubmitAdd({
          type,
          amount: validated.amount,
          categoryId: validated.categoryId,
          title: resolvedTitle,
          note,
          date,
          paymentMethod,
        });
      }
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = () => {
    if (!transaction || !onDelete) return;
    Alert.alert(
      'Delete transaction',
      `Remove "${transaction.title}"? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            void onDelete(transaction.id);
          },
        },
      ],
    );
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Pressable style={styles.overlay} onPress={onClose}>
          <Animated.View entering={FadeIn.duration(180)} style={StyleSheet.absoluteFill} />
        </Pressable>

        <Animated.View entering={SlideInDown.duration(280).springify()} style={styles.sheet}>
          <View style={styles.handle} />

          <View style={styles.header}>
            <AppText variant="h3">{mode === 'edit' ? 'Edit transaction' : 'Add transaction'}</AppText>
            <PressableScale
              onPress={onClose}
              style={styles.closeBtn}
              accessibilityRole="button"
              accessibilityLabel="Close"
            >
              <X color={Colors.textSecondary} size={20} strokeWidth={2} />
            </PressableScale>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.form}
          >
            <View style={styles.segment}>
              {(['expense', 'income'] as TransactionType[]).map((option) => {
                const selected = type === option;
                return (
                  <PressableScale
                    key={option}
                    onPress={() => {
                      setType(option);
                      setCategoryId(null);
                    }}
                    style={[styles.segmentItem, selected && styles.segmentSelected]}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    accessibilityLabel={option}
                  >
                    <AppText
                      variant="bodyMedium"
                      style={{
                        fontWeight: '600',
                        color: selected ? Colors.white : Colors.textSecondary,
                        textTransform: 'capitalize',
                      }}
                    >
                      {option}
                    </AppText>
                  </PressableScale>
                );
              })}
            </View>

            <View style={styles.amountBlock}>
              <AppText variant="bodySmall" color="secondary">
                Amount
              </AppText>
              <TextInput
                value={amountText}
                onChangeText={(text) => {
                  const cleaned = text.replace(/[^0-9.]/g, '');
                  setAmountText(cleaned);
                  if (amountError) setAmountError(null);
                }}
                placeholder="₹ 0"
                placeholderTextColor={Colors.textMuted}
                keyboardType="decimal-pad"
                style={styles.amountInput}
                accessibilityLabel="Amount"
              />
              {amountError ? (
                <AppText variant="caption" color="danger">
                  {amountError}
                </AppText>
              ) : null}
            </View>

            <View style={styles.field}>
              <AppText variant="bodySmall" color="secondary">
                Category
              </AppText>
              <PressableScale
                onPress={() => setCategoryOpen(true)}
                style={[styles.selectField, categoryError ? styles.selectError : null]}
                accessibilityRole="button"
                accessibilityLabel="Select category"
              >
                <AppText
                  variant="body"
                  color={selectedCategory ? 'default' : 'muted'}
                  style={styles.selectText}
                >
                  {selectedCategory?.name ?? 'Choose category'}
                </AppText>
                <ChevronDown color={Colors.textMuted} size={18} strokeWidth={2} />
              </PressableScale>
              {categoryError ? (
                <AppText variant="caption" color="danger">
                  {categoryError}
                </AppText>
              ) : null}
            </View>

            <View style={styles.field}>
              <AppText variant="bodySmall" color="secondary">
                Title
              </AppText>
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="e.g. Dinner, Uber, Salary"
                placeholderTextColor={Colors.textMuted}
                style={styles.input}
                accessibilityLabel="Title"
              />
            </View>

            <View style={styles.field}>
              <AppText variant="bodySmall" color="secondary">
                Note
              </AppText>
              <TextInput
                value={note}
                onChangeText={setNote}
                placeholder="Add a short note"
                placeholderTextColor={Colors.textMuted}
                style={[styles.input, styles.noteInput]}
                multiline
                accessibilityLabel="Note"
              />
            </View>

            <DateSelector value={date} onChange={setDate} />

            <PaymentMethodSelector value={paymentMethod} onChange={setPaymentMethod} />

            {formError ? (
              <AppText variant="bodySmall" color="danger">
                {formError}
              </AppText>
            ) : null}

            <AppButton
              label={mode === 'edit' ? 'Save changes' : 'Add transaction'}
              onPress={() => {
                void handleSubmit();
              }}
              loading={submitting}
              fullWidth
              style={styles.submit}
            />

            {mode === 'edit' ? (
              <AppButton
                label="Delete"
                variant="danger"
                onPress={handleDelete}
                fullWidth
                style={styles.deleteBtn}
              />
            ) : null}
          </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>

      <CategorySelector
        visible={categoryOpen}
        type={type}
        selectedId={categoryId}
        onSelect={setCategoryId}
        onClose={() => setCategoryOpen(false)}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, justifyContent: 'flex-end' },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.overlay,
  },
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Radius['2xl'],
    borderTopRightRadius: Radius['2xl'],
    maxHeight: '92%',
    paddingBottom: Spacing.lg,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
    marginTop: 10,
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
  },
  closeBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xl,
    gap: Spacing.md,
  },
  segment: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    borderRadius: Radius.lg,
    padding: 4,
    gap: 4,
  },
  segmentItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: Radius.md,
    minHeight: 44,
  },
  segmentSelected: {
    backgroundColor: Colors.primary,
  },
  amountBlock: {
    gap: 8,
  },
  amountInput: {
    fontSize: 36,
    fontWeight: '700',
    color: Colors.text,
    paddingVertical: 8,
    borderBottomWidth: 1.5,
    borderBottomColor: Colors.border,
  },
  field: {
    gap: 8,
  },
  selectField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.background,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingHorizontal: 14,
    minHeight: 50,
  },
  selectError: {
    borderColor: Colors.danger,
  },
  selectText: {
    flex: 1,
  },
  input: {
    backgroundColor: Colors.background,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: Colors.text,
    fontSize: 15,
    minHeight: 50,
  },
  noteInput: {
    minHeight: 72,
    textAlignVertical: 'top',
  },
  submit: {
    marginTop: Spacing.sm,
  },
  deleteBtn: {
    marginTop: 4,
  },
});
