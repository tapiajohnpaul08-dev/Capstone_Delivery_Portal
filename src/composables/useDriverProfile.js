// composables/useDriverProfile.js
import { ref } from 'vue'
import { useAuth } from './useAuth'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1'

export function useDriverProfile() {
  const { user, loadUser } = useAuth()
  const isLoading = ref(false)
  const updateSuccess = ref(false)
  const error = ref(null)

  // Fetch driver profile
  const fetchProfile = async () => {
    isLoading.value = true
    error.value = null
    try {
      const token = localStorage.getItem('driverToken')
      if (!token) throw new Error('Not authenticated')

      console.log(`📡 Fetching profile from: ${API_BASE_URL}/drivers/profile`)

      const response = await fetch(`${API_BASE_URL}/drivers/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()
      
      if (data.success) {
        // Update local user data
        localStorage.setItem('driverUser', JSON.stringify(data.data))
        loadUser()
        return data.data
      } else {
        error.value = data.message || 'Failed to fetch profile'
        return null
      }
    } catch (err) {
      error.value = err.message
      return null
    } finally {
      isLoading.value = false
    }
  }

  // Update driver profile
  const updateProfile = async (updateData) => {
    isLoading.value = true
    updateSuccess.value = false
    error.value = null

    try {
      const token = localStorage.getItem('driverToken')
      if (!token) throw new Error('Not authenticated')

      console.log(`📡 Updating profile at: ${API_BASE_URL}/drivers/profile`)

      const response = await fetch(`${API_BASE_URL}/drivers/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      })

      const data = await response.json()

      if (data.success) {
        // Update local user data
        localStorage.setItem('driverUser', JSON.stringify(data.data))
        loadUser()
        updateSuccess.value = true
        return data.data
      } else {
        error.value = data.message || 'Failed to update profile'
        return null
      }
    } catch (err) {
      error.value = err.message
      return null
    } finally {
      isLoading.value = false
    }
  }

  // Change password
  const changePassword = async (currentPassword, newPassword) => {
    isLoading.value = true
    updateSuccess.value = false
    error.value = null

    try {
      const token = localStorage.getItem('driverToken')
      if (!token) throw new Error('Not authenticated')

      console.log(`📡 Changing password at: ${API_BASE_URL}/drivers/change-password`)

      const response = await fetch(`${API_BASE_URL}/drivers/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      })

      const data = await response.json()

      if (data.success) {
        updateSuccess.value = true
        return true
      } else {
        error.value = data.message || 'Failed to change password'
        return false
      }
    } catch (err) {
      error.value = err.message
      return false
    } finally {
      isLoading.value = false
    }
  }

  return {
    user,
    isLoading,
    updateSuccess,
    error,
    fetchProfile,
    updateProfile,
    changePassword
  }
}