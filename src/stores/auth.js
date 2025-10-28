import { defineStore } from 'pinia'
import { authService } from '@/services/auth.js'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    loading: false
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.user,
    getUser: (state) => state.user
  },
  
  actions: {
    async login(email, password) {
      try {
        this.loading = true
        const data = await authService.login(email, password)
        this.user = data.user // Guardar usuario del response
        return data
      } catch (error) {
        this.user = null
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchUser() {
      try {
        const data = await authService.verify()
        this.user = data.user
        return data
      } catch (error) {
        this.user = null
        throw error
      }
    },

    async logout() {
      try {
        await authService.logout()
      } catch (error) {
        //console.error('Error en logout:', error)
        console.log('se cerro la sesion', error);
      } finally {
        this.user = null
        // Limpiar cookie en frontend también
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
      }
    }
  }
})