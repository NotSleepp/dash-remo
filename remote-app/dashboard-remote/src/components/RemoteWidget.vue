<template>
  <div class="remote-widget">
    <h2>{{ title }}</h2>
    <p>Este es un componente remoto cargado desde otra aplicación</p>
    <div class="stats">
      <div class="stat-item">
        <span class="value">{{ stats.visits }}</span>
        <span class="label">Visitas</span>
      </div>
      <div class="stat-item">
        <span class="value">{{ stats.sales }}</span>
        <span class="label">Ventas</span>
      </div>
      <div class="stat-item">
        <span class="value">{{ stats.users }}</span>
        <span class="label">Usuarios</span>
      </div>
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
    }
  },
  data() {
    return {
      stats: {
        visits: 1254,
        sales: 642,
        users: 86
      }
    }
  }
}
</script>

<style scoped>
.remote-widget {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

h2 {
  margin-top: 0;
  color: #333;
  font-size: 1.5rem;
}

.stats {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.stat-item {
  text-align: center;
  flex: 1;
  padding: 10px;
}

.value {
  display: block;
  font-size: 1.8rem;
  font-weight: bold;
  color: #4361ee;
}

.label {
  display: block;
  color: #666;
  font-size: 0.9rem;
  margin-top: 5px;
}
</style>
