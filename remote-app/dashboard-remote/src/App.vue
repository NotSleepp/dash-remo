<script setup>
import { ref } from "vue";
import RemoteComponent from "./components/RemoteComponent.vue";
import RemoteExample from "./components/RemoteExample.vue";

const title = ref("Aplicación Remota");
</script>

<template>
 <div class="app-container">
  <header>
   <h1>{{ title }}</h1>
   <p>Este es un componente remoto que se carga desde otra aplicación</p>
  </header>
  <main>
   <div class="info-card">
    <h2>Componente Remoto</h2>
    <RemoteComponent />
   </div>
   <div class="info-card">
    <h2>Componente de Ejemplo con Bridge</h2>
    <RemoteExample />
   </div>
   <div class="info-card">
    <h2>Información</h2>
    <p>Este componente se está cargando desde la aplicación host.</p>
   </div>
  </main>
 </div>
</template>

<style scoped>
.app-container {
 max-width: 1200px;
 margin: 0 auto;
 padding: 20px;
 font-family: Arial, sans-serif;
}

header {
 margin-bottom: 30px;
 text-align: center;
}

header h1 {
 color: #42b883;
 margin-bottom: 10px;
}

main {
 display: flex;
 flex-direction: column;
 gap: 30px;
}

.info-card {
 background-color: #f8f8f8;
 border-radius: 8px;
 padding: 20px;
 border-left: 4px solid #42b883;
}

ul {
 margin-left: 20px;
 line-height: 1.6;
}
</style>
