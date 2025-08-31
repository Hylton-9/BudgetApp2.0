/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
// Fix: Use 'import type' for type-only imports from declaration files.
import type { Expense } from '../../types/index.d.ts';
import { categoryConfigMap } from '../../constants/categories.ts';

const CategoryChart = ({ expenses }: { expenses: Expense[] }) => {
    const totalSpent = React.useMemo(() => expenses.reduce((sum, exp) => sum + exp.amount, 0), [expenses]);

    const categoryTotals = React.useMemo(() => {
        if (!totalSpent) return [];
        const totals = expenses.reduce((acc: { [key: string]: number }, expense) => {
            acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
            return acc;
        }, {});

        return Object.entries(totals)
            .map(([category, amount]) => ({
                category,
                amount,
                percentage: (amount / totalSpent) * 100,
            }))
            .sort((a, b) => b.amount - a.amount);
    }, [expenses, totalSpent]);

    if (expenses.length === 0) {
        return (
            <div className="chart-card card">
                <h2 className="card-title">Spending by Category</h2>
                <div className="empty-state">
                    <i className="las la-chart-pie"></i>
                    <p>No expense data to display.</p>
                </div>
            </div>
        );
    }
    
    const radius = 80;
    const circumference = 2 * Math.PI * radius;
    let accumulatedPercentage = 0;

    return (
        <div className="chart-card card">
            <h2 className="card-title">Spending by Category</h2>
            <div className="chart-container">
                <svg width="200" height="200" viewBox="0 0 200 200">
                    <circle cx="100" cy="100" r={radius} fill="transparent" stroke="var(--color-surface-secondary)" strokeWidth="25" />
                    {categoryTotals.map((item) => {
                        const strokeDasharray = `${(item.percentage / 100) * circumference} ${circumference}`;
                        const strokeDashoffset = -accumulatedPercentage / 100 * circumference;
                        accumulatedPercentage += item.percentage;
                        return (
                            <circle
                                key={item.category}
                                cx="100"
                                cy="100"
                                r={radius}
                                fill="transparent"
                                stroke={categoryConfigMap[item.category]?.color || "#6c757d"}
                                strokeWidth="25"
                                strokeDasharray={strokeDasharray}
                                strokeDashoffset={strokeDashoffset}
                                transform="rotate(-90 100 100)"
                            />
                        );
                    })}
                     <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="20" fontWeight="bold" fill="var(--color-text-primary)">
                        ${totalSpent.toFixed(0)}
                    </text>
                </svg>
                <ul className="chart-legend">
                    {categoryTotals.map((item) => (
                        <li key={item.category} className="legend-item">
                            <span className="legend-color-key" style={{ backgroundColor: categoryConfigMap[item.category]?.color || "#6c757d" }}></span>
                            <span className="legend-label">{item.category}</span>
                            <span className="legend-percentage">{item.percentage.toFixed(1)}%</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default CategoryChart;