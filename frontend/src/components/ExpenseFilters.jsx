import React from 'react';
import { Filter, Search, RotateCcw } from 'lucide-react';

const CATEGORIES = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Other'];

export default function ExpenseFilters({ filters, onFilterChange, onResetFilters }) {
  const handleChange = (key, value) => {
    onFilterChange({
      ...filters,
      [key]: value
    });
  };

  return (
    <div className="card filter-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
        <h2 className="card-title" style={{ margin: 0, border: 'none', padding: 0 }}>
          <Filter size={18} className="logo-icon" style={{ boxShadow: 'none', padding: 0, background: 'none' }} />
          Filter Expenses
        </h2>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onResetFilters}
          style={{ width: 'auto', padding: '0.4rem 0.8rem', fontSize: '0.85rem', display: 'flex', gap: '0.25rem' }}
          id="reset-filters-btn"
        >
          <RotateCcw size={14} /> Reset
        </button>
      </div>

      <div className="filter-grid" id="filters-container">
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label htmlFor="filter-category">Category</label>
          <select
            id="filter-category"
            className="form-control"
            value={filters.category || ''}
            onChange={(e) => handleChange('category', e.target.value)}
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label>Date Range</label>
          <div className="date-range-container">
            <input
              type="date"
              id="filter-start-date"
              className="form-control"
              placeholder="From"
              value={filters.startDate || ''}
              onChange={(e) => handleChange('startDate', e.target.value)}
              title="Start Date"
            />
            <input
              type="date"
              id="filter-end-date"
              className="form-control"
              placeholder="To"
              value={filters.endDate || ''}
              onChange={(e) => handleChange('endDate', e.target.value)}
              title="End Date"
            />
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label htmlFor="filter-search">Search Title</label>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              id="filter-search"
              className="form-control"
              placeholder="Search expenses..."
              style={{ paddingLeft: '2.5rem' }}
              value={filters.search || ''}
              onChange={(e) => handleChange('search', e.target.value)}
            />
            <Search
              size={16}
              style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
