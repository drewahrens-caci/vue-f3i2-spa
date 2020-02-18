import Vue from 'vue'
import VueRouter from 'vue-router'
import ThemeLayout from '@/components/Layout/DashboardLayout.vue'
import home from '@/components/Pages/home.vue'

Vue.use(VueRouter)

let travelMenu = {
  path: '/travel',
  component: ThemeLayout,
  redirect: '/travel/home',
  children: [
    {
      path: 'home/:mode',
      name: 'Travel',
      component:  () => import(/* webpackChunkName: "travel" */ '../components/Pages/travel.vue'),
      props: true
    }
  ]
}

let personnelMenu = {
  path: '/personnel',
  component: ThemeLayout,
  redirect: '/personnel/home',
  children: [
    {
      path: 'home/:mode',
      name: 'Personnel',
      component:  () => import(/* webpackChunkName: "personnel" */ '../components/Pages/personnel.vue'),
      props: true
    }
  ]
}

let backlogMenu = {
  path: '/backlog',
  component: ThemeLayout,
  redirect: '/backlog/home',
  children: [
    {
      path: 'home',
      name: 'Product Backlog',
      component:  () => import(/* webpackChunkName: "backlog" */ '../components/Pages/backlog.vue'),
      props: true
    }
  ]
}

let workplanMenu = {
  path: '/workplans',
  component: ThemeLayout,
  redirect: '/workplans/home',
  children: [
    {
      path: 'home/:mode',
      name: 'Work Plans',
      component: () => import(/* webpackChunkName: "workplan" */ '../components/Pages/workplan.vue'),
      props: true
    }
  ]
}

const routes = [
  {
    path: '/',
    redirect: '/pages/home'
  },
  travelMenu,
  personnelMenu,
  backlogMenu,
  workplanMenu,
  {
    path: '/pages',
    component: ThemeLayout,
    redirect: '/pages/home',
    children: [
      {
        path: 'home',
        name: 'Home',
        component: home
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
