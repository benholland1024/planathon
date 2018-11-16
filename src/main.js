import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
  mounted() {
    this.$store.dispatch('users/openDBChannel')
    this.$store.dispatch('orgs/openDBChannel')
    this.$store.dispatch('hackathons/openDBChannel')
    this.$store.dispatch('tasks/openDBChannel')
    this.$store.dispatch('sponsors/openDBChannel');
    this.$store.dispatch('colors/openDBChannel');
  }
}).$mount('#app')
