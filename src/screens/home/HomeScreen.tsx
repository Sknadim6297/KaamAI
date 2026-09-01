import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Colors, Spacing } from '../../theme';
import { HomeHeader } from './components/HomeHeader';
import { AISearchCard } from './components/AISearchCard';
import { MoneySummaryCard } from './components/MoneySummaryCard';
import { QuickActions } from './components/QuickActions';
import { UpcomingReminders } from './components/UpcomingReminders';
import { DailyInsight } from './components/DailyInsight';

/** Toggle to preview first-time user empty state (no storage wired yet). */
const HAS_TRANSACTIONS = true;

export function HomeScreen() {
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
            balance={12500}
            income={16000}
            expense={3500}
            monthlyBudget={12000}
            hasTransactions={HAS_TRANSACTIONS}
          />

          <QuickActions />

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
