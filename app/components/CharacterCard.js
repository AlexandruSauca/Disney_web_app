import Link from 'next/link';
import Image from 'next/image';
import styles from './CharacterCard.module.css';

export default function CharacterCard({ character }) {
    // Use a fallback image if image is missing or invalid
    const imageUrl = character.image || '/placeholder.png';

    return (
        <Link href={`/character/${character.id}`} className={styles.card}>
            <div className={styles.imageWrapper}>
                <img
                    src={imageUrl}
                    alt={character.name}
                    className={styles.image}
                    loading="lazy"
                />
            </div>
            <div className={styles.content}>
                <h3 className={styles.name}>{character.name}</h3>
                <div className={styles.meta}>
                    {character.films?.length > 0 && (
                        <span className={styles.tag}>Films: {character.films.length}</span>
                    )}
                    {character.tvShows?.length > 0 && (
                        <span className={styles.tag}>TV: {character.tvShows.length}</span>
                    )}
                </div>
            </div>
        </Link>
    );
}
