import { createApp } from 'vue'  
import App from './App.vue'  
  
// Creamos y montamos la aplicaci¢n  
const app = createApp(App)  
app.mount('#app')  
  
// Exportamos los componentes que queremos exponer a trav‚s de Module Federation  
export { default as RemoteComponent } from './components/RemoteComponent.vue'  
export { default as RemoteView } from './views/RemoteView.vue' 
