<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { verifyTokenSms } from '@/services/auth.js'
import { useToast } from 'vue-toastification'

const toast = useToast()
const router = useRouter()
const route = useRoute() // <-- Para leer query params

const telefono = ref('') // Ahora usamos teléfono porque viene de SMS
const token = ref('')

// Al montar el componente, recuperamos los datos de la URL
onMounted(() => {
  if (route.query.telefono) {
    telefono.value = route.query.telefono
  }
})

const handleVerifyToken = async () => {
  if (!telefono.value) return

  try {
    const response = await verifyTokenSms(telefono.value, token.value)
    //holaa
    toast.success(response.message || 'Token correcto, puede continuar', {
      timeout: 5000,
      closeOnClick: true,
      pauseOnHover: true,
      onClose: () => {
        // Redirigir a reset de contraseña, pasando el teléfono por query
        router.push({ path: '/reset-psw', query: { telefono: telefono.value } })
      }
    })
  } catch (err) {
    toast.error(err.message || 'Ocurrió un error inesperado', {
      timeout: 4000,
      closeOnClick: true,
      pauseOnHover: true,
    })
  }
}
</script>

<template>
  <div class="register-container">
    <div class="form-card">
      <h1 class="title">Verificación de Código de recuperación</h1>
      <p class="instruction-text">
        Ingrese el código que se envió al teléfono: ****{{ telefono.slice(-4) }}
      </p> <br>
      <form @submit.prevent="handleVerifyToken" class="verify-form">
        <div class="input-group">
          <input v-model="token" type="number" placeholder="Ingrese el código" maxlength="6" pattern="\\d{6}" required />
        </div>

        <div class="centered">
          <button type="submit">Enviar</button>
        </div>
      </form>
    </div>
  </div>
</template>


<style scoped>
/* Colores clave: #b7f0a1 (texto), #42b983 (botón/resaltado), #0d0d0d (fondo/texto oscuro) */

.register-container {
  /* Mantiene la estructura de centrado */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh; /* Usa 100vh para centrar verticalmente en toda la pantalla */
  background-color: #0d0d0d; /* Fondo oscuro sutil */
  padding: 20px;
}

.form-card {
  /* Estilo de "Tarjeta" para el formulario */
  background-color: #1a1a1a; /* Un color ligeramente más claro que el fondo para destacar */
  padding: 40px 30px;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5); /* Sombra elegante */
  width: 100%;
  max-width: 380px; /* Ancho máximo fijo para mejor apariencia */
  text-align: center;
}

.title {
  color: #b7f0a1; /* Tu color de texto principal */
  margin-bottom: 30px;
  font-size: 1.8rem;
  font-weight: 600;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 15px; /* Espacio entre los grupos de input */
}

/* Estilo para los grupos de input (para el icono) */
.input-group {
  display: flex;
  align-items: center;
  background-color: #2c2c2c; /* Fondo para el campo de input */
  border-radius: 8px;
  border: 1px solid #444; /* Borde sutil */
  padding: 0 15px;
  transition: border-color 0.3s ease;
}

.input-group:focus-within {
  border-color: #42b983; /* Resalta el borde al hacer focus */
}

.icon {
  color: #b7f0a1; /* Color de tu texto/resaltado */
  margin-right: 10px;
  font-size: 1.1rem;
}

input {
  flex-grow: 1; /* Hace que el input tome el espacio restante */
  padding: 12px 0; /* Ajusta el padding para alinear con el icono */
  border: none;
  background: none; /* Fondo transparente para usar el del input-group */
  color: #f0f0f0; /* Color claro para el texto dentro del input */
  outline: none; /* Quita el borde de focus por defecto */
  font-size: 1rem;
  width: 100%; /* Asegura que tome el ancho completo del grupo */
}

/* Placeholder personalizado para que se vea bien en el fondo oscuro */
input::placeholder {
  color: #999;
}

button {
  width: 100%; /* Botón de ancho completo para un mejor diseño */
  padding: 12px;
  margin-top: 10px;
  border: none;
  border-radius: 8px;
  background-color: #42b983; /* Tu color de botón principal */
  color: #0d0d0d;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.1s;
  font-size: 1.1rem;
}

button:hover {
  background-color: #7fff7f; /* Color de hover más brillante */
  transform: translateY(-2px); /* Pequeño efecto 3D al hacer hover */
} 
/* La clase centered ya no es tan necesaria con width: 100% pero la mantengo */
.centered {
  display: flex;
  justify-content: center;
}

.login-link {
  color: #999; /* Texto de la frase un poco más sutil */
  font-size: 0.95rem;
  margin-top: 10px;
}

.link {
  color: #b7f0a1; /* Tu color de resaltado para el enlace */
  text-decoration: none; /* Quitar el subrayado por defecto */
  font-weight: 600;
  transition: color 0.3s;
}

.link:hover {
  color: #42b983; /* Resaltado al hacer hover */
  text-decoration: underline;
}

.message {
  color: #e0e0e0; /* Color de mensaje sutil */
  margin-top: 10px;
}
</style>