<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/auth.js' 
import { Icon } from '@iconify/vue' 

const email = ref('')
const password = ref('')
const loading = ref(false)
const showPassword = ref(false)
const router = useRouter()
const toast = useToast()
const auth = useAuthStore()
const totpToken = ref('')
const showTOTP = ref(false)

const loginWithGoogle = () => {
  window.location.href = 'https://sitio-seguridad.netlify.app/api/auth/google'
}

const handleLogin = async () => {
  if (loading.value) return
  
  try {
    loading.value = true
    await auth.login(email.value, password.value)
    
    toast.success('Login exitoso!', { timeout: 2000 })
    
    setTimeout(() => {
      router.push('/dashboard')
    }, 500)
  } catch (err) {
    const errorMessage = err.response?.data?.message || 'Error en login'
    toast.error(errorMessage, { timeout: 3000 })
    password.value = ''
  } finally {
    loading.value = false
  }
}

// Simulación de verificación TOTP
const verifyTOTP = () => {
  console.log('Verificando TOTP:', totpToken.value)
}
</script>

<template>
  <div class="login-container">
    <div class="form-card">
      <h1 class="title">Iniciar sesión</h1>
      <form @submit.prevent="handleLogin" class="login-form">
        
        <!-- Email -->
        <div class="input-group">
          <Icon icon="mdi:email" class="icon" />
          <input v-model="email" type="email" placeholder="Correo electrónico" required />
        </div>
        
        <!-- Contraseña con icono de ojo -->
        <div class="input-group">
          <Icon icon="mdi:lock" class="icon" />
          <input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Contraseña"
            required
          />
          <Icon
            :icon="showPassword ? 'mdi:eye-off' : 'mdi:eye'"
            class="toggle-eye"
            @click="showPassword = !showPassword"
          />
        </div>

        <!-- Botón con loading -->
        <div class="centered">
          <button type="submit" :disabled="loading" class="primary-btn">
            <Icon
              v-if="loading"
              icon="eos-icons:loading"
              class="loading-icon"
            />
            {{ loading ? 'Cargando...' : 'Entrar' }}
          </button>
        </div>

        <p class="register-link">
          ¿No tienes cuenta? <router-link to="/register" class="link">Regístrate aquí</router-link>
        </p>

        <p class="login-link">
          ¿Olvidaste tu contraseña? <router-link to="/verify-user" class="link">Clic aquí</router-link>
        </p>

        <div class="separator">o</div>
        
        <!-- Botón Google -->
        <button @click.prevent="loginWithGoogle" class="google-btn">
          <Icon icon="logos:google-icon" class="google-icon" />
          Continuar con Google
        </button>
        
        <!-- Sección TOTP -->
        <div v-if="showTOTP" class="totp-section">
          <h3 class="totp-title">Verificación en dos pasos</h3>
          <div class="input-group">
            <Icon icon="mdi:key" class="icon" />
            <input v-model="totpToken" type="text" placeholder="Código de autenticación" required />
          </div>
          <button @click.prevent="verifyTOTP" class="primary-btn">Verificar</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #0d0d0d;
  padding: 20px;
}

.form-card {
  background-color: #1a1a1a;
  padding: 40px 30px;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
  width: 100%;
  max-width: 380px;
  text-align: center;
}

.title {
  color: #b7f0a1;
  margin-bottom: 30px;
  font-size: 1.8rem;
  font-weight: 600;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.input-group {
  display: flex;
  align-items: center;
  background-color: #2c2c2c;
  border-radius: 8px;
  border: 1px solid #444;
  padding: 0 15px;
  transition: border-color 0.3s ease;
  position: relative;
}

.input-group:focus-within {
  border-color: #42b983;
}

.icon {
  color: #b7f0a1;
  margin-right: 10px;
  font-size: 1.3rem;
}

.toggle-eye {
  position: absolute;
  right: 15px;
  color: #b7f0a1;
  cursor: pointer;
  font-size: 1.3rem;
}

input {
  flex-grow: 1;
  padding: 12px 0;
  border: none;
  background: none;
  color: #f0f0f0;
  outline: none;
  font-size: 1rem;
  width: 100%;
}

input::placeholder {
  color: #999;
}

.primary-btn {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 8px;
  background-color: #42b983;
  color: #0d0d0d;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.1s;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.loading-icon {
  font-size: 1.4rem;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}

.primary-btn:hover:not([disabled]) {
  background-color: #7fff7f;
  transform: translateY(-2px);
}

.primary-btn[disabled] {
  background-color: #333;
  color: #999;
  cursor: not-allowed;
}

.centered {
  display: flex;
  justify-content: center;
}

.register-link {
  color: #999;
  font-size: 0.95rem;
  margin-top: 10px;
  margin-bottom: 0;
}

.link {
  color: #b7f0a1;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s;
}

.link:hover {
  color: #42b983;
  text-decoration: underline;
}

.separator {
  color: #666;
  margin: 15px 0;
  position: relative;
  text-align: center;
  font-size: 0.9rem;
}

.separator::before,
.separator::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 40%;
  height: 1px;
  background: #333;
}

.separator::before {
  left: 0;
}

.separator::after {
  right: 0;
}

.google-btn {
  padding: 12px;
  border: 1px solid #42b983;
  border-radius: 8px;
  background-color: transparent;
  color: #f0f0f0;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s, border-color 0.3s;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.google-btn:hover {
  background-color: rgba(66, 185, 131, 0.1);
  border-color: #7fff7f;
}

.google-icon {
  font-size: 1.3rem;
}

.totp-section {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid #333;
}

.totp-title {
  color: #b7f0a1;
  font-size: 1.2rem;
  margin-bottom: 5px;
}
</style>
