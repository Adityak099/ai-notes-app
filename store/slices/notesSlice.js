import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const getBaseUrl = () => {
  return typeof window !== 'undefined' ? '' : process.env.NEXTAUTH_URL;
};

export const fetchNotes = createAsyncThunk(
  'notes/fetchNotes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${getBaseUrl()}/api/notes`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch notes');
    }
  }
);

export const createNote = createAsyncThunk(
  'notes/createNote',
  async (noteData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${getBaseUrl()}/api/notes`, noteData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create note');
    }
  }
);

export const updateNote = createAsyncThunk(
  'notes/updateNote',
  async ({ id, noteData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${getBaseUrl()}/api/notes/${id}`, noteData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update note');
    }
  }
);

export const deleteNote = createAsyncThunk(
  'notes/deleteNote',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${getBaseUrl()}/api/notes/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete note');
    }
  }
);

export const summarizeNote = createAsyncThunk(
  'notes/summarizeNote',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${getBaseUrl()}/api/notes/${id}/summarize`);
      return { id, summary: response.data.summary };
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to summarize note');
    }
  }
);

const notesSlice = createSlice({
  name: 'notes',
  initialState: {
    notes: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch notes
      .addCase(fetchNotes.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchNotes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notes = action.payload;
      })
      .addCase(fetchNotes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create note
      .addCase(createNote.fulfilled, (state, action) => {
        state.notes.unshift(action.payload);
      })
      // Update note
      .addCase(updateNote.fulfilled, (state, action) => {
        const index = state.notes.findIndex(note => note._id === action.payload._id);
        if (index !== -1) {
          state.notes[index] = action.payload;
        }
      })
      // Delete note
      .addCase(deleteNote.fulfilled, (state, action) => {
        state.notes = state.notes.filter(note => note._id !== action.payload);
      })
      // Summarize note
      .addCase(summarizeNote.fulfilled, (state, action) => {
        const note = state.notes.find(n => n._id === action.payload.id);
        if (note) {
          note.summary = action.payload.summary;
        }
      });
  },
});

export const { clearError } = notesSlice.actions;
export default notesSlice.reducer;