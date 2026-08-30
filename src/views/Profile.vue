<template>
  <div class="space-y-4">
    <h2 class="text-xl font-bold text-gray-900">Profile</h2>

    <!-- Profile Card -->
    <div class="bg-white border rounded-xl p-6 text-center">
      <div class="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mx-auto">
        <User :size="40" class="text-blue-600" />
      </div>
      <h3 class="text-lg font-bold mt-3">{{ user.fullName || user.displayName || 'Driver' }}</h3>
      <p class="text-sm text-gray-500">{{ user.email }}</p>
      <div class="mt-2">
        <span class="badge" :class="user.available ? 'badge-green' : 'badge-red'">
          {{ user.available ? 'Available' : 'Unavailable' }}
        </span>
      </div>
    </div>

    <!-- Details -->
    <div class="bg-white border rounded-xl divide-y divide-gray-100">
      <div class="flex justify-between p-4">
        <span class="text-gray-500 text-sm">Driver ID</span>
        <span class="font-medium text-sm">{{ user.driverId || 'N/A' }}</span>
      </div>
      <div class="flex justify-between p-4">
        <span class="text-gray-500 text-sm">Phone</span>
        <span class="font-medium text-sm">{{ user.phoneNumber || user.phone || 'N/A' }}</span>
      </div>
      <div class="flex justify-between p-4">
        <span class="text-gray-500 text-sm">Vehicle</span>
        <span class="font-medium text-sm">{{ user.vehicleDescription || user.vehicle || 'N/A' }}</span>
      </div>
      <div class="flex justify-between p-4">
        <span class="text-gray-500 text-sm">Plate Number</span>
        <span class="font-medium text-sm">{{ user.plateNumber || 'N/A' }}</span>
      </div>
      <div class="flex justify-between p-4">
        <span class="text-gray-500 text-sm">Assigned Orders</span>
        <span class="font-medium text-sm">{{ user.assignedOrdersCount || 0 }}</span>
      </div>
    </div>

    <!-- Stats -->
    <div class="bg-white border rounded-xl p-4">
      <h4 class="font-semibold text-gray-900 mb-3">Delivery Stats</h4>
      <div class="grid grid-cols-3 gap-2 text-center">
        <div>
          <div class="text-2xl font-bold text-blue-600">{{ stats.completed }}</div>
          <div class="text-xs text-gray-500">Completed</div>
        </div>
        <div>
          <div class="text-2xl font-bold text-orange-500">{{ stats.pending }}</div>
          <div class="text-xs text-gray-500">In Progress</div>
        </div>
        <div>
          <div class="text-2xl font-bold text-green-500">{{ stats.assigned }}</div>
          <div class="text-xs text-gray-500">Assigned</div>
        </div>
      </div>
    </div>

    <!-- Logout Button -->
    <button @click="logout" class="btn-danger w-full">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
        <polyline points="16 17 21 12 16 7"/>
        <line x1="21" y1="12" x2="9" y2="12"/>
      </svg>
      Logout
    </button>

    <div class="text-xs text-center text-gray-400 py-4">
      ACAPSHOP Rider Portal v1.0
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { User } from 'lucide-vue-next'
import { useAuth } from '../composables/useAuth'
import { useOrders } from '../composables/useOrders'

const { user, logout } = useAuth()
const { stats } = useOrders()

// Map backend fields to display
const displayUser = computed(() => ({
  ...user,
  fullName: user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
  phone: user.phoneNumber || user.phone,
  vehicle: user.vehicleDescription || user.vehicle
}))
</script>