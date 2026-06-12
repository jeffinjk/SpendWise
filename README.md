# SpendWise

## Overview
SpendWise is a single-page web application for tracking personal expenses. It allows users to log daily expenses, filter items, and view a monthly breakdown. The application is built using a React frontend, a Node.js/Express backend, and a local SQLite database.

## Architecture
```
React Frontend
↓
Express REST API
↓
SQLite Database (expenses.db)
```

## Features
- Create, read, update, and delete (CRUD) expense records.
- Concurrent filtering of expenses by category, date range, and text search.
- Monthly spending summary with a category-wise breakdown.
- Input validation (positive amounts, required fields, and predefined categories).
- Persistence of records in a local database file.

## Technology Stack

### Frontend
- React
- Vite

### Backend
- Node.js
- Express

### Database
- SQLite

## Project Structure
```
expense-tracker/
├── backend/
│   ├── database.js             # SQLite DB initialization & helper queries
│   ├── expenses.db             # SQLite database file
│   ├── package.json            # Node backend dependencies
│   └── server.js               # Express API endpoints & middleware
├── frontend/
│   ├── package.json            # Vite frontend dependencies
│   ├── vite.config.js          # Vite configuration
│   └── src/
│       ├── App.jsx             # Main React entry point and state container
│       ├── index.css           # UI styling rules
│       ├── main.jsx            # React mounting setup
│       └── components/
│           ├── ExpenseFilters.jsx  # Category, date-range, and text filters
│           ├── ExpenseForm.jsx     # Add/Edit form with validation
│           ├── ExpenseList.jsx     # Expense list with edit/delete callbacks
│           └── MonthlySummary.jsx  # Spending aggregation & breakdown
├── README.md
└── PROJECT_CONTEXT.md
```

## Prerequisites
- Node.js (v20.16.0 or higher recommended)
- npm (automatically installed with Node.js)

## Setup Instructions
1. Clone the repository and navigate to the project root directory.
2. Install the backend dependencies:
   ```bash
   cd backend
   npm install
   ```
3. Install the frontend dependencies:
   ```bash
   cd ../frontend
   npm install --legacy-peer-deps
   ```

## Running the Application
To run the application, start both the backend server and the frontend development server.

### Backend Commands
1. Navigate to the `backend` directory and run:
   ```bash
   cd backend
   npm start
   ```
   *Note: On startup, the server runs on `http://localhost:5000` and automatically initializes the SQLite database file (`expenses.db`) with seed data if it does not already exist.*

### Frontend Commands
1. Navigate to the `frontend` directory and run:
   ```bash
   cd frontend
   npm run dev
   ```
   *Note: The frontend development server runs on `http://localhost:5173`.*

## API Overview
All API endpoints are prefixed with `/api`.

- **`GET /api/expenses`**: Retrieves a list of expenses. Supports optional query parameters: `category`, `startDate`, `endDate`, and `search`.
- **`POST /api/expenses`**: Creates a new expense. Expects a JSON request body containing `title`, `amount`, `category`, `date`, and an optional `note`.
- **`PUT /api/expenses/:id`**: Updates an existing expense. Expects a JSON request body with the updated fields.
- **`DELETE /api/expenses/:id`**: Deletes an expense by ID.
- **`GET /api/summary`**: Retrieves the spending summary for the current month, including total spent and a category breakdown.

## Design Decisions and Tradeoffs

- **Why React**: React's component-driven model facilitates building modular UI elements (list, form, filters, summary) and managing local state interactively.
- **Why Express**: A minimalist and lightweight framework that allows setting up REST endpoints with minimal dependency overhead.
- **Why SQLite**: A file-based database that requires no external setup, configuration, or separate background process, which ensures zero-configuration local execution.
- **Why single-page architecture**: Simplifies state synchronization across the filters, list, form, and monthly summary by managing the data in a central parent component.

## Completed Requirements
- Full CRUD capabilities for expense records.
- Input validation (valid category choice, non-empty title, and amount > 0).
- Multi-criteria filtering working concurrently.
- SQLite database integration for local persistence.
- Auto-initialization and seeding of the database on first run.

## Known Limitations
- **Current Month Only Summary**: The monthly summary only aggregates data for the server's current calendar month and does not dynamically adjust based on date filters.
- **Single-User Concurrency**: SQLite's file locking restricts high write concurrency, making this suitable for local single-user deployments.

## Future Improvements
- **Authentication**: JWT-based user authentication and route protection.
- **Pagination**: Server-side pagination to efficiently handle large expense lists.
- **Export functionality**: Ability to export expense reports to CSV or Excel.
- **Charts**: Integration of charting libraries (e.g., Recharts) for visualization.
- **Multi-user support**: Data isolation by partitioning user accounts.
