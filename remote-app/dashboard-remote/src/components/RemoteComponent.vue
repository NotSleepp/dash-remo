<template>
  <div class="remote-component">
    <h2>Componente Remoto</h2>
    <p>Este es un componente cargado desde una aplicación remota usando Module Federation.</p>
    <div class="stats-card">
      <h3>Estadísticas</h3>
      <div class="stats-value">{{ count }}</div>
      <button @click="increment" class="increment-btn">Incrementar</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const count = ref(0);

function increment() {
  count.value++;
  // Emitimos un evento personalizado que el host puede escuchar
  const event = new CustomEvent('remote-counter-updated', {
    detail: { count: count.value }
  });
  window.dispatchEvent(event);
}
</script>

<style scoped>
.remote-component {
 border: 2px solid #42b883;
 border-radius: 8px;
 padding: 20px;
 margin: 20px 0;
 background-color: #f8f8f8;
 max-width: 500px;
}

.stats-card {
 background-color: #42b883;
 color: white;
 border-radius: 6px;
 padding: 15px;
 margin-top: 15px;
 text-align: center;
}

.stats-value {
 font-size: 3rem;
 font-weight: bold;
 margin: 10px 0;
}

.increment-btn {
 background-color: white;
 color: #42b883;
 border: none;
 border-radius: 4px;
 padding: 8px 16px;
 font-weight: bold;
 cursor: pointer;
 transition: all 0.3s ease;
}

.increment-btn:hover {
 background-color: #eee;
 transform: scale(1.05);
}
</style>
