import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import axios from 'axios'

// import VCharts from 'v-charts'
// Vue.use(VCharts)






Vue.prototype.$http = axios.create({})

Vue.config.productionTip = false

new Vue({
    router,
    vuetify,
    render: (h) => h(App),
}).$mount('#app')