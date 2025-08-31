/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import CategorySelect from './CategorySelect.tsx';
import ExportImport from './ExportImport.tsx';

interface FiltersProps {
    filters: any;
    setFilters: any;
    deleteExpenses: (ids: string[]) => void;
    selectedIds: Set<string>;
    onReset: () => void;
    onExportCsv: () => void;
    onExportJson: () => void;
}

const Filters = (props: FiltersProps) => {
    const { filters, setFilters, onReset } = props;
    return (
        <div className="filters-card card">
            <h2 className="card-title"><i className="las la-filter"></i> Filters & Actions</h2>
            <div className="filter-controls">
                <div className="form-group">
                    <label htmlFor="text-filter">Description</label>
                    <input id="text-filter" type="text" placeholder="Search..." value={filters.text} onChange={e => setFilters({ ...filters, text: e.target.value })} />
                </div>
                <div className="form-group">
                    <label htmlFor="category-filter">Category</label>
                    <CategorySelect
                        value={filters.categories}
                        onChange={cats => setFilters({...filters, categories: cats})}
                        multiple={true}
                        placeholder="All Categories"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="start-date">Start Date</label>
                    <input id="start-date" type="date" value={filters.startDate} onChange={e => setFilters({ ...filters, startDate: e.target.value })}/>
                </div>
                <div className="form-group">
                    <label htmlFor="end-date">End Date</label>
                    <input id="end-date" type="date" value={filters.endDate} onChange={e => setFilters({ ...filters, endDate: e.target.value })}/>
                </div>
            </div>
            <div className="filter-actions">
                <button onClick={onReset} className="btn"><i className="las la-undo"></i> Reset Filters</button>
                <ExportImport {...props} />
            </div>
        </div>
    );
};

export default Filters;
