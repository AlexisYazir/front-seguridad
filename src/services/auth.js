import api from '../api/axios';

export const authService = {
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password }, {
      withCredentials: true // Importante para cookies
    });
    return response.data;
  },

  async verify() {
    const response = await api.get('/auth/verify', {
      withCredentials: true // Importante para cookies
    });
    return response.data;
  },

  async logout() {
    // Opcional: endpoint para logout en backend
    const response = await api.post('/auth/logout', {}, {
      withCredentials: true
    });
    return response.data;
  }
};

export const registerUser = async (username,email,telefono, password) => {
  try {
    const response = await api.post('/auth/register', { username,email, telefono,password });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error desconocido' };
  }
};
export const verifyUserEmail = async (email) => {
  try {
    const response = await api.post('/auth/password-reset/verify-user-email', { email });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error desconocido' };
  }
};
export const sendSMS = async (telefono) => {
  try {
    const response = await api.post('/auth/password-reset/send-sms', { telefono });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error desconocido' };
  }
};
export const sendEmail = async (email) => {
  try {
    const response = await api.post('/auth/password-reset/send-email', { email });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error desconocido' };
  }
};
//pa verificar token
export const verifyTokenSms = async (telefono, token) => {
  try {
    const response = await api.post('/auth/password-reset/verify-token-sms', { telefono, token });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error desconocido' };
  }
};
//pa verificar token
export const verifyTokenEmail = async (id, token) => {
  try {
    const response = await api.post('/auth/password-reset/verify-token-email', { id, token });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error desconocido' };
  }
};
export const resetPsw = async (telefono, psw) => {
  try {
    const response = await api.post('/auth/password-reset/reset-psw', { telefono, psw });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error desconocido' };
  }
};