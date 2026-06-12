import React from 'react';
import { TrendingUp, PieChart } from 'lucide-react';

const CATEGORY_COLORS = {
  Food: 'var(--cat-food)',
  Transport: 'var(--cat-transport)',
  Shopping: 'var(--cat-shopping)',
  Bills: 'var(--cat-bills)',
  Entertainment: 'var(--cat-entertainment)',
  Other: 'var(--cat-other)'
};

export default function MonthlySummary({ summary }) {
  if (!summary) return null;

  const { totalSpent, breakdown, month } = summary;

  // Format YYYY-MM to human readable (e.g. June 2026)
  const formatMonthName = (monthString) => {
    if (!monthString) return 'Current Month';
    const [year, monthVal] = monthString.split('-');
    const date = new Date(year, monthVal - 1, 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  return (
    <div className="card">
      <h2 className="card-title">
        <PieChart size={20} className="logo-icon" style={{ boxShadow: 'none', padding: 0, background: 'none' }} />
        Summary - {formatMonthName(month)}
      </h2>

      <div className="summary-grid">
        <div className="total-card" id="total-spent-card">
          <div className="total-label">Total Spent This Month</div>
          <div className="total-value" id="total-spent-value">
            {formatAmount(totalSpent)}
          </div>
        </div>

        <div className="breakdown-list" id="category-breakdown-list">
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
            Category Breakdown
          </div>
          {breakdown.map((item) => {
            const percentage = totalSpent > 0 ? (item.total / totalSpent) * 100 : 0;
            return (
              <div key={item.category} className="breakdown-item" id={`breakdown-item-${item.category}`}>
                <div className="breakdown-header">
                  <span className="breakdown-name">
                    <span
                      style={{
                        display: 'inline-block',
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        backgroundColor: CATEGORY_COLORS[item.category] || 'var(--text-muted)'
                      }}
                    />
                    {item.category}
                  </span>
                  <span className="breakdown-value">
                    {formatAmount(item.total)} ({percentage.toFixed(0)}%)
                  </span>
                </div>
                <div className="progress-bar-container">
                  <div
                    className="progress-bar-fill"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: CATEGORY_COLORS[item.category] || 'var(--text-muted)'
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
