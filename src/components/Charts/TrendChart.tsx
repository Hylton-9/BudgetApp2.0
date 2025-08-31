/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
// Fix: Use 'import type' for type-only imports from declaration files.
import type { Expense } from '../../types/index.d.ts';

const TrendChart = ({ expenses }: { expenses: Expense[] }) => {
    const trendData = React.useMemo(() => {
        const data: { [key: string]: number } = {};
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            data[date.toISOString().split('T')[0]] = 0;
        }

        expenses.forEach(expense => {
            const expenseDate = new Date(expense.date);
            const userTimezoneOffset = expenseDate.getTimezoneOffset() * 60000;
            const correctedDate = new Date(expenseDate.getTime() + userTimezoneOffset);
            const key = correctedDate.toISOString().split('T')[0];

            if (key in data) {
                data[key] += expense.amount;
            }
        });

        return Object.entries(data).map(([date, amount]) => ({
            date,
            amount,
            label: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        }));
    }, [expenses]);

    if (expenses.length === 0) {
        return (
            <div className="chart-card card">
                <h2 className="card-title">Spending Trend (Last 7 Days)</h2>
                <div className="empty-state">
                    <i className="las la-chart-bar"></i>
                    <p>No recent expenses to show.</p>
                </div>
            </div>
        );
    }
    
    const maxAmount = Math.max(...trendData.map(d => d.amount), 1);
    const chartHeight = 150;
    const barWidth = 30;
    const gap = 15;

    return (
        <div className="chart-card card">
            <h2 className="card-title">Spending Trend (Last 7 Days)</h2>
            <div className="trend-chart-container">
                <svg width={trendData.length * (barWidth + gap)} height={chartHeight + 30} aria-label="Bar chart showing spending over the last 7 days">
                    {trendData.map((d, i) => {
                        const barHeight = (d.amount / maxAmount) * chartHeight;
                        return (
                            <g key={d.date} transform={`translate(${i * (barWidth + gap)}, 0)`}>
                                <rect className="trend-chart-bar" y={chartHeight - barHeight} width={barWidth} height={barHeight} rx="4">
                                   <title>{`${d.label}: $${d.amount.toFixed(2)}`}</title>
                                </rect>
                                <text x={barWidth / 2} y={chartHeight + 20} textAnchor="middle" fontSize="12" fill="var(--color-text-secondary)">
                                    {d.label}
                                </text>
                            </g>
                        );
                    })}
                </svg>
            </div>
        </div>
    );
};

export default TrendChart;