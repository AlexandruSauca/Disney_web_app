import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request, { params }) {
    const { id } = await params; // await params in Next.js 15+ (v16 uses same)

    const stmt = db.prepare('SELECT id, data FROM data WHERE id = ?');
    const row = stmt.get(id);

    if (!row) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const data = JSON.parse(row.data);
    return NextResponse.json({ id: row.id, ...data });
}

export async function PUT(request, { params }) {
    const { id } = await params;

    // Check existence
    const checkValues = db.prepare('SELECT id FROM data WHERE id = ?').get(id);
    if (!checkValues) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    try {
        const body = await request.json();

        // Preserve ID, update data content
        const stmt = db.prepare('UPDATE data SET data = ? WHERE id = ?');
        stmt.run(JSON.stringify(body), id);

        return NextResponse.json({ success: true, id, ...body });
    } catch (error) {
        return NextResponse.json({ error: 'Update failed' }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    const { id } = await params;

    const stmt = db.prepare('DELETE FROM data WHERE id = ?');
    const info = stmt.run(id);

    if (info.changes === 0) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
}
