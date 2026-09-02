export type CalculatorId =
  | 'emi'
  | 'percentage'
  | 'discount'
  | 'gst'
  | 'age'
  | 'bmi'
  | 'sip'
  | 'fd'
  | 'salary'
  | 'split-bill'
  | 'date-difference'
  | 'fuel-cost';

export type CalculatorCategory = 'Money' | 'Finance' | 'Health' | 'Utility';

export interface CalculatorDefinition {
  id: CalculatorId;
  title: string;
  description: string;
  category: CalculatorCategory;
  iconKey: string;
  keywords: string[];
}

export interface CalculatorResultRow {
  label: string;
  value: string;
  highlight?: boolean;
}

export interface CalculatorResult {
  title: string;
  primaryValue: string;
  primaryLabel?: string;
  rows: CalculatorResultRow[];
  note?: string;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
}
