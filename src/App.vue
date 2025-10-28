<script setup>
import { RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue'
</script>
<template>
  <div class="app-container">
    <aside class="sidebar">
      <NavBar />
    </aside>

    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>
