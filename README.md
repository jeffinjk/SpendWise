# SpendWise - Personal Expense Tracker

SpendWise is a sleek, modern, single-page personal expense tracker built with a Node.js/Express backend, SQLite database, and React/Vite frontend. It features rich glassmorphic aesthetics, fluid micro-interactions, responsive styling, and comprehensive expense management features.

---

## 1. Project Overview

SpendWise helps users track and manage their daily expenses in a beautiful dashboard. It offers:
- **CRUD Operations**: Add, view, edit, and delete expenses.
- **Filtering**: Combine category, date-range, and title-search filters.
- **Monthly Summary**: Monitor total monthly spending and category breakdown.
- **Aesthetic UI**: Responsive glassmorphic layout, dynamic category badges, and modern CSS gradients.

---

## 2. Setup Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) (v20.16.0 or higher recommended)
- [npm](https://www.npmjs.com/) (installed automatically with Node.js)

### Cloning / Navigating
Ensure the files are placed in a folder structure like:
```
expense-tracker/
├── backend/
├── frontend/
├── README.md
└── PROJECT_CONTEXT.md
```

---

## 3. Exact Run Commands

To run the application locally, you need to start both the backend server and the frontend development server.

### Option A: Run Backend Server
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server (runs on `http://localhost:5000`):
   ```bash
   npm start
   ```

On startup, the backend automatically initializes an SQLite database file (`expenses.db`) in the `backend` folder and seeds it with sample data for testing.

### Option B: Run Frontend Development Server
1. Navigate to the `frontend` directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```
3. Start the development server (runs on `http://localhost:5173`):
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173/`.

---

## 4. Stack Choices

- **Frontend**: **React** + **Vite**. React was chosen for component-driven UI and stateful filtering. Vite provides lightning-fast builds and module reloading.
- **Backend**: **Node.js** + **Express**. Simple, lightweight, fast-to-develop API layer.
- **Database**: **SQLite**. A zero-configuration, file-based database that requires no external system services, enabling zero-setup local execution.
- **Styling**: **Vanilla CSS**. Maximizes customization, allows fine-grained layout styling, custom CSS variables, glassmorphic cards, and neon focus ring effects.

---

## 5. Tradeoffs

- **Single-page Layout vs. Multi-page Routing**: All UI elements (form, summary, filters, list) reside on a single page. This speeds up development, removes routing overhead, and allows real-time state sync, but might clutter the viewport on smaller screens.
- **Synchronous SQLite Driver vs. ORM**: Used raw SQL queries through the `sqlite3` driver rather than an ORM (like Prisma or Sequelize) to minimize dependency weight, avoid migration steps, and decrease startup latency.
- **Fetch API vs. Axios**: Used native browser `fetch` in the frontend to avoid installing Axios, keeping frontend dependencies light.
- **CORS Configuration**: Configured global wildcard CORS on the Express backend (`app.use(cors())`) to simplify local cross-port routing without adding proxy headers.

---

## 6. Completed Features

All requested features were successfully implemented:
- [x] **Create Expense**: Validate title, positive amount, allowed categories (Food, Transport, Shopping, Bills, Entertainment, Other), date.
- [x] **View Expenses**: Displays title, amount, category, date, note, sorted by most recent first.
- [x] **Edit Expense**: Modify any field of an existing expense, filling the form automatically.
- [x] **Delete Expense**: Remove an expense with a browser-native confirmation prompt.
- [x] **Monthly Summary**: Calculate total spent and show a category-wise budget breakdown with visual progress bars.
- [x] **Filters**: Search title (partial string), category, and start/end dates working concurrently.
- [x] **Edge Case Handling**: Handled empty states, incorrect amount entries, invalid dates, and zero search matches with clean UI messages.

---

## 7. Skipped Features
- No authentication system (omitted per Development Principles).
- No cloud deployment setup (omitted per Development Principles).
- No external chart libraries (CSS progress bars were used instead to keep bundles minimal and lightweight).

---

## 8. Known Limitations
- **Current Month Only Summary**: The monthly summary only aggregates details for the server's current calendar month. It does not dynamically adjust based on the date range filter.
- **Local Database Only**: Database is written to a local SQLite file. Clearing or deleting `backend/expenses.db` resets the tracker data.
- **Concurrency**: SQLite does not natively support high-concurrency writing, which is acceptable since this is designed for a single-user local deployment.
