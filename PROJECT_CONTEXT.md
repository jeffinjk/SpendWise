# Project Context - SpendWise

This document provides a technical guide to the codebase, describing the architecture, database schema, API definitions, and file hierarchy.

---

## 1. Directory Structure

```
expense-tracker/
├── README.md
├── PROJECT_CONTEXT.md
├── backend/
│   ├── .env                    # Environment variables (PORT, DATABASE_FILE)
│   ├── database.js             # SQLite DB initialization & promisified helper queries
│   ├── expenses.db             # SQLite database file (created on startup)
│   ├── package.json            # Node backend dependencies
│   └── server.js               # Express API endpoints & middleware
└── frontend/
    ├── index.html              # HTML template (configured for SEO & Outfit font)
    ├── package.json            # Vite frontend dependencies
    ├── vite.config.js          # Vite configuration
    └── src/
        ├── App.jsx             # Main React entry point, state container, API operations
        ├── index.css           # Core styling system (CSS variables, glass cards, animations)
        ├── main.jsx            # React mounting setup
        └── components/
            ├── ExpenseForm.jsx     # Add/Edit form + validation
            ├── ExpenseList.jsx     # Expense list + delete/edit callbacks
            ├── ExpenseFilters.jsx  # Filtering controls (search, category, date-range)
            └── MonthlySummary.jsx  # Aggregated total & category progress bars
```

---

## 2. Database Schema

The database uses SQLite, containing a single table: `expenses`.

```sql
CREATE TABLE IF NOT EXISTS expenses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  amount REAL NOT NULL,
  category TEXT NOT NULL,
  date TEXT NOT NULL,
  note TEXT
);
```

### Constraints & Formats:
- `id`: Auto-incremented primary key.
- `title`: Non-empty text string.
- `amount`: Floating-point number (must be > 0).
- `category`: Must match one of the allowed categories:
  - `Food`
  - `Transport`
  - `Shopping`
  - `Bills`
  - `Entertainment`
  - `Other`
- `date`: Text representation of ISO date (`YYYY-MM-DD`).
- `note`: Text details (nullable).

---

## 3. Backend API Specification

All endpoints use `http://localhost:5000/api`.

### 1. Retrieve Expenses
- **Endpoint**: `GET /api/expenses`
- **Query Parameters (Optional)**:
  - `category` (string) - Filters exactly by category.
  - `startDate` (string, YYYY-MM-DD) - Filters expenses on or after this date.
  - `endDate` (string, YYYY-MM-DD) - Filters expenses on or before this date.
  - `search` (string) - Partial case-insensitive match against title.
- **Sorting**: Most recent date first (`date DESC`), then by ID descending.
- **Success Response**: `200 OK` with JSON array of expenses.

### 2. Get Monthly Summary
- **Endpoint**: `GET /api/summary`
- **Description**: Returns the spending summary for the current month.
- **Success Response**: `200 OK`
```json
{
  "month": "2026-06",
  "totalSpent": 1465.74,
  "breakdown": [
    { "category": "Food", "total": 98.25 },
    { "category": "Transport", "total": 45.00 },
    ...
  ]
}
```

### 3. Create Expense
- **Endpoint**: `POST /api/expenses`
- **Request Body**:
```json
{
  "title": "Weekly Groceries",
  "amount": 85.50,
  "category": "Food",
  "date": "2026-06-10",
  "note": "Whole Foods"
}
```
- **Error Response**: `400 Bad Request` if validation fails (returns error message list).
- **Success Response**: `201 Created` with created expense object.

### 4. Update Expense
- **Endpoint**: `PUT /api/expenses/:id`
- **Request Body**: Same format as Create.
- **Success Response**: `200 OK` with updated expense object.
- **Error Response**: `404 Not Found` if expense does not exist; `400 Bad Request` on validation failure.

### 5. Delete Expense
- **Endpoint**: `DELETE /api/expenses/:id`
- **Success Response**: `200 OK` with `{ "message": "Expense deleted successfully", "id": <id> }`.
- **Error Response**: `404 Not Found` if expense does not exist.

---

## 4. Frontend State Flow

```
                  ┌────────────────────────┐
                  │        App.jsx         │◄────────────────┐
                  │  (State & API Sync)    │                 │
                  └──────────┬─────────────┘                 │
                             │                               │
        ┌────────────────────┼────────────────────┐          │
        ▼                    ▼                    ▼          │
┌──────────────┐     ┌───────────────┐     ┌──────────────┐  │
│ ExpenseForm  │     │ExpenseFilters │     │ MonthlySumm  │  │
│  (Add/Edit)  │     │   (Filters)   │     │  (Progress)  │  │
└──────┬───────┘     └───────┬───────┘     └──────────────┘  │
       │                     │                               │
       │ Submits Form        │ Updates Filters               │ Updates State
       ▼                     ▼                               │ (Refetch API)
 ┌──────────┐          ┌──────────┐          ┌──────────────┐│
 │ onSubmit ├─────────►│ onFilter ├─────────►│ ExpenseList  ├┘
 └──────────┘          └──────────┘          │ (Edit/Delete)│
                                             └──────────────┘
```
