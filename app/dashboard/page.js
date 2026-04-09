'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotes, deleteNote } from '@/store/slices/notesSlice';
import { checkAuthStatus } from '@/store/slices/authSlice';
import Navbar from '@/components/Navbar';
import NoteCard from '@/components/NoteCard';
import NoteEditor from '@/components/NoteEditor';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [selectedNote, setSelectedNote] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  
  const dispatch = useDispatch();
  const router = useRouter();
  const { notes, isLoading: notesLoading } = useSelector((state) => state.notes);
  const { user, isCheckingAuth } = useSelector((state) => state.auth);
  
  // Check authentication on page load
  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isCheckingAuth && !user) {
      router.push('/login');
    }
  }, [isCheckingAuth, user, router]);
  
  // Fetch notes when user is authenticated
  useEffect(() => {
    if (user) {
      dispatch(fetchNotes());
    }
  }, [dispatch, user]);
  
  // Show loading while checking auth
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }
  
  // Don't render anything if not authenticated (will redirect)
  if (!user) {
    return null;
  }
  
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      dispatch(deleteNote(id));
    }
  };
  
  if (showEditor) {
    return (
      <>
        <Navbar />
        <NoteEditor
          note={selectedNote}
          onClose={() => {
            setShowEditor(false);
            setSelectedNote(null);
          }}
        />
      </>
    );
  }
  
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">My Notes</h1>
          <button
            onClick={() => {
              setSelectedNote(null);
              setShowEditor(true);
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition flex items-center space-x-2"
          >
            <span>+</span>
            <span>New Note</span>
          </button>
        </div>
        
        {notesLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading notes...</p>
          </div>
        ) : notes.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500 text-lg">No notes yet.</p>
            <p className="text-gray-400 mt-2">Click &quot;New Note&quot; to create your first note!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <NoteCard
                key={note._id}
                note={note}
                onEdit={() => {
                  setSelectedNote(note);
                  setShowEditor(true);
                }}
                onDelete={() => handleDelete(note._id)}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}