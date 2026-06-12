import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { query, run, get } from './database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const ALLOWED_CATEGORIES = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Other'];

// Helper to validate expense fields
const validateExpense = (data) => {
  const { title, amount, category, date } = data;
  const errors = [];

  if (!title || typeof title !== 'string' || title.trim() === '') {
    errors.push('Title is required');
  }

  const parsedAmount = parseFloat(amount);
  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    errors.push('Amount must be a number greater than 0');
  }

  if (!category || !ALLOWED_CATEGORIES.includes(category)) {
    errors.push(`Category is required and must be one of: ${ALLOWED_CATEGORIES.join(', ')}`);
  }

  if (!date || isNaN(Date.parse(date))) {
    errors.push('A valid date is required');
  }

  return errors;
};

// GET /api/expenses - List expenses with filters
app.get('/api/expenses', async (req, res, next) => {
  try {
    const { category, startDate, endDate, search } = req.query;
    
    let sql = 'SELECT * FROM expenses WHERE 1=1';
    const params = [];

    if (category) {
      sql += ' AND category = ?';
      params.push(category);
    }

    if (startDate) {
      sql += ' AND date >= ?';
      params.push(startDate);
    }

    if (endDate) {
      sql += ' AND date <= ?';
      params.push(endDate);
    }

    if (search) {
      sql += ' AND title LIKE ?';
      params.push(`%${search}%`);
    }

    // Sort by date descending (most recent first), then by id descending
    sql += ' ORDER BY date DESC, id DESC';

    const expenses = await query(sql, params);
    res.json(expenses);
  } catch (error) {
    next(error);
  }
});

// GET /api/summary - Monthly summary (current month only)
app.get('/api/summary', async (req, res, next) => {
  try {
    // Determine the current month in YYYY-MM format locally
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const currentMonth = `${year}-${month}`; // e.g. "2026-06"

    // Get total spent for current month
    const totalResult = await get(
      'SELECT SUM(amount) AS total FROM expenses WHERE date LIKE ?',
      [`${currentMonth}%`]
    );
    const totalSpent = totalResult ? (totalResult.total || 0) : 0;

    // Get breakdown by category for current month
    const breakdown = await query(
      'SELECT category, SUM(amount) AS total FROM expenses WHERE date LIKE ? GROUP BY category',
      [`${currentMonth}%`]
    );

    // Ensure all allowed categories are represented in the breakdown (even with 0 if not spent)
    const breakdownMap = {};
    ALLOWED_CATEGORIES.forEach(cat => {
      breakdownMap[cat] = 0;
    });
    breakdown.forEach(row => {
      breakdownMap[row.category] = row.total;
    });

    const categoryBreakdown = Object.keys(breakdownMap).map(cat => ({
      category: cat,
      total: breakdownMap[cat]
    }));

    res.json({
      month: currentMonth,
      totalSpent,
      breakdown: categoryBreakdown
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/expenses - Create expense
app.post('/api/expenses', async (req, res, next) => {
  try {
    const errors = validateExpense(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const { title, amount, category, date, note } = req.body;
    const result = await run(
      'INSERT INTO expenses (title, amount, category, date, note) VALUES (?, ?, ?, ?, ?)',
      [title.trim(), parseFloat(amount), category, date, note ? note.trim() : null]
    );

    const newExpense = await get('SELECT * FROM expenses WHERE id = ?', [result.id]);
    res.status(201).json(newExpense);
  } catch (error) {
    next(error);
  }
});

// PUT /api/expenses/:id - Update expense
app.put('/api/expenses/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Check if expense exists
    const existing = await get('SELECT * FROM expenses WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    const errors = validateExpense(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const { title, amount, category, date, note } = req.body;
    await run(
      'UPDATE expenses SET title = ?, amount = ?, category = ?, date = ?, note = ? WHERE id = ?',
      [title.trim(), parseFloat(amount), category, date, note ? note.trim() : null, id]
    );

    const updatedExpense = await get('SELECT * FROM expenses WHERE id = ?', [id]);
    res.json(updatedExpense);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/expenses/:id - Delete expense
app.delete('/api/expenses/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const existing = await get('SELECT * FROM expenses WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    await run('DELETE FROM expenses WHERE id = ?', [id]);
    res.json({ message: 'Expense deleted successfully', id: parseInt(id) });
  } catch (error) {
    next(error);
  }
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error', details: err.message });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
