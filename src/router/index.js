import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import AssignedOrders from '../views/AssignedOrders.vue'
import OrderHistory from '../views/OrderHistory.vue'
import Profile from '../views/Profile.vue'
import RiderLayout from '../components/Layout/RiderLayout.vue'

const routes = [
  { path: '/login', component: Login },
  {
    path: '/',
    component: RiderLayout,
    meta: { requiresAuth: true },
    children: [
      { path: '', redirect: '/dashboard' },
      { path: 'dashboard', component: Dashboard },
      { path: 'assigned-orders', component: AssignedOrders },
      { path: 'order-history', component: OrderHistory },
      { path: 'profile', component: Profile },
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})


export default router