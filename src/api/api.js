// src/api/api.js
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1'

console.log(`🌐 API Base URL: ${API_BASE_URL}`)

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Request interceptor - Add token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('driverToken') || localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      console.log(`🔑 Adding token to request: ${config.url}`)
    }
    return config
  },
  (error) => {
    console.error('Request Error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => {
    console.log(`📥 Response from ${response.config.url}:`, response.data.success ? '✅ Success' : '❌ Error')
    return response
  },
  (error) => {
    if (error.response) {
      console.error('API Error:', error.response.data)
      
      if (error.response.status === 401) {
        console.log('🔒 Session expired, redirecting to login...')
        localStorage.removeItem('driverToken')
        localStorage.removeItem('token')
        localStorage.removeItem('driverUser')
        if (!window.location.pathname.includes('/')) {
          window.location.href = '/'
        }
      }
    } else if (error.request) {
      console.error('Network Error:', error.message)
    } else {
      console.error('Error:', error.message)
    }
    return Promise.reject(error)
  }
)

// Helper methods for common API calls
export const apiService = {
  // Auth
  login: (email, password) => api.post('/drivers/login', { email, password }),
  
  // Profile
  getProfile: () => api.get('/drivers/profile'),
  updateProfile: (data) => api.put('/drivers/profile', data),
  changePassword: (currentPassword, newPassword) => 
    api.post('/drivers/change-password', { currentPassword, newPassword }),
  toggleAvailability: (driverId) => api.patch(`/drivers/${driverId}/toggle-availability`),
  
  // Orders
  getAssignedOrders: () => api.get('/drivers/orders/assigned'),
  getOrderHistory: () => api.get('/drivers/orders/history'),
  updateOrderStatus: (orderId, status, proofFile) => {
    const formData = new FormData()
    formData.append('status', status)
    if (proofFile) {
      formData.append('proofOfDelivery', proofFile)
    }
    return api.patch(`/drivers/orders/${orderId}/status`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}

export default api