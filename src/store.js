import Vue from 'vue'
import Vuex from 'vuex'
import users from './storeModules/users.js';
import orgs from './storeModules/orgs.js';
import hackathons from './storeModules/hackathons.js';
import tasks from './storeModules/tasks.js';
import sponsors from './storeModules/sponsors.js';
import sponsorship from './storeModules/sponsorship.js';

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [
    users,
    orgs,
    hackathons,
    tasks,
    sponsors,
    sponsorship
  ],
  state: {

  },
  mutations: {

  },
  actions: {

  }
})
