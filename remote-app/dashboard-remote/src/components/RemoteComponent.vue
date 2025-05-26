<template>
  <div class="remote-component" :class="{ 'dark-theme': theme === 'dark' }">
    <div class="header">
      <h2>{{ title }}</h2>
      <div class="status-badge" :class="{ 'connected': isConnected }">
        {{ isConnected ? 'Conectado' : 'Desconectado' }}
      </div>
    </div>
    
    <p class="description">Componente remoto con contador sincronizado</p>
    
    <div class="counter-container">
      <div class="counter-display">
        <span class="counter-label">Contador:</span>
        <span class="counter-value">{{ count }}</span>
      </div>
      
      <div class="counter-controls">
        <button @click="decrement" class="counter-button decrement">
          <span class="button-icon minus-icon"></span>
        </button>
        <button @click="increment" class="counter-button increment">
          <span class="button-icon plus-icon"></span>
        </button>
      </div>
    </div>
    
    <div class="sync-status" :class="{ 'synced': isSynced }">
      <span class="sync-icon"></span>
      <span>{{ syncStatus }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';

// Props
const props = defineProps({
  title: {
    type: String,
    default: 'Componente Remoto'
  },
  theme: {
    type: String,
    default: 'light',
    validator: (value) => ['light', 'dark'].includes(value)
  },
  initialCount: {
    type: Number,
    default: 0
  }
});

// Estado
const count = ref(props.initialCount);
const isConnected = ref(false);
const isSynced = ref(true);
const lastSyncTime = ref(null);

// Estado calculado
const syncStatus = computed(() => {
  if (!isConnected.value) return 'Sin conexión';
  if (!isSynced.value) return 'Sincronizando...';
  if (lastSyncTime.value) {
    return `Sincronizado: ${new Date(lastSyncTime.value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }
  return 'Sincronizado';
});

// Métodos
function increment() {
  count.value++;
  syncWithHost();
}

function decrement() {
  count.value--;
  syncWithHost();
}

function syncWithHost() {
  // Simulamos un proceso de sincronización
  isSynced.value = false;
  
  setTimeout(() => {
    isSynced.value = true;
    lastSyncTime.value = new Date().getTime();
    
    // Enviamos el evento al host
    window.dispatchEvent(new CustomEvent('remote-counter-updated', {
      detail: {
        count: count.value,
        timestamp: lastSyncTime.value
      }
    }));
  }, 600);
}

// Manejador de eventos del host
function handleHostEvent(event) {
  if (event.detail && typeof event.detail.action === 'string') {
    switch(event.detail.action) {
      case 'reset':
        count.value = 0;
        syncWithHost();
        break;
      case 'set-count':
        if (typeof event.detail.value === 'number') {
          count.value = event.detail.value;
          isSynced.value = true;
          lastSyncTime.value = new Date().getTime();
        }
        break;
    }
  }
}

// Ciclo de vida
onMounted(() => {
  console.log('Componente remoto montado correctamente');
  window.addEventListener('host-to-remote-event', handleHostEvent);
  
  // Verificamos si estamos conectados con el host
  isConnected.value = window.parent !== window;
  
  // Simulamos una conexión exitosa después de un breve retraso
  setTimeout(() => {
    isConnected.value = true;
    // Notificamos al host que estamos listos
    window.dispatchEvent(new CustomEvent('remote-component-ready', {
      detail: { id: 'counter-component', status: 'success' }
    }));
  }, 800);
});

onBeforeUnmount(() => {
  window.removeEventListener('host-to-remote-event', handleHostEvent);
});
</script>

<style scoped>
.remote-component {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 20px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.remote-component:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.12);
}

.remote-component::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, #4361ee, #3a0ca3);
}

.remote-component.dark-theme {
  background-color: #1f2937;
  color: #f9fafb;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
}

.remote-component.dark-theme::before {
  background: linear-gradient(90deg, #60a5fa, #3b82f6);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

h2 {
  margin: 0;
  color: #111827;
  font-size: 1.5rem;
  font-weight: 600;
}

.dark-theme h2 {
  color: #f9fafb;
}

.status-badge {
  font-size: 0.75rem;
  padding: 4px 10px;
  border-radius: 12px;
  background-color: #f3f4f6;
  color: #6b7280;
  display: flex;
  align-items: center;
  font-weight: 500;
}

.status-badge.connected {
  background-color: #ecfdf5;
  color: #059669;
}

.dark-theme .status-badge {
  background-color: #374151;
  color: #9ca3af;
}

.dark-theme .status-badge.connected {
  background-color: rgba(5, 150, 105, 0.2);
  color: #10b981;
}

.status-badge::before {
  content: '';
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #9ca3af;
  margin-right: 6px;
}

.status-badge.connected::before {
  background-color: #059669;
}

.dark-theme .status-badge.connected::before {
  background-color: #10b981;
}

.description {
  color: #6b7280;
  margin-bottom: 24px;
  font-size: 0.95rem;
}

.dark-theme .description {
  color: #d1d5db;
}

.counter-container {
  background-color: #f9fafb;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
}

.dark-theme .counter-container {
  background-color: #374151;
}

.counter-display {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.counter-label {
  font-size: 1.1rem;
  color: #6b7280;
  margin-right: 10px;
}

.dark-theme .counter-label {
  color: #d1d5db;
}

.counter-value {
  font-size: 2.5rem;
  font-weight: bold;
  color: #4361ee;
}

.dark-theme .counter-value {
  color: #60a5fa;
}

.counter-controls {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.counter-button {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.counter-button:hover {
  transform: scale(1.1);
}

.counter-button.decrement {
  background-color: #fee2e2;
  color: #dc2626;
}

.counter-button.increment {
  background-color: #dcfce7;
  color: #059669;
}

.dark-theme .counter-button.decrement {
  background-color: rgba(220, 38, 38, 0.2);
  color: #ef4444;
}

.dark-theme .counter-button.increment {
  background-color: rgba(5, 150, 105, 0.2);
  color: #10b981;
}

.button-icon {
  width: 24px;
  height: 24px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
}

.minus-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23dc2626'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M20 12H4' /%3E%3C/svg%3E");
}

.plus-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23059669'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M12 6v6m0 0v6m0-6h6m-6 0H6' /%3E%3C/svg%3E");
}

.dark-theme .minus-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23ef4444'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M20 12H4' /%3E%3C/svg%3E");
}

.dark-theme .plus-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2310b981'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M12 6v6m0 0v6m0-6h6m-6 0H6' /%3E%3C/svg%3E");
}

.sync-status {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  color: #6b7280;
}

.dark-theme .sync-status {
  color: #9ca3af;
}

.sync-icon {
  width: 16px;
  height: 16px;
  margin-right: 8px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' /%3E%3C/svg%3E");
  transition: all 0.3s ease;
}

.dark-theme .sync-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239ca3af'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' /%3E%3C/svg%3E");
}

.sync-status.synced .sync-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23059669'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M5 13l4 4L19 7' /%3E%3C/svg%3E");
}

.dark-theme .sync-status.synced .sync-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2310b981'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M5 13l4 4L19 7' /%3E%3C/svg%3E");
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.sync-status:not(.synced) .sync-icon {
  animation: spin 1.5s linear infinite;
}
</style>
