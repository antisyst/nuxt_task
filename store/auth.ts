import { defineStore } from 'pinia';
import axios from 'axios';

interface AuthState {
  token: string | null;
  loading: boolean;
  error: string | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: null,
    loading: false,
    error: null,
  }),
  actions: {
    initialize() {
      if (process.client) {
        this.token = localStorage.getItem('token');
        this.checkTokenExpiry();
      }
    },
    async login(username: string, password: string) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.post('http://localhost:8000/auth/login', { username, password });
        const { token } = response.data;
        this.token = token;
        if (process.client) {
          localStorage.setItem('token', token);
          this.setTokenExpiry();
        }
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          this.error = error.response?.data?.message || 'Login failed. Please check your credentials.';
        } else {
          this.error = 'An unexpected error occurred.';
        }
      } finally {
        this.loading = false;
      }
    },
    logout() {
      this.token = null;
      if (process.client) {
        localStorage.removeItem('token');
      }
    },
    checkTokenExpiry() {
      const expiry = localStorage.getItem('tokenExpiry');
      if (expiry && new Date(expiry).getTime() <= Date.now()) {
        this.logout();
      }
    },
    setTokenExpiry() {
      const expiryTime = new Date(Date.now() + 60 * 60 * 1000); 
      localStorage.setItem('tokenExpiry', expiryTime.toString());
    },
  },
});