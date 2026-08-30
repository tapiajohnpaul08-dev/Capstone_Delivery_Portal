<template>
  <div>
    <h2 class="text-xl font-bold text-gray-900 mb-4">Assigned Orders</h2>
    
    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
      <p class="text-gray-500 text-sm mt-2">Loading orders...</p>
    </div>

    <!-- Orders -->
    <div v-else>
      <!-- Tabs -->
      <div class="flex gap-1 bg-gray-100 border rounded-lg p-1 mb-4">
        <button 
          v-for="tab in tabs" 
          :key="tab.key"
          @click="activeTab = tab.key"
          class="flex-1 py-2 rounded-lg text-sm font-medium transition-colors"
          :class="activeTab === tab.key
            ? 'bg-white border shadow-sm text-gray-900'
            : 'text-gray-500 hover:text-gray-700'"
        >
          {{ tab.label }} 
          <span class="text-xs" :class="activeTab === tab.key ? 'text-blue-600' : 'text-gray-400'">
            ({{ getTabCount(tab.key) }})
          </span>
        </button>
      </div>

      <!-- Order List -->
      <div class="space-y-3">
        <template v-if="filteredOrders.length > 0">
          <OrderCard 
            v-for="order in filteredOrders" 
            :key="order.id || order._id"
            :order="order"
            @update-status="handleStatusUpdate"
            @upload-proof="handleProofUpload"
          />
        </template>
        
        <div v-else class="bg-white border rounded-xl p-12 text-center text-gray-500">
          <ClipboardList :size="48" class="mx-auto text-gray-300 mb-2" />
          <p class="text-sm">No {{ activeTab }} orders</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ClipboardList } from 'lucide-vue-next'
import OrderCard from '../components/Orders/OrderCard.vue'
import { useOrders } from '../composables/useOrders'

const { assignedOrders, isLoading, updateOrderStatus, fetchAssignedOrders } = useOrders()

const tabs = [
  { key: 'assigned', label: 'Assigned' },
  { key: 'out-for-delivery', label: 'Out for Delivery' },
  { key: 'all', label: 'All' }
]

const activeTab = ref('assigned')

const filteredOrders = computed(() => {
  if (activeTab.value === 'all') {
    return assignedOrders.value
  }
  return assignedOrders.value.filter(o => o.status === activeTab.value)
})

const getTabCount = (tabKey) => {
  if (tabKey === 'all') {
    return assignedOrders.value.length
  }
  return assignedOrders.value.filter(o => o.status === tabKey).length
}

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

onMounted(() => {
  fetchAssignedOrders()
})
</script>