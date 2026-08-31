// composables/useAuth.js
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { apiService } from '../api/api'

export function useAuth() {
  const router = useRouter()
  
  const getToken = () => {
    return localStorage.getItem('driverToken') || localStorage.getItem('token')
  }
  
  const isAuthenticated = ref(!!getToken())
  
  const user = ref({
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

  const loadUser = () => {
    const storedUser = localStorage.getItem('driverUser')
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser)
        user.value = { ...user.value, ...parsed }
        console.log('✅ Driver user loaded:', user.value.fullName || user.value.displayName || user.value.email)
        return true
      } catch (e) {
        console.error('Error parsing user data:', e)
        return false
      }
    }
    return false
  }

  const login = async (email, password) => {
    try {
      console.log(`📡 Sending login request...`)
      
      const response = await apiService.login(email, password)
      const data = response.data
      
      console.log('📥 Login response:', data)

      if (!data.success) {
        throw new Error(data.message || 'Login failed')
      }

      const token = data.token || data.data?.token || null
      
      if (!token) {
        console.error('❌ No token in response:', data)
        throw new Error('No token received from server')
      }

      console.log('🔑 Token received:', token.substring(0, 20) + '...')

      const userData = data.data || data.user || {}
      
      localStorage.setItem('driverToken', token)
      localStorage.setItem('token', token)
      localStorage.setItem('driverUser', JSON.stringify(userData))
      
      user.value = { ...user.value, ...userData }
      isAuthenticated.value = true

      console.log(`✅ Login successful for: ${user.value.fullName || user.value.displayName || user.value.email}`)
      
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
    user.value = {
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
    }
    router.push('/')
  }

  const checkAuth = () => {
    const token = getToken()
    if (token) {
      console.log('🔑 Token found in localStorage')
      isAuthenticated.value = true
      loadUser()
      return true
    }
    console.log('❌ No token found in localStorage')
    return false
  }

  loadUser()

  return {
    isAuthenticated,
    user,
    login,
    logout,
    loadUser,
    checkAuth,
    getToken
  }
}