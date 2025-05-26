<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import hostCommunication, { HOST_ACTIONS } from '../utils/HostCommunication';

// Estado local
const currentTheme = ref('light');
const counter = ref(0);
const message = ref('');

// Función para manejar eventos del host
const handleHostEvent = (action, data) => {
  console.log(`Evento recibido del host: ${action}`, data);
  
  switch (action) {
    case HOST_ACTIONS.THEME_CHANGED:
      // Actualizar el tema local
      currentTheme.value = data.theme;
      hostCommunication.applyTheme(data.theme, data.themeVars);
      break;
    
    case HOST_ACTIONS.REFRESH:
      // Refrescar datos
      refreshData();
      break;
      
    case HOST_ACTIONS.MENU_ITEM_ADDED:
      // Confirmar que se añadió un elemento de menú
      if (data.status === 'success') {
        message.value = `Elemento de menú ${data.id} añadido correctamente`;
      }
      break;
      
    default:
      console.log('Acción no manejada:', action);
  }
};

// Función para incrementar el contador y notificar al host
const incrementCounter = () => {
  counter.value++;
  hostCommunication.updateCounter(counter.value);
  hostCommunication.showNotification('info', `Contador actualizado: ${counter.value}`);
};

// Función para mostrar una notificación de éxito
const showSuccessNotification = () => {
  hostCommunication.showNotification(
    'success',
    'Operación completada correctamente',
    'Éxito',
    5000
  );
};

// Función para mostrar una notificación de error
const showErrorNotification = () => {
  hostCommunication.showNotification(
    'error',
    'No se pudo completar la operación',
    'Error',
    5000
  );
};

// Función para mostrar un modal de confirmación
const showConfirmationModal = () => {
  hostCommunication.openModal({
    title: 'Confirmación',
    content: '¿Está seguro de que desea realizar esta acción?',
    size: 'md',
    persistent: false,
    confirmText: 'Confirmar',
    cancelText: 'Cancelar'
  });
};

// Función para añadir un elemento de menú
const addMenuItemExample = () => {
  hostCommunication.addMenuItem({
    id: 'remote-example',
    label: 'Ejemplo Remoto',
    path: '/dashboard/remote-example',
    icon: 'activity',
    order: 2
  });
};

// Función para refrescar datos
const refreshData = () => {
  const demoData = {
    users: Math.floor(Math.random() * 1000),
    sessions: Math.floor(Math.random() * 5000),
    conversion: (Math.random() * 10).toFixed(2) + '%'
  };
  
  hostCommunication.updateData(demoData);
  message.value = 'Datos actualizados: ' + JSON.stringify(demoData);
};

// Configurar escuchadores al montar el componente
let removeListener;
onMounted(() => {
  // Registrar escuchador para eventos del host
  removeListener = hostCommunication.listenToHostEvents(handleHostEvent);
  
  // Notificar que el componente está listo
  hostCommunication.notifyViewReady('remote-example', 'Componente de Ejemplo', '1.0.0');
  
  // Solicitar información del tema actual
  hostCommunication.requestTheme();
  
  // Añadir elemento de menú al cargar
  addMenuItemExample();
});

// Limpiar escuchadores al desmontar
onBeforeUnmount(() => {
  if (removeListener) {
    removeListener();
  }
});
</script>

<template>
  <div class="remote-example" :class="`theme-${currentTheme}`">
    <h2>Componente Remoto de Ejemplo</h2>
    
    <div class="card">
      <h3>Estado Actual</h3>
      <p>Tema: <strong>{{ currentTheme }}</strong></p>
      <p>Contador: <strong>{{ counter }}</strong></p>
      <p v-if="message" class="message">{{ message }}</p>
    </div>
    
    <div class="actions">
      <h3>Acciones de Demostración</h3>
      
      <div class="buttons">
        <button @click="incrementCounter" class="btn primary">
          Incrementar Contador
        </button>
        
        <button @click="showSuccessNotification" class="btn success">
          Notificación Éxito
        </button>
        
        <button @click="showErrorNotification" class="btn danger">
          Notificación Error
        </button>
        
        <button @click="showConfirmationModal" class="btn info">
          Abrir Modal
        </button>
        
        <button @click="refreshData" class="btn secondary">
          Actualizar Datos
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.remote-example {
  padding: 1.5rem;
  border-radius: 0.5rem;
  background-color: var(--color-bg-secondary);
  color: var(--color-text-primary);
  max-width: 800px;
  margin: 0 auto;
}

h2, h3 {
  color: var(--color-accent);
  margin-bottom: 1rem;
}

.card {
  background-color: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.message {
  background-color: var(--color-bg-secondary);
  padding: 0.75rem;
  border-radius: 0.25rem;
  margin-top: 1rem;
  font-size: 0.875rem;
}

.actions {
  background-color: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  padding: 1rem;
}

.buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1rem;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  border: none;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.btn.primary {
  background-color: var(--color-accent);
  color: white;
}

.btn.success {
  background-color: var(--color-success);
  color: white;
}

.btn.danger {
  background-color: var(--color-error);
  color: white;
}

.btn.info {
  background-color: var(--color-info);
  color: white;
}

.btn.secondary {
  background-color: var(--color-bg-secondary);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
}

/* Estilos responsivos */
@media (max-width: 640px) {
  .buttons {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
  }
}
</style>