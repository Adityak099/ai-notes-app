export default function NoteCard({ note, onEdit, onDelete }) {
  const getPreview = (content) => {
    return content.length > 100 ? content.substring(0, 100) + '...' : content;
  };
  
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <h3 className="text-xl font-semibold mb-2">
        {note.title || 'Untitled'}
      </h3>
      
      <p className="text-gray-600 mb-3">
        {getPreview(note.content)}
      </p>
      
      {note.summary && (
        <div className="bg-blue-50 p-2 rounded mb-3 text-sm">
          <span className="font-semibold">AI Summary:</span>
          <p className="text-gray-700 mt-1">{note.summary}</p>
        </div>
      )}
      
      <div className="text-xs text-gray-400 mb-3">
        Updated: {formatDate(note.updatedAt)}
      </div>
      
      <div className="flex space-x-2">
        <button
          onClick={onEdit}
          className="flex-1 bg-yellow-500 text-white py-1 rounded hover:bg-yellow-600 transition"
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="flex-1 bg-red-500 text-white py-1 rounded hover:bg-red-600 transition"
        >
          Delete
        </button>
      </div>
    </div>
  );
}