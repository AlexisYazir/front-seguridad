import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useAuthStore } from '../stores/auth.js'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/login', name: 'login', component: () => import('../views/LoginView.vue') },
    { path: '/register', name: 'register', component: () => import('../views/RegisterView.vue') },
    { path: '/verify-user', name: 'verify-user', component: () => import('../views/VerifyUserView.vue') },
    { path: '/v-token-sms', name: 'verify-token-sms', component: () => import('../views/VerifyTokenSmsView.vue') },
    { path: '/v-token-email', name: 'verify-token-email', component: () => import('../views/VerifyTokenEmailView.vue') },
    { path: '/reset-psw', name: 'reset-psw', component: () => import('../views/ResetPswView.vue') },
    { 
      path: '/dashboard', 
      name: 'dashboard', 
      component: () => import('../views/DashboardView.vue'), 
      meta: { requiresAuth: true },
    },
    {
      path: '/profile', 
      name: 'profile', 
      component: () => import('../views/ProfileView.vue'), 
      meta: { requiresAuth: true } 
    }
  ],
})

router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore()
  
  // Si ya tenemos usuario, continuar
  if (auth.user) {
    return next()
  }

  // Si la ruta requiere auth, intentar recuperar sesión
  if (to.meta.requiresAuth) {
    try {
      await auth.fetchUser()
      if (auth.isAuthenticated) {
        next()
      } else {
        next('/login')
      }
    } catch (error) {
      console.error('Error verificando autenticación:', error)
      next('/login')
    }
  } else {
    next()
  }
})

export default router