import Link from 'next/link';
import styles from './page.module.css';

// Using server component for initial data fetch if simpler, 
// or stick to client component pattern for consistency if we want dynamic updates later.
// Let's use Server Component for details as it's static-ish.
// Actually, standard Next.js 15 App Router:

async function getCharacter(id) {
    // Use absolute URL or relative if on same host (but fetch needs absolute on server usually, or internal logic).
    // For simplicity without hardcoding localhost port, I'll use the DB logic directly or 
    // just fetching from client side. 
    // Let's use direct DB import here for Server Component to avoid HTTP roundtrip overhead/url issues.

    const { default: db } = await import('@/lib/db');
    const stmt = db.prepare('SELECT id, data FROM data WHERE id = ?');
    const row = stmt.get(id);

    if (!row) return null;
    return { id: row.id, ...JSON.parse(row.data) };
}

export default async function CharacterPage({ params }) {
    const { id } = await params;
    const character = await getCharacter(id);

    if (!character) {
        return <div className={styles.container}>Character not found</div>;
    }

    const imageUrl = character.image || '/placeholder.png';

    return (
        <div className={styles.container}>
            <Link href="/" className="btn btn-outline" style={{ marginBottom: '2rem' }}>
                ← Back to List
            </Link>

            <div className={styles.content}>
                <div className={styles.imageWrapper}>
                    <img src={imageUrl} alt={character.name} className={styles.image} />
                </div>

                <div className={styles.info}>
                    <h1 className={styles.title}>{character.name}</h1>

                    <div className={styles.section}>
                        <h2>Main Appearance</h2>
                        <div className={styles.tags}>
                            {character.films?.map(f => <span key={f} className={styles.tag}>{f}</span>)}
                            {character.tvShows?.map(t => <span key={t} className={styles.tag}>{t}</span>)}
                        </div>
                        {(!character.films?.length && !character.tvShows?.length) && <p className={styles.muted}>No media listed.</p>}
                    </div>

                    <div className={styles.section}>
                        <h2>More Info</h2>
                        <p className={styles.url}>
                            <a href={character.url} target="_blank" rel="noreferrer">
                                View on Disney Wiki
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
