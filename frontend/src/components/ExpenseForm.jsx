import React, { useState, useEffect } from 'react';
import { PlusCircle, Save, XCircle } from 'lucide-react';

const CATEGORIES = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Other'];

export default function ExpenseForm({ onSubmit, editingExpense, onCancelEdit }) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [note, setNote] = useState('');
  const [errors, setErrors] = useState([]);

  // Populate form when editing an expense
  useEffect(() => {
    if (editingExpense) {
      setTitle(editingExpense.title || '');
      setAmount(editingExpense.amount || '');
      setCategory(editingExpense.category || '');
      setDate(editingExpense.date || '');
      setNote(editingExpense.note || '');
      setErrors([]);
    } else {
      resetForm();
    }
  }, [editingExpense]);

  const resetForm = () => {
    setTitle('');
    setAmount('');
    setCategory('');
    // Set default date to today's local date in YYYY-MM-DD
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    setDate(`${year}-${month}-${day}`);
    setNote('');
    setErrors([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Client-side Validation
    const validationErrors = [];
    if (!title.trim()) {
      validationErrors.push('Title is required');
    }
    
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      validationErrors.push('Amount must be a number greater than 0');
    }
    
    if (!category) {
      validationErrors.push('Category is required');
    }
    
    if (!date) {
      validationErrors.push('Date is required');
    }

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors([]);
    onSubmit({
      title: title.trim(),
      amount: parsedAmount,
      category,
      date,
      note: note.trim() || null
    });
    
    if (!editingExpense) {
      resetForm();
    }
  };

  return (
    <div className="card">
      <h2 className="card-title">
        {editingExpense ? (
          <>
            <Save size={20} className="logo-icon" style={{ boxShadow: 'none', padding: 0, background: 'none' }} />
            Edit Expense
          </>
        ) : (
          <>
            <PlusCircle size={20} className="logo-icon" style={{ boxShadow: 'none', padding: 0, background: 'none' }} />
            Add New Expense
          </>
        )}
      </h2>

      {errors.length > 0 && (
        <div className="alert alert-danger" id="form-errors">
          <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
            {errors.map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit} id="expense-form">
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            type="text"
            id="title"
            className="form-control"
            placeholder="e.g. Weekly Groceries"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="amount">Amount (₹) *</label>
          <input
            type="number"
            id="amount"
            className="form-control"
            placeholder="0.00"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category *</label>
          <select
            id="category"
            className="form-control"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select Category</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="date">Date *</label>
          <input
            type="date"
            id="date"
            className="form-control"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="note">Note (Optional)</label>
          <textarea
            id="note"
            className="form-control"
            placeholder="Additional details..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        {editingExpense ? (
          <div className="btn-group">
            <button type="submit" className="btn btn-primary" id="save-expense-btn">
              <Save size={18} /> Update
            </button>
            <button type="button" className="btn btn-secondary" onClick={onCancelEdit} id="cancel-edit-btn">
              <XCircle size={18} /> Cancel
            </button>
          </div>
        ) : (
          <button type="submit" className="btn btn-primary" id="add-expense-btn">
            <PlusCircle size={18} /> Add Expense
          </button>
        )}
      </form>
    </div>
  );
}
