import React, { useState } from 'react';
import { parseNonNegative, parseStrictPositive } from '../../../utils/formatNumber';
import {
  calculateSalary,
  salaryToResult,
  validateSalaryInput,
} from '../../../services/calculators';
import type { CalculatorResult } from '../../../types/calculator';
import { CalculatorScreenLayout } from '../components/CalculatorScreenLayout';
import { CalculatorInput } from '../components/CalculatorInput';

export default function SalaryCalculatorScreen() {
  const [gross, setGross] = useState('');
  const [basic, setBasic] = useState('');
  const [hra, setHra] = useState('');
  const [allowances, setAllowances] = useState('');
  const [pf, setPf] = useState('');
  const [professionalTax, setProfessionalTax] = useState('');
  const [otherDeductions, setOtherDeductions] = useState('');
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const reset = () => {
    setGross('');
    setBasic('');
    setHra('');
    setAllowances('');
    setPf('');
    setProfessionalTax('');
    setOtherDeductions('');
    setResult(null);
    setFormError(null);
  };

  const calculate = () => {
    const grossSalary = parseStrictPositive(gross);
    const validation = validateSalaryInput({ grossSalary: grossSalary ?? 0 });
    if (!validation.valid || grossSalary === null) {
      setFormError(validation.error ?? 'Please enter a valid gross salary.');
      setResult(null);
      return;
    }
    const output = calculateSalary({
      grossSalary,
      basicSalary: parseNonNegative(basic) ?? undefined,
      hra: parseNonNegative(hra) ?? undefined,
      otherAllowances: parseNonNegative(allowances) ?? undefined,
      pf: parseNonNegative(pf) ?? undefined,
      professionalTax: parseNonNegative(professionalTax) ?? undefined,
      otherDeductions: parseNonNegative(otherDeductions) ?? undefined,
    });
    setFormError(null);
    setResult(salaryToResult(output));
  };

  return (
    <CalculatorScreenLayout
      calculatorId="salary"
      title="Salary Calculator"
      subtitle="Estimate in-hand salary"
      onCalculate={calculate}
      onReset={reset}
      result={result}
      formError={formError}
    >
      <CalculatorInput
        label="Monthly Gross / CTC"
        value={gross}
        onChangeText={setGross}
        placeholder="₹50,000"
        keyboardType="decimal-pad"
      />
      <CalculatorInput label="Basic Salary (optional)" value={basic} onChangeText={setBasic} keyboardType="decimal-pad" />
      <CalculatorInput label="HRA (optional)" value={hra} onChangeText={setHra} keyboardType="decimal-pad" />
      <CalculatorInput label="Other Allowances (optional)" value={allowances} onChangeText={setAllowances} keyboardType="decimal-pad" />
      <CalculatorInput label="PF (optional)" value={pf} onChangeText={setPf} keyboardType="decimal-pad" />
      <CalculatorInput label="Professional Tax (optional)" value={professionalTax} onChangeText={setProfessionalTax} keyboardType="decimal-pad" />
      <CalculatorInput label="Other Deductions (optional)" value={otherDeductions} onChangeText={setOtherDeductions} keyboardType="decimal-pad" />
    </CalculatorScreenLayout>
  );
}
