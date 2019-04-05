import Vue from 'vue'
import Router from 'vue-router'
import OpenLock from './views/OpenLock.vue'
import YourAccesses from './views/YourAccesses.vue'

Vue.use(Router)

export default new Router({
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: OpenLock
    },
    {
      path: '/accesses',
      name: 'accesses',
      component: YourAccesses
    }
  ]
})
