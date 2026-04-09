'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createNote, updateNote, summarizeNote } from '@/store/slices/notesSlice';

export default function NoteEditor({ note, onClose }) {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summary, setSummary] = useState(note?.summary || '');
  const [showFullSummary, setShowFullSummary] = useState(false);
  
  const dispatch = useDispatch();
  
  const handleSave = async () => {
    if (!title.trim() && !content.trim()) {
      alert('Please add title or content');
      return;
    }
    
    if (note) {
      await dispatch(updateNote({ id: note._id, noteData: { title, content } }));
    } else {
      await dispatch(createNote({ title, content }));
    }
    onClose();
  };
  
  const handleSummarize = async () => {
    if (!content.trim()) {
      alert('Please add some content to summarize');
      return;
    }
    
    setIsSummarizing(true);
    const result = await dispatch(summarizeNote(note._id));
    if (result.payload?.summary) {
      setSummary(result.payload.summary);
    }
    setIsSummarizing(false);
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">
              {note ? 'Edit Note' : 'Create New Note'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>
          
          <input
            type="text"
            placeholder="Note Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <textarea
            placeholder="Write your note content here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={12}
            className="w-full px-3 py-2 border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
          />
          
          {summary && (
            <div className="bg-blue-50 p-3 rounded-lg mb-3">
              <h3 className="font-semibold mb-1 text-blue-900">🤖 AI Summary</h3>
              <p className="text-sm text-blue-800">{summary}</p>
              <button
                onClick={() => setShowFullSummary(true)}
                className="mt-3 text-sm font-medium text-blue-700 underline-offset-2 hover:underline"
              >
                View Full Summary
              </button>
            </div>
          )}
          
          <div className="flex space-x-2">
            {note && (
              <button
                onClick={handleSummarize}
                disabled={isSummarizing}
                className="flex-1 bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition disabled:opacity-50"
              >
                {isSummarizing ? 'Summarizing...' : '✨ Generate AI Summary'}
              </button>
            )}
            
            <button
              onClick={handleSave}
              className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
            >
              💾 Save Note
            </button>
          </div>
        </div>
      </div>

      {showFullSummary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Full Summary</h3>
              <button
                onClick={() => setShowFullSummary(false)}
                className="text-2xl text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto rounded-lg bg-blue-50 p-4 text-sm leading-7 text-blue-900">
              {summary}
            </div>
            <button
              onClick={() => setShowFullSummary(false)}
              className="mt-4 w-full rounded-lg bg-blue-500 py-2 text-white transition hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
