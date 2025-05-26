<template>
  <div class="remote-view" :class="{ 'dark-theme': theme === 'dark' }">
    <div class="view-header">
      <h1>Vista Remota</h1>
      <div class="connection-status" :class="{ 'connected': isConnected }">
        {{ isConnected ? 'Conectado al Host' : 'Desconectado' }}
      </div>
    </div>
    
    <p class="view-description">Panel de métricas integrado con la aplicación principal</p>
    
    <div class="dashboard-card">
      <div class="card-header">
        <h2>Panel de Control Remoto</h2>
        <div class="last-update">Actualizado: {{ lastUpdateFormatted }}</div>
      </div>
      
      <div class="metrics">
        <div class="metric-card" :class="{ 'refreshing': isRefreshing }">
          <div class="metric-icon users-icon"></div>
          <div class="metric-value">{{ activeUsers }}</div>
          <div class="metric-label">Usuarios Activos</div>
          <div class="metric-trend" :class="{ 'positive': usersTrend > 0, 'negative': usersTrend < 0 }">
            <span class="trend-arrow">{{ usersTrend > 0 ? '↑' : usersTrend < 0 ? '↓' : '→' }}</span>
            <span>{{ Math.abs(usersTrend) }}%</span>
          </div>
        </div>
        
        <div class="metric-card" :class="{ 'refreshing': isRefreshing }">
          <div class="metric-icon views-icon"></div>
          <div class="metric-value">{{ totalViews }}</div>
          <div class="metric-label">Vistas Totales</div>
          <div class="metric-trend" :class="{ 'positive': viewsTrend > 0, 'negative': viewsTrend < 0 }">
            <span class="trend-arrow">{{ viewsTrend > 0 ? '↑' : viewsTrend < 0 ? '↓' : '→' }}</span>
            <span>{{ Math.abs(viewsTrend) }}%</span>
          </div>
        </div>
        
        <div class="metric-card" :class="{ 'refreshing': isRefreshing }">
          <div class="metric-icon conversion-icon"></div>
          <div class="metric-value">{{ conversionRate }}%</div>
          <div class="metric-label">Tasa de Conversión</div>
          <div class="metric-trend" :class="{ 'positive': conversionTrend > 0, 'negative': conversionTrend < 0 }">
            <span class="trend-arrow">{{ conversionTrend > 0 ? '↑' : conversionTrend < 0 ? '↓' : '→' }}</span>
            <span>{{ Math.abs(conversionTrend) }}%</span>
          </div>
        </div>
      </div>
      
      <div class="actions">
        <button @click="refreshData" class="action-btn primary" :disabled="isRefreshing">
          <span class="button-icon refresh-icon" :class="{ 'spinning': isRefreshing }"></span>
          <span>{{ isRefreshing ? 'Actualizando...' : 'Actualizar Datos' }}</span>
        </button>
        <button @click="addMenuItem" class="action-btn secondary" :disabled="menuAdded">
          <span class="button-icon menu-icon"></span>
          <span>{{ menuAdded ? 'Añadido al Menú' : 'Añadir al Menú' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';

// Props
const props = defineProps({
  theme: {
    type: String,
    default: 'light',
    validator: (value) => ['light', 'dark'].includes(value)
  }
});

// Estado
const activeUsers = ref(128);
const totalViews = ref(1024);
const conversionRate = ref(5.7);
const usersTrend = ref(8.2);
const viewsTrend = ref(-2.5);
const conversionTrend = ref(3.7);
const lastUpdate = ref(new Date());
const isRefreshing = ref(false);
const isConnected = ref(false);
const menuAdded = ref(false);

// Estado calculado
const lastUpdateFormatted = computed(() => {
  return lastUpdate.value.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
});

// Métodos
function refreshData() {
  isRefreshing.value = true;
  
  // Simulamos un pequeño retraso para mostrar el estado de actualización
  setTimeout(() => {
    // Actualizamos los valores
    activeUsers.value = Math.floor(Math.random() * 200) + 100;
    totalViews.value = Math.floor(Math.random() * 2000) + 500;
    conversionRate.value = parseFloat((Math.random() * 10 + 2).toFixed(1));
    
    // Actualizamos las tendencias
    usersTrend.value = parseFloat((Math.random() * 20 - 5).toFixed(1));
    viewsTrend.value = parseFloat((Math.random() * 20 - 5).toFixed(1));
    conversionTrend.value = parseFloat((Math.random() * 20 - 5).toFixed(1));
    
    // Actualizamos la hora de la última actualización
    lastUpdate.value = new Date();
    isRefreshing.value = false;
    
    // Notificamos al host que los datos se han actualizado
    window.dispatchEvent(new CustomEvent('remote-data-updated', {
      detail: {
        metrics: {
          activeUsers: activeUsers.value,
          totalViews: totalViews.value,
          conversionRate: conversionRate.value
        },
        timestamp: lastUpdate.value.toISOString()
      }
    }));
  }, 800);
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
  menuAdded.value = true;
  
  // Notificamos al host que el menú se ha añadido correctamente
  window.dispatchEvent(new CustomEvent('remote-menu-added', {
    detail: { id: menuItem.id, status: 'success' }
  }));
}

// Escuchamos eventos del host
function handleHostEvent(event) {
  if (event.detail && typeof event.detail.action === 'string') {
    switch(event.detail.action) {
      case 'refresh':
        refreshData();
        break;
      case 'theme-changed':
        // El host nos notifica de un cambio de tema
        console.log('Tema cambiado a:', event.detail.theme);
        break;
    }
  }
}

// Ciclo de vida
onMounted(() => {
  console.log('Vista remota montada correctamente');
  window.addEventListener('host-to-remote-event', handleHostEvent);
  
  // Verificamos si estamos conectados con el host
  isConnected.value = window.parent !== window;
  
  // Simulamos una conexión exitosa después de un breve retraso
  setTimeout(() => {
    isConnected.value = true;
    // Notificamos al host que estamos listos
    window.dispatchEvent(new CustomEvent('remote-view-ready', {
      detail: { id: 'dashboard-view', status: 'success' }
    }));
  }, 1000);
  
  // Actualizamos los datos iniciales
  refreshData();
});

onBeforeUnmount(() => {
  window.removeEventListener('host-to-remote-event', handleHostEvent);
});
</script>

<style scoped>
.remote-view {
  padding: 24px;
  max-width: 900px;
  margin: 0 auto;
  transition: all 0.3s ease;
}

.remote-view.dark-theme {
  color: #f9fafb;
}

.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

h1 {
  margin: 0;
  font-size: 1.8rem;
  color: #111827;
  font-weight: 600;
}

.dark-theme h1 {
  color: #f9fafb;
}

.connection-status {
  font-size: 0.75rem;
  padding: 4px 10px;
  border-radius: 12px;
  background-color: #f3f4f6;
  color: #6b7280;
  display: flex;
  align-items: center;
  font-weight: 500;
}

.connection-status.connected {
  background-color: #ecfdf5;
  color: #059669;
}

.dark-theme .connection-status {
  background-color: #374151;
  color: #9ca3af;
}

.dark-theme .connection-status.connected {
  background-color: rgba(5, 150, 105, 0.2);
  color: #10b981;
}

.connection-status::before {
  content: '';
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #9ca3af;
  margin-right: 6px;
}

.connection-status.connected::before {
  background-color: #059669;
}

.dark-theme .connection-status.connected::before {
  background-color: #10b981;
}

.view-description {
  color: #6b7280;
  margin-bottom: 24px;
  font-size: 0.95rem;
}

.dark-theme .view-description {
  color: #d1d5db;
}

.dashboard-card {
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 24px;
  margin-top: 20px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.dashboard-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, #4361ee, #3a0ca3);
}

.dark-theme .dashboard-card {
  background-color: #1f2937;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
}

.dark-theme .dashboard-card::before {
  background: linear-gradient(90deg, #60a5fa, #3b82f6);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #111827;
  font-weight: 600;
}

.dark-theme h2 {
  color: #f9fafb;
}

.last-update {
  font-size: 0.8rem;
  color: #6b7280;
}

.dark-theme .last-update {
  color: #9ca3af;
}

.metrics {
  display: flex;
  justify-content: space-between;
  margin: 24px 0;
  gap: 20px;
}

.metric-card {
  background-color: #f9fafb;
  border-radius: 10px;
  padding: 20px;
  flex: 1;
  text-align: center;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.dark-theme .metric-card {
  background-color: #374151;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.metric-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.dark-theme .metric-card:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.7; }
  100% { opacity: 1; }
}

.metric-card.refreshing {
  animation: pulse 1.5s infinite;
}

.metric-icon {
  width: 40px;
  height: 40px;
  margin: 0 auto 12px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
}

.users-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%234361ee'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' /%3E%3C/svg%3E");
}

.views-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%234361ee'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' /%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' /%3E%3C/svg%3E");
}

.conversion-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%234361ee'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' /%3E%3C/svg%3E");
}

.dark-theme .users-icon,
.dark-theme .views-icon,
.dark-theme .conversion-icon {
  filter: brightness(1.5);
}

.metric-value {
  font-size: 2.5rem;
  font-weight: bold;
  color: #4361ee;
  margin-bottom: 8px;
}

.dark-theme .metric-value {
  color: #60a5fa;
}

.metric-label {
  color: #6b7280;
  font-size: 0.9rem;
  margin-bottom: 12px;
}

.dark-theme .metric-label {
  color: #d1d5db;
}

.metric-trend {
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
}

.metric-trend.positive {
  color: #059669;
}

.metric-trend.negative {
  color: #dc2626;
}

.dark-theme .metric-trend {
  color: #9ca3af;
}

.dark-theme .metric-trend.positive {
  color: #10b981;
}

.dark-theme .metric-trend.negative {
  color: #ef4444;
}

.trend-arrow {
  font-size: 1.2rem;
  margin-right: 4px;
}

.actions {
  display: flex;
  gap: 16px;
  margin-top: 32px;
}

.action-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.action-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

.action-btn.primary {
  background-color: #4361ee;
  color: white;
  box-shadow: 0 2px 8px rgba(67, 97, 238, 0.3);
}

.action-btn.secondary {
  background-color: #f3f4f6;
  color: #4b5563;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.dark-theme .action-btn.primary {
  background-color: #3b82f6;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

.dark-theme .action-btn.secondary {
  background-color: #374151;
  color: #e5e7eb;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.action-btn:hover:not(:disabled) {
  transform: translateY(-2px);
}

.action-btn.primary:hover:not(:disabled) {
  box-shadow: 0 4px 12px rgba(67, 97, 238, 0.4);
}

.action-btn.secondary:hover:not(:disabled) {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.dark-theme .action-btn.primary:hover:not(:disabled) {
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.dark-theme .action-btn.secondary:hover:not(:disabled) {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.button-icon {
  width: 16px;
  height: 16px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
}

.refresh-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23ffffff'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' /%3E%3C/svg%3E");
}

.menu-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%234b5563'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M4 6h16M4 12h16M4 18h7' /%3E%3C/svg%3E");
}

.dark-theme .menu-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23e5e7eb'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M4 6h16M4 12h16M4 18h7' /%3E%3C/svg%3E");
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.refresh-icon.spinning {
  animation: spin 1s linear infinite;
}
</style>
