import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { Colors, Spacing } from '../../theme';
import { useMoney } from '../../context/MoneyContext';
import { useReminders } from '../../context/RemindersContext';
import { HomeHeader } from './components/HomeHeader';
import { AISearchCard } from './components/AISearchCard';
import { MoneySummaryCard } from './components/MoneySummaryCard';
import { QuickActions } from './components/QuickActions';
import { UpcomingReminders } from '../reminders/components/UpcomingReminders';
import { DailyInsight } from './components/DailyInsight';

export function HomeScreen() {
  const router = useRouter();
  const { summary, transactions, openAddSheet } = useMoney();
  const { openAddSheet: openReminderSheet } = useReminders();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Animated.View entering={FadeIn.duration(350)} style={styles.container}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces
        >
          <HomeHeader userName="User" notificationCount={3} />

          <AISearchCard />

          <MoneySummaryCard
            balance={summary.balance}
            income={summary.income}
            expense={summary.expense}
            monthlyBudget={summary.monthlyBudget}
            hasTransactions={transactions.length > 0}
            onPress={() => router.push('/(tabs)/money')}
            onAddExpensePress={() => {
              openAddSheet('expense');
              router.push('/(tabs)/money');
            }}
          />

          <QuickActions
            onActionPress={(id) => {
              if (id === 'expense') {
                openAddSheet('expense');
                router.push('/(tabs)/money');
                return;
              }
              if (id === 'reminder') {
                openReminderSheet();
                router.push('/reminders');
                return;
              }
              router.push('/(tabs)/tools');
            }}
          />

          <UpcomingReminders />

          <DailyInsight />

          <View style={styles.bottomPad} />
        </ScrollView>
      </Animated.View>
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: Spacing.sm,
  },
  bottomPad: {
    height: Spacing.md,
  },
});
