import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'all'; // 'films', 'tvShows', or 'all'

    // Fetch all data
    const stmt = db.prepare('SELECT data FROM data');
    const rows = stmt.all();

    // Extract all unique films and TV shows
    const films = new Set();
    const tvShows = new Set();

    rows.forEach(row => {
        const data = JSON.parse(row.data);
        if (data.films && Array.isArray(data.films)) {
            data.films.forEach(film => films.add(film));
        }
        if (data.tvShows && Array.isArray(data.tvShows)) {
            data.tvShows.forEach(show => tvShows.add(show));
        }
    });

    const filmsArray = Array.from(films).sort();
    const tvShowsArray = Array.from(tvShows).sort();

    let result = {};
    
    if (type === 'films' || type === 'all') {
        result.films = filmsArray;
    }
    if (type === 'tvShows' || type === 'all') {
        result.tvShows = tvShowsArray;
    }

    return NextResponse.json(result);
}
