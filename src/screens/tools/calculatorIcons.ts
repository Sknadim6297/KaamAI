import {
  Landmark,
  Percent,
  Tag,
  Receipt,
  Calendar,
  HeartPulse,
  TrendingUp,
  PiggyBank,
  Wallet,
  Users,
  CalendarRange,
  Fuel,
  LucideIcon,
} from 'lucide-react-native';

const ICON_MAP: Record<string, LucideIcon> = {
  landmark: Landmark,
  percent: Percent,
  tag: Tag,
  receipt: Receipt,
  calendar: Calendar,
  'heart-pulse': HeartPulse,
  'trending-up': TrendingUp,
  'piggy-bank': PiggyBank,
  wallet: Wallet,
  users: Users,
  'calendar-range': CalendarRange,
  fuel: Fuel,
};

export function getCalculatorIcon(iconKey: string): LucideIcon {
  return ICON_MAP[iconKey] ?? Percent;
}
