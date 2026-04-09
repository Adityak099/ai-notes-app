import { connectDB } from '@/lib/db';
import Notes from '@/models/Notes';
import { verifyToken } from '@/lib/auth';
import { summarizeText } from '@/lib/gemini';
import { NextResponse } from 'next/server';

export async function POST(request, { params }) {
  try {
    const token = request.cookies.get('token')?.value;
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { id } = await params;
    
    await connectDB();
    
    const note = await Notes.findOne({ 
      _id: id, 
      userId: decoded.userId 
    });
    
    if (!note) {
      return NextResponse.json(
        { error: 'Note not found' },
        { status: 404 }
      );
    }
    
    const summary = await summarizeText(note.content);
    
    note.summary = summary;
    await note.save();
    
    return NextResponse.json({ summary });
    
  } catch (error) {
    console.error('Summarize error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
