import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const filter = searchParams.get('filter') || 'all'; // e.g. 'films', 'tvShows'
    const filterType = searchParams.get('filterType') || ''; // 'films' or 'tvShows'
    const filterTitle = searchParams.get('filterTitle') || ''; // specific film/tv show title

    // Fetch all data (small dataset optimization)
    const stmt = db.prepare('SELECT id, data FROM data');
    const rows = stmt.all();

    // Parse and map
    let characters = rows.map(row => {
        const data = JSON.parse(row.data);
        return {
            id: row.id,
            ...data
        };
    });

    // Filter
    if (search) {
        const lowerSearch = search.toLowerCase();
        characters = characters.filter(c =>
            c.name?.toLowerCase().includes(lowerSearch)
        );
    }

    if (filterType && filterTitle) {
        // Filter by specific film or TV show
        if (filterType === 'films') {
            characters = characters.filter(c => c.films && c.films.includes(filterTitle));
        } else if (filterType === 'tvShows') {
            characters = characters.filter(c => c.tvShows && c.tvShows.includes(filterTitle));
        }
    } else if (filter !== 'all') {
        // Legacy filter logic: if filter is 'films', check if character has films
        if (filter === 'films') {
            characters = characters.filter(c => c.films && c.films.length > 0);
        } else if (filter === 'tvShows') {
            characters = characters.filter(c => c.tvShows && c.tvShows.length > 0);
        }
    }

    // Pagination
    const total = characters.length;
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginated = characters.slice(start, end);

    return NextResponse.json({
        data: paginated,
        meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    });
}

export async function POST(request) {
    try {
        const body = await request.json();

        // Validation: Name is required
        if (!body.name) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }

        // Insert
        // Use a transaction if doing complex things, but here simple insert
        const stmt = db.prepare('INSERT INTO data (data) VALUES (?)');
        const info = stmt.run(JSON.stringify(body));

        return NextResponse.json({
            success: true,
            id: info.lastInsertRowid,
            ...body
        }, { status: 201 });
    } catch (error) {
        console.error('Create error:', error);
        return NextResponse.json({ error: 'Failed to create character' }, { status: 500 });
    }
}
