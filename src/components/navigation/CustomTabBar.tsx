import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Home, Wallet, Sparkles, Wrench, User } from 'lucide-react-native';
import { Colors, Shadows } from '../../theme';
import { AppText } from '../ui/AppText';

const TAB_ICONS: Record<string, React.FC<{ color: string; size: number }>> = {
  index: ({ color, size }) => <Home color={color} size={size} strokeWidth={2} />,
  money: ({ color, size }) => <Wallet color={color} size={size} strokeWidth={2} />,
  ai: ({ color, size }) => <Sparkles color={color} size={size} strokeWidth={2} />,
  tools: ({ color, size }) => <Wrench color={color} size={size} strokeWidth={2} />,
  profile: ({ color, size }) => <User color={color} size={size} strokeWidth={2} />,
};

const TAB_LABELS: Record<string, string> = {
  index: 'Home',
  money: 'Money',
  ai: 'AI',
  tools: 'Tools',
  profile: 'Profile',
};

interface TabItemProps {
  route: { name: string; key: string };
  isFocused: boolean;
  onPress: () => void;
  onLongPress: () => void;
}

function TabItem({ route, isFocused, onPress, onLongPress }: TabItemProps) {
  const scale = useSharedValue(1);
  const isAI = route.name === 'ai';

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.88, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const IconComponent = TAB_ICONS[route.name];
  const label = TAB_LABELS[route.name] ?? route.name;
  const activeColor = isAI ? Colors.white : Colors.primary;
  const inactiveColor = Colors.textMuted;

  if (isAI) {
    return (
      <TouchableOpacity
        onPress={onPress}
        onLongPress={onLongPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.aiTabWrapper}
        activeOpacity={0.9}
      >
        <Animated.View style={[styles.aiButton, animatedStyle]}>
          {IconComponent && <IconComponent color={Colors.white} size={22} />}
        </Animated.View>
        <AppText
          variant="caption"
          style={{ ...styles.label, color: isFocused ? Colors.primary : Colors.textMuted }}
        >
          {label}
        </AppText>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={styles.tabItem}
      activeOpacity={0.7}
    >
      <Animated.View style={[styles.iconWrapper, animatedStyle]}>
        {isFocused && <View style={styles.activeDot} />}
        {IconComponent && (
          <IconComponent
            color={isFocused ? activeColor : inactiveColor}
            size={22}
          />
        )}
      </Animated.View>
      <AppText
        variant="caption"
        style={{ ...styles.label, color: isFocused ? Colors.primary : inactiveColor }}
      >
        {label}
      </AppText>
    </TouchableOpacity>
  );
}

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 4 }]}>
      {(state.routes as Array<{ name: string; key: string }>).map((route, index) => {
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({ type: 'tabLongPress', target: route.key });
        };

        return (
          <TabItem
            key={route.key}
            route={route}
            isFocused={isFocused}
            onPress={onPress}
            onLongPress={onLongPress}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    paddingTop: 10,
    paddingHorizontal: 8,
    ...Shadows.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 3,
  },
  activeDot: {
    position: 'absolute',
    top: -6,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.primary,
  },
  label: {
    fontWeight: '600',
  },
  aiTabWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  aiButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 3,
    marginTop: -20,
    ...Shadows.primary,
  },
});
