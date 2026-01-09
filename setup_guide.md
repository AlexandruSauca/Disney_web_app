# Setup & Installation Guide

Follow these steps to run the Disney Character Web App on a new machine.

## 1. Prerequisites
- **Node.js**: Version 18.0.0 or higher.
- **npm**: Included with Node.js.

## 2. Installation
Open your terminal in the project directory and run:

```bash
npm install
```

This will look at `package.json` and install all necessary dependencies, including:
- `next`, `react`, `react-dom` (Core Framework)
- `better-sqlite3` (Database Driver)
- `bcryptjs` (Password Hashing)

## 3. Database Setup
Before running the app, you need to initialize the database and creating the users table.

1.  **Import Character Data**:
    ```bash
    npm run db:setup
    ```
    *This creates `disney.db` and imports data from `disney_characters.sql`.*

2.  **Initialize User System**:
    ```bash
    node scripts/migrate_users.js
    ```
    *This creates the `users` table and a default admin account.*

## 4. Running the Application

### Development Mode
For active development with hot-reloading:
```bash
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000).

### Production Mode
For the best performance (simulating a live deployment):
```bash
npm run build
npm start
```
Visit [http://localhost:3000](http://localhost:3000).

## 5. Default Credentials
- **Username**: `admin`
- **Password**: `admin`
