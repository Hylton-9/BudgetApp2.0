/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import type { Expense } from '../types/index.d.ts';
import { CATEGORIES_CONFIG } from '../constants/categories.ts';
import CategorySelect from './CategorySelect.tsx';

interface ExpenseFormProps {
    addExpense: (expense: Omit<Expense, 'id'>) => void;
}

const ExpenseForm = ({ addExpense }: ExpenseFormProps) => {
  const [description, setDescription] = React.useState('');
  const [amount, setAmount] = React.useState('');
  const [category, setCategory] = React.useState(CATEGORIES_CONFIG[0].name);
  const [date, setDate] = React.useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || parseFloat(amount) <= 0) {
      alert("Please fill in all fields with valid values.");
      return;
    }
    addExpense({
      description,
      amount: parseFloat(amount),
      category,
      date,
    });
    // Reset form
    setDescription('');
    setAmount('');
    setCategory(CATEGORIES_CONFIG[0].name);
    setDate(new Date().toISOString().split('T')[0]);
  };

  return (
    <div className="form-card card">
       <h2 className="card-title"><i className="las la-plus-circle"></i> Add New Expense</h2>
        <form onSubmit={handleSubmit} className="expense-form">
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <input id="description" type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="e.g., Coffee" required />
          </div>
          <div className="form-group">
            <label htmlFor="amount">Amount ($)</label>
            <input id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" min="0.01" step="0.01" required />
          </div>
          <div className="form-group">
            <label htmlFor="category">Category</label>
             <CategorySelect value={category} onChange={setCategory} />
          </div>
          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary"><i className="las la-plus-circle"></i> Add Expense</button>
        </form>
    </div>
  );
};

export default ExpenseForm;
