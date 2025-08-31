/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface ExportImportProps {
    onExportCsv: () => void;
    onExportJson: () => void;
    deleteExpenses: (ids: string[]) => void;
    selectedIds: Set<string>;
}

const ExportImport = ({ onExportCsv, onExportJson, deleteExpenses, selectedIds }: ExportImportProps) => {
    return (
        <div className="action-buttons-group">
            <button onClick={onExportCsv} className="btn"><i className="las la-file-csv"></i> Export CSV</button>
            <button onClick={onExportJson} className="btn"><i className="las la-file-code"></i> Export JSON</button>
            {selectedIds.size > 0 && (
                <button onClick={() => deleteExpenses(Array.from(selectedIds))} className="btn btn-danger">
                    <i className="las la-trash"></i> Delete ({selectedIds.size}) Selected
                </button>
            )}
        </div>
    );
};

export default ExportImport;
