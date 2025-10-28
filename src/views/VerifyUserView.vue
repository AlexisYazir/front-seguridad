<script setup>
import { ref } from 'vue'
import { useToast } from 'vue-toastification'
import { verifyUserEmail, sendSMS as sendSMSService, sendEmail as sendEmailService } from '@/services/auth.js'
import { useRouter } from 'vue-router'

const toast = useToast()
const router = useRouter()

const email = ref('')
const showRecoveryOptions = ref(false)
const userData = ref(null)

// Paso 1: verificar correo
const handleVerificationSend = async () => {
  try {
    const response = await verifyUserEmail(email.value)
    console.log(response)

    if (!response.success) {
      toast.error(response.message || 'No existe una cuenta con este correo.', {
        timeout: 5000,
        closeOnClick: true,
        pauseOnHover: true,
      })
      return
    }

    userData.value = response.datos
    toast.success(response.message || 'Datos encontrados, elige cómo recuperar la contraseña.', {
      timeout: 3000,
      closeOnClick: true,
      pauseOnHover: true,
    })

    showRecoveryOptions.value = true
  } catch (err) {
    const errorMessage = err.message || 'Error al verificar el correo.'
    toast.error(errorMessage, {
      timeout: 5000,
      closeOnClick: true,
      pauseOnHover: true,
    })
  }
}

// Función para enviar por correo
// Función para enviar por correo usando el servicio real
const sendEmail = async () => {
  if (!userData.value) return

  try {
    // Llamas a tu servicio real que envía el código por email
    const response = await sendEmailService(userData.value.email) // <-- tu función del backend
    if (response.success) {
      toast.success(`Se envió un código a ${userData.value.email}`, {
        timeout: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        onClose: () => {
          // Redirige a la ruta de verificación de email pasando id_usuario por query
          router.push(`/v-token-email?id_usuario=${userData.value.id_usuario}`)
        }
      })
      showRecoveryOptions.value = false
    } else {
      toast.error(response.message || 'Error al enviar código por correo')
    }
  } catch (err) {
    const errorMessage = err.message || 'Error al enviar código por correo'
    toast.error(errorMessage, {
      timeout: 5000,
      closeOnClick: true,
      pauseOnHover: true,
    })
  }
}


// Función para enviar por SMS usando el servicio real
const sendSMS = async () => {
  if (!userData.value) return
  const lastDigits = userData.value.telefono.slice(-4)

  try {
    const response = await sendSMSService(userData.value.telefono)
    if (response.success) {
      toast.success(`Se envió un código al teléfono ****${lastDigits}`, {
        timeout: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        onClose: () => {
        router.push(`/v-token-sms?telefono=${userData.value.telefono}`)
      }
      })
      showRecoveryOptions.value = false
    } else {
      toast.error(response.message || 'Error al enviar SMS')
    }
  } catch (err) {
    const errorMessage = err.message || 'Error al enviar SMS'
    toast.error(errorMessage, {
      timeout: 5000,
      closeOnClick: true,
      pauseOnHover: true,
    })
  }
}

// Función auxiliar para mostrar el teléfono parcialmente
const maskedPhone = (phone) => {
  if (!phone) return ''
  const last4 = phone.slice(-4)
  return `****${last4}`
}
</script>

<template>
  <div class="verification-container">
    <div class="form-card">
      <h1 class="title">Verificación de Correo</h1>
      <form @submit.prevent="handleVerificationSend" class="verification-form">
        <p class="instruction-text">
          Ingrese su correo electrónico para verificar sus datos.
        </p>

        <div class="input-group">
          <i class="fas fa-envelope icon"></i>
          <input 
            v-model="email" 
            type="email" 
            placeholder="Correo electrónico" 
            required 
          />
        </div>

        <div class="centered">
          <button type="submit">Enviar</button>
        </div>

        <p class="footer-link">
          ¿Recordaste tu contraseña? 
          <router-link to="/login" class="link">Iniciar Sesión</router-link>
        </p>
      </form>
    </div>

    <!-- Modal / pantalla flotante -->
    <div v-if="showRecoveryOptions" class="modal-overlay">
      <div class="modal-card">
        <h2>Opciones de recuperación</h2>
        <p>Elige cómo deseas recuperar tu contraseña:</p>
        <p>Se enviara un codigo por el medio que elijas</p>
        <div class="options">
          <button @click="sendEmail">Por correo ({{ userData.email }})</button>
          <button @click="sendSMS">Por SMS ({{ maskedPhone(userData.telefono) }})</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* --- Mantener los estilos anteriores --- */
.verification-container { display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:100vh; background-color:#0d0d0d; padding:20px; }
.form-card { background-color:#1a1a1a; padding:40px 30px; border-radius:12px; box-shadow:0 10px 25px rgba(0,0,0,0.5); width:100%; max-width:380px; text-align:center; }
.title { color:#b7f0a1; margin-bottom:20px; font-size:1.8rem; font-weight:600; }
.instruction-text { color:#999; margin-bottom:25px; font-size:0.95rem; }
.verification-form { display:flex; flex-direction:column; gap:15px; }
.input-group { display:flex; align-items:center; background-color:#2c2c2c; border-radius:8px; border:1px solid #444; padding:0 15px; transition:border-color 0.3s ease; }
.input-group:focus-within { border-color:#42b983; }
.icon { color:#b7f0a1; margin-right:10px; font-size:1.1rem; }
input { flex-grow:1; padding:12px 0; border:none; background:none; color:#f0f0f0; outline:none; font-size:1rem; width:100%; }
input::placeholder { color:#999; }
button { width:100%; padding:12px; margin-top:5px; border:none; border-radius:8px; background-color:#42b983; color:#0d0d0d; font-weight:bold; cursor:pointer; transition: background-color 0.3s, transform 0.1s; font-size:1.1rem; }
button:hover { background-color:#7fff7f; transform:translateY(-2px); }
.centered { display:flex; justify-content:center; }
.footer-link { color:#999; font-size:0.95rem; margin-top:10px; }
.link { color:#b7f0a1; text-decoration:none; font-weight:600; transition:color 0.3s; }
.link:hover { color:#42b983; text-decoration:underline; }

/* Modal */
.modal-overlay { position:fixed; top:0; left:0; width:100%; height:100%; background-color:rgba(0,0,0,0.7); display:flex; align-items:center; justify-content:center; z-index:100; }
.modal-card { background-color:#1a1a1a; padding:30px; border-radius:12px; text-align:center; width:90%; max-width:360px; }
.modal-card h2 { color:#b7f0a1; margin-bottom:15px; }
.modal-card p { color:#ccc; margin-bottom:20px; }
.modal-card .options { display:flex; flex-direction:column; gap:10px; }
.modal-card .options button { width:100%; }
</style>
