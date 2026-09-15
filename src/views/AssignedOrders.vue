<template>
  <div>
    <h2 class="text-xl font-bold text-gray-900 mb-4">My Orders</h2>
    
    <!-- Global Loading Overlay -->
    <div v-if="isUpdating" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div class="bg-white rounded-xl p-6 text-center max-w-sm mx-4">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-3"></div>
        <p class="text-gray-700 font-medium">Updating order...</p>
        <p class="text-gray-500 text-sm mt-1">Please wait while we process your request</p>
      </div>
    </div>

    <div v-if="isLoading" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
      <p class="text-gray-500 text-sm mt-2">Loading orders...</p>
    </div>

    <div v-else>
      <div class="flex gap-1 bg-gray-100 border rounded-lg p-1 mb-4">
        <button 
          v-for="tab in tabs" 
          :key="tab.key"
          @click="activeTab = tab.key"
          class="flex-1 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
          :class="activeTab === tab.key
            ? 'bg-white border shadow-sm text-gray-900'
            : 'text-gray-500 hover:text-gray-700'"
        >
          <component :is="tab.icon" :size="16" />
          {{ tab.label }} 
          <span class="text-xs" :class="activeTab === tab.key ? 'text-blue-600' : 'text-gray-400'">
            ({{ getTabCount(tab.key) }})
          </span>
        </button>
      </div>

      <div class="space-y-3">
        <template v-if="filteredOrders.length > 0">
          <OrderCard 
            v-for="order in filteredOrders" 
            :key="order.id || order._id"
            :order="order"
            @complete-order="handleCompleteOrder"
            @upload-proof="handleProofUpload"
          />
        </template>
        
        <div v-else class="bg-white border rounded-xl p-12 text-center text-gray-500">
          <ClipboardList :size="48" class="mx-auto text-gray-300 mb-2" />
          <p class="text-sm">{{ emptyMessage }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { ClipboardList, Package, CheckCircle } from 'lucide-vue-next'
import OrderCard from '../components/Orders/OrderCard.vue'
import { useOrders } from '../composables/useOrders'

const { 
  assignedOrders, 
  completedOrders, 
  isLoading, 
  isUpdating, // ← Import the updating state
  updateOrderStatus, 
  fetchAssignedOrders, 
  fetchOrderHistory 
} = useOrders()

const tabs = [
  { key: 'assigned', label: 'Assigned', icon: Package },
  { key: 'completed', label: 'Completed', icon: CheckCircle }
]

const activeTab = ref('assigned')

const filteredOrders = computed(() => {
  if (activeTab.value === 'assigned') return assignedOrders.value
  if (activeTab.value === 'completed') return completedOrders.value
  return []
})

const getTabCount = (tabKey) => {
  if (tabKey === 'assigned') return assignedOrders.value.length
  if (tabKey === 'completed') return completedOrders.value.length
  return 0
}

const emptyMessage = computed(() => {
  if (activeTab.value === 'assigned') return 'No assigned orders. Check back later!'
  if (activeTab.value === 'completed') return 'No completed orders yet'
  return 'No orders found'
})

const handleCompleteOrder = async ({ orderId, codCollected = false }) => {
  console.log('📡 Completing order:', orderId, '| codCollected:', codCollected)
  const success = await updateOrderStatus(orderId, 'Completed', null, codCollected)
  if (success) {
    await Promise.all([fetchAssignedOrders(), fetchOrderHistory()])
  }
}

const handleProofUpload = async ({ orderId, file, codCollected = false }) => {
  console.log('📡 Uploading proof for order:', orderId, file, '| codCollected:', codCollected)
  const success = await updateOrderStatus(orderId, 'Completed', file, codCollected)
  if (success) {
    await Promise.all([fetchAssignedOrders(), fetchOrderHistory()])
  }
}

onMounted(async () => {
  await Promise.all([fetchAssignedOrders(), fetchOrderHistory()])
})

watch(activeTab, async (newTab) => {
  if (newTab === 'completed') {
    await fetchOrderHistory()
  }
})
</script>