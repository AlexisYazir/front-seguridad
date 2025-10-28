import axios from 'axios';

const api = axios.create({
  baseURL: 'https://back-seguridad-ruby.vercel.app/api',
  withCredentials: true, // ✅ Esto es CRUCIAL
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido - redirigir a login
      console.log('Sesión expirada, redirigiendo...');
      // Opcional: limpiar estado local
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
