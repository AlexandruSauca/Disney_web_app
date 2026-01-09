'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './CharacterForm.module.css';

export default function CharacterForm({ initialData = {}, isEdit = false }) {
    const [name, setName] = useState(initialData.name || '');
    const [imageUrl, setImageUrl] = useState(initialData.image || '');
    const [films, setFilms] = useState(initialData.films?.join(', ') || '');
    const [tvShows, setTvShows] = useState(initialData.tvShows?.join(', ') || '');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleImageUpload(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);

        const payload = {
            name,
            image: imageUrl, // storage key is 'image'
            films: films.split(',').map(s => s.trim()).filter(Boolean),
            tvShows: tvShows.split(',').map(s => s.trim()).filter(Boolean),
            url: initialData.url || '', // Preserve or add field if needed
        };

        try {
            const method = isEdit ? 'PUT' : 'POST';
            const url = isEdit ? `/api/characters/${initialData.id}` : '/api/characters';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                router.push('/admin');
                router.refresh();
            } else {
                alert('Failed to save');
            }
        } catch (error) {
            console.error(error);
            alert('Error occurred');
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
                <label>Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="input"
                />
            </div>

            <div className={styles.field}>
                <label>Image</label>
                <div className={styles.imageInput}>
                    <input
                        type="text"
                        placeholder="Image URL"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        className="input"
                    />
                    <span className={styles.or}>OR</span>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                    />
                </div>
                {imageUrl && (
                    <div className={styles.preview}>
                        <img src={imageUrl} alt="Preview" />
                    </div>
                )}
            </div>

            <div className={styles.field}>
                <label>Films (comma separated)</label>
                <textarea
                    value={films}
                    onChange={(e) => setFilms(e.target.value)}
                    className={styles.textarea}
                    rows={3}
                />
            </div>

            <div className={styles.field}>
                <label>TV Shows (comma separated)</label>
                <textarea
                    value={tvShows}
                    onChange={(e) => setTvShows(e.target.value)}
                    className={styles.textarea}
                    rows={3}
                />
            </div>

            <div className={styles.actions}>
                <button type="button" onClick={() => router.back()} className="btn btn-outline">
                    Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Saving...' : (isEdit ? 'Update Character' : 'Create Character')}
                </button>
            </div>
        </form>
    );
}
