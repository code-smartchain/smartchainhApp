import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import 'vuetify/src/stylus/app.styl'
import Key from '../components/Key.vue'
import Keys from '../components/Keys.vue'

Vue.use(Vuetify, {
  iconfont: 'md',
  icons: {
    'key': {
      component: Key,
    },
    'keys': {
      component: Keys,
    }
  }
})
