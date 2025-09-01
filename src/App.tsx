/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import type { Expense } from "./types/index.d.ts";
import { useLocalStorage } from "./hooks/useLocalStorage.ts";
import { filterExpenses, calculateTotalSpent } from "./utils/calculations.ts";
import { exportToCsv, exportToJson } from "./utils/fileExport.ts";

import Header from "./components/Header.tsx";
import BudgetProgressBar from "./components/BudgetProgressBar.tsx";
import Summary from "./components/Summary.tsx";
import CategoryChart from "./components/Charts/CategoryChart.tsx";
import TrendChart from "./components/Charts/TrendChart.tsx";
import ExpenseForm from "./components/ExpenseForm.tsx";
import Filters from "./components/Filters.tsx";
import ExpenseList from "./components/ExpenseList.tsx";
import Chatbot from "./components/Chatbot.tsx";
import BudgetEditModal from "./components/BudgetEditModal.tsx";
import ExpenseEditModal from "./components/ExpenseEditModal.tsx";

const App = () => {
  const [expenses, setExpenses] = useLocalStorage<Expense[]>("expenses", []);
  const [budget, setBudget] = useLocalStorage<number>("budget", 1000);
  const [filters, setFilters] = React.useState({
    text: "",
    categories: [] as string[],
    startDate: "",
    endDate: "",
  });
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
  const [isBudgetModalOpen, setIsBudgetModalOpen] = React.useState(false);
  const [editingExpense, setEditingExpense] =
    React.useState<Expense | null>(null);

  const addExpense = React.useCallback(
    (newExpense: Omit<Expense, "id">) => {
      const expenseWithId = {
        ...newExpense,
        id: `${Date.now()}-${Math.random()}`,
      };
      setExpenses((prev) =>
        [expenseWithId, ...prev].sort(
          (a, b) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        )
      );
    },
    [setExpenses]
  );

  const deleteExpenses = React.useCallback(
    (ids: string[]) => {
      if (
        window.confirm(`Are you sure you want to delete ${ids.length} expense(s)?`)
      ) {
        setExpenses((prev) => prev.filter((exp) => !ids.includes(exp.id)));
        setSelectedIds(new Set()); // Clear selection after deletion
      }
    },
    [setExpenses]
  );

  const handleUpdateExpense = React.useCallback(
    (updatedExpense: Expense) => {
      setExpenses((prev) =>
        prev
          .map((exp) => (exp.id === updatedExpense.id ? updatedExpense : exp))
          .sort(
            (a, b) =>
              new Date(b.date).getTime() - new Date(a.date).getTime()
          )
      );
      setEditingExpense(null);
    },
    [setExpenses]
  );

  const resetFilters = React.useCallback(() => {
    setFilters({ text: "", categories: [], startDate: "", endDate: "" });
  }, []);

  const handleSaveBudget = React.useCallback(
    (newBudget: number) => {
      setBudget(newBudget);
      setIsBudgetModalOpen(false);
    },
    [setBudget]
  );

  const filteredExpenses = React.useMemo(
    () => filterExpenses(expenses, filters),
    [expenses, filters]
  );

  const handleExportCsv = React.useCallback(
    () => exportToCsv(filteredExpenses),
    [filteredExpenses]
  );
  const handleExportJson = React.useCallback(
    () => exportToJson(filteredExpenses),
    [filteredExpenses]
  );

  const totalSpent = React.useMemo(
    () => calculateTotalSpent(filteredExpenses),
    [filteredExpenses]
  );
  const isFiltered =
    filters.text ||
    filters.categories.length > 0 ||
    filters.startDate ||
    filters.endDate;
  const memoizedFilteredExpenses = React.useMemo(
    () => filteredExpenses.map(({ id, ...rest }) => rest),
    [filteredExpenses]
  );

  return (
    <>
      <Header budget={budget} onEdit={() => setIsBudgetModalOpen(true)} />
      <BudgetProgressBar total={totalSpent} budget={budget} />

      <main className="flex flex-col lg:flex-row gap-6 px-6 py-4 max-w-7xl mx-auto">
        {/* Dashboard Section */}
        <div className="flex-1 space-y-6">
          {/* Dashboard Header */}
          <div className="flex items-center justify-between border-b border-gray-200 pb-2">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-semibold text-gray-800">Dashboard</h2>
              {isFiltered && (
                <span className="text-sm px-2 py-1 bg-indigo-100 text-indigo-600 rounded-md">
                  Filtered Results
                </span>
              )}
            </div>
            {isFiltered && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1 px-3 py-1 text-sm font-medium bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
              >
                <i className="las la-times-circle"></i> Clear Filters
              </button>
            )}
          </div>

          {/* Summary */}
          <Summary total={totalSpent} budget={budget} />

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CategoryChart expenses={filteredExpenses} />
            <TrendChart expenses={filteredExpenses} />
          </div>

          {/* Expense Form */}
          <ExpenseForm addExpense={addExpense} />

          {/* Filters */}
          <Filters
            filters={filters}
            setFilters={setFilters}
            deleteExpenses={deleteExpenses}
            selectedIds={selectedIds}
            onReset={resetFilters}
            onExportCsv={handleExportCsv}
            onExportJson={handleExportJson}
          />

          {/* Expense List */}
          <ExpenseList
            expenses={filteredExpenses}
            deleteExpenses={deleteExpenses}
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
            onEdit={setEditingExpense}
          />
        </div>

        {/* Chatbot Section */}
        <div className="w-full lg:w-96 flex-shrink-0">
          <div className="sticky top-4">
            <Chatbot
              expenses={memoizedFilteredExpenses}
              addExpense={addExpense}
            />
          </div>
        </div>
      </main>

      {/* Modals */}
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
