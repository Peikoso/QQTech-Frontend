import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { initMocks } from './mock'
import '@/assets/styles.css'
import '@/assets/button_status.css'
import '@/assets/link.css'
import '@/assets/login.css'
import '@/assets/navbar.css'
import '@/assets/saveMessage.css'

initMocks()

const app = createApp(App)

app.use(router)
app.mount('#app')
