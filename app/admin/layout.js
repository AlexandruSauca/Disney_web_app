'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './admin.module.css';

export default function AdminLayout({ children }) {
    const router = useRouter();

    async function handleLogout() {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/login');
    }

    return (
        <div className={styles.layout}>
            <aside className={styles.sidebar}>
                <div className={styles.brand}>Admin Panel</div>
                <nav className={styles.nav}>
                    <Link href="/admin" className={styles.navItem}>Dashboard</Link>
                    <Link href="/admin/add" className={styles.navItem}>Add Character</Link>
                    <Link href="/" className={styles.navItem}>View Site</Link>
                </nav>
                <button onClick={handleLogout} className={styles.logoutBtn}>
                    Logout
                </button>
            </aside>
            <main className={styles.main}>
                {children}
            </main>
        </div>
    );
}
