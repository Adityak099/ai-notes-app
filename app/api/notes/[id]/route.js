import { connectDB } from "@/lib/db";
import Notes from "@/models/Notes";
import { verifyToken } from "@/lib/auth";
import { NextResponse } from "next/server";

async function getUserId(request) {
  const token = request.cookies.get("token")?.value;
  const decoded = verifyToken(token);
  return decoded?.userId;
}

// PUT - Update note
export async function PUT(request, { params }) {
  try {
    const userId = await getUserId(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, content } = await request.json();
    const { id } = params;

    await connectDB();
    const note = await Notes.findOneAndUpdate(
      { _id: id, userId },
      { title, content, updatedAt: Date.now() },
      { new: true },
    );

    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    return NextResponse.json(note);
  } catch (error) {
    console.error("PUT note error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE - Delete note
export async function DELETE(request, { params }) {
  try {
    const userId = await getUserId(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    await connectDB();
    const note = await Notes.findOneAndDelete({ _id: id, userId });

    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("DELETE note error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
