import Vue from 'vue'
import App from './App.vue'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// MOB_DEBUG=true npm run test - Enables mobile debugging
// (sending console output to the webpack terminal)
if (MOB_DEBUG) {
    console.log = debug
    console.error = debug
    console.warn = debug
}


Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

new Vue({
  el: '#app',
  render: h => h(App)
})


function debug(...argv) {
    fetch('/debug?argv=' + JSON.stringify(argv))
}
