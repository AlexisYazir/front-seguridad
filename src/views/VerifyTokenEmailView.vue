<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { verifyTokenEmail } from '@/services/auth.js'
import { useToast } from 'vue-toastification'

const toast = useToast()
const router = useRouter()
const route = useRoute()

const id_usuario = ref(null)
const email = ref('')
const token = ref('')
const telefono = ref('') // <--- aquí guardaremos lo que traiga el back

onMounted(() => {
  if (route.query.id_usuario) {
    id_usuario.value = route.query.id_usuario
    email.value = route.query.email || ''
  }
})

const handleVerifyToken = async () => {
  if (!id_usuario.value || !token.value) return

  try {
    const response = await verifyTokenEmail(id_usuario.value, token.value)
    console.log(response)

    if (response.success && response.datos) {
      telefono.value = response.datos.telefono // <-- lo guardamos
      toast.success(response.message || 'Token correcto, puede continuar', {
        timeout: 5000,
        closeOnClick: true,
        pauseOnHover: true,
        onClose: () => {
          // Redirigir a reset de contraseña pasando el teléfono por query
          router.push(`/reset-psw?telefono=${telefono.value}`)
        }
      })
    } else {
      toast.error('Código incorrecto')
    }
  } catch (err) {
    toast.error(err.message || 'Ocurrió un error inesperado', {
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
      <h1 class="title">Verificación de Código de recuperación</h1>
      <p class="instruction-text">
        Ingrese el código que se envió al correo: {{ email }}
      </p>
      <form @submit.prevent="handleVerifyToken" class="verify-form">
        <div class="input-group">
          <input v-model="token" type="number" placeholder="Ingrese el código" required />
        </div>

        <div class="centered">
          <button type="submit">Enviar</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* Mantener los estilos previos, solo cambia el mensaje de instrucción */
.register-container {
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
  box-shadow: 0 10px 25px rgba(0,0,0,0.5);
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

.input-group {
  display: flex;
  align-items: center;
  background-color: #2c2c2c;
  border-radius: 8px;
  border: 1px solid #444;
  padding: 0 15px;
  transition: border-color 0.3s ease;
  margin-bottom: 20px;
}

.input-group:focus-within {
  border-color: #42b983;
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

button {
  width: 100%;
  padding: 12px;
  margin-top: 10px;
  border: none;
  border-radius: 8px;
  background-color: #42b983;
  color: #0d0d0d;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.1s;
  font-size: 1.1rem;
}

button:hover {
  background-color: #7fff7f;
  transform: translateY(-2px);
}

.centered {
  display: flex;
  justify-content: center;
}

.instruction-text {
  color: #ccc;
  margin-bottom: 25px;
}
</style>
