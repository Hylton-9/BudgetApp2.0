/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Fix: Use 'import type' for type-only imports from declaration files.
import type { Expense } from '../types/index.d.ts';

export const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  // Add timezone offset to prevent date from shifting
  const userTimezoneOffset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() + userTimezoneOffset).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export const calculateTotalSpent = (expenses: Expense[]): number => {
  return expenses.reduce((sum, exp) => sum + exp.amount, 0);
};

export const filterExpenses = (
    expenses: Expense[],
    filters: { text: string; categories: string[]; startDate: string; endDate: string }
): Expense[] => {
    return expenses.filter(exp => {
      const expDate = new Date(exp.date);
      const startDate = filters.startDate ? new Date(filters.startDate) : null;
      const endDate = filters.endDate ? new Date(filters.endDate) : null;
      if (startDate) startDate.setHours(0,0,0,0);
      if (endDate) endDate.setHours(23,59,59,999);

      const textMatch = exp.description.toLowerCase().includes(filters.text.toLowerCase());
      const categoryMatch = filters.categories.length === 0 || filters.categories.includes(exp.category);
      const startDateMatch = !startDate || expDate >= startDate;
      const endDateMatch = !endDate || expDate <= endDate;
      
      return textMatch && categoryMatch && startDateMatch && endDateMatch;
    });
};