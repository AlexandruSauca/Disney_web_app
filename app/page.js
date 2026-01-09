'use client';

import { useState, useEffect, Suspense } from 'react';
import CharacterCard from './components/CharacterCard';
import styles from './page.module.css';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

function HomeContent() {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({});

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const search = searchParams.get('search') || '';
  const filter = searchParams.get('filter') || 'all';
  const page = searchParams.get('page') || '1';

  useEffect(() => {
    fetchCharacters();
  }, [search, filter, page]);

  async function fetchCharacters() {
    setLoading(true);
    try {
      const params = new URLSearchParams({ search, filter, page, limit: 15 });
      const res = await fetch(`/api/characters?${params}`);
      const data = await res.json();
      setCharacters(data.data);
      setMeta(data.meta);
    } catch (error) {
      console.error('Failed to fetch', error);
    } finally {
      setLoading(false);
    }
  }

  function updateParams(key, value) {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    // Reset page on filter/search change
    if (key !== 'page') params.set('page', '1');

    router.replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div className={styles.container}>
      <div style={{ position: 'absolute', top: '2rem', left: '2rem' }}>
        <a href="/admin" className="btn btn-outline btn-sm">Go to Admin Panel</a>
      </div>
      <header className={styles.header}>
        <h1 className={styles.title}>Disney Characters</h1>

        <div className={styles.controls}>
          <input
            type="text"
            placeholder="Search characters..."
            className="input"
            value={search}
            onChange={(e) => updateParams('search', e.target.value)}
          />

          <div className={styles.filters}>
            <button
              className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => updateParams('filter', 'all')}
            >
              All
            </button>
            <button
              className={`btn ${filter === 'films' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => updateParams('filter', 'films')}
            >
              Movies
            </button>
            <button
              className={`btn ${filter === 'tvShows' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => updateParams('filter', 'tvShows')}
            >
              TV Shows
            </button>
          </div>
        </div>
      </header>

      <main>
        {loading ? (
          <div className={styles.loading}>Loading magic...</div>
        ) : (
          <>
            {characters.length === 0 ? (
              <p className={styles.empty}>No characters found.</p>
            ) : (
              <div className={styles.grid}>
                {characters.map(char => (
                  <CharacterCard key={char.id} character={char} />
                ))}
              </div>
            )}

            <div className={styles.pagination}>
              <button
                className="btn btn-outline"
                disabled={meta.page <= 1}
                onClick={() => updateParams('page', String(meta.page - 1))}
              >
                Previous
              </button>
              <span className={styles.pageInfo}>
                Page {meta.page} of {meta.totalPages}
              </span>
              <button
                className="btn btn-outline"
                disabled={meta.page >= meta.totalPages}
                onClick={() => updateParams('page', String(meta.page + 1))}
              >
                Next
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className={styles.loading}>Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}
