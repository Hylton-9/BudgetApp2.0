/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import ThemeToggle from './ThemeToggle.tsx';

interface HeaderProps {
    budget: number;
    onEdit: () => void;
}

const Header = ({ budget, onEdit }: HeaderProps) => {
    return (
        <header className="app-header">
            <h1><i className="las la-wallet"></i> Hylton's Personal Budget Tracker</h1>
            <div className="header-controls">
                <div className="budget-setter">
                    <span className="budget-label">Monthly Budget:</span>
                    <div className="budget-display">
                        <span className="budget-value">${budget.toFixed(2)}</span>
                        <button onClick={onEdit} className="btn-icon btn-edit" aria-label="Edit Budget"><i className="las la-pen"></i></button>
                    </div>
                </div>
                 <ThemeToggle />
            </div>
        </header>
    );
};

export default Header;
