<template>
  <div class="space-y-4">
    <!-- Welcome Banner -->
    <div class="bg-blue-600 text-white rounded-xl p-4">
      <h2 class="text-lg font-bold">Hello, {{ driverName }}! 👋</h2>
      <p class="text-blue-100 text-sm">{{ statusMessage }}</p>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-2 gap-3">
      <div class="bg-white border rounded-xl p-4 text-center transition-all hover:shadow-md">
        <div class="text-2xl font-bold text-blue-600">{{ stats.assigned }}</div>
        <div class="text-xs text-gray-500 mt-0.5">Assigned</div>
      </div>
      <div class="bg-white border rounded-xl p-4 text-center transition-all hover:shadow-md">
        <div class="text-2xl font-bold text-orange-500">{{ stats.pending }}</div>
        <div class="text-xs text-gray-500 mt-0.5">Out for Delivery</div>
      </div>
      <div class="bg-white border rounded-xl p-4 text-center transition-all hover:shadow-md">
        <div class="text-2xl font-bold text-green-500">{{ stats.completed }}</div>
        <div class="text-xs text-gray-500 mt-0.5">Completed</div>
      </div>
      <div class="bg-white border rounded-xl p-4 text-center transition-all hover:shadow-md">
        <div class="text-2xl font-bold text-blue-600">{{ user.assignedOrdersCount || 0 }}</div>
        <div class="text-xs text-gray-500 mt-0.5">Total Assigned</div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
      <p class="text-gray-500 text-sm mt-2">Loading orders...</p>
    </div>

    <!-- Today's Orders -->
    <div v-else>
      <div class="flex justify-between items-center mb-3">
        <h3 class="font-semibold text-gray-900">Today's Orders</h3>
        <router-link to="/assigned-orders" class="text-sm text-blue-600 font-medium hover:underline">
          View All →
        </router-link>
      </div>
      
      <div v-if="todayOrders.length === 0" class="bg-white border rounded-xl p-8 text-center text-gray-500">
        <ClipboardList :size="40" class="mx-auto text-gray-300 mb-2" />
        <p>No orders assigned for today</p>
      </div>
      
      <div v-else class="space-y-3">
        <OrderCard 
          v-for="order in todayOrders" 
          :key="order.id || order._id"
          :order="order"
          @update-status="handleStatusUpdate"
          @upload-proof="handleProofUpload"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { ClipboardList } from 'lucide-vue-next'
import OrderCard from '../components/Orders/OrderCard.vue'
import { useAuth } from '../composables/useAuth'
import { useOrders } from '../composables/useOrders'

const { user } = useAuth()
const { stats, assignedOrders, isLoading, updateOrderStatus, fetchAssignedOrders } = useOrders()

const driverName = computed(() => {
  return user.firstName || user.displayName || 'Driver'
})

const statusMessage = computed(() => {
  if (user.available === false) return 'You are currently unavailable'
  if (stats.assigned > 0) return `You have ${stats.assigned} order(s) to deliver today`
  return 'No orders assigned yet'
})

const todayOrders = computed(() => {
  const today = new Date().toDateString()
  return assignedOrders.value.filter(order => {
    const orderDate = new Date(order.createdAt).toDateString()
    return orderDate === today
  })
})

const handleStatusUpdate = async ({ orderId, newStatus }) => {
  const success = await updateOrderStatus(orderId, newStatus)
  if (success) {
    console.log('Order updated successfully')
  }
}

const handleProofUpload = async ({ orderId, file }) => {
  console.log('Uploading proof for order:', orderId, file)
  const success = await updateOrderStatus(orderId, 'completed', file)
  if (success) {
    console.log('Order completed with proof')
  }
}

// Fetch orders on mount
onMounted(() => {
  fetchAssignedOrders()
})
</script>