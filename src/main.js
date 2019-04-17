import Vue from 'vue'
import App from './App.vue'

import './styles/quasar.styl'
import lang from 'quasar/lang/ru.js'
import '@quasar/extras/material-icons/material-icons.css'
import Quasar from 'quasar'

Vue.use(Quasar, {
  config: {},
  lang: lang
 })

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
