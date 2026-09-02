import React, { useMemo, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';
import { History } from 'lucide-react-native';
import { Colors, Spacing } from '../../theme';
import { AppText, AppIconButton } from '../../components/ui';
import {
  CALCULATORS,
  getCalculatorById,
  getCalculatorRoute,
  type CalculatorCategoryFilter,
} from '../../constants/calculators';
import { useTools } from '../../context/ToolsContext';
import { CalculatorCard } from './components/CalculatorCard';
import { CalculatorSearch } from './components/CalculatorSearch';
import { CalculatorCategoryTabs } from './components/CalculatorCategoryTabs';

export function ToolsScreen() {
  const router = useRouter();
  const { recentIds, isFavorite, toggleFavorite } = useTools();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<CalculatorCategoryFilter>('All');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return CALCULATORS.filter((calc) => {
      const matchesCategory = category === 'All' || calc.category === category;
      if (!matchesCategory) return false;
      if (!q) return true;
      return (
        calc.title.toLowerCase().includes(q) ||
        calc.description.toLowerCase().includes(q) ||
        calc.category.toLowerCase().includes(q) ||
        calc.keywords.some((k) => k.includes(q))
      );
    });
  }, [search, category]);

  const showFeatured = !search && category === 'All';
  const featured = getCalculatorById('emi');
  const listData = showFeatured ? filtered.filter((c) => c.id !== 'emi') : filtered;

  const openCalculator = (id: string) => {
    router.push(getCalculatorRoute(id) as never);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Animated.View entering={FadeIn.duration(300)} style={styles.header}>
          <View style={styles.headerText}>
            <AppText variant="h2">Tools</AppText>
            <AppText variant="bodySmall" color="secondary">
              Everyday calculators, made simple
            </AppText>
          </View>
          <AppIconButton
            onPress={() => undefined}
            icon={<History color={Colors.textSecondary} size={20} strokeWidth={2} />}
            accessibilityLabel="Recently used"
          />
        </Animated.View>

        <CalculatorSearch value={search} onChange={setSearch} />
        <CalculatorCategoryTabs selected={category} onSelect={setCategory} />

        {showFeatured && featured ? (
          <CalculatorCard
            calculator={featured}
            featured
            onPress={() => openCalculator(featured.id)}
          />
        ) : null}

        {recentIds.length > 0 && showFeatured ? (
          <View style={styles.section}>
            <AppText variant="bodySemiBold" style={styles.sectionTitle}>
              Recently Used
            </AppText>
            {recentIds.map((id, index) => {
              const calc = getCalculatorById(id);
              if (!calc || calc.id === 'emi') return null;
              return (
                <CalculatorCard
                  key={`recent_${id}`}
                  calculator={calc}
                  index={index}
                  isFavorite={isFavorite(calc.id)}
                  onPress={() => openCalculator(calc.id)}
                  onToggleFavorite={() => toggleFavorite(calc.id)}
                />
              );
            })}
          </View>
        ) : null}

        <View style={styles.section}>
          <AppText variant="bodySemiBold" style={styles.sectionTitle}>
            Calculators
          </AppText>
          {listData.length === 0 ? (
            <View style={styles.empty}>
              <AppText variant="body" color="secondary">
                No calculators found
              </AppText>
            </View>
          ) : (
            listData.map((calc, index) => (
              <CalculatorCard
                key={calc.id}
                calculator={calc}
                index={index}
                isFavorite={isFavorite(calc.id)}
                onPress={() => openCalculator(calc.id)}
                onToggleFavorite={() => toggleFavorite(calc.id)}
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingBottom: Spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
  },
  headerText: {
    flex: 1,
    gap: 4,
  },
  section: {
    marginTop: Spacing.lg,
  },
  sectionTitle: {
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
  },
  empty: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
  },
});
