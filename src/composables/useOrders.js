// composables/useOrders.js
import { ref, computed, onMounted } from 'vue'
import { useAuth } from './useAuth'
import { apiService } from '../api/api'
import { useToast } from './useToast'

export function useOrders() {
  const { user } = useAuth()
  const { success, error } = useToast()
  const orders = ref([])
  const historyOrdersData = ref([])
  const isLoading = ref(false)
  const isLoadingHistory = ref(false)
  const isUpdating = ref(false) // ← Add specific loading for updates
  const stats = ref({
    assigned: 0,
    completed: 0
  })

  const getDriverId = () => {
    return user.value?.driverId || ''
  }

  const fetchAssignedOrders = async () => {
    isLoading.value = true
    try {
      console.log(`📡 Fetching assigned orders for driver: ${getDriverId()}`)
      
      const response = await apiService.getAssignedOrders()
      const data = response.data
      
      if (data.success) {
        orders.value = data.data || []
        console.log(`📦 Loaded ${orders.value.length} assigned orders`)
        console.log('fetchedddd', data)
        updateStats()
      } else {
        console.error('Failed to fetch orders:', data.message)
        orders.value = []
      }
    } catch (err) {
      console.error('Error fetching orders:', err)
      orders.value = []
    } finally {
      isLoading.value = false
    }
  }

  const fetchOrderHistory = async () => {
    isLoadingHistory.value = true
    try {
      console.log(`📡 Fetching order history for driver: ${getDriverId()}`)
      
      const response = await apiService.getOrderHistory()
      const data = response.data
      
      if (data.success) {
        historyOrdersData.value = data.data || []
        console.log(`📦 Loaded ${historyOrdersData.value.length} history orders`)
        return historyOrdersData.value
      } else {
        console.error('Failed to fetch order history:', data.message)
        historyOrdersData.value = []
        return []
      }
    } catch (err) {
      console.error('Error fetching order history:', err)
      historyOrdersData.value = []
      return []
    } finally {
      isLoadingHistory.value = false
    }
  }

const updateOrderStatus = async (orderId, newStatus, proofFile = null, codCollected = false) => {
      isUpdating.value = true // ← Set loading before API call
    try {
        console.log(`📡 Attempting to update order ${orderId} to status: ${newStatus}`)
        
        // Normalize status - always use 'Completed' for backend
        let statusToSend = 'Completed'
        
        if (newStatus === 'completed' || newStatus === 'Completed') {
            statusToSend = 'Completed'
        } else {
            error('You can only mark orders as Completed')
            isUpdating.value = false
            return false
        }

        console.log(`📡 Marking order ${orderId} as ${statusToSend}...`)

        let response
        
            if (proofFile) {
      const formData = new FormData()
      formData.append('status', statusToSend)
      formData.append('proofOfDelivery', proofFile)
      formData.append('codCollected', codCollected ? 'true' : 'false') // ← NEW
      response = await apiService.updateOrderStatus(orderId, formData)
    } else {
      response = await apiService.updateOrderStatus(orderId, {
        status: statusToSend,
        codCollected: codCollected ? 'true' : 'false', // ← NEW
      })
    }
        
        const data = response.data

        if (data.success) {
            // Update local state
            const orderIndex = orders.value.findIndex(o => o.id === orderId || o._id === orderId)
            if (orderIndex !== -1) {
                const completedOrder = { 
                    ...orders.value[orderIndex], 
                    status: 'completed',
                    completedAt: new Date().toISOString(),
                    proofOfDelivery: data.data?.proofOfDelivery || null
                }
                orders.value.splice(orderIndex, 1)
                historyOrdersData.value.unshift(completedOrder)
                updateStats()
            }
            success(`Order marked as completed successfully! 🎉`)
            isUpdating.value = false
            return true
        } else {
            error(data.message || 'Failed to update order')
            isUpdating.value = false
            return false
        }
    } catch (err) {
        console.error('Error updating order:', err)
        error(err.response?.data?.message || 'Error updating order. Please try again.')
        isUpdating.value = false
        return false
    }
  }

  // ✅ NEW — Driver reports a delay on their own assigned order
  const reportDelay = async (orderId, payload) => {
    isUpdating.value = true
    try {
      const response = await apiService.reportDelay(orderId, payload)
      const data = response.data

      if (data.success) {
        // Patch the local order so the card updates instantly
        const idx = orders.value.findIndex((o) => o.id === orderId || o._id === orderId)
        if (idx !== -1) {
          orders.value[idx] = {
            ...orders.value[idx],
            delayHistory: data.data?.delayHistory || orders.value[idx].delayHistory || [],
            isCurrentlyDelayed: true,
            currentDelay: (data.data?.delayHistory || []).slice(-1)[0] || null,
          }
        }
        success('Delay reported — customer has been notified')
        return { success: true, order: data.data }
      }
      error(data.message || 'Failed to report delay')
      return { success: false, message: data.message }
    } catch (err) {
      console.error('Error reporting delay:', err)
      error(err.response?.data?.message || 'Failed to report delay')
      return { success: false, message: err.message }
    } finally {
      isUpdating.value = false
    }
  }

  const updateStats = () => {
    const assigned = orders.value.filter(o => o.status === 'out-for-delivery').length
    const completed = historyOrdersData.value.filter(o => o.status === 'completed').length
    
    stats.value = {
      assigned,
      completed
    }
  }

  const assignedOrders = computed(() => {
    return orders.value.filter(o => o.status === 'out-for-delivery')
  })

  const completedOrders = computed(() => {
    return historyOrdersData.value.filter(o => o.status === 'completed')
  })

  const cancelledOrders = computed(() => {
    return historyOrdersData.value.filter(o => o.status === 'cancelled')
  })

  const historyOrders = computed(() => {
    return historyOrdersData.value.filter(o => o.status === 'completed' || o.status === 'cancelled')
  })

  const getOrderById = (id) => {
    return orders.value.find(o => o.id === id || o._id === id) ||
           historyOrdersData.value.find(o => o.id === id || o._id === id)
  }

  onMounted(() => {
    fetchAssignedOrders()
  })

  return {
    orders,
    historyOrdersData,
    stats,
    isLoading,
    isLoadingHistory,
    isUpdating, // ← Export the updating state
    assignedOrders,
    reportDelay,           // ← NEW
    completedOrders,
    cancelledOrders,
    historyOrders,
    updateOrderStatus,
    getOrderById,
    fetchAssignedOrders,
    fetchOrderHistory
  }
}