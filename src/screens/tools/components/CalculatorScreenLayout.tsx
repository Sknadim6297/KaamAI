import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing } from '../../../theme';
import { AppButton, AppText } from '../../../components/ui';
import type { CalculatorId, CalculatorResult } from '../../../types/calculator';
import { useTools } from '../../../context/ToolsContext';
import { CalculatorHeader } from './CalculatorHeader';
import { CalculatorResultCard } from './CalculatorResultCard';

interface CalculatorScreenLayoutProps {
  calculatorId: CalculatorId;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onCalculate: () => void;
  onReset: () => void;
  result: CalculatorResult | null;
  formError?: string | null;
}

export function CalculatorScreenLayout({
  calculatorId,
  title,
  subtitle,
  children,
  onCalculate,
  onReset,
  result,
  formError,
}: CalculatorScreenLayoutProps) {
  const { trackRecent } = useTools();

  useEffect(() => {
    trackRecent(calculatorId);
  }, [calculatorId, trackRecent]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}
      >
        <CalculatorHeader title={title} subtitle={subtitle} />
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.form}>{children}</View>

          <View style={styles.actions}>
            <AppButton label="Calculate" onPress={onCalculate} fullWidth />
            <AppButton label="Reset" variant="outline" onPress={onReset} fullWidth />
          </View>

          {formError ? (
            <AppText variant="bodySmall" color="danger" style={styles.formError}>
              {formError}
            </AppText>
          ) : null}

          {result ? <CalculatorResultCard result={result} /> : null}
        </ScrollView>
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
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: Spacing.xl,
    gap: Spacing.md,
  },
  form: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.md,
    marginTop: Spacing.md,
  },
  actions: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  formError: {
    paddingHorizontal: Spacing.md,
  },
});
