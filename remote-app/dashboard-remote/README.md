# Dashboard Remote Components

## Guía para Desarrolladores de Componentes Remotos

Esta documentación proporciona información sobre cómo integrar componentes remotos con la aplicación host DashaDash utilizando el sistema de comunicación mejorado.

## Índice

1. [Arquitectura de Comunicación](#arquitectura-de-comunicación)
2. [Eventos Disponibles](#eventos-disponibles)
3. [Ejemplos de Uso](#ejemplos-de-uso)
4. [Tema y Estilos](#tema-y-estilos)
5. [Notificaciones](#notificaciones)
6. [Modales](#modales)
7. [Elementos de Menú](#elementos-de-menú)

## Arquitectura de Comunicación

La comunicación entre la aplicación host y los componentes remotos se realiza mediante eventos personalizados (CustomEvent). El sistema proporciona una interfaz unificada para enviar y recibir eventos.

### Enviar eventos al host

```javascript
function sendEventToHost(eventName, data = {}) {
  window.dispatchEvent(new CustomEvent(eventName, {
    detail: {
      ...data,
      timestamp: new Date().toISOString()
    }
  }));
}
```

### Recibir eventos del host

```javascript
function listenToHostEvents(callback) {
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
```

## Eventos Disponibles

### Eventos que puede enviar el componente remoto al host

| Nombre del Evento | Descripción | Datos Esperados |
|-------------------|-------------|------------------|
| `add-dashboard-menu-item` | Añadir un elemento al menú del dashboard | `{ id, label, path, icon, order }` |
| `remote-widget-mounted` | Notificar que un widget se ha montado | `{ id, name, version }` |
| `remote-view-ready` | Notificar que una vista remota está lista | `{ id, name, version }` |
| `remote-data-updated` | Enviar datos actualizados al host | `{ metrics: { ... } }` |
| `remote-counter-updated` | Notificar actualización de contador | `{ value: number }` |
| `remote-notification` | Mostrar una notificación en el host | `{ type, title, message, duration }` |
| `remote-modal-open` | Abrir un modal en el host | `{ title, content, size, persistent }` |
| `remote-theme-request` | Solicitar información del tema actual | `{}` |

### Acciones que puede enviar el host al componente remoto

| Nombre de la Acción | Descripción | Datos Incluidos |
|---------------------|-------------|------------------|
| `theme-changed` | Notificar cambio de tema | `{ theme, themeVars }` |
| `menu-item-added` | Confirmar adición de elemento de menú | `{ id, status }` |
| `refresh` | Solicitar actualización de datos | `{}` |
| `notification-shown` | Confirmar que se mostró una notificación | `{ id, status }` |
| `modal-opened` | Confirmar que se abrió un modal | `{ id, status }` |

## Ejemplos de Uso

### Mostrar una notificación

```javascript
sendEventToHost('remote-notification', {
  type: 'success', // 'success', 'error', 'warning', 'info'
  title: 'Operación Exitosa',
  message: 'Los datos se han guardado correctamente',
  duration: 5000 // milisegundos, opcional
});
```

### Abrir un modal

```javascript
sendEventToHost('remote-modal-open', {
  title: 'Confirmación',
  content: '¿Está seguro de que desea eliminar este elemento?',
  size: 'md', // 'sm', 'md', 'lg', 'xl'
  persistent: false,
  confirmText: 'Eliminar',
  cancelText: 'Cancelar'
});
```

### Añadir un elemento de menú

```javascript
sendEventToHost('add-dashboard-menu-item', {
  id: 'remote-stats',
  label: 'Estadísticas',
  path: '/dashboard/remote',
  icon: 'bar-chart',
  order: 3
});
```

### Escuchar cambios de tema

```javascript
onMounted(() => {
  const removeListener = listenToHostEvents((action, data) => {
    if (action === 'theme-changed') {
      // Actualizar el tema en el componente remoto
      updateTheme(data.theme, data.themeVars);
    }
  });
  
  // Solicitar el tema actual al montar el componente
  sendEventToHost('remote-theme-request');
  
  onBeforeUnmount(() => {
    // Limpiar el escuchador al desmontar
    removeListener();
  });
});
```

## Tema y Estilos

El host proporciona información completa sobre el tema actual, incluyendo todas las variables CSS. Esto permite a los componentes remotos adaptarse perfectamente al tema del host.

### Variables de Tema Disponibles

```javascript
// Ejemplo de variables de tema proporcionadas por el host
const lightThemeVars = {
  '--color-bg-primary': '#ffffff',
  '--color-bg-secondary': '#f3f4f6',
  '--color-text-primary': '#1f2937',
  '--color-text-secondary': '#4b5563',
  '--color-accent': '#3b82f6',
  '--color-border': '#e5e7eb',
  '--color-success': '#10b981',
  '--color-error': '#ef4444',
  '--color-warning': '#f59e0b',
  '--color-info': '#3b82f6'
};

const darkThemeVars = {
  '--color-bg-primary': '#111827',
  '--color-bg-secondary': '#1f2937',
  '--color-text-primary': '#f9fafb',
  '--color-text-secondary': '#d1d5db',
  '--color-accent': '#60a5fa',
  '--color-border': '#374151',
  '--color-success': '#34d399',
  '--color-error': '#f87171',
  '--color-warning': '#fbbf24',
  '--color-info': '#60a5fa'
};
```

### Aplicar Variables de Tema

```javascript
function updateTheme(theme, themeVars) {
  // Guardar el tema actual
  currentTheme.value = theme;
  
  // Aplicar variables CSS al componente
  if (themeVars) {
    Object.entries(themeVars).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
  }
}
```

## Notificaciones

Los componentes remotos pueden mostrar notificaciones en la aplicación host utilizando el evento `remote-notification`.

### Tipos de Notificaciones

- `success`: Para operaciones exitosas
- `error`: Para errores
- `warning`: Para advertencias
- `info`: Para información general

### Propiedades de las Notificaciones

- `type`: Tipo de notificación (obligatorio)
- `title`: Título de la notificación (opcional)
- `message`: Mensaje de la notificación (obligatorio)
- `duration`: Duración en milisegundos (opcional, por defecto 5000)

## Modales

Los componentes remotos pueden abrir modales en la aplicación host utilizando el evento `remote-modal-open`.

### Tamaños de Modal

- `sm`: Pequeño (24rem)
- `md`: Mediano (32rem)
- `lg`: Grande (48rem)
- `xl`: Extra grande (64rem)

### Propiedades de los Modales

- `title`: Título del modal (obligatorio)
- `content`: Contenido HTML del modal (obligatorio si no se proporciona component)
- `size`: Tamaño del modal (opcional, por defecto 'md')
- `persistent`: Si es true, el modal no se puede cerrar haciendo clic fuera o con Escape (opcional, por defecto false)
- `confirmText`: Texto del botón de confirmación (opcional, por defecto 'Aceptar')
- `cancelText`: Texto del botón de cancelación (opcional, por defecto 'Cancelar')
- `showFooter`: Si es false, no se muestran los botones de confirmación y cancelación (opcional, por defecto true)

## Elementos de Menú

Los componentes remotos pueden añadir elementos al menú del dashboard utilizando el evento `add-dashboard-menu-item`.

### Propiedades de los Elementos de Menú

- `id`: Identificador único del elemento (obligatorio)
- `label`: Texto a mostrar (obligatorio)
- `path`: Ruta a la que debe navegar (obligatorio)
- `icon`: Nombre del icono a mostrar (opcional)
- `order`: Orden de aparición en el menú (opcional)

## Configuración del Proyecto

```sh
npm install
```

### Compilar y Hot-Reload para Desarrollo

```sh
npm run dev
```

### Compilar y Minificar para Producción

```sh
npm run build
```
