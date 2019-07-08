import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueResource from 'vue-resource';

Vue.use(VueResource);
// Vue.http.interceptors.push((request, next) => {
//   request.credentials = true
//   request.headers.set('X-Requested-With', 'XMLHttpRequest')
//   next()
// })
Vue.http.options.xhr = {withCredentials: false};
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
