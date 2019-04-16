import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
var cmd=require('node-cmd')

import { connect } from "@holochain/hc-web-client";
Vue.prototype.$holochain = connect("ws:localhost:8887");

cmd.get(
  'pwd',
  function(err, data, stderr){
      console.log('the current working dir is : ',data)
  }
);

Vue.config.productionTip = false
Vue.config.ignoredElements = [/^ion-/]

new Vue({
  data:{
    wsUrl: 'ws:localhost:8887'
  },
  router,
  render: h => h(App)
}).$mount('#app')
