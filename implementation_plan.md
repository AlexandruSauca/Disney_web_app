# Implementation Plan - Web Application with Admin Panel

## Problem Description
The user needs a functional web application with an Admin Panel (CRUD, Auth) and a Public Frontend (List, Filter, Search, Details). The app must effectively handle data (likely from `disney_characters.sql`) and images stored as Base64 Data URIs.

## User Review Required
> [!IMPORTANT]
> **Database Choice**: I will use **SQLite** via `better-sqlite3` within Next.js. This avoids the need for a separate database server (like MySQL) and keeps the project self-contained. I will attempt to parse `disney_characters.sql` to populate the initial database.

> [!NOTE]
> **Styling**: As requested, I will use **Vanilla CSS** (likely with CSS Modules for component-level scoping) to ensure a high-quality, "wow" design without relying on TailwindCSS unless explicitly approved.

## Proposed Changes

### Project Structure
- **Framework**: Next.js (App Router)
- **Database**: SQLite (`better-sqlite3`)
- **Styling**: Vanilla CSS (CSS Modules)

### [Backend / Database]
#### [NEW] `lib/db.js`
- Database connection setup.
- Helper functions to query data.
#### [NEW] `scripts/init_db.js`
- Script to read `disney_characters.sql` and initialize the SQLite database `database.sqlite`.
- Will parse the SQL dump to extract structure and data.

### [Authentication]
#### [NEW] `app/login/page.js`
- Simple login form.
- Hardcoded credentials (admin/admin) or simple DB check for demo purposes.
#### [NEW] `lib/auth.js` or API Route
- Session handling (cookie-based).

### [API Routes]
#### [NEW] `app/api/auth/route.js` (Login/Logout)
#### [NEW] `app/api/characters/route.js`
- GET (List with pagination/search/filter)
- POST (Create new character)
#### [NEW] `app/api/characters/[id]/route.js`
- GET (Detail)
- PUT (Update)
- DELETE (Remove)

### [Authentication - Update]
#### [NEW] `scripts/migrate_users.js`
- Create `users` table (id, username, password_hash).
- Insert default admin user.

#### [MODIFY] `lib/db.js`
- Ensure `users` table exists on connection if not using migration script.

#### [NEW] `app/register/page.js`
- Public registration form (username, password).
- POST to `/api/auth/register`.

#### [NEW] `app/api/auth/register/route.js`
- Validate input.
- Check if user exists.
- Hash password (using `bcryptjs` or `crypto`).
- Insert into DB.

#### [MODIFY] `app/api/auth/login/route.js`
- Replace hardcoded check with DB lookup and password verification.

#### [MODIFY] `task.md`
- Add new tasks for User Registration and DB Auth.

### [Frontend - Public]
#### [NEW] `app/page.js`
- Grid/List view of characters.
- Search input.
- Filter buttons (e.g., by Movie, Type - dependent on SQL schema).
- Pagination controls.
#### [NEW] `app/character/[id]/page.js`
- Detailed view with image, name, description, etc.

### [Frontend - Admin]
#### [NEW] `app/admin/page.js`
- Dashboard table view.
- Buttons to Edit/Delete.
- "Add New" button.
#### [NEW] `app/admin/edit/[id]/page.js` & `app/admin/add/page.js`
- Form for editing/adding.
- Image upload (convert to Base64).

## Verification Plan

### Automated Tests
- None planned initially (speed focus), can add Jest if time permits.

### Manual Verification
1.  **Setup**: Run `npm run init-db` to verify database creation.
2.  **Auth**: Try accessing `/admin` without login (should redirect). Login with credentials (should succeed).
3.  **Public View**:
    - Check if list loads.
    - Test Search: Data should filter.
    - Test Pagination: Next/Prev buttons work.
    - Test Filters: Click buttons, data updates.
4.  **Admin CRUD**:
    - **Create**: Add a new character with image. Verify it appears on public list.
    - **Edit**: Change name of existing character. Verify update.
    - **Delete**: Remove a character. Verify it's gone.
