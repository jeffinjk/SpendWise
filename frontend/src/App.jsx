import React, { useState, useEffect, useCallback } from 'react';
import { DollarSign, Wallet, RefreshCw, AlertCircle } from 'lucide-react';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import MonthlySummary from './components/MonthlySummary';
import ExpenseFilters from './components/ExpenseFilters';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function App() {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState(null);
  const [editingExpense, setEditingExpense] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const [filters, setFilters] = useState({
    category: '',
    startDate: '',
    endDate: '',
    search: ''
  });

  // Helper to show alert for 5 seconds
  const showAlert = useCallback((type, message) => {
    setAlert({ type, message });
    const timer = setTimeout(() => {
      setAlert(null);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  // Fetch expenses from API
  const fetchExpenses = useCallback(async (currentFilters = filters) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (currentFilters.category) params.append('category', currentFilters.category);
      if (currentFilters.startDate) params.append('startDate', currentFilters.startDate);
      if (currentFilters.endDate) params.append('endDate', currentFilters.endDate);
      if (currentFilters.search) params.append('search', currentFilters.search);

      const response = await fetch(`${API_BASE_URL}/expenses?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch expenses');
      }
      const data = await response.json();
      setExpenses(data);
    } catch (err) {
      console.error(err);
      showAlert('danger', 'Error loading expenses. Please make sure the backend server is running.');
    } finally {
      setIsLoading(false);
    }
  }, [filters, showAlert]);

  // Fetch monthly summary from API
  const fetchSummary = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/summary`);
      if (!response.ok) {
        throw new Error('Failed to fetch summary');
      }
      const data = await response.json();
      setSummary(data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchExpenses();
    fetchSummary();
  }, []);

  // Refetch expenses when filters change
  useEffect(() => {
    if (filters.startDate && filters.endDate && filters.startDate > filters.endDate) {
      showAlert('danger', 'Filter Warning: Start date is after end date.');
    }
    fetchExpenses(filters);
  }, [filters, fetchExpenses, showAlert]);

  // Handle Create or Update
  const handleSubmitExpense = async (expenseData) => {
    try {
      let response;
      if (editingExpense) {
        // Update existing expense
        response = await fetch(`${API_BASE_URL}/expenses/${editingExpense.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(expenseData)
        });
      } else {
        // Create new expense
        response = await fetch(`${API_BASE_URL}/expenses`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(expenseData)
        });
      }

      const responseData = await response.json();

      if (!response.ok) {
        const errorMsg = responseData.errors 
          ? responseData.errors.join(', ') 
          : (responseData.error || 'Failed to save expense');
        throw new Error(errorMsg);
      }

      showAlert('success', editingExpense ? 'Expense updated successfully!' : 'Expense added successfully!');
      setEditingExpense(null);
      fetchExpenses();
      fetchSummary();
    } catch (err) {
      console.error(err);
      showAlert('danger', err.message || 'Failed to save expense');
    }
  };

  // Handle Delete
  const handleDeleteExpense = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/expenses/${id}`, {
        method: 'DELETE'
      });
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to delete expense');
      }

      showAlert('success', 'Expense deleted successfully!');
      // Cancel edit if deleting the editing expense
      if (editingExpense && editingExpense.id === id) {
        setEditingExpense(null);
      }
      fetchExpenses();
      fetchSummary();
    } catch (err) {
      console.error(err);
      showAlert('danger', err.message || 'Failed to delete expense');
    }
  };

  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
    // Scroll to form on mobile/small screens
    document.getElementById('expense-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingExpense(null);
  };

  const handleResetFilters = () => {
    setFilters({
      category: '',
      startDate: '',
      endDate: '',
      search: ''
    });
  };

  return (
    <div className="dashboard-container">
      <header className="header">
        <div className="logo-section">
          <div className="logo-icon">
            <DollarSign size={24} />
          </div>
          <div>
            <h1>SpendWise</h1>
            <p>Personal Expense Tracker</p>
          </div>
        </div>
        <div>
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={() => { fetchExpenses(); fetchSummary(); }} 
            style={{ width: 'auto', display: 'flex', gap: '0.5rem', padding: '0.6rem 1rem' }}
            id="refresh-btn"
          >
            <RefreshCw size={16} /> Sync Data
          </button>
        </div>
      </header>

      {alert && (
        <div className={`alert alert-${alert.type}`} id="global-alert">
          <AlertCircle size={18} />
          <span>{alert.message}</span>
        </div>
      )}

      <div className="dashboard-grid">
        {/* Left Column: Form & Summary */}
        <div className="left-column">
          <ExpenseForm 
            onSubmit={handleSubmitExpense} 
            editingExpense={editingExpense} 
            onCancelEdit={handleCancelEdit} 
          />
          <MonthlySummary summary={summary} />
        </div>

        {/* Right Column: Filters & List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <ExpenseFilters 
            filters={filters} 
            onFilterChange={setFilters} 
            onResetFilters={handleResetFilters} 
          />
          <div className="card" style={{ padding: '1.75rem' }}>
            <ExpenseList 
              expenses={expenses} 
              onEdit={handleEditExpense} 
              onDelete={handleDeleteExpense} 
              isLoading={isLoading} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
