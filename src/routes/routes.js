import ThemeLayout from '@/components/Layout/ThemeLayout.vue'
import home from '@/components/Pages/home.vue'
import travel from '@/components/Pages/travel/travel.vue'
import newtravel from '@/components/Pages/travel/newtravel.vue'
import approvetravel from '@/components/Pages/travel/approvetravel.vue'
import updatetravel from '@/components/Pages/travel/updatetravel.vue'
// import shop from '@/components/Pages/shop.vue'

let travelMenu = {
  path: '/travel',
  component: ThemeLayout,
  redirect: '/travel/home',
  children: [
    {
      path: 'home',
      name: 'Travel',
      component: travel
    },
    {
      path: 'request',
      name: 'Travel Request',
      component: newtravel
    },
    {
      path: 'approve',
      name: 'Travel Approval',
      component: approvetravel
    },
    {
      path: 'update',
      name: 'Update Travel',
      component: updatetravel
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
      }
    ]
  }
]

export default routes
