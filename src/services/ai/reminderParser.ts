import { getReminderCategoryById } from '../../constants/reminders';
import type {
  CreateReminderInput,
  ReminderCategoryId,
  ReminderPriority,
  ReminderType,
} from '../../types/reminder';
import { toISODateString } from '../../utils/formatNumber';

export interface ParsedReminderIntent {
  title: string;
  date: string;
  time: string;
  categoryId: ReminderCategoryId;
  categoryName: string;
  type: ReminderType;
  priority: ReminderPriority;
  recurrence?: CreateReminderInput['recurrence'];
}

const WEEKDAYS: Record<string, number> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function resolveCategory(text: string): ReminderCategoryId {
  const lower = text.toLowerCase();
  if (/electric|bill|internet|credit card|utility/.test(lower)) return 'bills';
  if (/rent|emi|insurance|finance|loan|bank/.test(lower)) return 'finance';
  if (/gym|workout|health|doctor|medicine/.test(lower)) return 'health';
  if (/passport|document|license|renew/.test(lower)) return 'documents';
  if (/shop|buy|grocer/.test(lower)) return 'shopping';
  if (/travel|flight|trip/.test(lower)) return 'travel';
  if (/work|office|meeting/.test(lower)) return 'work';
  if (/home|clean|repair/.test(lower)) return 'home';
  return 'personal';
}

function extractTitle(text: string): string {
  let title = text
    .replace(/^(please\s+)?(remind me to|remind me about|set a reminder for|set reminder for)\s+/i, '')
    .replace(/^(please\s+)?(remind me)\s+/i, '')
    .trim();

  title = title
    .replace(/\b(tomorrow|today|tonight)\b.*$/i, '')
    .replace(/\bat\s+\d{1,2}(:\d{2})?\s*(am|pm)?\b.*$/i, '')
    .replace(/\bevery\s+(day|week|month|year|monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b.*$/i, '')
    .replace(/\bevery\s+month\b.*$/i, '')
    .replace(/\bin\s+\d+\s+(hour|hours|minute|minutes)\b.*$/i, '')
    .trim();

  if (!title) return 'Reminder';
  return title.charAt(0).toUpperCase() + title.slice(1);
}

function extractTime(text: string): string {
  const atMatch = text.match(/\bat\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i);
  if (atMatch) {
    let hours = Number(atMatch[1]);
    const minutes = atMatch[2] ? Number(atMatch[2]) : 0;
    const period = atMatch[3]?.toLowerCase();
    if (period === 'pm' && hours < 12) hours += 12;
    if (period === 'am' && hours === 12) hours = 0;
    if (!period && hours <= 12 && /pm/i.test(text)) hours = hours === 12 ? 12 : hours + 12;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  }

  const compact = text.match(/(\d{1,2})\s*(am|pm)/i);
  if (compact) {
    let hours = Number(compact[1]);
    const period = compact[2].toLowerCase();
    if (period === 'pm' && hours < 12) hours += 12;
    if (period === 'am' && hours === 12) hours = 0;
    return `${String(hours).padStart(2, '0')}:00`;
  }

  return '09:00';
}

function extractDate(text: string, now = new Date()): string {
  const lower = text.toLowerCase();
  if (lower.includes('tomorrow')) return toISODateString(addDays(now, 1));
  if (lower.includes('today') || lower.includes('tonight')) return toISODateString(now);

  const inHours = lower.match(/\bin\s+(\d+)\s+hours?\b/);
  if (inHours) {
    const d = new Date(now);
    d.setHours(d.getHours() + Number(inHours[1]));
    return toISODateString(d);
  }

  const dayMatch = lower.match(/\b(\d{1,2})(?:st|nd|rd|th)?\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i);
  if (dayMatch) {
    const months: Record<string, number> = {
      jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
      jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
    };
    const day = Number(dayMatch[1]);
    const month = months[dayMatch[2].toLowerCase()];
    let year = now.getFullYear();
    const candidate = new Date(year, month, day);
    if (candidate.getTime() < now.getTime()) year += 1;
    return toISODateString(new Date(year, month, day));
  }

  return toISODateString(addDays(now, 1));
}

function extractRecurrence(text: string): {
  type: ReminderType;
  recurrence?: CreateReminderInput['recurrence'];
} {
  const lower = text.toLowerCase();
  if (/\bevery\s+day\b/.test(lower)) return { type: 'daily' };
  if (/\bevery\s+week\b/.test(lower)) return { type: 'weekly' };
  if (/\bevery\s+month\b/.test(lower)) {
    const dayMatch = lower.match(/(\d{1,2})(?:st|nd|rd|th)/);
    return {
      type: 'monthly',
      recurrence: { monthDay: dayMatch ? Number(dayMatch[1]) : 1 },
    };
  }
  if (/\bevery\s+year\b/.test(lower)) return { type: 'yearly' };

  for (const [name, weekday] of Object.entries(WEEKDAYS)) {
    if (new RegExp(`every\\s+${name}`, 'i').test(lower)) {
      return { type: 'weekly', recurrence: { weekday } };
    }
  }

  return { type: 'one-time' };
}

export function parseReminderIntent(text: string, now = new Date()): ParsedReminderIntent {
  const categoryId = resolveCategory(text);
  const category = getReminderCategoryById(categoryId)!;
  const { type, recurrence } = extractRecurrence(text);

  return {
    title: extractTitle(text),
    date: extractDate(text, now),
    time: extractTime(text),
    categoryId,
    categoryName: category.name,
    type,
    priority: 'medium',
    recurrence,
  };
}

import { formatReminderDateLabel, formatReminderTime } from '../../utils/reminderDate';

export function formatParsedReminderSummary(parsed: ParsedReminderIntent): string {
  return `${parsed.title}\n${formatReminderDateLabel(parsed.date)} · ${formatReminderTime(parsed.time)}`;
}
