import {
  Utensils,
  Car,
  ShoppingBag,
  Lightbulb,
  Smartphone,
  Clapperboard,
  HeartPulse,
  GraduationCap,
  MoreHorizontal,
  Briefcase,
  Laptop,
  Building2,
  TrendingUp,
  LucideIcon,
} from 'lucide-react-native';
import { Colors } from '../theme';
import type { CategoryDefinition, CategoryId, TransactionType } from '../types/money';

export const CATEGORIES: CategoryDefinition[] = [
  {
    id: 'food',
    name: 'Food',
    type: 'expense',
    iconKey: 'utensils',
    color: Colors.danger,
    bgColor: Colors.dangerLight,
  },
  {
    id: 'travel',
    name: 'Travel',
    type: 'expense',
    iconKey: 'car',
    color: Colors.info,
    bgColor: Colors.infoLight,
  },
  {
    id: 'shopping',
    name: 'Shopping',
    type: 'expense',
    iconKey: 'shopping-bag',
    color: Colors.primary,
    bgColor: Colors.primarySubtle,
  },
  {
    id: 'bills',
    name: 'Bills',
    type: 'expense',
    iconKey: 'lightbulb',
    color: Colors.warning,
    bgColor: Colors.warningLight,
  },
  {
    id: 'recharge',
    name: 'Recharge',
    type: 'expense',
    iconKey: 'smartphone',
    color: Colors.info,
    bgColor: Colors.infoLight,
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    type: 'expense',
    iconKey: 'clapperboard',
    color: Colors.primaryDark,
    bgColor: Colors.primarySubtle,
  },
  {
    id: 'health',
    name: 'Health',
    type: 'expense',
    iconKey: 'heart-pulse',
    color: Colors.danger,
    bgColor: Colors.dangerLight,
  },
  {
    id: 'education',
    name: 'Education',
    type: 'expense',
    iconKey: 'graduation-cap',
    color: Colors.info,
    bgColor: Colors.infoLight,
  },
  {
    id: 'expense_other',
    name: 'Other',
    type: 'expense',
    iconKey: 'more',
    color: Colors.textSecondary,
    bgColor: Colors.borderLight,
  },
  {
    id: 'salary',
    name: 'Salary',
    type: 'income',
    iconKey: 'briefcase',
    color: Colors.success,
    bgColor: Colors.successLight,
  },
  {
    id: 'freelance',
    name: 'Freelance',
    type: 'income',
    iconKey: 'laptop',
    color: Colors.success,
    bgColor: Colors.successLight,
  },
  {
    id: 'business',
    name: 'Business',
    type: 'income',
    iconKey: 'building',
    color: Colors.success,
    bgColor: Colors.successLight,
  },
  {
    id: 'investment',
    name: 'Investment',
    type: 'income',
    iconKey: 'trending-up',
    color: Colors.success,
    bgColor: Colors.successLight,
  },
  {
    id: 'income_other',
    name: 'Other',
    type: 'income',
    iconKey: 'more',
    color: Colors.textSecondary,
    bgColor: Colors.borderLight,
  },
];

const ICON_MAP: Record<string, LucideIcon> = {
  utensils: Utensils,
  car: Car,
  'shopping-bag': ShoppingBag,
  lightbulb: Lightbulb,
  smartphone: Smartphone,
  clapperboard: Clapperboard,
  'heart-pulse': HeartPulse,
  'graduation-cap': GraduationCap,
  more: MoreHorizontal,
  briefcase: Briefcase,
  laptop: Laptop,
  building: Building2,
  'trending-up': TrendingUp,
};

export function getCategoryById(id: CategoryId): CategoryDefinition | undefined {
  return CATEGORIES.find((c) => c.id === id);
}

export function getCategoriesByType(type: TransactionType): CategoryDefinition[] {
  return CATEGORIES.filter((c) => c.type === type);
}

export function getCategoryIcon(iconKey: string): LucideIcon {
  return ICON_MAP[iconKey] ?? MoreHorizontal;
}
