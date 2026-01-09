'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { use } from 'react'; // React 19/Next 15 params unwrapping
import CharacterForm from '../../components/CharacterForm';

export default function EditCharacterPage({ params }) {
    // Unwrap params in Next.js 15+ if not already async component
    // Since 'use client' component, we receive params as promise
    const resolvedParams = use(params);
    const id = resolvedParams.id;

    const [character, setCharacter] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/characters/${id}`)
            .then(res => res.json())
            .then(data => {
                if (!data.error) setCharacter(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (!character) return <div>Character not found</div>;

    return (
        <div>
            <h1 style={{ marginBottom: '2rem' }}>Edit Character</h1>
            <CharacterForm initialData={character} isEdit={true} />
        </div>
    );
}
