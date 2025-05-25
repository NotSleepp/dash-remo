<template>
  <div class="remote-view">
    <h1>Vista Remota</h1>
    <p>Esta es una vista completa cargada desde una aplicación remota usando Module Federation.</p>
    
    <div class="dashboard-card">
      <h2>Panel de Control Remoto</h2>
      <div class="metrics">
        <div class="metric-card">
          <div class="metric-value">{{ activeUsers }}</div>
          <div class="metric-label">Usuarios Activos</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">{{ totalViews }}</div>
          <div class="metric-label">Vistas Totales</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">{{ conversionRate }}%</div>
          <div class="metric-label">Tasa de Conversión</div>
        </div>
      </div>
      
      <div class="actions">
        <button @click="refreshData" class="action-btn primary">Actualizar Datos</button>
        <button @click="addMenuItem" class="action-btn secondary">Añadir al Menú</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const activeUsers = ref(128);
const totalViews = ref(1024);
const conversionRate = ref(5.7);

function refreshData() {
  // Simulamos actualización de datos
  activeUsers.value = Math.floor(Math.random() * 200) + 100;
  totalViews.value = Math.floor(Math.random() * 2000) + 500;
  conversionRate.value = (Math.random() * 10 + 2).toFixed(1);
}

function addMenuItem() {
  // Creamos un evento personalizado para añadir este componente al menú del host
  const menuItem = {
    id: 'remote-dashboard',
    title: 'Panel Remoto',
    icon: 'chart-pie',
    path: '/dashboard/remote',
    order: 3
  };
  
  const event = new CustomEvent('add-dashboard-menu-item', {
    detail: menuItem
  });
  
  window.dispatchEvent(event);
  alert('¡Elemento añadido al menú del host!');
}

onMounted(() => {
  console.log('Vista remota montada correctamente');
});
</script>

<style scoped>
.remote-view {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.dashboard-card {
 background-color: white;
 border-radius: 8px;
 box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
 padding: 24px;
 margin-top: 20px;
}

.metrics {
 display: flex;
 justify-content: space-between;
 margin: 24px 0;
 gap: 16px;
}

.metric-card {
 background-color: #f8f9fa;
 border-radius: 6px;
 padding: 16px;
 flex: 1;
 text-align: center;
 transition: transform 0.3s ease;
}

.metric-card:hover {
 transform: translateY(-5px);
}

.metric-value {
 font-size: 2.5rem;
 font-weight: bold;
 color: #42b883;
 margin-bottom: 8px;
}

.metric-label {
 color: #666;
 font-size: 0.9rem;
}

.actions {
 display: flex;
 gap: 12px;
 margin-top: 24px;
}

.action-btn {
 padding: 10px 20px;
 border: none;
 border-radius: 4px;
 font-weight: bold;
 cursor: pointer;
 transition: all 0.2s ease;
}

.action-btn.primary {
 background-color: #42b883;
 color: white;
}

.action-btn.secondary {
 background-color: #e9ecef;
 color: #495057;
}

.action-btn:hover {
 opacity: 0.9;
 transform: scale(1.02);
}
</style>
