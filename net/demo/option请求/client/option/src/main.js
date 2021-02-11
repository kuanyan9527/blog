import Vue from 'vue'
import axios from 'axios'
import App from './App.vue'

Vue.config.productionTip = false

Vue.$http = axios

new Vue({
  render: h => h(App),
}).$mount('#app')
