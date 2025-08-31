/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

const BudgetProgressBar = ({ total, budget }: { total: number; budget: number }) => {
    const percentage = budget > 0 ? (total / budget) * 100 : 0;
    const cappedPercentage = Math.min(percentage, 100);

    let progressBarClass = 'normal';
    if (percentage > 90) {
        progressBarClass = 'danger';
    } else if (percentage > 70) {
        progressBarClass = 'warning';
    }

    return (
        <div className="progress-bar-container">
            <div className="progress-bar-info">
                <span>Spent: ${total.toFixed(2)}</span>
                <span>Budget: ${budget.toFixed(2)}</span>
            </div>
            <div className="progress-bar" role="progressbar" aria-valuenow={percentage} aria-valuemin={0} aria-valuemax={100}>
                <div
                    className={`progress-bar-fill ${progressBarClass}`}
                    style={{ width: `${cappedPercentage}%` }}
                />
            </div>
            <div className="progress-bar-percentage">
                 {percentage > 100 && <span className="over-budget-indicator"><i className="las la-exclamation-triangle"></i> Over Budget!</span>}
                <span>{percentage.toFixed(1)}% Used</span>
            </div>
        </div>
    );
};

export default BudgetProgressBar;
