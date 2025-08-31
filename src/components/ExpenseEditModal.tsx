/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
// Fix: Use 'import type' for type-only imports from declaration files.
import type { Expense } from '../types/index.d.ts';
import CategorySelect from './CategorySelect.tsx';

interface ExpenseEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (expense: Expense) => void;
    expense: Expense | null;
}

const ExpenseEditModal = ({ isOpen, onClose, onSave, expense }: ExpenseEditModalProps) => {
    const [description, setDescription] = React.useState('');
    const [amount, setAmount] = React.useState('');
    const [category, setCategory] = React.useState('');
    const [date, setDate] = React.useState('');
    const modalRef = React.useRef<HTMLFormElement>(null);

    React.useEffect(() => {
        if (expense) {
            setDescription(expense.description);
            setAmount(expense.amount.toString());
            setCategory(expense.category);
            setDate(expense.date);
        }
    }, [expense]);

    React.useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        if (isOpen) document.addEventListener('keydown', handleEsc);
        return () => document.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (expense) {
             onSave({ ...expense, description, amount: parseFloat(amount), category, date });
        }
    };

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
            onClose();
        }
    };

    if (!isOpen || !expense) return null;

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <form className="modal-content" ref={modalRef} onSubmit={handleSave} role="dialog" aria-modal="true" aria-labelledby="edit-modal-title">
                <div className="modal-header">
                    <h2 id="edit-modal-title" className="card-title"><i className="las la-pen"></i> Edit Expense</h2>
                    <button type="button" onClick={onClose} className="btn-icon" aria-label="Close"><i className="las la-times"></i></button>
                </div>
                <div className="modal-body expense-form">
                     <div className="form-group">
                        <label htmlFor="edit-description">Description</label>
                        <input id="edit-description" type="text" value={description} onChange={(e) => setDescription(e.target.value)} required />
                      </div>
                      <div className="form-group">
                        <label htmlFor="edit-amount">Amount ($)</label>
                        <input id="edit-amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} min="0.01" step="0.01" required />
                      </div>
                      <div className="form-group">
                        <label htmlFor="edit-category">Category</label>
                         <CategorySelect value={category} onChange={setCategory} />
                      </div>
                      <div className="form-group">
                        <label htmlFor="edit-date">Date</label>
                        <input id="edit-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                      </div>
                </div>
                <div className="modal-footer">
                    <button type="button" onClick={onClose} className="btn">Cancel</button>
                    <button type="submit" className="btn btn-primary"><i className="las la-save"></i> Save Changes</button>
                </div>
            </form>
        </div>
    );
};

export default ExpenseEditModal;