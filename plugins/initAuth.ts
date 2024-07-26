import { defineNuxtPlugin } from '#app';
import { useAuthStore } from '../store/auth';

export default defineNuxtPlugin(() => {
  if (process.client) {
    const authStore = useAuthStore();
    authStore.initialize();
  }
});