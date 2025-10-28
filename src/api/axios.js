import axios from 'axios';

const api = axios.create({
  baseURL: 'https://back-seguridad-ruby.vercel.app/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
