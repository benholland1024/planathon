import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Onboarding/Landing.vue'
import DoesNotExist from './views/notDone.vue'
import notFound from './views/notFound.vue'
import Vis from './views/Vis.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    },
    {
      path: '/dne',
      name: 'doesNotExist',
      component: DoesNotExist
    },
    {
      path: '/vis',
      name: 'Vis',
      component: Vis
    },
    {
      path: '/register',
      name:'register',
      component: () => import('./components/Auth/Register.vue')
    },
    {
      path: '/login',
      name:'login',
      component: () => import('./components/Auth/Login.vue')
    },
    {
      path: '/dashboard/:hackathonId',
      name:'dashboard',
      component: () => import('./views/Onboarding/Dashboard.vue')
    },
    {
      path: '/fundingburndown',
      name: 'FundingBurndown',
      component: () => import('./components/Sponsorship/FundingBurndown.vue')
    },
    {
      path: '/contacttracker',
      name: 'ContactTracker',
      component: () => import('./components/Sponsorship/ContactTracker.vue')
    },
    {
      path: '*',
      redirect: '/404'
    },
    {
      path: '/404',
      name: '404',
      component: notFound
    },]
})
