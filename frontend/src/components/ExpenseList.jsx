import React from 'react';
import { Edit2, Trash2, Inbox } from 'lucide-react';

export default function ExpenseList({ expenses, onEdit, onDelete, isLoading }) {
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    // Format YYYY-MM-DD to a more readable local date
    const [year, month, day] = dateString.split('-');
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner" />
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="empty-state" id="empty-state">
        <Inbox size={48} className="empty-icon" />
        <h3>No Expenses Found</h3>
        <p>Try adding a new expense or adjusting your search filters.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="list-header">
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>All Expenses</h2>
        <span className="expenses-count" id="expenses-count">
          {expenses.length} {expenses.length === 1 ? 'expense' : 'expenses'}
        </span>
      </div>

      <div className="expenses-list" id="expenses-list">
        {expenses.map((expense) => (
          <div key={expense.id} className="expense-item" data-id={expense.id}>
            <div className={`badge badge-${expense.category}`}>
              {expense.category}
            </div>
            
            <div className="expense-info">
              <span className="expense-title">{expense.title}</span>
              <div className="expense-date-category">
                <span>{formatDate(expense.date)}</span>
              </div>
              {expense.note && <span className="expense-note">{expense.note}</span>}
            </div>

            <div className="expense-amount">
              {formatAmount(expense.amount)}
            </div>

            <div className="expense-actions">
              <button
                type="button"
                className="btn-icon"
                onClick={() => onEdit(expense)}
                title="Edit expense"
                id={`edit-btn-${expense.id}`}
              >
                <Edit2 size={16} />
              </button>
              <button
                type="button"
                className="btn-icon btn-icon-danger"
                onClick={() => {
                  if (confirm(`Are you sure you want to delete "${expense.title}"?`)) {
                    onDelete(expense.id);
                  }
                }}
                title="Delete expense"
                id={`delete-btn-${expense.id}`}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
