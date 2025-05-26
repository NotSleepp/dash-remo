import { createApp } from 'vue'  
import App from './App.vue'  
  
// Creamos y montamos la aplicación  
const app = createApp(App)  
app.mount('#app')  
  
// Exportamos los componentes que queremos exponer a través de Module Federation  
export { default as RemoteComponent } from './components/RemoteComponent.vue'  
export { default as RemoteView } from './views/RemoteView.vue' 
export { default as RemoteExample } from './components/RemoteExample.vue'
