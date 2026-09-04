<template>
  <div class="space-y-4">
    <div class="bg-blue-600 text-white rounded-xl p-4">
      <h2 class="text-lg font-bold">Hello, {{ driverName }}! 👋</h2>
      <p class="text-blue-100 text-sm">{{ statusMessage }}</p>
    </div>

    <div class="grid grid-cols-2 gap-3">
      <div class="bg-white border rounded-xl p-4 text-center transition-all hover:shadow-md">
        <div class="text-2xl font-bold text-blue-600">{{ stats.assigned || 0 }}</div>
        <div class="text-xs text-gray-500 mt-0.5">Assigned</div>
      </div>
      <div class="bg-white border rounded-xl p-4 text-center transition-all hover:shadow-md">
        <div class="text-2xl font-bold text-green-500">{{completedOrdersCount }}</div>
        <div class="text-xs text-gray-500 mt-0.5">Completed</div>
      </div>
    </div>

    <div v-if="isLoading" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
      <p class="text-gray-500 text-sm mt-2">Loading orders...</p>
    </div>

    <div v-else>
      <div class="flex justify-between items-center mb-3">
        <h3 class="font-semibold text-gray-900">
          <Package :size="18" class="inline mr-2" />
          Assigned Orders
        </h3>
        <router-link to="/rider/assigned-orders" class="text-sm text-blue-600 font-medium hover:underline">
          View All →
        </router-link>
      </div>
      
      <div v-if="assignedOrders.length === 0" class="bg-white border rounded-xl p-8 text-center text-gray-500">
        <Truck :size="40" class="mx-auto text-gray-300 mb-2" />
        <p>No assigned orders</p>
      </div>
      
      <div v-else class="space-y-3">
        <OrderCard 
          v-for="order in assignedOrders" 
          :key="order.id || order._id"
          :order="order"
          @complete-order="handleCompleteOrder"
          @upload-proof="handleProofUpload"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { Package, Truck } from 'lucide-vue-next'
import OrderCard from '../components/Orders/OrderCard.vue'
import { useAuth } from '../composables/useAuth'
import { useOrders } from '../composables/useOrders'

const { user } = useAuth()
const { stats, assignedOrders, isLoading, updateOrderStatus, fetchAssignedOrders } = useOrders()

const driverName = computed(() => {
  const u = user.value || {}
  return u.firstName || u.displayName || 'Driver'
})

const statusMessage = computed(() => {
  const u = user.value || {}
  if (u.available === false) return 'You are currently unavailable'
  if (assignedOrders.value.length > 0) {
    return `You have ${assignedOrders.value.length} order(s) to deliver`
  }
  return 'No orders assigned yet'
})

const completedOrdersCount = computed(() => {
  const u = user.value || {}
  return u.completedOrdersCount || 89
})

const handleCompleteOrder = async ({ orderId }) => {
  console.log('📡 Completing order:', orderId)
  const success = await updateOrderStatus(orderId, 'Completed')
  if (success) {
    await fetchAssignedOrders()
  }
}

const handleProofUpload = async ({ orderId, file }) => {
  console.log('📡 Uploading proof for order:', orderId, file)
  const success = await updateOrderStatus(orderId, 'Completed', file)
  if (success) {
    await fetchAssignedOrders()
  }
}

onMounted(() => {
  fetchAssignedOrders()
})
</script>