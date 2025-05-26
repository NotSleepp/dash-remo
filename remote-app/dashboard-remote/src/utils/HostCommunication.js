/**
 * Utilidad para la comunicación entre componentes remotos y la aplicación host
 */

// Constantes para los tipos de eventos
export const REMOTE_EVENTS = {
  ADD_MENU_ITEM: 'add-dashboard-menu-item',
  WIDGET_MOUNTED: 'remote-widget-mounted',
  VIEW_READY: 'remote-view-ready',
  DATA_UPDATED: 'remote-data-updated',
  COUNTER_UPDATED: 'remote-counter-updated',
  NOTIFICATION: 'remote-notification',
  MODAL_OPEN: 'remote-modal-open',
  THEME_REQUEST: 'remote-theme-request'
};

export const HOST_ACTIONS = {
  THEME_CHANGED: 'theme-changed',
  MENU_ITEM_ADDED: 'menu-item-added',
  REFRESH: 'refresh',
  NOTIFICATION_SHOWN: 'notification-shown',
  MODAL_OPENED: 'modal-opened'
};

/**
 * Envía un evento al host con los datos proporcionados
 * @param {string} eventName - Nombre del evento a enviar
 * @param {Object} data - Datos a enviar con el evento
 */
export function sendEventToHost(eventName, data = {}) {
  window.dispatchEvent(new CustomEvent(eventName, {
    detail: {
      ...data,
      timestamp: new Date().toISOString()
    }
  }));
}

/**
 * Configura un escuchador para eventos enviados desde el host
 * @param {Function} callback - Función a llamar cuando se recibe un evento
 * @returns {Function} - Función para eliminar el escuchador
 */
export function listenToHostEvents(callback) {
  const handleHostEvent = (event) => {
    const { action, ...data } = event.detail;
    callback(action, data);
  };
  
  window.addEventListener('host-to-remote-event', handleHostEvent);
  
  // Devolver función para eliminar el escuchador
  return () => {
    window.removeEventListener('host-to-remote-event', handleHostEvent);
  };
}

/**
 * Añade un elemento al menú del dashboard
 * @param {Object} menuItem - Elemento de menú a añadir
 * @param {string} menuItem.id - ID único del elemento
 * @param {string} menuItem.label - Texto a mostrar
 * @param {string} menuItem.path - Ruta a la que navegar
 * @param {string} [menuItem.icon] - Nombre del icono (opcional)
 * @param {number} [menuItem.order] - Orden en el menú (opcional)
 */
export function addMenuItem({ id, label, path, icon, order }) {
  sendEventToHost(REMOTE_EVENTS.ADD_MENU_ITEM, {
    id,
    label,
    path,
    icon,
    order
  });
}

/**
 * Notifica que un widget se ha montado
 * @param {string} id - ID del widget
 * @param {string} name - Nombre del widget
 * @param {string} version - Versión del widget
 */
export function notifyWidgetMounted(id, name, version) {
  sendEventToHost(REMOTE_EVENTS.WIDGET_MOUNTED, {
    id,
    name,
    version
  });
}

/**
 * Notifica que una vista remota está lista
 * @param {string} id - ID de la vista
 * @param {string} name - Nombre de la vista
 * @param {string} version - Versión de la vista
 */
export function notifyViewReady(id, name, version) {
  sendEventToHost(REMOTE_EVENTS.VIEW_READY, {
    id,
    name,
    version
  });
}

/**
 * Envía datos actualizados al host
 * @param {Object} metrics - Métricas o datos a enviar
 */
export function updateData(metrics) {
  sendEventToHost(REMOTE_EVENTS.DATA_UPDATED, { metrics });
}

/**
 * Actualiza un contador en el host
 * @param {number} value - Nuevo valor del contador
 */
export function updateCounter(value) {
  sendEventToHost(REMOTE_EVENTS.COUNTER_UPDATED, { value });
}

/**
 * Muestra una notificación en el host
 * @param {string} type - Tipo de notificación ('success', 'error', 'warning', 'info')
 * @param {string} message - Mensaje de la notificación
 * @param {string} [title] - Título de la notificación (opcional)
 * @param {number} [duration] - Duración en ms (opcional, por defecto 5000)
 */
export function showNotification(type, message, title, duration) {
  sendEventToHost(REMOTE_EVENTS.NOTIFICATION, {
    type,
    message,
    title,
    duration
  });
}

/**
 * Abre un modal en el host
 * @param {Object} modalConfig - Configuración del modal
 * @param {string} modalConfig.title - Título del modal
 * @param {string} modalConfig.content - Contenido HTML del modal
 * @param {string} [modalConfig.size] - Tamaño ('sm', 'md', 'lg', 'xl')
 * @param {boolean} [modalConfig.persistent] - Si es true, no se puede cerrar con Escape o clic fuera
 * @param {string} [modalConfig.confirmText] - Texto del botón de confirmación
 * @param {string} [modalConfig.cancelText] - Texto del botón de cancelación
 * @param {boolean} [modalConfig.showFooter] - Si es false, no muestra botones
 */
export function openModal(modalConfig) {
  sendEventToHost(REMOTE_EVENTS.MODAL_OPEN, modalConfig);
}

/**
 * Solicita información del tema actual al host
 */
export function requestTheme() {
  sendEventToHost(REMOTE_EVENTS.THEME_REQUEST);
}

/**
 * Aplica las variables de tema recibidas del host
 * @param {string} theme - Nombre del tema ('light' o 'dark')
 * @param {Object} themeVars - Variables CSS del tema
 */
export function applyTheme(theme, themeVars) {
  // Guardar el tema actual (puedes usar una store si es necesario)
  // Ejemplo: currentTheme.value = theme;
  
  // Aplicar variables CSS al componente
  if (themeVars) {
    Object.entries(themeVars).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
  }
}

// Exportar un objeto con todas las funciones para facilitar su uso
export default {
  sendEventToHost,
  listenToHostEvents,
  addMenuItem,
  notifyWidgetMounted,
  notifyViewReady,
  updateData,
  updateCounter,
  showNotification,
  openModal,
  requestTheme,
  applyTheme,
  REMOTE_EVENTS,
  HOST_ACTIONS
};