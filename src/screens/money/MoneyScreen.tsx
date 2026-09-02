import React, { useCallback, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus } from 'lucide-react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Colors, Shadows, Spacing } from '../../theme';
import { AppText, PressableScale } from '../../components/ui';
import { useMoney } from '../../context/MoneyContext';
import type { Transaction } from '../../types/money';
import { MoneyHeader } from './components/MoneyHeader';
import { BalanceCard } from './components/BalanceCard';
import { MoneyStats } from './components/MoneyStats';
import { MonthlySpending } from './components/MonthlySpending';
import { TransactionFiltersBar } from './components/TransactionFilters';
import { TransactionList } from './components/TransactionList';
import { AddTransactionSheet } from './components/AddTransactionSheet';

export function MoneyScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ action?: string; type?: string }>();
  const {
    filteredTransactions,
    filters,
    summary,
    error,
    sheetOpen,
    sheetMode,
    editingTransaction,
    preferredAddType,
    setFilters,
    shiftMonth,
    openAddSheet,
    openEditSheet,
    closeSheet,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  } = useMoney();

  useEffect(() => {
    if (params.action === 'add') {
      const type = params.type === 'income' ? 'income' : 'expense';
      openAddSheet(type);
      router.setParams({ action: undefined, type: undefined });
    }
  }, [params.action, params.type, openAddSheet, router]);

  const handleDelete = useCallback(
    async (transaction: Transaction) => {
      try {
        await deleteTransaction(transaction.id);
      } catch (err) {
        Alert.alert(
          'Could not delete',
          err instanceof Error ? err.message : 'Please try again.',
        );
      }
    },
    [deleteTransaction],
  );

  const listHeader = (
    <Animated.View entering={FadeIn.duration(280)}>
      <MoneyHeader
        month={filters.month}
        year={filters.year}
        onPrevMonth={() => shiftMonth(-1)}
        onNextMonth={() => shiftMonth(1)}
        onCalendarPress={() => setFilters({ dateRange: 'this_month' })}
      />
      <BalanceCard summary={summary} />
      <MoneyStats summary={summary} />
      <MonthlySpending summary={summary} />
      <TransactionFiltersBar filters={filters} onChange={setFilters} />
      {error ? (
        <AppText variant="bodySmall" color="danger" style={styles.error}>
          {error}
        </AppText>
      ) : null}
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.container}>
        <TransactionList
          transactions={filteredTransactions}
          ListHeaderComponent={listHeader}
          onTransactionPress={openEditSheet}
          onDelete={(txn) => {
            void handleDelete(txn);
          }}
          onAddPress={() => openAddSheet('expense')}
        />

        <PressableScale
          onPress={() => openAddSheet('expense')}
          style={styles.fab}
          accessibilityRole="button"
          accessibilityLabel="Add transaction"
        >
          <Plus color={Colors.white} size={22} strokeWidth={2.5} />
          <AppText variant="button" style={styles.fabLabel}>
            Add transaction
          </AppText>
        </PressableScale>
      </View>

      <AddTransactionSheet
        visible={sheetOpen}
        mode={sheetMode}
        initialType={preferredAddType}
        transaction={editingTransaction}
        onClose={closeSheet}
        onSubmitAdd={addTransaction}
        onSubmitEdit={updateTransaction}
        onDelete={deleteTransaction}
      />
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
  error: {
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.sm,
  },
  fab: {
    position: 'absolute',
    right: Spacing.md,
    bottom: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 999,
    minHeight: 52,
    ...Shadows.primary,
  },
  fabLabel: {
    color: Colors.white,
  },
});
