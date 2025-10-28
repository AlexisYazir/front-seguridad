<script setup>
import { useAuthStore } from '@/stores/auth.js'

const auth = useAuthStore()
</script>

<template>
  <div class="dashboard-container">
    <div class="welcome-card">
      <h1>Bienvenido, {{ auth.user?.email || 'Usuario' }} </h1>
      <p>Aquí encontrarás información importante sobre Seguridad Informática.</p>
    </div>

    <div class="info-grid">
      <div class="info-card">
        <h2>Usuarios y Roles</h2>
        <p>Gestiona cuentas de usuario, roles y permisos para mantener el acceso seguro y controlado.</p>
      </div>
      <div class="info-card">
        <h2>Monitoreo de Red</h2>
        <p>Observa el tráfico de red, detecta actividades sospechosas y previene posibles ataques cibernéticos.</p>
      </div>
      <div class="info-card">
        <h2>Reportes de Seguridad</h2>
        <p>Genera reportes detallados de incidentes, vulnerabilidades y auditorías de sistemas.</p>
      </div>
      <div class="info-card">
        <h2>Alertas y Notificaciones</h2>
        <p>Recibe avisos en tiempo real sobre intentos de intrusión, malware o cambios no autorizados.</p>
      </div>
      <div class="info-card">
        <h2>Copia de Seguridad</h2>
        <p>Administra backups automáticos y restauraciones rápidas para proteger datos críticos.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-container {
  background-color: #0d0d0d;
  color: #b7f0a1;
  min-height: 100vh;
  padding: 3rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Tarjeta de bienvenida */
.welcome-card {
  background-color: #1a1a1a;
  border-left: 5px solid #42b983;
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  margin-bottom: 3rem;
}

.welcome-card h1 {
  font-size: 2.5rem;
  color: #42b983;
  margin-bottom: 1rem;
}

.welcome-card p {
  font-size: 1.2rem;
  color: #a0f0b0;
}

/* Grid de información */
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
}

.info-card {
  background-color: #1a1a1a;
  border: 1px solid #42b983;
  padding: 1.5rem;
  border-radius: 12px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.info-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 20px rgba(66, 185, 131, 0.4);
}

.info-card h2 {
  color: #42b983;
  margin-bottom: 0.8rem;
}

.info-card p {
  color: #b7f0a1;
  font-size: 0.95rem;
}
</style>
