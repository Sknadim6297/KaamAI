import React from 'react';
import { View, StyleSheet, Modal, Pressable, ScrollView } from 'react-native';
import { X } from 'lucide-react-native';
import { Colors, Radius, Spacing } from '../../../theme';
import { AppText, PressableScale } from '../../../components/ui';
import { getCategoriesByType, getCategoryIcon } from '../../../constants/categories';
import type { CategoryId, TransactionType } from '../../../types/money';

interface CategorySelectorProps {
  visible: boolean;
  type: TransactionType;
  selectedId: CategoryId | null;
  onSelect: (id: CategoryId) => void;
  onClose: () => void;
}

export function CategorySelector({
  visible,
  type,
  selectedId,
  onSelect,
  onClose,
}: CategorySelectorProps) {
  const categories = getCategoriesByType(type);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <View style={styles.handle} />
          <View style={styles.header}>
            <AppText variant="h3">Select category</AppText>
            <PressableScale
              onPress={onClose}
              style={styles.closeBtn}
              accessibilityRole="button"
              accessibilityLabel="Close category selector"
            >
              <X color={Colors.textSecondary} size={20} strokeWidth={2} />
            </PressableScale>
          </View>

          <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
            {categories.map((cat) => {
              const Icon = getCategoryIcon(cat.iconKey);
              const selected = selectedId === cat.id;
              return (
                <PressableScale
                  key={cat.id}
                  onPress={() => {
                    onSelect(cat.id);
                    onClose();
                  }}
                  style={[styles.item, selected && styles.itemSelected]}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  accessibilityLabel={cat.name}
                >
                  <View style={[styles.icon, { backgroundColor: cat.bgColor }]}>
                    <Icon color={cat.color} size={20} strokeWidth={2} />
                  </View>
                  <AppText
                    variant="bodySmall"
                    style={{
                      fontWeight: selected ? '700' : '500',
                      color: selected ? Colors.primary : Colors.text,
                    }}
                  >
                    {cat.name}
                  </AppText>
                </PressableScale>
              );
            })}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Radius['2xl'],
    borderTopRightRadius: Radius['2xl'],
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xl,
    maxHeight: '70%',
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
    marginTop: 10,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  closeBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    paddingBottom: Spacing.lg,
  },
  item: {
    width: '31%',
    flexGrow: 1,
    minWidth: '30%',
    backgroundColor: Colors.background,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderColor: Colors.borderLight,
    minHeight: 88,
  },
  itemSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primarySubtle,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
