import Vue from 'vue'
import App from './App'
import router from './router/index'
import Router from 'vue-router'

Vue.use(Router)
Vue.config.productionTip = false

new Vue({
  render(h) {
    return h(App)
  },
  router
}).$mount('#app')


