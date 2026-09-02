import React, { useMemo } from 'react';
import { View, StyleSheet, FlatList, ListRenderItem } from 'react-native';
import { Wallet } from 'lucide-react-native';
import { Colors, Spacing } from '../../../theme';
import { AppText, EmptyState, SectionHeader } from '../../../components/ui';
import { groupTransactionsForList, type ListSection } from '../../../utils/money';
import type { Transaction } from '../../../types/money';
import { TransactionCard } from './TransactionCard';

interface TransactionListProps {
  transactions: Transaction[];
  onSeeAllPress?: () => void;
  onTransactionPress: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
  onAddPress: () => void;
  ListHeaderComponent?: React.ReactElement | null;
}

export function TransactionList({
  transactions,
  onSeeAllPress,
  onTransactionPress,
  onDelete,
  onAddPress,
  ListHeaderComponent,
}: TransactionListProps) {
  const sections = useMemo(() => groupTransactionsForList(transactions), [transactions]);

  const renderItem: ListRenderItem<ListSection> = ({ item, index }) => {
    if (item.type === 'header') {
      return (
        <AppText variant="caption" color="muted" style={styles.sectionTitle}>
          {item.title}
        </AppText>
      );
    }

    return (
      <TransactionCard
        transaction={item.transaction}
        index={index}
        onPress={onTransactionPress}
        onDelete={onDelete}
      />
    );
  };

  return (
    <FlatList
      data={sections}
      keyExtractor={(item) => item.key}
      renderItem={renderItem}
      style={styles.list}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <>
          {ListHeaderComponent}
          <View style={styles.sectionHeaderWrap}>
            <SectionHeader
              title="Recent transactions"
              actionLabel={transactions.length > 0 ? 'See all' : undefined}
              onActionPress={onSeeAllPress}
            />
          </View>
        </>
      }
      ListEmptyComponent={
        <View style={styles.emptyWrap}>
          <EmptyState
            title="No transactions yet"
            description="Start tracking your money by adding your first transaction."
            actionLabel="Add transaction"
            onActionPress={onAddPress}
            icon={<Wallet color={Colors.primary} size={24} strokeWidth={2} />}
          />
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  content: {
    paddingBottom: 120,
    flexGrow: 1,
  },
  sectionHeaderWrap: {
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.lg,
  },
  sectionTitle: {
    paddingHorizontal: Spacing.md,
    marginBottom: 8,
    marginTop: 4,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  emptyWrap: {
    marginHorizontal: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
});
