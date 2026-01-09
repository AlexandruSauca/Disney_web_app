# Walkthrough - Disney Character Web App

I have built a web application with Next.js, SQLite, and Vanilla CSS. It features a public character list and a private admin panel.

## Features Implemented
- **Protected Frontend**: The entire application requires login.
- **Admin Panel**: Secure dashboard to manage characters (Create, Edit, Delete).
- **Authentication**: Multi-user system with Registration and Login (Database-backed).
- **Database**: Imported ~500 characters from `disney_characters.sql`, plus a `users` table.

## How to Run
1. Start the development server:
   ```bash
   npm run dev
   ```
2. Open [http://localhost:3000](http://localhost:3000)

## Verification Steps

### 1. Security Check
- [ ] Open the homepage URL (`/`) in an incognito window.
- [ ] Verify you are redirected to `/login`.
- [ ] Try accessing `/admin` directly. Verify redirect to `/login`.

### 2. User Registration & Login
- [ ] On `/login`, click "Register".
- [ ] Sign up with a new username/password.
- [ ] Login.
- [ ] Verify you can now see the Character List and Admin Dashboard.

### 3. Manage Characters (CRUD)
- [ ] **Create**: Click "Add New", enter a name (e.g., "Test Hero"), and upload a small image or paste a URL. Click Save.
- [ ] **Verify**: Go to the public homepage and search for "Test Hero".
- [ ] **Edit**: In Admin Dashboard, find "Test Hero", click "Edit". Change name to "Super Test". Save.
- [ ] **Delete**: In Admin Dashboard, click "Delete" on "Super Test". Verify it's gone from the list.
