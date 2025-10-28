<script setup>
import { useAuthStore } from '@/stores/auth.js'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

const logout = () => {
  auth.logout()
  router.push('/login')
}
</script>

<template>
  <div class="profile-container">
    <div class="profile-card">
      <h1>Perfil de Usuario</h1>
      <p>Información de tu cuenta:</p>

      <div class="info">
        <p><strong>Nombre de usuario:</strong> {{ auth.user?.username || 'No disponible' }}</p>
        <p><strong>Email:</strong> {{ auth.user?.email || 'No disponible' }}</p>
        <p><strong>Teléfono:</strong> {{ auth.user?.telefono || 'No disponible' }}</p>
      </div>

      <button @click="logout">Cerrar sesión</button>
    </div>
  </div>
</template>

<style scoped>
.profile-container {
  background-color: #0d0d0d;
  color: #b7f0a1;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.profile-card {
  background-color: #1a1a1a;
  border-left: 5px solid #42b983;
  padding: 2rem;
  border-radius: 12px;
  width: 100%;
  max-width: 400px;
  text-align: left;
}

.profile-card h1 {
  color: #42b983;
  margin-bottom: 1rem;
}

.profile-card p {
  color: #a0f0b0;
  margin-bottom: 1rem;
}

.info p {
  margin: 0.5rem 0;
}

button {
  background-color: #42b983;
  color: #0d0d0d;
  border: none;
  padding: 0.7rem 1.5rem;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 1.5rem;
  transition: 0.3s;
  width: 100%;
}

button:hover {
  background-color: #7fff7f;
}
</style>