/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Fix: Use 'import type' for type-only imports from declaration files.
import type { Expense } from '../types/index.d.ts';

const triggerDownload = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

export const exportToCsv = (expenses: Expense[]) => {
    const headers = ['id', 'description', 'amount', 'category', 'date'];
    const csvRows = [
        headers.join(','),
        ...expenses.map(exp => 
            [
                exp.id,
                `"${exp.description.replace(/"/g, '""')}"`,
                exp.amount,
                exp.category,
                exp.date
            ].join(',')
        )
    ];
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    triggerDownload(blob, `expenses-${new Date().toISOString().split('T')[0]}.csv`);
};

export const exportToJson = (expenses: Expense[]) => {
    const jsonString = JSON.stringify(expenses, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8;' });
    triggerDownload(blob, `expenses-${new Date().toISOString().split('T')[0]}.json`);
};