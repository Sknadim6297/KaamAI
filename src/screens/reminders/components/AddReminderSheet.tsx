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
import { X } from 'lucide-react-native';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import { Colors, Radius, Spacing } from '../../../theme';
import { AppText, AppButton, PressableScale } from '../../../components/ui';
import { toISODateString } from '../../../utils/formatNumber';
import type {
  CreateReminderInput,
  Reminder,
  ReminderCategoryId,
  ReminderPriority,
  ReminderRecurrence,
  ReminderType,
  UpdateReminderInput,
} from '../../../types/reminder';
import { ReminderCategorySelector } from './ReminderCategorySelector';
import { ReminderDateSelector } from './ReminderDateSelector';
import { ReminderTimeSelector } from './ReminderTimeSelector';
import { ReminderRepeatSelector } from './ReminderRepeatSelector';
import { ReminderPrioritySelector } from './ReminderPrioritySelector';

interface AddReminderSheetProps {
  visible: boolean;
  mode: 'add' | 'edit';
  reminder?: Reminder | null;
  onClose: () => void;
  onSubmitAdd: (input: CreateReminderInput) => Promise<void>;
  onSubmitEdit: (id: string, input: UpdateReminderInput) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}

export function AddReminderSheet({
  visible,
  mode,
  reminder,
  onClose,
  onSubmitAdd,
  onSubmitEdit,
  onDelete,
}: AddReminderSheetProps) {
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [categoryId, setCategoryId] = useState<ReminderCategoryId>('personal');
  const [date, setDate] = useState(toISODateString(new Date()));
  const [time, setTime] = useState('09:00');
  const [type, setType] = useState<ReminderType>('one-time');
  const [recurrence, setRecurrence] = useState<ReminderRecurrence | undefined>();
  const [priority, setPriority] = useState<ReminderPriority>('medium');
  const [titleError, setTitleError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!visible) return;

    if (mode === 'edit' && reminder) {
      setTitle(reminder.title);
      setNote(reminder.note ?? '');
      setCategoryId(reminder.categoryId);
      setDate(reminder.date);
      setTime(reminder.time);
      setType(reminder.type);
      setRecurrence(reminder.recurrence);
      setPriority(reminder.priority);
    } else {
      setTitle('');
      setNote('');
      setCategoryId('personal');
      setDate(toISODateString(new Date()));
      setTime('09:00');
      setType('one-time');
      setRecurrence(undefined);
      setPriority('medium');
    }
    setTitleError(null);
    setFormError(null);
  }, [visible, mode, reminder]);

  const validate = (): boolean => {
    if (!title.trim()) {
      setTitleError('Title is required.');
      return false;
    }
    setTitleError(null);
    return true;
  };

  const buildInput = (): CreateReminderInput => ({
    title: title.trim(),
    note: note.trim() || undefined,
    categoryId,
    date,
    time,
    type,
    priority,
    recurrence: type === 'one-time' ? undefined : recurrence,
  });

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    setFormError(null);
    try {
      const input = buildInput();
      if (mode === 'edit' && reminder) {
        await onSubmitEdit(reminder.id, input);
      } else {
        await onSubmitAdd(input);
      }
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Could not save reminder.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = () => {
    if (!reminder || !onDelete) return;
    Alert.alert(
      'Delete reminder?',
      'This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            void onDelete(reminder.id).catch((err) => {
              Alert.alert('Could not delete', err instanceof Error ? err.message : 'Please try again.');
            });
          },
        },
      ],
    );
  };

  return (
    <Modal visible={visible} animationType="none" transparent onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardWrap}
        >
          <Pressable onPress={(e) => e.stopPropagation()}>
            <Animated.View entering={SlideInDown.springify().damping(18)} style={styles.sheet}>
              <View style={styles.handle} />
              <View style={styles.header}>
                <AppText variant="h3">
                  {mode === 'edit' ? 'Edit Reminder' : 'Add Reminder'}
                </AppText>
                <PressableScale
                  onPress={onClose}
                  style={styles.closeBtn}
                  accessibilityRole="button"
                  accessibilityLabel="Close"
                >
                  <X color={Colors.textSecondary} size={20} />
                </PressableScale>
              </View>

              <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.field}>
                  <AppText variant="bodySmall" color="secondary">
                    Title
                  </AppText>
                  <TextInput
                    value={title}
                    onChangeText={setTitle}
                    placeholder="Pay electricity bill"
                    placeholderTextColor={Colors.textMuted}
                    style={styles.input}
                    accessibilityLabel="Reminder title"
                  />
                  {titleError ? (
                    <AppText variant="caption" color="danger">
                      {titleError}
                    </AppText>
                  ) : null}
                </View>

                <View style={styles.field}>
                  <AppText variant="bodySmall" color="secondary">
                    Note
                  </AppText>
                  <TextInput
                    value={note}
                    onChangeText={setNote}
                    placeholder="Optional details"
                    placeholderTextColor={Colors.textMuted}
                    style={[styles.input, styles.textArea]}
                    multiline
                    accessibilityLabel="Reminder note"
                  />
                </View>

                <ReminderCategorySelector value={categoryId} onChange={setCategoryId} />
                <ReminderDateSelector value={date} onChange={setDate} />
                <ReminderTimeSelector value={time} onChange={setTime} />
                <ReminderRepeatSelector
                  value={type}
                  recurrence={recurrence}
                  onChange={(nextType, nextRecurrence) => {
                    setType(nextType);
                    setRecurrence(nextRecurrence);
                  }}
                />
                <ReminderPrioritySelector value={priority} onChange={setPriority} />

                {formError ? (
                  <Animated.View entering={FadeIn.duration(200)}>
                    <AppText variant="bodySmall" color="danger">
                      {formError}
                    </AppText>
                  </Animated.View>
                ) : null}

                <AppButton
                  label={mode === 'edit' ? 'Save Changes' : 'Create Reminder'}
                  onPress={() => void handleSubmit()}
                  loading={submitting}
                  disabled={submitting}
                  style={styles.submitBtn}
                />

                {mode === 'edit' && onDelete ? (
                  <PressableScale
                    onPress={handleDelete}
                    style={styles.deleteBtn}
                    accessibilityRole="button"
                    accessibilityLabel="Delete reminder"
                  >
                    <AppText variant="buttonSmall" style={styles.deleteText}>
                      Delete Reminder
                    </AppText>
                  </PressableScale>
                ) : null}
              </ScrollView>
            </Animated.View>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  keyboardWrap: {
    justifyContent: 'flex-end',
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
    marginBottom: 6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  closeBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    maxHeight: '100%',
  },
  scrollContent: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xl,
    gap: Spacing.md,
  },
  field: {
    gap: 8,
  },
  input: {
    backgroundColor: Colors.background,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors.text,
    minHeight: 48,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  submitBtn: {
    marginTop: Spacing.sm,
  },
  deleteBtn: {
    alignItems: 'center',
    paddingVertical: 14,
    minHeight: 44,
  },
  deleteText: {
    color: Colors.danger,
    fontWeight: '600',
  },
});
