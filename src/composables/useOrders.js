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

  const updateOrderStatus = async (orderId, newStatus, proofFile = null) => {
    try {
      if (newStatus !== 'completed') {
        error('You can only mark orders as completed')
        return false
      }

      console.log(`📡 Marking order ${orderId} as completed...`)

      const response = await apiService.updateOrderStatus(orderId, newStatus, proofFile)
      const data = response.data

      if (data.success) {
        const orderIndex = orders.value.findIndex(o => o.id === orderId || o._id === orderId)
        if (orderIndex !== -1) {
          const completedOrder = { ...orders.value[orderIndex], status: 'completed' }
          orders.value.splice(orderIndex, 1)
          historyOrdersData.value.unshift(completedOrder)
          updateStats()
        }
        success('Order marked as completed successfully! 🎉')
        return true
      } else {
        error(data.message || 'Failed to update order')
        return false
      }
    } catch (err) {
      error('Error updating order. Please try again.')
      return false
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
    assignedOrders,
    completedOrders,
    cancelledOrders,
    historyOrders,
    updateOrderStatus,
    getOrderById,
    fetchAssignedOrders,
    fetchOrderHistory
  }
}