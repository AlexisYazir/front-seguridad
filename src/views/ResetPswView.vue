<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { resetPsw } from '@/services/auth.js'
import { useToast } from 'vue-toastification'
import { Icon } from '@iconify/vue'

const toast = useToast()
const router = useRouter()
const route = useRoute()

const telefono = ref('')
const psw1 = ref('')
const psw2 = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const showPasswordHints = ref(false)
const showConfirmHints = ref(false)

const passwordPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!#%*?&._-])[A-Za-z\d@$!#%*?&._-]{8,}$/

const passwordChecks = computed(() => ({
  length: psw1.value.length >= 8,
  uppercase: /[A-Z]/.test(psw1.value),
  lowercase: /[a-z]/.test(psw1.value),
  number: /\d/.test(psw1.value),
  special: /[@$!#%*?&._-]/.test(psw1.value)
}))

onMounted(() => {
  if (route.query.telefono) {
    telefono.value = route.query.telefono
  }
})

const handleResetPsw = async () => {
  if (!telefono.value) {
    toast.error('No se encontró el número de teléfono. Intenta nuevamente.')
    return
  }

  if (!psw1.value || !psw2.value) {
    toast.error('Por favor, ingrese ambas contraseñas.')
    return
  }

  if (!passwordPattern.test(psw1.value)) {
    toast.error(
      'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.'
    )
    return
  }

  if (psw1.value !== psw2.value) {
    toast.error('Las contraseñas no coinciden.')
    return
  }

  try {
    const response = await resetPsw(telefono.value, psw1.value)
    toast.success(response.message || 'Contraseña actualizada correctamente', {
      timeout: 4000,
      closeOnClick: true,
      pauseOnHover: true,
      onClose: () => router.push('/login')
    })
  } catch (err) {
    toast.error(err.message || 'Ocurrió un error al actualizar la contraseña', {
      timeout: 4000,
      closeOnClick: true,
      pauseOnHover: true
    })
  }
}
</script>

<template>
  <div class="register-container">
    <div class="form-card">
      <h1 class="title">Restablecer Contraseña</h1>
      <p class="instruction-text">
        Ingrese su nueva contraseña para el número ****{{ telefono.slice(-4) }}
      </p>
      <br />

      <form @submit.prevent="handleResetPsw" class="verify-form">
        <div class="input-group">
          <Icon icon="mdi:lock" class="icon" />
          <input
            v-model="psw1"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Nueva contraseña"
            required
            maxlength="10"
            @focus="showPasswordHints = true"
            @blur="showPasswordHints = false"
          />
          <Icon
            :icon="showPassword ? 'mdi:eye-off' : 'mdi:eye'"
            class="toggle-eye"
            @click="showPassword = !showPassword"
          />
        </div>

        <transition name="fade">
          <ul v-if="showPasswordHints" class="password-hints">
            <li :class="{ valid: passwordChecks.uppercase }">Debe tener una letra mayúscula</li>
            <li :class="{ valid: passwordChecks.lowercase }">Debe tener una letra minúscula</li>
            <li :class="{ valid: passwordChecks.number }">Debe tener un número</li>
            <li :class="{ valid: passwordChecks.special }">Debe tener un carácter especial (@$!%*?&._-)</li>
            <li :class="{ valid: passwordChecks.length }">Debe tener mínimo 8 caracteres</li>
          </ul>
        </transition>

        <div class="input-group">
          <Icon icon="mdi:lock-check" class="icon" />
          <input
            v-model="psw2"
            :type="showConfirmPassword ? 'text' : 'password'"
            placeholder="Confirmar contraseña"
            required
            maxlength="10"
            @focus="showConfirmHints = true"
            @blur="showConfirmHints = false"
          />
          <Icon
            :icon="showConfirmPassword ? 'mdi:eye-off' : 'mdi:eye'"
            class="toggle-eye"
            @click="showConfirmPassword = !showConfirmPassword"
          />
        </div>

        <transition name="fade">
          <p v-if="showConfirmHints" class="confirm-hint"
             :class="{
               match: psw2 === psw1 && psw2 !== '',
               nomatch: psw2 !== psw1 && psw2 !== ''
             }">
            {{
              psw2 === psw1 && psw2 !== ''
                ? '✔ Las contraseñas coinciden'
                : '✘ Las contraseñas no coinciden'
            }}
          </p>
        </transition>

        <div class="centered">
          <button type="submit">Actualizar contraseña</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #0d0d0d;
  padding: 20px;
}

.form-card {
  background-color: #1a1a1a;
  padding: 40px 30px;
  border-radius: 12px;
  width: 100%;
  max-width: 380px;
  text-align: center;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
}

.title {
  color: #b7f0a1;
  font-size: 1.8rem;
  margin-bottom: 25px;
}

/*  Arreglo principal: separación entre inputs */
.input-group {
  display: flex;
  align-items: center;
  background-color: #2c2c2c;
  border-radius: 8px;
  border: 1px solid #444;
  padding: 0 15px;
  position: relative;
  transition: border-color 0.3s;
  margin-bottom: 18px; /* <-- Espacio entre campos */
}

.input-group:last-of-type {
  margin-bottom: 25px; /* Más espacio antes del botón */
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
  flex: 1;
  border: none;
  background: none;
  color: #f0f0f0;
  padding: 12px 0;
  font-size: 1rem;
  outline: none;
}

/*  Consejos de contraseña */
.password-hints {
  list-style: none;
  padding: 0;
  margin: 5px 0 15px;
  text-align: left;
  font-size: 0.85rem;
  color: #999;
}

.password-hints li {
  margin-bottom: 4px;
  transition: color 0.3s;
}

.password-hints li.valid {
  color: #42b983;
}

/*  Confirmación */
.confirm-hint {
  margin-top: -10px;
  margin-bottom: 15px;
  font-size: 0.9rem;
  text-align: left;
}
.confirm-hint.match {
  color: #42b983;
}
.confirm-hint.nomatch {
  color: #ff6b6b;
}

/*  Botón */
button {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 8px;
  background-color: #42b983;
  color: #0d0d0d;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s, transform 0.1s;
}

button:hover {
  background-color: #7fff7f;
  transform: translateY(-2px);
}

/*  Transiciones */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/*  Enlace */
.login-link {
  color: #999;
  font-size: 0.95rem;
  margin-top: 15px;
}

.link {
  color: #b7f0a1;
  text-decoration: none;
  font-weight: 600;
}
.link:hover {
  color: #42b983;
  text-decoration: underline;
}
</style>