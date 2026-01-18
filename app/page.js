'use client';

import { useState, useEffect, Suspense } from 'react';
import CharacterCard from './components/CharacterCard';
import styles from './page.module.css';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

function HomeContent() {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({});
  const [films, setFilms] = useState([]);
  const [tvShows, setTvShows] = useState([]);
  const [showFilmsList, setShowFilmsList] = useState(false);
  const [showTvShowsList, setShowTvShowsList] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const search = searchParams.get('search') || '';
  const filterType = searchParams.get('filterType') || '';
  const filterTitle = searchParams.get('filterTitle') || '';
  const page = searchParams.get('page') || '1';
  const limit = searchParams.get('limit') || '15';

  useEffect(() => {
    fetchCharacters();
    fetchMedia();
  }, [search, filterType, filterTitle, page, limit]);

  async function fetchCharacters() {
    setLoading(true);
    try {
      const params = new URLSearchParams({ search, page, limit });
      if (filterType && filterTitle) {
        params.set('filterType', filterType);
        params.set('filterTitle', filterTitle);
      }
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

  async function fetchMedia() {
    try {
      const res = await fetch('/api/media');
      const data = await res.json();
      setFilms(data.films || []);
      setTvShows(data.tvShows || []);
    } catch (error) {
      console.error('Failed to fetch media', error);
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

  function selectFilm(filmTitle) {
    updateParams('filterType', 'films');
    const params = new URLSearchParams(searchParams);
    params.set('filterType', 'films');
    params.set('filterTitle', filmTitle);
    params.set('page', '1');
    router.replace(`${pathname}?${params.toString()}`);
    setShowFilmsList(false);
  }

  function selectTvShow(showTitle) {
    updateParams('filterType', 'tvShows');
    const params = new URLSearchParams(searchParams);
    params.set('filterType', 'tvShows');
    params.set('filterTitle', showTitle);
    params.set('page', '1');
    router.replace(`${pathname}?${params.toString()}`);
    setShowTvShowsList(false);
  }

  function clearFilter() {
    const params = new URLSearchParams(searchParams);
    params.delete('filterType');
    params.delete('filterTitle');
    params.set('page', '1');
    router.replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div className={styles.container}>
      <div style={{ position: 'fixed', top: '2rem', left: '2rem', zIndex: 100 }}>
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
            <div style={{ position: 'relative' }}>
              <button
                className={`btn ${showFilmsList || filterType === 'films' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => {
                  setShowFilmsList(!showFilmsList);
                  setShowTvShowsList(false);
                }}
              >
                Films
              </button>
              {showFilmsList && films.length > 0 && (
                <div className={styles.dropdown}>
                  {films.map(film => (
                    <button
                      key={film}
                      className={styles.dropdownItem}
                      onClick={() => selectFilm(film)}
                    >
                      {film}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div style={{ position: 'relative' }}>
              <button
                className={`btn ${showTvShowsList || filterType === 'tvShows' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => {
                  setShowTvShowsList(!showTvShowsList);
                  setShowFilmsList(false);
                }}
              >
                TV Shows
              </button>
              {showTvShowsList && tvShows.length > 0 && (
                <div className={styles.dropdown}>
                  {tvShows.map(show => (
                    <button
                      key={show}
                      className={styles.dropdownItem}
                      onClick={() => selectTvShow(show)}
                    >
                      {show}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {filterType && (
              <button
                className="btn btn-outline"
                onClick={clearFilter}
              >
                Clear Filter ({filterTitle})
              </button>
            )}
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', justifyContent: 'center' }}>
            <label htmlFor="limit-select" style={{ color: 'var(--muted)' }}>Items per page:</label>
            <select
              id="limit-select"
              className="input"
              value={limit}
              onChange={(e) => updateParams('limit', e.target.value)}
              style={{ width: '100px' }}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
              <option value="30">30</option>
            </select>
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
