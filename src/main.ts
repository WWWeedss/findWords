import { createApp } from 'vue'
import './assets/index.css'
import App from './App.vue'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import 'primeicons/primeicons.css'
import { createPinia } from 'pinia'
const app = createApp(App)
app.use(createPinia())

app.use(PrimeVue, {
  theme: {
    preset: Aura
  }})
app.mount('#app').$nextTick(() => {
  // Use contextBridge
  window.ipcRenderer.on('main-process-message', (_event, message) => {
    console.log(message)
  })
})
