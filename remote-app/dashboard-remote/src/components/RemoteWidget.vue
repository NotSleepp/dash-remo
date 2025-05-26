<template>
  <div class="remote-widget" :class="{ 'dark-theme': theme === 'dark' }">
    <h2>{{ title }}</h2>
    <p>Este es un componente remoto cargado desde otra aplicación</p>
    <div class="stats">
      <div class="stat-item">
        <div class="stat-icon visits-icon"></div>
        <span class="value">{{ stats.visits }}</span>
        <span class="label">Visitas</span>
      </div>
      <div class="stat-item">
        <div class="stat-icon sales-icon"></div>
        <span class="value">{{ stats.sales }}</span>
        <span class="label">Ventas</span>
      </div>
      <div class="stat-item">
        <div class="stat-icon users-icon"></div>
        <span class="value">{{ stats.users }}</span>
        <span class="label">Usuarios</span>
      </div>
    </div>
    <div class="trend-indicator" :class="{ 'positive': trend > 0, 'negative': trend < 0 }">
      <span class="trend-arrow">{{ trend > 0 ? '↑' : trend < 0 ? '↓' : '→' }}</span>
      <span class="trend-value">{{ Math.abs(trend) }}% respecto al mes anterior</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RemoteWidget',
  props: {
    title: {
      type: String,
      default: 'Widget Remoto'
    },
    theme: {
      type: String,
      default: 'light',
      validator: (value) => ['light', 'dark'].includes(value)
    }
  },
  data() {
    return {
      stats: {
        visits: 1254,
        sales: 642,
        users: 86
      },
      trend: 8.5, // Porcentaje de cambio respecto al mes anterior (positivo = aumento)
      refreshInterval: null
    }
  },
  mounted() {
    // Simulamos actualizaciones periódicas de datos
    this.refreshInterval = setInterval(() => {
      this.updateRandomStat();
    }, 8000);
    
    // Notificamos al host que el componente se ha montado correctamente
    window.dispatchEvent(new CustomEvent('remote-widget-mounted', {
      detail: { id: 'stats-widget', status: 'success' }
    }));
  },
  beforeUnmount() {
    // Limpiamos el intervalo al desmontar
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  },
  methods: {
    updateRandomStat() {
      const keys = Object.keys(this.stats);
      const randomKey = keys[Math.floor(Math.random() * keys.length)];
      const currentValue = this.stats[randomKey];
      const change = Math.floor(Math.random() * 20) - 5; // Cambio entre -5 y +15
      
      this.stats[randomKey] = Math.max(1, currentValue + change);
      this.trend = parseFloat((Math.random() * 20 - 5).toFixed(1)); // Actualizar tendencia
    }
  }
}
</script>

<style scoped>
.remote-widget {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 20px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.remote-widget:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.12);
}

.remote-widget::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, #4361ee, #3a0ca3);
}

.remote-widget.dark-theme {
  background-color: #1f2937;
  color: #f9fafb;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
}

.remote-widget.dark-theme::before {
  background: linear-gradient(90deg, #60a5fa, #3b82f6);
}

h2 {
  margin-top: 0;
  color: #111827;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 8px;
}

.dark-theme h2 {
  color: #f9fafb;
}

p {
  color: #6b7280;
  margin-bottom: 24px;
  font-size: 0.95rem;
}

.dark-theme p {
  color: #d1d5db;
}

.stats {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  gap: 16px;
}

.stat-item {
  text-align: center;
  flex: 1;
  padding: 16px;
  background-color: #f9fafb;
  border-radius: 8px;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.dark-theme .stat-item {
  background-color: #374151;
}

.stat-item:hover {
  transform: scale(1.03);
}

.stat-icon {
  width: 40px;
  height: 40px;
  margin-bottom: 12px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
}

.visits-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%234361ee'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' /%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' /%3E%3C/svg%3E");
}

.sales-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%234361ee'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' /%3E%3C/svg%3E");
}

.users-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%234361ee'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' /%3E%3C/svg%3E");
}

.dark-theme .visits-icon,
.dark-theme .sales-icon,
.dark-theme .users-icon {
  filter: brightness(1.5);
}

.value {
  display: block;
  font-size: 1.8rem;
  font-weight: bold;
  color: #4361ee;
  margin-bottom: 4px;
}

.dark-theme .value {
  color: #60a5fa;
}

.label {
  display: block;
  color: #6b7280;
  font-size: 0.9rem;
}

.dark-theme .label {
  color: #d1d5db;
}

.trend-indicator {
  margin-top: 20px;
  padding: 10px 16px;
  border-radius: 6px;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f3f4f6;
  color: #6b7280;
}

.dark-theme .trend-indicator {
  background-color: #374151;
  color: #d1d5db;
}

.trend-indicator.positive {
  color: #059669;
}

.trend-indicator.negative {
  color: #dc2626;
}

.dark-theme .trend-indicator.positive {
  color: #10b981;
}

.dark-theme .trend-indicator.negative {
  color: #ef4444;
}

.trend-arrow {
  font-size: 1.2rem;
  margin-right: 6px;
}
</style>
