import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { Colors, Spacing } from '../../../theme';
import { AppText, AppIconButton } from '../../../components/ui';

interface CalculatorHeaderProps {
  title: string;
  subtitle?: string;
}

export function CalculatorHeader({ title, subtitle }: CalculatorHeaderProps) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <AppIconButton
        onPress={() => router.back()}
        icon={<ChevronLeft color={Colors.text} size={22} strokeWidth={2.5} />}
        variant="ghost"
        accessibilityLabel="Go back"
        style={styles.back}
      />
      <View style={styles.text}>
        <AppText variant="h2">{title}</AppText>
        {subtitle ? (
          <AppText variant="bodySmall" color="secondary">
            {subtitle}
          </AppText>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    gap: 4,
  },
  back: {
    marginTop: 2,
  },
  text: {
    flex: 1,
    gap: 4,
    paddingTop: 4,
  },
});
