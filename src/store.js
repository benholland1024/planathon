import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import users from './storeModules/users.js';


export default new Vuex.Store({
  plugins: [users],
  state: {

  },
  mutations: {

  },
  actions: {

  }
})

