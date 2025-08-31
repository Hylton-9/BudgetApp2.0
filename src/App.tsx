/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import type { Expense } from './types/index.d.ts';
import { useLocalStorage } from './hooks/useLocalStorage.ts';
import { filterExpenses, calculateTotalSpent } from './utils/calculations.ts';
import { exportToCsv, exportToJson } from './utils/fileExport.ts';

import Header from './components/Header.tsx';
import BudgetProgressBar from './components/BudgetProgressBar.tsx';
import Summary from './components/Summary.tsx';
import CategoryChart from './components/Charts/CategoryChart.tsx';
import TrendChart from './components/Charts/TrendChart.tsx';
import ExpenseForm from './components/ExpenseForm.tsx';
import Filters from './components/Filters.tsx';
import ExpenseList from './components/ExpenseList.tsx';
import Chatbot from './components/Chatbot.tsx';
import BudgetEditModal from './components/BudgetEditModal.tsx';
import ExpenseEditModal from './components/ExpenseEditModal.tsx';


const App = () => {
  const [expenses, setExpenses] = useLocalStorage<Expense[]>('expenses', []);
  const [budget, setBudget] = useLocalStorage<number>('budget', 1000);
  const [filters, setFilters] = React.useState({ text: '', categories: [] as string[], startDate: '', endDate: '' });
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
  const [isBudgetModalOpen, setIsBudgetModalOpen] = React.useState(false);
  const [editingExpense, setEditingExpense] = React.useState<Expense | null>(null);

  const addExpense = React.useCallback((newExpense: Omit<Expense, 'id'>) => {
    const expenseWithId = { ...newExpense, id: `${Date.now()}-${Math.random()}` };
    setExpenses(prev => [expenseWithId, ...prev].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  }, [setExpenses]);

  const deleteExpenses = React.useCallback((ids: string[]) => {
    if (window.confirm(`Are you sure you want to delete ${ids.length} expense(s)?`)) {
      setExpenses(prev => prev.filter(exp => !ids.includes(exp.id)));
      setSelectedIds(new Set()); // Clear selection after deletion
    }
  }, [setExpenses]);
  
   const handleUpdateExpense = React.useCallback((updatedExpense: Expense) => {
        setExpenses(prev => prev.map(exp => exp.id === updatedExpense.id ? updatedExpense : exp)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        setEditingExpense(null);
    }, [setExpenses]);

  const resetFilters = React.useCallback(() => {
    setFilters({ text: '', categories: [], startDate: '', endDate: '' });
  }, []);
  
  const handleSaveBudget = React.useCallback((newBudget: number) => {
    setBudget(newBudget);
    setIsBudgetModalOpen(false);
  }, [setBudget]);

  const filteredExpenses = React.useMemo(() => filterExpenses(expenses, filters), [expenses, filters]);
  
  const handleExportCsv = React.useCallback(() => exportToCsv(filteredExpenses), [filteredExpenses]);
  const handleExportJson = React.useCallback(() => exportToJson(filteredExpenses), [filteredExpenses]);

  const totalSpent = React.useMemo(() => calculateTotalSpent(filteredExpenses), [filteredExpenses]);
  const isFiltered = filters.text || filters.categories.length > 0 || filters.startDate || filters.endDate;
  const memoizedFilteredExpenses = React.useMemo(() => filteredExpenses.map(({id, ...rest}) => rest), [filteredExpenses]);

  return (
    <>
      <Header budget={budget} onEdit={() => setIsBudgetModalOpen(true)} />
      <BudgetProgressBar total={totalSpent} budget={budget} />
      <main className="app-container">
        <div className="dashboard-column">
          <div className="dashboard-header">
            <div className="dashboard-header-title">
              <h2>Dashboard</h2>
              {isFiltered && <span className="filter-indicator">Filtered Results</span>}
            </div>
            {isFiltered && <button onClick={resetFilters} className="btn btn-secondary"><i className="las la-times-circle"></i> Clear Filters</button>}
          </div>
          <Summary total={totalSpent} budget={budget} />
          <div className="charts-container">
            <CategoryChart expenses={filteredExpenses} />
            <TrendChart expenses={filteredExpenses} />
          </div>
          <ExpenseForm addExpense={addExpense} />
          <Filters 
            filters={filters} 
            setFilters={setFilters} 
            deleteExpenses={deleteExpenses} 
            selectedIds={selectedIds}
            onReset={resetFilters}
            onExportCsv={handleExportCsv}
            onExportJson={handleExportJson}
          />
          <ExpenseList 
            expenses={filteredExpenses} 
            deleteExpenses={deleteExpenses} 
            selectedIds={selectedIds} 
            setSelectedIds={setSelectedIds}
            onEdit={setEditingExpense}
           />
        </div>
        <div className="chatbot-column">
            <Chatbot expenses={memoizedFilteredExpenses} addExpense={addExpense} />
        </div>
      </main>
      <BudgetEditModal 
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        onSave={handleSaveBudget}
        currentBudget={budget}
      />
      <ExpenseEditModal
          isOpen={!!editingExpense}
          onClose={() => setEditingExpense(null)}
          onSave={handleUpdateExpense}
          expense={editingExpense}
      />
    </>
  );
};

export default App;
