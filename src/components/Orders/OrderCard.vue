<template>
  <div class="card">
    <div class="card-body">
      <!-- Header -->
      <div class="flex justify-between items-start mb-3">
        <div>
          <h3 class="font-semibold text-gray-900">{{ order.customerName }}</h3>
          <p class="text-sm text-gray-500">{{ order.customerPhone }}</p>
        </div>
        <StatusBadge :status="order.status" />
      </div>

      <!-- Details -->
      <div class="space-y-2 text-sm">
        <div class="flex items-start gap-2 text-gray-600">
          <MapPin :size="16" class="mt-0.5 flex-shrink-0" />
          <span>{{ order.address }}</span>
        </div>
        
        <div class="flex items-center gap-2 text-gray-600">
          <Package :size="16" class="flex-shrink-0" />
          <span>{{ order.items.join(', ') }}</span>
        </div>

        <div class="flex justify-between text-gray-700 font-medium pt-1 border-t border-gray-100">
          <span>₱{{ order.total.toLocaleString() }}</span>
          <span class="text-green-600">Delivery: ₱{{ order.deliveryFee }}</span>
        </div>

        <div v-if="order.notes" class="text-sm text-gray-500 bg-gray-50 p-2 rounded-lg">
          📝 {{ order.notes }}
        </div>

        <!-- Proof of Delivery Upload -->
        <div v-if="order.status === 'out-for-delivery'" class="mt-3">
          <label class="block text-sm font-medium text-gray-700 mb-1.5">
            Upload Proof of Delivery
          </label>
          <input 
            type="file" 
            accept="image/*"
            @change="handleFileUpload($event, order.id)"
            class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:transition-colors cursor-pointer"
          />
        </div>

        <!-- Action Buttons -->
        <div v-if="availableActions.length > 0" class="flex gap-2 mt-3">
          <button 
            v-for="action in availableActions" 
            :key="action"
            @click="handleAction(action, order.id)"
            class="flex-1 py-2 rounded-lg font-medium text-sm transition-colors"
            :class="getActionButtonClass(action)"
          >
            {{ getActionLabel(action) }}
          </button>

        </div>

        <!-- Timestamps -->
        <div v-if="order.status === 'completed' && order.completedAt" class="text-xs text-gray-400 mt-2 pt-1 border-t border-gray-100">
          Completed: {{ formatDate(order.completedAt) }}
        </div>
        <div v-if="order.status === 'cancelled' && order.cancelledAt" class="text-xs text-red-400 mt-2 pt-1 border-t border-gray-100">
          Cancelled: {{ formatDate(order.cancelledAt) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { MapPin, Package } from 'lucide-vue-next'
import StatusBadge from './StatusBadge.vue'
import { getStatusActions, getStatusLabel } from '../../data/mockData'

const props = defineProps({
  order: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update-status', 'upload-proof'])

const availableActions = computed(() => {
  return getStatusActions(props.order.status)
})

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString('en-PH', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getActionLabel = (action) => {
  return getStatusLabel(action)
}

const getActionButtonClass = (action) => {
  const classes = {
    'out-for-delivery': 'bg-blue-600 text-white hover:bg-blue-700',
    'completed': 'bg-green-600 text-white hover:bg-green-700'
  }
  return classes[action] || 'bg-gray-600 text-white hover:bg-gray-700'
}

const handleAction = (action, orderId) => {
  emit('update-status', { orderId, newStatus: action })
}

const handleFileUpload = (event, orderId) => {
  const file = event.target.files[0]
  if (file) {
    emit('upload-proof', { orderId, file })
  }
}
</script>