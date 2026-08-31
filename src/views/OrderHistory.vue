<template>
  <div>
    <h2 class="text-xl font-bold text-gray-900 mb-4">
      <History :size="20" class="inline mr-2" />
      Completed Orders
    </h2>

    <!-- Loading State -->
    <div v-if="isLoadingHistory" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
      <p class="text-gray-500 text-sm mt-2">Loading history...</p>
    </div>

    <!-- History List -->
    <div v-else class="space-y-3">
      <template v-if="historyOrders.length > 0">
        <OrderCard 
          v-for="order in historyOrders" 
          :key="order.id || order._id"
          :order="order"
        />
      </template>
      
      <div v-else class="bg-white border rounded-xl p-12 text-center text-gray-500">
        <History :size="48" class="mx-auto text-gray-300 mb-2" />
        <p class="text-sm">No completed orders yet</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { History } from 'lucide-vue-next'
import OrderCard from '../components/Orders/OrderCard.vue'
import { useOrders } from '../composables/useOrders'

const { historyOrders, isLoadingHistory, fetchOrderHistory } = useOrders()

onMounted(() => {
  fetchOrderHistory()
})
</script>