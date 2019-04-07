import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false

new Vue({
  data:{
    wsUrl: 'ws:localhost:8887'
  },
  router,
  render: h => h(App)
}).$mount('#app')
