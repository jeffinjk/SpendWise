import sqlite3 from 'sqlite3';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const dbFile = process.env.DATABASE_FILE || 'expenses.db';
const dbPath = path.resolve(dbFile);

console.log(`Connecting to SQLite database at: ${dbPath}`);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    db.run(`
      CREATE TABLE IF NOT EXISTS expenses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        amount REAL NOT NULL,
        category TEXT NOT NULL,
        date TEXT NOT NULL,
        note TEXT
      )
    `, (err) => {
      if (err) {
        console.error('Error creating expenses table:', err.message);
      } else {
        console.log('Expenses table initialized.');
        // Check if database is empty and seed if necessary
        db.get('SELECT COUNT(*) AS count FROM expenses', (err, row) => {
          if (!err && row && row.count === 0) {
            console.log('Database is empty. Inserting seed expenses...');
            const stmt = db.prepare('INSERT INTO expenses (title, amount, category, date, note) VALUES (?, ?, ?, ?, ?)');
            
            const sampleExpenses = [
              ['Weekly Groceries', 85.50, 'Food', '2026-06-10', 'Whole Foods shopping'],
              ['Monthly Rent', 1200.00, 'Bills', '2026-06-01', 'June apartment rent'],
              ['Bus Pass', 45.00, 'Transport', '2026-06-02', 'Monthly transit card'],
              ['Movie Night', 32.50, 'Entertainment', '2026-06-08', 'Tickets and popcorn'],
              ['Summer Jacket', 89.99, 'Shopping', '2026-06-05', 'Blue denim jacket'],
              ['Coffee with team', 12.75, 'Food', '2026-06-11', 'Starbucks'],
            ];
            
            for (const exp of sampleExpenses) {
              stmt.run(exp, (err) => {
                if (err) console.error('Error seeding expense:', err.message);
              });
            }
            stmt.finalize();
            console.log('Seed expenses inserted successfully.');
          }
        });
      }
    });
  }
});

// Promisified database helpers
export const query = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
};

export const get = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

export const run = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
};

export default db;
