/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

const Summary = ({ total, budget }: { total: number; budget: number }) => {
  const remaining = budget - total;
  const remainingColor = remaining >= 0 ? 'var(--color-success)' : 'var(--color-danger)';

  return (
    <div className="summary-card card">
      <h2 className="card-title">Summary</h2>
      <div className="summary-metrics">
        <div className="metric">
          <span className="metric-label">Total Spent</span>
          <span className="metric-value">${total.toFixed(2)}</span>
        </div>
        <div className="metric">
          <span className="metric-label">Remaining Budget</span>
          <span className="metric-value" style={{ color: remainingColor }}>
            ${remaining.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Summary;
