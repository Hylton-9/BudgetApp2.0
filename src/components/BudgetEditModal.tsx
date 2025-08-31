/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface BudgetEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (newBudget: number) => void;
    currentBudget: number;
}

const BudgetEditModal = ({ isOpen, onClose, onSave, currentBudget }: BudgetEditModalProps) => {
    const [tempBudget, setTempBudget] = React.useState(currentBudget.toString());
    const modalRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        setTempBudget(currentBudget.toString());
    }, [isOpen, currentBudget]);

    React.useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEsc);
        }
        return () => document.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    const handleSave = () => {
        onSave(parseFloat(tempBudget) || 0);
    };
    
    const handleOverlayClick = (e: React.MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
            onClose();
        }
    };

    if (!isOpen) return null;

    const budgetValue = parseFloat(tempBudget) || 0;
    const sliderMax = Math.max(2000, currentBudget * 2);

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-content" ref={modalRef} role="dialog" aria-modal="true" aria-labelledby="modal-title">
                <div className="modal-header">
                    <h2 id="modal-title" className="card-title"><i className="las la-coins"></i> Edit Monthly Budget</h2>
                    <button onClick={onClose} className="btn-icon" aria-label="Close"><i className="las la-times"></i></button>
                </div>
                <div className="modal-body">
                    <div className="form-group">
                        <label htmlFor="budget-input">Budget Amount ($)</label>
                        <input
                            id="budget-input"
                            type="number"
                            value={tempBudget}
                            onChange={(e) => setTempBudget(e.target.value)}
                            placeholder="e.g., 1000"
                            min="0"
                            step="50"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="budget-slider">Budget Slider</label>
                        <input
                            id="budget-slider"
                            type="range"
                            min="0"
                            max={sliderMax}
                            step="50"
                            value={budgetValue}
                            onChange={(e) => setTempBudget(e.target.value)}
                        />
                    </div>
                </div>
                <div className="modal-footer">
                    <button onClick={onClose} className="btn">Cancel</button>
                    <button onClick={handleSave} className="btn btn-primary"><i className="las la-save"></i> Save Budget</button>
                </div>
            </div>
        </div>
    );
};

export default BudgetEditModal;
