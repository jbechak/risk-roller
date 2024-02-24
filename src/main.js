import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// import Vue from 'vue'
// import { BootstrapVue } from 'bootstrap-vue'

// Import Bootstrap and BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// Make BootstrapVue available throughout your project
// Vue.use(BootstrapVue)

createApp(App).use(router).mount('#app')
