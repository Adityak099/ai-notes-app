import { connectDB } from "@/lib/db";
import Notes from "@/models/Notes";
import { verifyToken } from "@/lib/auth";
import { summarizeText } from "@/lib/openai";
import { NextResponse } from "next/server";

async function getUserId(request) {
  const token = request.cookies.get("token")?.value;
  const decoded = verifyToken(token);
  return decoded?.userId;
}

export async function POST(request, { params }) {
  try {
    const userId = await getUserId(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    await connectDB();
    const note = await Notes.findOne({ _id: id, userId });

    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    // Generate summary
    const summary = await summarizeText(note.content);

    // Save summary to note
    note.summary = summary;
    await note.save();

    return NextResponse.json({ summary });
  } catch (error) {
    console.error("Summarize error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
