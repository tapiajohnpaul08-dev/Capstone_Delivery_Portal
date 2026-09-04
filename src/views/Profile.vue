<template>
  <div class="space-y-4">
    <h2 class="text-xl font-bold text-gray-900">Profile</h2>

    <div v-if="isLoading" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
      <p class="text-gray-500 text-sm mt-2">Loading profile...</p>
    </div>

    <template v-else>
      <div class="bg-white border rounded-xl p-6 text-center">
        <div class="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mx-auto">
          <User :size="40" class="text-blue-600" />
        </div>
        <h3 class="text-lg font-bold mt-3">{{ displayUser.fullName || 'Driver' }}</h3>
        <p class="text-sm text-gray-500">{{ displayUser.email || 'No email' }}</p>
        <div class="mt-2">
          <span class="badge" :class="displayUser.available ? 'badge-green' : 'badge-red'">
            <CheckCircle v-if="displayUser.available" :size="12" class="inline mr-1" />
            <XCircle v-else :size="12" class="inline mr-1" />
            {{ displayUser.available ? 'Available' : 'Unavailable' }}
          </span>
        </div>
      </div>

      <div class="bg-white border rounded-xl divide-y divide-gray-100">
        <div class="flex justify-between p-4">
          <span class="text-gray-500 text-sm">Driver ID</span>
          <span class="font-medium text-sm">{{ displayUser.driverId || 'N/A' }}</span>
        </div>
        <div class="flex justify-between p-4">
          <span class="text-gray-500 text-sm">Phone</span>
          <span class="font-medium text-sm">{{ displayUser.phoneNumber || displayUser.phone || 'N/A' }}</span>
        </div>
        <div class="flex justify-between p-4">
          <span class="text-gray-500 text-sm">Vehicle</span>
          <span class="font-medium text-sm">{{ displayUser.vehicleDescription || displayUser.vehicle || 'N/A' }}</span>
        </div>
        <div class="flex justify-between p-4">
          <span class="text-gray-500 text-sm">Plate Number</span>
          <span class="font-medium text-sm">{{ displayUser.plateNumber || 'N/A' }}</span>
        </div>
        <div class="flex justify-between p-4">
          <span class="text-gray-500 text-sm">Assigned Orders</span>
          <span class="font-medium text-sm">{{ displayUser.assignedOrdersCount || 0 }}</span>
        </div>
      </div>

      <div class="bg-white border rounded-xl p-4">
        <h4 class="font-semibold text-gray-900 mb-3">Delivery Stats</h4>
        <div class="grid grid-cols-2 gap-2 text-center">
          <div>
            <div class="text-2xl font-bold text-blue-600">{{ stats.assigned || 0 }}</div>
            <div class="text-xs text-gray-500">Assigned</div>
          </div>
          <div>
            <div class="text-2xl font-bold text-green-500">{{ displayUser.completedOrdersCount || 0 }}</div>
            <div class="text-xs text-gray-500">Completed</div>
          </div>
        </div>
      </div>

      <button 
        @click="handleToggleAvailability" 
        :disabled="isToggling"
        class="w-full py-3 rounded-lg font-medium text-sm transition-colors shadow-sm flex items-center justify-center gap-2"
        :class="displayUser.available 
          ? 'bg-yellow-500 text-white hover:bg-yellow-600' 
          : 'bg-green-500 text-white hover:bg-green-600'"
      >
        <Loader2 v-if="isToggling" :size="18" class="animate-spin" />
        <template v-else>
          <component :is="displayUser.available ? XCircle : CheckCircle" :size="18" />
          {{ displayUser.available ? 'Set as Unavailable' : 'Set as Available' }}
        </template>
      </button>

      <button @click="handleLogout" class="btn-danger w-full flex items-center justify-center gap-2">
        <LogOut :size="18" />
        Logout
      </button>

      <div class="text-xs text-center text-gray-400 py-4">
        ACAPSHOP Rider Portal v1.0
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { User, CheckCircle, XCircle, LogOut, Loader2 } from 'lucide-vue-next'
import { useAuth } from '../composables/useAuth'
import { useOrders } from '../composables/useOrders'
import { useDriverProfile } from '../composables/useDriverProfile'
import { useModal } from '../composables/useModal'

const { user, logout } = useAuth()
const { stats } = useOrders()
const { fetchProfile, toggleAvailability, isLoading } = useDriverProfile()
const { confirm } = useModal()

const isToggling = ref(false)

const displayUser = computed(() => {
  const u = user.value || {}
  return {
    ...u,
    fullName: u.fullName || u.displayName || `${u.firstName || ''} ${u.lastName || ''}`.trim(),
    phone: u.phoneNumber || u.phone,
    vehicle: u.vehicleDescription || u.vehicle,
    available: u.available !== undefined ? u.available : true,
    completedOrdersCount: u.completedOrdersCount || 0,
  }
})

const handleToggleAvailability = async () => {
  const newStatus = !displayUser.value.available
  const action = newStatus ? 'available' : 'unavailable'
  
  const confirmed = await confirm({
    title: `Set as ${action.charAt(0).toUpperCase() + action.slice(1)}`,
    message: `Are you sure you want to set yourself as ${action}?`,
    confirmText: `Yes, Set as ${action.charAt(0).toUpperCase() + action.slice(1)}`,
    cancelText: 'Cancel',
    type: newStatus ? 'success' : 'warning'
  })
  
  if (confirmed) {
    isToggling.value = true
    try {
      const success = await toggleAvailability()
      if (success) {
        await fetchProfile()
      }
    } catch (error) {
      console.error('❌ Error toggling availability:', error)
    } finally {
      isToggling.value = false
    }
  }
}

const handleLogout = async () => {
  const confirmed = await confirm({
    title: 'Logout',
    message: 'Are you sure you want to logout?',
    confirmText: 'Logout',
    cancelText: 'Cancel',
    type: 'danger'
  })
  
  if (confirmed) {
    logout()
  }
}

onMounted(() => {
  fetchProfile()
})
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>