import { connectDB } from '@/lib/db';
import Notes from '@/models/Notes';
import { verifyToken } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const token = request.cookies.get('token')?.value;
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const notes = await Notes.find({ userId: decoded.userId }).sort({ updatedAt: -1 });

    return NextResponse.json(notes);
  } catch (error) {
    console.error('GET notes error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const token = request.cookies.get('token')?.value;
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, content } = await request.json();

    await connectDB();

    const note = await Notes.create({
      userId: decoded.userId,
      title: title || 'Untitled',
      content: content || '',
    });

    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    console.error('POST note error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
