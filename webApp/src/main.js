import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'

import { connect } from "@holochain/hc-web-client";
Vue.prototype.$holochain = connect("ws:localhost:8887");

Vue.config.productionTip = false

new Vue({
  data:{
    wsUrl: 'ws:localhost:8887'
  },
  router,
  render: h => h(App)
}).$mount('#app')
