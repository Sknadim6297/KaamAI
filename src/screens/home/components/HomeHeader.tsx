import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Bell } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { Colors, Spacing } from '../../../theme';
import { AppText, AppIconButton } from '../../../components/ui';

interface HomeHeaderProps {
  userName?: string;
  notificationCount?: number;
  onNotificationPress?: () => void;
  onProfilePress?: () => void;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.charAt(0).toUpperCase() || 'U';
}

export function HomeHeader({
  userName = 'User',
  notificationCount = 3,
  onNotificationPress,
  onProfilePress,
}: HomeHeaderProps) {
  const router = useRouter();
  const initials = getInitials(userName);

  const handleProfilePress = () => {
    if (onProfilePress) {
      onProfilePress();
    } else {
      router.push('/(tabs)/profile');
    }
  };

  return (
    <Animated.View
      entering={FadeInDown.duration(500).springify()}
      style={styles.container}
    >
      <View style={styles.left}>
        <AppText variant="bodySmall" color="secondary">
          {getGreeting()} 👋
        </AppText>
        <AppText variant="h2" style={styles.name}>
          {userName}
        </AppText>
      </View>

      <View style={styles.actions}>
        <View style={styles.notificationWrap}>
          <AppIconButton
            onPress={onNotificationPress}
            icon={<Bell color={Colors.textSecondary} size={22} strokeWidth={2} />}
            variant="default"
            size="md"
            style={styles.iconButton}
            accessibilityLabel="Notifications"
            accessibilityHint={
              notificationCount > 0
                ? `${notificationCount} unread notifications`
                : 'No unread notifications'
            }
          />
          {notificationCount > 0 ? (
            <View style={styles.badge} accessibilityElementsHidden>
              <AppText variant="caption" style={styles.badgeText}>
                {notificationCount > 9 ? '9+' : notificationCount}
              </AppText>
            </View>
          ) : null}
        </View>

        <AppIconButton
          onPress={handleProfilePress}
          icon={
            <AppText variant="bodySemiBold" color="primary">
              {initials}
            </AppText>
          }
          variant="default"
          size="md"
          style={styles.avatarButton}
          accessibilityLabel="Profile"
          accessibilityHint="Open profile"
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xs,
  },
  left: {
    gap: 2,
    flex: 1,
  },
  name: {
    marginTop: 2,
    fontSize: 24,
    lineHeight: 30,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  notificationWrap: {
    position: 'relative',
  },
  iconButton: {
    backgroundColor: Colors.surface,
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: Colors.surface,
  },
  badgeText: {
    color: Colors.white,
    fontSize: 9,
    fontWeight: '700',
    lineHeight: 12,
  },
  avatarButton: {
    backgroundColor: Colors.primarySubtle,
  },
});
