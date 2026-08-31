// composables/useDriverProfile.js
import { ref } from 'vue'
import { useAuth } from './useAuth'
import { apiService } from '../api/api'
import { useToast } from './useToast'

export function useDriverProfile() {
  const { user, loadUser } = useAuth()
  const { success, error } = useToast()
  const isLoading = ref(false)
  const updateSuccess = ref(false)
  const err = ref(null)

  const fetchProfile = async () => {
    isLoading.value = true
    err.value = null
    try {
      console.log(`📡 Fetching profile...`)

      const response = await apiService.getProfile()
      const data = response.data
      
      if (data.success) {
        const userData = data.data || data.user || {}
        localStorage.setItem('driverUser', JSON.stringify(userData))
        loadUser()
        return userData
      } else {
        err.value = data.message || 'Failed to fetch profile'
        return null
      }
    } catch (err) {
      err.value = err.response?.data?.message || err.message || 'Failed to fetch profile'
      return null
    } finally {
      isLoading.value = false
    }
  }

  const toggleAvailability = async () => {
    isLoading.value = true
    err.value = null
    try {
      const driverId = user.value?.driverId
      if (!driverId) {
        err.value = 'Driver ID not found'
        return false
      }
      
      console.log(`📡 Toggling availability for driver: ${driverId}`)
      
      const response = await apiService.toggleAvailability(driverId)
      const data = response.data

      if (data.success) {
        localStorage.setItem('driverUser', JSON.stringify(data.data))
        loadUser()
        success(`You are now ${data.data.available ? 'available' : 'unavailable'}`)
        return true
      } else {
        err.value = data.message || 'Failed to toggle availability'
        error(err.value)
        return false
      }
    } catch (err) {
      err.value = err.response?.data?.message || err.message || 'Failed to toggle availability'
      error(err.value)
      return false
    } finally {
      isLoading.value = false
    }
  }

  const updateProfile = async (updateData) => {
    isLoading.value = true
    updateSuccess.value = false
    err.value = null

    try {
      console.log(`📡 Updating profile...`, updateData)

      const response = await apiService.updateProfile(updateData)
      const data = response.data

      if (data.success) {
        const userData = data.data || data.user || {}
        localStorage.setItem('driverUser', JSON.stringify(userData))
        loadUser()
        updateSuccess.value = true
        success('Profile updated successfully!')
        return userData
      } else {
        err.value = data.message || 'Failed to update profile'
        error(err.value)
        return null
      }
    } catch (err) {
      err.value = err.response?.data?.message || err.message || 'Failed to update profile'
      error(err.value)
      return null
    } finally {
      isLoading.value = false
    }
  }

  const changePassword = async (currentPassword, newPassword) => {
    isLoading.value = true
    updateSuccess.value = false
    err.value = null

    try {
      console.log(`📡 Changing password...`)

      const response = await apiService.changePassword(currentPassword, newPassword)
      const data = response.data

      if (data.success) {
        updateSuccess.value = true
        success('Password changed successfully!')
        return true
      } else {
        err.value = data.message || 'Failed to change password'
        error(err.value)
        return false
      }
    } catch (err) {
      err.value = err.response?.data?.message || err.message || 'Failed to change password'
      error(err.value)
      return false
    } finally {
      isLoading.value = false
    }
  }

  return {
    user,
    isLoading,
    updateSuccess,
    error: err,
    fetchProfile,
    toggleAvailability,
    updateProfile,
    changePassword
  }
}