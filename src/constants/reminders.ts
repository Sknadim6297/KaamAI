import {
  Receipt,
  Wallet,
  Home,
  HeartPulse,
  Briefcase,
  User,
  ShoppingBag,
  Plane,
  FileText,
  MoreHorizontal,
  LucideIcon,
} from 'lucide-react-native';
import { Colors } from '../theme';
import type { ReminderCategoryId } from '../types/reminder';

export interface ReminderCategoryDefinition {
  id: ReminderCategoryId;
  name: string;
  iconKey: string;
  color: string;
  bgColor: string;
}

export const REMINDER_CATEGORIES: ReminderCategoryDefinition[] = [
  { id: 'bills', name: 'Bills', iconKey: 'receipt', color: Colors.warning, bgColor: Colors.warningLight },
  { id: 'finance', name: 'Finance', iconKey: 'wallet', color: Colors.primary, bgColor: Colors.primarySubtle },
  { id: 'home', name: 'Home', iconKey: 'home', color: Colors.info, bgColor: Colors.infoLight },
  { id: 'health', name: 'Health', iconKey: 'heart-pulse', color: Colors.danger, bgColor: Colors.dangerLight },
  { id: 'work', name: 'Work', iconKey: 'briefcase', color: Colors.textSecondary, bgColor: Colors.borderLight },
  { id: 'personal', name: 'Personal', iconKey: 'user', color: Colors.primaryDark, bgColor: Colors.primarySubtle },
  { id: 'shopping', name: 'Shopping', iconKey: 'shopping-bag', color: Colors.info, bgColor: Colors.infoLight },
  { id: 'travel', name: 'Travel', iconKey: 'plane', color: Colors.success, bgColor: Colors.successLight },
  { id: 'documents', name: 'Documents', iconKey: 'file-text', color: Colors.warning, bgColor: Colors.warningLight },
  { id: 'other', name: 'Other', iconKey: 'more', color: Colors.textMuted, bgColor: Colors.borderLight },
];

const ICON_MAP: Record<string, LucideIcon> = {
  receipt: Receipt,
  wallet: Wallet,
  home: Home,
  'heart-pulse': HeartPulse,
  briefcase: Briefcase,
  user: User,
  'shopping-bag': ShoppingBag,
  plane: Plane,
  'file-text': FileText,
  more: MoreHorizontal,
};

export function getReminderCategoryById(id: ReminderCategoryId): ReminderCategoryDefinition | undefined {
  return REMINDER_CATEGORIES.find((c) => c.id === id);
}

export function getReminderCategoryIcon(iconKey: string): LucideIcon {
  return ICON_MAP[iconKey] ?? MoreHorizontal;
}

export const REMINDER_TYPE_LABELS: Record<string, string> = {
  'one-time': 'Does not repeat',
  daily: 'Every day',
  weekly: 'Every week',
  monthly: 'Every month',
  yearly: 'Every year',
  custom: 'Custom',
};

export const REMINDER_PRIORITY_LABELS: Record<string, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};
