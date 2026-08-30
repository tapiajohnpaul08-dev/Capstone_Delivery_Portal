// composables/useAuth.js
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1'

export function useAuth() {
  const router = useRouter()
  const isAuthenticated = ref(!!localStorage.getItem('driverToken'))
  
  const user = reactive({
    driverId: '',
    firstName: '',
    lastName: '',
    middleName: '',
    username: '',
    email: '',
    phoneNumber: '',
    plateNumber: '',
    vehicleDescription: '',
    fullName: '',
    displayName: '',
    available: true,
    assignedOrdersCount: 0
  })

  // Load user from localStorage
  const loadUser = () => {
    const storedUser = localStorage.getItem('driverUser')
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser)
        Object.assign(user, parsed)
        console.log('✅ Driver user loaded:', user.fullName || user.displayName || user.email)
      } catch (e) {
        console.error('Error parsing user data:', e)
      }
    }
  }

  const login = async (email, password) => {
    try {
      console.log(`📡 Sending login request to: ${API_BASE_URL}/drivers/login`)
      
      const response = await fetch(`${API_BASE_URL}/drivers/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()
      console.log('📥 Login response:', data)

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Login failed')
      }

      // Store tokens and user data
      localStorage.setItem('driverToken', data.data.token)
      localStorage.setItem('token', data.data.token) // For compatibility
      localStorage.setItem('driverUser', JSON.stringify(data.data))
      
      // Update reactive user
      Object.assign(user, data.data)
      isAuthenticated.value = true

      console.log(`✅ Login successful for: ${user.fullName || user.displayName || user.email}`)
      
      return { success: true, data: data }
    } catch (error) {
      console.error('❌ Login error:', error)
      throw error
    }
  }

  const logout = () => {
    console.log('🚪 Logging out...')
    localStorage.removeItem('driverToken')
    localStorage.removeItem('token')
    localStorage.removeItem('driverUser')
    isAuthenticated.value = false
    Object.assign(user, {
      driverId: '',
      firstName: '',
      lastName: '',
      middleName: '',
      username: '',
      email: '',
      phoneNumber: '',
      plateNumber: '',
      vehicleDescription: '',
      fullName: '',
      displayName: '',
      available: true,
      assignedOrdersCount: 0
    })
    router.push('/login')
  }

  // Check if token is valid on load
  const checkAuth = () => {
    const token = localStorage.getItem('driverToken')
    if (token) {
      isAuthenticated.value = true
      loadUser()
      return true
    }
    return false
  }

  // Load user on init
  loadUser()

  return {
    isAuthenticated,
    user,
    login,
    logout,
    loadUser,
    checkAuth
  }
}