// composables/useOrders.js
import { ref, computed, onMounted } from 'vue'
import { useAuth } from './useAuth'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1'

export function useOrders() {
  const { user } = useAuth()
  const orders = ref([])
  const isLoading = ref(false)
  const stats = ref({
    assigned: 0,
    pending: 0,
    completed: 0,
    todayEarnings: 0
  })

  // Fetch orders assigned to this driver
  const fetchAssignedOrders = async () => {
    isLoading.value = true
    try {
      const token = localStorage.getItem('driverToken')
      if (!token) {
        console.warn('No token found')
        return
      }

      console.log(`📡 Fetching assigned orders from: ${API_BASE_URL}/drivers/orders/assigned`)
      
      const response = await fetch(`${API_BASE_URL}/drivers/orders/assigned`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        body: JSON.stringify({ driverId: user.driverId })
        }
      })

      const data = await response.json()
      
      if (data.success) {
        orders.value = data.data || []
        updateStats()
        console.log(`📦 Loaded ${orders.value.length} assigned orders`)
      } else {
        console.error('Failed to fetch orders:', data.message)
        orders.value = []
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      orders.value = []
    } finally {
      isLoading.value = false
    }
  }

  // Fetch order history
  const fetchOrderHistory = async () => {
    try {
      const token = localStorage.getItem('driverToken')
      if (!token) return []

      console.log(`📡 Fetching order history from: ${API_BASE_URL}/drivers/orders/history`)
      
      const response = await fetch(`${API_BASE_URL}/drivers/orders/history`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()
      if (data.success) {
        return data.data || []
      }
      return []
    } catch (error) {
      console.error('Error fetching order history:', error)
      return []
    }
  }

  // Update order status
  const updateOrderStatus = async (orderId, newStatus, proofFile = null) => {
    try {
      const token = localStorage.getItem('driverToken')
      if (!token) throw new Error('Not authenticated')

      const formData = new FormData()
      formData.append('status', newStatus)
      if (proofFile) {
        formData.append('proofOfDelivery', proofFile)
      }

      console.log(`📡 Updating order ${orderId} to ${newStatus} at: ${API_BASE_URL}/drivers/orders/${orderId}/status`)

      const response = await fetch(`${API_BASE_URL}/drivers/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      const data = await response.json()

      if (data.success) {
        // Update local orders
        const order = orders.value.find(o => o.id === orderId || o._id === orderId)
        if (order) {
          const oldStatus = order.status
          order.status = newStatus
          if (newStatus === 'completed') {
            order.completedAt = new Date().toISOString()
            if (proofFile) {
              order.proofOfDelivery = proofFile.name
            }
          }
          updateStats()
        }
        return true
      } else {
        console.error('Failed to update order:', data.message)
        return false
      }
    } catch (error) {
      console.error('Error updating order:', error)
      return false
    }
  }

  // Update stats
  const updateStats = () => {
    const assigned = orders.value.filter(o => o.status === 'assigned').length
    const pending = orders.value.filter(o => o.status === 'out-for-delivery').length
    const completed = orders.value.filter(o => o.status === 'completed').length
    
    stats.value = {
      assigned,
      pending,
      completed,
      todayEarnings: completed * 150 // Example: ₱150 per delivery
    }
  }

  // Computed properties
  const assignedOrders = computed(() => {
    return orders.value.filter(o => o.status === 'assigned' || o.status === 'out-for-delivery')
  })

  const completedOrders = computed(() => {
    return orders.value.filter(o => o.status === 'completed')
  })

  const cancelledOrders = computed(() => {
    return orders.value.filter(o => o.status === 'cancelled')
  })

  const historyOrders = computed(() => {
    return orders.value.filter(o => o.status === 'completed' || o.status === 'cancelled')
  })

  const getOrderById = (id) => {
    return orders.value.find(o => o.id === id || o._id === id)
  }

  // Initialize
  onMounted(() => {
    fetchAssignedOrders()
  })

  return {
    orders,
    stats,
    isLoading,
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