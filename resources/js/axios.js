import axios from 'axios';

const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;

const api = axios.create({
  baseURL: '/',
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'X-CSRF-TOKEN': csrfToken,
  },
  withCredentials: true,
});

export default api;
