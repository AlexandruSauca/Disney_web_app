'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function AdminDashboard() {
    const [characters, setCharacters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');

    const router = useRouter();

    useEffect(() => {
        fetchData();
    }, [page, search]);

    async function fetchData() {
        setLoading(true);
        try {
            const params = new URLSearchParams({ page, limit: 10, search });
            const res = await fetch(`/api/characters?${params}`);
            const data = await res.json();
            setCharacters(data.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id) {
        if (!confirm('Are you sure you want to delete this character?')) return;

        try {
            const res = await fetch(`/api/characters/${id}`, { method: 'DELETE' });
            if (res.ok) {
                fetchData(); // Refresh
            } else {
                alert('Failed to delete');
            }
        } catch (error) {
            alert('Error deleting');
        }
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>Dashboard</h1>
                <Link href="/admin/add" className="btn btn-primary">
                    + Add New
                </Link>
            </header>

            <div className={styles.toolbar}>
                <input
                    type="text"
                    placeholder="Search..."
                    className="input"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Films</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5" className={styles.center}>Loading...</td></tr>
                        ) : characters.map(char => (
                            <tr key={char.id}>
                                <td>{char.id}</td>
                                <td>
                                    <img
                                        src={char.image || '/placeholder.png'}
                                        alt={char.name}
                                        className={styles.thumb}
                                    />
                                </td>
                                <td>{char.name}</td>
                                <td>{char.films?.length || 0}</td>
                                <td>
                                    <div className={styles.actions}>
                                        <Link href={`/admin/edit/${char.id}`} className="btn btn-outline btn-sm">
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(char.id)}
                                            className="btn btn-danger btn-sm"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className={styles.pagination}>
                <button
                    className="btn btn-outline"
                    disabled={page <= 1}
                    onClick={() => setPage(p => p - 1)}
                >
                    Previous
                </button>
                <span>Page {page}</span>
                <button
                    className="btn btn-outline"
                    onClick={() => setPage(p => p + 1)}
                >
                    Next
                </button>
            </div>
        </div>
    );
}
