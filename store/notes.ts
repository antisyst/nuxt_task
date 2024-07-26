import { defineStore } from 'pinia';
import axios from 'axios';

interface Note {
  id: string;
  content: string;
  date: Date;
}

interface NotesState {
  notes: Note[];
  itemsPerPage: number;
  currentPage: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
}

export const useNotesStore = defineStore('notes', {
  state: (): NotesState => ({
    notes: [],
    itemsPerPage: 10,
    currentPage: 1,
    totalPages: 1,
    loading: false,
    error: null,
  }),
  getters: {
    sortedNotes: (state): Note[] => {
      return [...state.notes].sort((a, b) => b.date.getTime() - a.date.getTime());
    },
    paginatedNotes: (state): Note[] => {
      return state.sortedNotes.slice(0, state.currentPage * state.itemsPerPage);
    },
    getNoteById: (state): (id: string) => Note | undefined => {
      return (id: string) => state.notes.find(note => note.id === id);
    },
    hasMoreNotes: (state): boolean => {
      return state.currentPage < state.totalPages;
    },
  },
  actions: {
    async initialize() {
      this.currentPage = 1;
      this.notes = [];
      await this.loadNotes();
    },
    async loadNotes(page = 1) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get(`http://localhost:8000/notes?page=${page}&limit=${this.itemsPerPage}`);
        const { data, totalPages } = response.data;
        this.notes = [...this.notes, ...data.map((note: any) => ({
          ...note,
          date: new Date(note.date),
        }))];
        this.totalPages = totalPages;
        this.currentPage = page;
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          this.error = error.response?.data?.message || 'Не удалось загрузить заметки.';
        } else {
          this.error = 'Произошла непредвиденная ошибка.';
        }
      } finally {
        this.loading = false;
      }
    },
    async addNote(content: string) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.post('http://localhost:8000/notes', { content });
        const newNote: Note = { ...response.data, date: new Date(response.data.date) };
        this.notes.push(newNote);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          this.error = error.response?.data?.message || 'Не удалось добавить заметку.';
        } else {
          this.error = 'Произошла непредвиденная ошибка.';
        }
      } finally {
        this.loading = false;
      }
    },
    async editNote(id: string, content: string) {
      this.loading = true;
      this.error = null;
      try {
        await axios.put(`http://localhost:8000/notes/${id}`, { content });
        const note = this.notes.find(note => note.id === id);
        if (note) {
          note.content = content;
        }
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          this.error = error.response?.data?.message || 'Не удалось отредактировать заметку.';
        } else {
          this.error = 'Произошла непредвиденная ошибка.';
        }
      } finally {
        this.loading = false;
      }
    },
    async deleteNote(id: string) {
      this.loading = true;
      this.error = null;
      try {
        await axios.delete(`http://localhost:8000/notes/${id}`);
        this.notes = this.notes.filter(note => note.id !== id);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          this.error = error.response?.data?.message || 'Не удалось удалить заметку.';
        } else {
          this.error = 'Произошла непредвиденная ошибка.';
        }
      } finally {
        this.loading = false;
      }
    },
    loadMore() {
      if (this.hasMoreNotes) {
        this.currentPage += 1;
        this.loadNotes(this.currentPage);
      }
    },
  },
});