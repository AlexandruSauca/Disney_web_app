# Project Documentation

## 1. Technologies Used

This web application is built with a modern, performance-focused stack:

### **Framework: Next.js (App Router)**
- **Why?**: It provides a powerful framework for building React applications with server-side rendering, API routes, and file-based routing.
- **Usage**: Used for all pages (`app/`), API endpoints (`app/api/`), and layout management.

### **Database: SQLite (via `better-sqlite3`)**
- **Why?**: A serverless, high-performance, self-contained SQL database. It avoids the complexity of setting up a separate MySQL/PostgreSQL server while offering full SQL capabilities for this scale.
- **Usage**: Stores character data and user accounts in `disney.db`.

### **Styling: Vanilla CSS (CSS Modules)**
- **Why?**: Provides full control over design without the overhead of external libraries. CSS Modules ensure styles are scoped to components, preventing global side effects.
- **Usage**: All `.module.css` files (e.g., `page.module.css`).

### **Authentication: Session Cookies + bcryptjs**
- **Why?**: Securely handles user access. `bcryptjs` is used to hash passwords so they are never stored in plain text. HTTP-only cookies prevent client-side script access to auth tokens. 
- **Details**: Session cookies are valid for **24 hours**.
- **Usage**: Login/Register APIs and Middleware.

---

## 2. File Functionality Tour

### **Core Configuration**
- **`package.json`**: Defines dependencies and scripts (e.g., `npm run db:setup`).
- **`middleware.js`**: Global security guard. Intercepts every request to check if the user is logged in. Redirects to `/login` if authentication is missing.

### **Database Layer**
- **`lib/db.js`**: Creates and exports the reusable database connection. Configures performance settings (WAL mode).
- **`scripts/import-db.js`**: One-time script to parse the MySQL `disney_characters.sql` dump and import it into SQLite.
- **`scripts/migrate_users.js`**: Creates the `users` table and seeds the default admin account.

### **Public Pages (`app/`)**
- **`page.js`**: The Homepage. Fetches characters, handles Search/Filter/Pagination state, and displays the grid of `CharacterCard`s.
- **`page.module.css`**: Styles for the homepage.
- **`character/[id]/page.js`**: Dynamic Route for character details. Fetches and displays data for a specific character ID.

### **Admin Panel (`app/admin/`)**
- **`layout.js`**: Admin-specific layout containing the Sidebar (Dashboard, Add New, View Site, Logout).
- **`page.js`**: Dashboard view. Lists all characters in a table with Edit/Delete actions.
- **`add/page.js`**: Wrapper for the `CharacterForm` to create new entries.
- **`edit/[id]/page.js`**: Wrapper that fetches existing data and passes it to `CharacterForm` for updates.
- **`components/CharacterForm.js`**: Reusable form component handling the logic for both creating and updating characters (including image handling).

### **Authentication (`app/`)**
- **`login/page.js`**: Login form.
- **`register/page.js`**: Registration form.
- **`api/auth/login/route.js`**: Validates credentials against the DB and sets the auth cookie.
- **`api/auth/register/route.js`**: Hashes the password and creates a new user in the DB.
- **`api/auth/logout/route.js`**: Destroys the auth cookie.

### **Backend APIs (`app/api/`)**
- **`characters/route.js`**:
    - `GET`: Returns list of characters (supports `?search`, `?filter`, `?page`).
    - `POST`: Creates a new character.
- **`characters/[id]/route.js`**:
    - `GET`: Returns a single character.
    - `PUT`: Updates a character.
    - `DELETE`: Deletes a character.
