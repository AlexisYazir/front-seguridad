<script setup>
import { RouterLink, useRouter  } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'
import { computed } from 'vue'

const authStore = useAuthStore()
const router = useRouter()

// Computed para reactividad
const isAuthenticated = computed(() => authStore.isAuthenticated)
const user = computed(() => authStore.user)

const handleLogout = async () => {
  try {
    await authStore.logout()
    router.push('/')
  } catch (error) {
    console.error('Error al cerrar sesión:', error)
  }
}
</script>

<template>
  <nav class="navbar">
    <RouterLink to="/">Home</RouterLink>
    
    <!-- Enlaces para usuarios NO autenticados -->
    <div v-if="!isAuthenticated" class="auth-links">
      <RouterLink to="/login">Login</RouterLink>
      <RouterLink to="/register">Register</RouterLink>
    </div>
    
    <!-- Enlaces para usuarios SÍ autenticados -->
    <div v-else class="user-links">
      <RouterLink to="/dashboard">Dashboard</RouterLink>
      <RouterLink to="/profile" class="profile-link">
        👤 {{ user?.username || 'Perfil' }}
      </RouterLink>
      <button @click="handleLogout" class="logout-btn">
        Cerrar Sesión
      </button>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  background-color: black;
  display: flex;
  gap: 1.5rem;
  padding: 1rem 2rem;
  align-items: center;
  justify-content: space-between;
}

.navbar a {
  color: #42b983;
  text-decoration: none;
  font-weight: bold;
  font-size: 1.1rem;
  padding: 0.3rem 0.6rem;
  transition: 0.3s;
}

.navbar a:hover {
  color: #0d0d0d;
  background-color: #42b983;
  box-shadow: 0 0 10px #42b983;
}

.auth-links, .user-links {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.profile-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logout-btn {
  background: none;
  border: 2px solid #ff6b6b;
  color: #ff6b6b;
  padding: 0.3rem 0.8rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  font-size: 1rem;
  transition: 0.3s;
}

.logout-btn:hover {
  background-color: #ff6b6b;
  color: #0d0d0d;
  box-shadow: 0 0 10px #ff6b6b;
}

/* Responsive */
@media (max-width: 768px) {
  .navbar {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }
  
  .auth-links, .user-links {
    gap: 1rem;
  }
}
</style>