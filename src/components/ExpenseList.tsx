/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
// Fix: Use 'import type' for type-only imports from declaration files.
import type { Expense } from '../types/index.d.ts';
import { formatDate } from '../utils/calculations.ts';
import { categoryConfigMap } from '../constants/categories.ts';

interface ExpenseListProps {
    expenses: Expense[];
    deleteExpenses: (ids: string[]) => void;
    selectedIds: Set<string>;
    setSelectedIds: React.Dispatch<React.SetStateAction<Set<string>>>;
    onEdit: (expense: Expense) => void;
}

const ExpenseList = ({ expenses, deleteExpenses, selectedIds, setSelectedIds, onEdit }: ExpenseListProps) => {
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(new Set(expenses.map(exp => exp.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectOne = (id: string) => {
    const newSelection = new Set(selectedIds);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedIds(newSelection);
  };

  return (
    <div className="list-card card">
      <h2 className="card-title">Expense History</h2>
      <div className="expense-list">
        {expenses.length === 0 ? (
          <div className="empty-state">
            <i className="las la-receipt"></i>
            <p>No expenses match your current filters.</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th><input type="checkbox" onChange={handleSelectAll} checked={expenses.length > 0 && selectedIds.size === expenses.length} aria-label="Select all expenses"/></th>
                <th>Description</th>
                <th>Category</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map(expense => (
                <tr key={expense.id} className={selectedIds.has(expense.id) ? 'selected' : ''}>
                  <td><input type="checkbox" checked={selectedIds.has(expense.id)} onChange={() => handleSelectOne(expense.id)}/></td>
                  <td>{expense.description}</td>
                  <td>
                    <span 
                      className="category-tag" 
                      style={{backgroundColor: categoryConfigMap[expense.category]?.color || '#6c757d'}}
                    >
                      <i className={categoryConfigMap[expense.category]?.icon}></i> {expense.category}
                    </span>
                  </td>
                  <td>{formatDate(expense.date)}</td>
                  <td className="amount-cell">${expense.amount.toFixed(2)}</td>
                  <td className="action-cell">
                    <button onClick={() => onEdit(expense)} className="btn-icon" aria-label={`Edit ${expense.description}`}>
                      <i className="las la-pen"></i>
                    </button>
                    <button onClick={() => deleteExpenses([expense.id])} className="btn-icon btn-danger" aria-label={`Delete ${expense.description}`}>
                      <i className="las la-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ExpenseList;