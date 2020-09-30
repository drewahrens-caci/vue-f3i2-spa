import Vue from 'vue'
import VueRouter from 'vue-router'
import ThemeLayout from '@/components/Layout/DashboardLayout.vue'
import home from '@/components/Pages/home.vue'

Vue.use(VueRouter)

let adminMenu = {
  path: '/admin',
  component: ThemeLayout,
  redirect: '/admin/home',
  children: [
    {
      path: 'home/:mode',
      name: 'Admin',
      component: () => import(/* webpackChunkName: "admin" */ '../components/Admin/admin.vue'),
      props: true
    }
  ]
}

let travelMenu = {
  path: '/travel',
  component: ThemeLayout,
  redirect: '/travel/home',
  children: [
    {
      path: 'home/:mode',
      name: 'Travel',
      component: () => import(/* webpackChunkName: "travel" */ '../components/Travel/traveltracker.vue'),
      props: true
    }
  ]
}

let msrMenu = {
  path: '/msr',
  component: ThemeLayout,
  redirect: '/msr/home',
  children: [
    {
      path: 'home',
      name: 'Home',
      component: () => import(/* webpackChunkName: "msr" */ '../components/MSR/msrhome.vue'),
      props: true
    },
    {
      path: 'form/:id',
      name: 'MSRForm',
      component: () => import(/* webpackChunkName: "msr" */ '../components/MSR/msrform.vue'),
      props: true
    },
    {
      path: 'library',
      name: 'MSR Library',
      component: () => import(/* webpackChunkName: "msr" */ '../components/MSR/library.vue'),
      props: true
    }
  ]
}

let financialMenu = {
  path: '/financial',
  component: ThemeLayout,
  redirect: '/financial/home',
  children: [
    {
      path: 'home',
      name: 'Home',
      component: () => import(/* webpackChunkName: "financial" */ '../components/Financial/dashboard.vue'),
      props: true
    },
    {
      path: 'library',
      name: 'Financial Documents',
      component: () => import(/* webpackChunkName: "financial" */ '../components/Financial/library.vue'),
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
      component: () => import(/* webpackChunkName: "features" */ '../components/Features/feature.vue')
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
      component: () => import(/* webpackChunkName: "features" */ '../components/Features/features.vue'),
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
      component: () => import(/* webpackChunkName: "features" */ '../components/Features/bugs.vue'),
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
      component: () => import(/* webpackChunkName: "personnel" */ '../components/Personnel/personnel.vue'),
      props: true
    },
    {
      path: 'home/refresh/:mode',
      name: 'Personnel',
      component: () => import(/* webpackChunkName: "personnel" */ '../components/Personnel/personnel.vue'),
      props: true
    },
    {
      path: 'home/new/:mode',
      name: 'Onboarding',
      component: () => import(/* webpackChunkName: "personnel" */ '../components/Personnel/personnel.vue'),
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
      component: () => import(/* webpackChunkName: "workplan" */ '../components/Workplans/workplan.vue'),
      props: true
    },
    {
      path: 'home/manning',
      name: 'Manning Report',
      component: () => import(/* webpackChunkName: "workplan" */ '../components/Workplans/manning.vue'),
      props: true
    }
  ]
}

const routes = [
  {
    path: '/',
    redirect: '/pages/home'
  },
  adminMenu,
  msrMenu,
  financialMenu,
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
