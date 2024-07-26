import { defineStore } from 'pinia';
import { useAuthStore } from './auth';
import { useNotesStore } from './notes';

export const useMainStore = defineStore('main', {
  actions: {
    nuxtServerInit() {
      const authStore = useAuthStore();
      const notesStore = useNotesStore();
      authStore.initialize();
      notesStore.initialize();
    }
  }
});