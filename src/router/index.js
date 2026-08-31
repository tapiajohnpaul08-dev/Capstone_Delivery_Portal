// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import AssignedOrders from '../views/AssignedOrders.vue'
import OrderHistory from '../views/OrderHistory.vue'
import Profile from '../views/Profile.vue'
import RiderLayout from '../components/Layout/RiderLayout.vue'

const routes = [
  { 
    path: '/', 
    component: Login,
    meta: { requiresAuth: false }
  },
  {
    path: '/rider',
    component: RiderLayout,
    meta: { requiresAuth: true },
    children: [
      { path: '', redirect: '/rider/dashboard' },
      { path: 'dashboard', component: Dashboard },
      { path: 'assigned-orders', component: AssignedOrders },
      { path: 'order-history', component: OrderHistory },
      { path: 'profile', component: Profile },
    ]
  },
  { 
    path: '/:pathMatch(.*)*', 
    redirect: '/' 
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('driverToken') || localStorage.getItem('token')
  const isAuthenticated = !!token

  console.log(`🔄 ${from.path} → ${to.path} | Token: ${isAuthenticated ? '✅' : '❌'}`)

  if (to.meta.requiresAuth && !isAuthenticated) {
    console.log('❌ No token, redirecting to login...')
    if (to.path !== '/') {
      sessionStorage.setItem('redirectAfterLogin', to.fullPath)
    }
    return next('/')
  }

  if (to.path === '/' && isAuthenticated) {
    console.log('✅ Already logged in, redirecting to dashboard...')
    const redirectPath = sessionStorage.getItem('redirectAfterLogin')
    if (redirectPath) {
      sessionStorage.removeItem('redirectAfterLogin')
      return next(redirectPath)
    }
    return next('/rider/dashboard')
  }

  next()
})

export default router