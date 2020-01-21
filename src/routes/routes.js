// import ThemeLayout from '@/components/Layout/ThemeLayout.vue'
import ThemeLayout from '@/components/Layout/DashboardLayout.vue'
import calendar from '@/components/Pages/calendar.vue'
import home from '@/components/Pages/home.vue'
import travel from '@/components/Pages/travel.vue'
import todos from '@/components/Pages/todos.vue'
/* import newtravel from '@/components/Pages/travel/newtravel.vue'
import approvetravel from '@/components/Pages/travel/approvetravel.vue'
import updatetravel from '@/components/Pages/travel/updatetravel.vue' */

let travelMenu = {
  path: '/travel',
  component: ThemeLayout,
  redirect: '/travel/home',
  children: [
    {
      path: 'home/:mode',
      name: 'Travel',
      component: travel,
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
  {
    path: '/pages',
    component: ThemeLayout,
    redirect: '/pages/home',
    children: [
      {
        path: 'home',
        name: 'Home',
        component: home
      },
      {
        path: 'calendar',
        name: 'Team Calendar',
        component: calendar
      },
      {
        path: 'todos',
        name: 'Tasks',
        component: todos
      }
    ]
  }
]

export default routes
