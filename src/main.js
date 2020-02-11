import Vue from 'vue'
import App from './App'
import router from './router/index'
import Router from 'vue-router'
import viewUI from 'view-design'
import Axios from 'axios'
import 'view-design/dist/styles/iview.css'
import './style.css'

Vue.use(Router)
Vue.use(viewUI)

Axios.create({

})

Vue.prototype.$http = Axios
Vue.config.productionTip = false

const app =  new Vue({
  render(h) {
    return h(App)
  },
  router
}).$mount('#app')

export {app}


