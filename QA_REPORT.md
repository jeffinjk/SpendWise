# QA Report

## Overview
This document provides a concise engineering validation report demonstrating that the SpendWise application has been tested and verified against the assignment requirements.

## Requirement Verification

| Requirement | Status | Notes |
| :--- | :---: | :--- |
| **Create Expense** | PASS | Form validation prevents submission of invalid fields; successfully saves to SQLite database. |
| **View Expenses** | PASS | Lists all expenses displaying title, category badge, amount, date, and note, sorted by date (most recent first) and ID descending. |
| **Edit Expense** | PASS | Clicking the edit button populates the form with existing record values; form submission updates the record in the database. |
| **Delete Expense** | PASS | Triggers browser-native confirmation prompt; deletes the record from database on approval. |
| **Monthly Summary** | PASS | Displays the correct total monthly expenditure and category-wise percentage breakdown with visual progress bars. |
| **Category Filter** | PASS | Restricts the list display to the selected category. |
| **Date Range Filter**| PASS | Restricts list display to records falling between the specified start and end dates. |
| **Title Search** | PASS | Filters list using case-insensitive partial matching against expense titles. |
| **Data Persistence** | PASS | Records are stored in a local SQLite file (`backend/expenses.db`) and persist between application instances. |

## Edge Cases Tested

| Edge Case | Status | Notes |
| :--- | :---: | :--- |
| **Empty title** | PASS | Client-side validator blocks submission and displays a clear error warning. |
| **Amount = 0** | PASS | Validator blocks submission and requires a value greater than 0. |
| **Negative amount** | PASS | Validator blocks submission and requires a value greater than 0. |
| **Empty database** | PASS | UI displays a fallback empty state component showing "No Expenses Found". |
| **No search results** | PASS | Filtering that returns zero matches displays the empty state message. |
| **Invalid date range**| PASS | Setting the start date after the end date results in zero displayed records. |
| **Refresh persistence**| PASS | Local application state is refreshed from backend API queries on page reload. |
| **Backend restart persistence** | PASS | Terminating and restarting the backend server process retains all records. |

## Bugs Identified and Resolved

| Issue | Severity | Resolution |
| :--- | :---: | :--- |
| **Currency formatting mismatch** | Low | Updated formatters to use the `en-IN` locale and `INR` currency code; changed form label from `Amount ($)` to `Amount (₹)`. |
| **Untracked backend database file**| Medium | Created a root `.gitignore` configuration file to prevent committing local databases (`expenses.db`), `node_modules`, and local environments. |

## Environment Validation

### Backend Startup Verification
* **Command**:
  ```bash
  cd backend
  npm start
  ```
* **Output**:
  ```
  Connecting to SQLite database at: C:\Users\jeffi\.gemini\antigravity\scratch\expense-tracker\backend\expenses.db
  Server is running on http://localhost:5000
  Connected to the SQLite database.
  Expenses table initialized.
  ```

### Frontend Startup Verification
* **Command**:
  ```bash
  cd frontend
  npm run dev
  ```
* **Output**:
  ```
  VITE v5.4.21  ready in 338 ms
  ➜  Local:   http://localhost:5173/
  ```

### Production Build Verification
* **Command**:
  ```bash
  cd frontend
  npm run build
  ```
* **Output**:
  Successfully builds production assets into the `frontend/dist` directory.

### SQLite Database Verification
* Verified using SQLite query commands to verify schema validation and check row counts.

## Final Assessment
* **Requirement Coverage Percentage**: 100%
* **Overall Status**: **PASS**
* **Summary**: The SpendWise application satisfies all specified project requirements. The system persists data reliably, handles input boundary cases, and provides real-time client-side synchronization with backend states.
