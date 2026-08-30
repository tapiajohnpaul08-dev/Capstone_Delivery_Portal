<template>
  <div>
    <h2 class="text-xl font-bold text-gray-900 mb-4">Order History</h2>
    
    <!-- Filters -->
    <div class="flex gap-2 mb-4">
      <button 
        v-for="filter in filters" 
        :key="filter.key"
        @click="activeFilter = filter.key"
        class="px-4 py-1.5 rounded-full text-sm font-medium transition-colors"
        :class="activeFilter === filter.key 
          ? 'bg-blue-600 text-white' 
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
      >
        {{ filter.label }}
      </button>
    </div>

    <!-- History List -->
    <div class="space-y-3">
      <template v-if="filteredHistory.length > 0">
        <OrderCard 
          v-for="order in filteredHistory" 
          :key="order.id"
          :order="order"
          @update-status="handleStatusUpdate"
          @upload-proof="handleProofUpload"
        />
      </template>
      
      <div v-else class="bg-white border rounded-xl p-12 text-center text-gray-500">
        <History :size="48" class="mx-auto text-gray-300 mb-2" />
        <p class="text-sm">No {{ activeFilter === 'all' ? '' : activeFilter }} orders in history</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { History } from 'lucide-vue-next'
import OrderCard from '../components/Orders/OrderCard.vue'
import { useOrders } from '../composables/useOrders'

const { historyOrders, updateOrderStatus } = useOrders()

const filters = [
  { key: 'all', label: 'All' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' }
]

const activeFilter = ref('all')

const filteredHistory = computed(() => {
  if (activeFilter.value === 'all') {
    return historyOrders.value
  }
  return historyOrders.value.filter(o => o.status === activeFilter.value)
})

const handleStatusUpdate = ({ orderId, newStatus }) => {
  const success = updateOrderStatus(orderId, newStatus)
  if (success) {
    console.log('Order updated successfully')
  }
}

const handleProofUpload = ({ orderId, file }) => {
  console.log('Uploading proof for order:', orderId, file)
}
</script>