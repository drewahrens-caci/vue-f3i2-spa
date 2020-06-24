import Vue from 'vue'
import VueRouter from 'vue-router'
import ThemeLayout from '@/components/Layout/DashboardLayout.vue'
import home from '@/components/Pages/home.vue'
import feature from '@/components/Pages/feature.vue'

Vue.use(VueRouter)

let travelMenu = {
  path: '/travel',
  component: ThemeLayout,
  redirect: '/travel/home',
  children: [
    /* {
      path: 'home/:mode',
      name: 'Travel',
      component: () => import('../components/Pages/travel.vue'),
      props: true
    }, */
    {
      path: 'home/calendar/:mode',
      name: 'Travel Calendar',
      component: () => import(/* webpackChunkName: "travel" */ '../components/Pages/travel.vue'),
      props: true
    },
    {
      path: 'home/refresh/:mode',
      name: 'Travel',
      component: () => import(/* webpackChunkName: "travel" */ '../components/Pages/travel.vue'),
      props: true
    },
    {
      path: 'home/new/:mode',
      name: 'New Travel',
      component: () => import(/* webpackChunkName: "travel" */ '../components/Pages/travel.vue'),
      props: true
    },
    {
      path: 'home/approve/:mode',
      name: 'Approve Travel',
      component: () => import(/* webpackChunkName: "travel" */ '../components/Pages/travel.vue'),
      props: true
    }
  ]
}

let developmentMenu = {
  path: '/development',
  component: ThemeLayout,
  redirect: '/development/home',
  children: [
    {
      path: 'home',
      name: 'Development',
      component: () => import(/* webpackChunkName: "development" */ '../components/Pages/development.vue'),
      props: true
    },
    {
      path: 'msrinput',
      name: 'MSR Input',
      component: () => import(/* webpackChunkName: "development" */ '../components/Pages/msrinput.vue'),
      props: true
    }
  ]
}

let calendarMenu = {
  path: '/calendar',
  component: ThemeLayout,
  redirect: '/calendar/home',
  children: [
    {
      path: 'home',
      name: 'Calendar',
      component: () => import(/* webpackChunkName: "calendar" */ '../components/Pages/calendar.vue'),
      props: true
    }
  ]
}

let refreshMenu = {
  path: '/refresh',
  component: ThemeLayout,
  redirect: '/refresh/home',
  children: [
    {
      path: 'home/:action',
      name: 'Refresh',
      component: () => import(/* webpackChunkName: "refresh" */ '../components/Layout/Refresh.vue'),
      props: true
    }
  ]
}

let featureMenu = {
  path: '/feature',
  component: ThemeLayout,
  redirect: '/feature/home',
  children: [
    {
      path: 'home',
      name: 'Feature',
      component: feature // () => import(/* webpackChunkName: "feature" */ '../components/Pages/feature.vue')
    }
  ]
}

let featuresMenu = {
  path: '/features',
  component: ThemeLayout,
  redirect: '/features/home',
  children: [
    {
      path: 'home',
      name: 'Features',
      component: () => import(/* webpackChunkName: "features" */ '../components/Pages/features.vue'),
      props: true
    }
  ]
}

let bugsMenu = {
  path: '/bugs',
  component: ThemeLayout,
  redirect: '/bugs/home',
  children: [
    {
      path: 'home',
      name: 'Bugs',
      component: () => import(/* webpackChunkName: "features" */ '../components/Pages/bugs.vue'),
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
      path: 'home/reports/:mode',
      name: 'Reports',
      component: () => import(/* webpackChunkName: "personnel" */ '../components/Pages/personnel.vue'),
      props: true
    },
    {
      path: 'home/refresh/:mode',
      name: 'Personnel',
      component: () => import(/* webpackChunkName: "personnel" */ '../components/Pages/personnel.vue'),
      props: true
    },
    {
      path: 'home/new/:mode',
      name: 'Onboarding',
      component: () => import(/* webpackChunkName: "personnel" */ '../components/Pages/personnel.vue'),
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
      path: 'home/active',
      name: 'Work Plans',
      component: () => import(/* webpackChunkName: "workplan" */ '../components/Pages/workplan.vue'),
      props: true
    },
    {
      path: 'home/manning',
      name: 'Manning Report',
      component: () => import(/* webpackChunkName: "workplan" */ '../components/Pages/manning.vue'),
      props: true
    }
  ]
}

const routes = [
  {
    path: '/',
    redirect: '/pages/home'
  },
  developmentMenu,
  calendarMenu,
  travelMenu,
  featureMenu,
  featuresMenu,
  bugsMenu,
  personnelMenu,
  workplanMenu,
  refreshMenu,
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
