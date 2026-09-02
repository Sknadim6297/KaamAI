import React, { useCallback, useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Search } from 'lucide-react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors, Shadows, Spacing } from '../../theme';
import { AppText, PressableScale } from '../../components/ui';
import { useReminders } from '../../context/RemindersContext';
import type { ReminderGroup } from '../../types/reminder';
import { ReminderCard } from './components/ReminderCard';
import { ReminderSearch } from './components/ReminderSearch';
import { ReminderFiltersBar } from './components/ReminderFilters';
import { ReminderEmptyState } from './components/ReminderEmptyState';
import { AddReminderSheet } from './components/AddReminderSheet';

export function RemindersScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ action?: string }>();
  const {
    filteredReminders,
    groupedReminders,
    filters,
    loading,
    error,
    notificationNotice,
    sheetOpen,
    sheetMode,
    editingReminder,
    searchOpen,
    setFilters,
    setSearchOpen,
    openAddSheet,
    openEditSheet,
    closeSheet,
    addReminder,
    updateReminder,
    deleteReminder,
    toggleComplete,
    clearNotificationNotice,
  } = useReminders();

  useEffect(() => {
    if (params.action === 'add') {
      openAddSheet();
      router.setParams({ action: undefined });
    }
  }, [params.action, openAddSheet, router]);

  const handleToggle = useCallback(
    (id: string) => {
      void toggleComplete(id).catch((err) => {
        Alert.alert('Could not update', err instanceof Error ? err.message : 'Please try again.');
      });
    },
    [toggleComplete],
  );

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        await deleteReminder(id);
      } catch (err) {
        Alert.alert('Could not delete', err instanceof Error ? err.message : 'Please try again.');
      }
    },
    [deleteReminder],
  );

  const renderGroup = ({ item }: { item: ReminderGroup }) => (
    <View style={styles.section}>
      <AppText variant="bodySemiBold" style={styles.sectionTitle}>
        {item.title}
      </AppText>
      <View style={styles.sectionList}>
        {item.reminders.map((reminder, index) => (
          <ReminderCard
            key={reminder.id}
            reminder={reminder}
            index={index}
            onToggleComplete={handleToggle}
            onPress={openEditSheet}
            onEdit={openEditSheet}
            onDelete={(rid) => void handleDelete(rid)}
          />
        ))}
      </View>
    </View>
  );

  const listHeader = (
    <Animated.View entering={FadeIn.duration(280)}>
      <View style={styles.header}>
        <View>
          <AppText variant="h2">Reminders</AppText>
          <AppText variant="bodySmall" color="muted">
            Stay on top of your day
          </AppText>
        </View>
        <View style={styles.headerActions}>
          <PressableScale
            onPress={() => setSearchOpen(!searchOpen)}
            style={styles.iconBtn}
            accessibilityRole="button"
            accessibilityLabel="Search reminders"
          >
            <Search color={Colors.textSecondary} size={20} />
          </PressableScale>
          <PressableScale
            onPress={openAddSheet}
            style={styles.iconBtn}
            accessibilityRole="button"
            accessibilityLabel="Add reminder"
          >
            <Plus color={Colors.primary} size={22} />
          </PressableScale>
        </View>
      </View>

      {searchOpen ? (
        <ReminderSearch
          value={filters.search}
          onChange={(search) => setFilters({ search })}
          onClose={() => {
            setSearchOpen(false);
            setFilters({ search: '' });
          }}
          resultCount={filteredReminders.length}
        />
      ) : null}

      <ReminderFiltersBar filters={filters} onChange={setFilters} />

      {notificationNotice ? (
        <View style={styles.notice}>
          <AppText variant="caption" color="secondary" style={{ flex: 1 }}>
            {notificationNotice}
          </AppText>
          <PressableScale onPress={clearNotificationNotice} accessibilityRole="button" accessibilityLabel="Dismiss">
            <AppText variant="caption" style={{ color: Colors.primary, fontWeight: '600' }}>
              Dismiss
            </AppText>
          </PressableScale>
        </View>
      ) : null}

      {error ? (
        <AppText variant="bodySmall" color="danger" style={styles.error}>
          {error}
        </AppText>
      ) : null}
    </Animated.View>
  );

  const showEmpty = !loading && filteredReminders.length === 0;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.container}>
        <FlatList
          data={showEmpty ? [] : groupedReminders}
          keyExtractor={(item) => item.key}
          renderItem={renderGroup}
          ListHeaderComponent={listHeader}
          ListEmptyComponent={
            showEmpty ? (
              <ReminderEmptyState
                onAddPress={openAddSheet}
              />
            ) : null
          }
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />

        <PressableScale
          onPress={openAddSheet}
          style={styles.fab}
          accessibilityRole="button"
          accessibilityLabel="Add reminder"
        >
          <Plus color={Colors.surface} size={24} strokeWidth={2.5} />
        </PressableScale>

        <AddReminderSheet
          visible={sheetOpen}
          mode={sheetMode}
          reminder={editingReminder}
          onClose={closeSheet}
          onSubmitAdd={async (input) => {
            await addReminder(input);
          }}
          onSubmitEdit={async (id, input) => {
            await updateReminder(id, input);
          }}
          onDelete={deleteReminder}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 4,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  section: {
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.md,
    gap: Spacing.sm,
  },
  sectionTitle: {
    color: Colors.textSecondary,
  },
  sectionList: {
    gap: Spacing.sm,
  },
  notice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
    padding: 12,
    borderRadius: 12,
    backgroundColor: Colors.warningLight,
    borderWidth: 1,
    borderColor: Colors.warning + '33',
  },
  error: {
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
  },
  fab: {
    position: 'absolute',
    right: Spacing.md,
    bottom: Spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.md,
  },
});
