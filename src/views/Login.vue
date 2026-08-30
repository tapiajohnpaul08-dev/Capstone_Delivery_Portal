<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- Logo Section -->
      <div class="text-center mb-8">
        <div class="inline-block bg-white rounded-2xl shadow-lg p-4 mb-4">
          <img 
            src="" 
            alt="ACAPSHOP" 
            class="h-16 w-16 object-contain"
            @error="(e) => e.target.style.display = 'none'"
          />
        </div>
        <h1 class="text-2xl font-bold text-gray-900">ACAPSHOP</h1>
        <p class="text-gray-500 text-sm mt-1">Rider Portal</p>
      </div>

      <!-- Login Card -->
      <div class="bg-white border rounded-xl shadow-sm p-6">
        <form @submit.prevent="handleLogin">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1.5">
              Email Address
            </label>
            <input 
              v-model="email" 
              type="email" 
              class="input-field" 
              placeholder="rider@acapshop.com"
              required
            />
          </div>

          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-1.5">
              Password
            </label>
            <input 
              v-model="password" 
              type="password" 
              class="input-field" 
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit" 
            class="btn-primary w-full"
            :disabled="loading"
          >
            <span v-if="!loading">Sign In</span>
            <span v-else class="flex items-center gap-2">
              <span class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Loading...
            </span>
          </button>

          <div v-if="error" class="mt-3 text-sm text-red-600 text-center bg-red-50 p-2 rounded-lg">
            {{ error }}
          </div>

          <div class="mt-4 text-xs text-gray-400 text-center border-t border-gray-100 pt-4">
            Demo: rider@acapshop.com / password
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { login } = useAuth()
const email = ref('rider@acapshop.com')
const password = ref('password')
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  // Validate inputs
  if (!email.value || !password.value) {
    error.value = 'Please enter both email and password'
    return
  }

  loading.value = true
  error.value = ''
  
  console.log('🔐 Attempting login with:', email.value)
  
  try {
    const result = await login(email.value, password.value)
    
    if (result.success) {
      console.log('✅ Login successful, redirecting to dashboard...')
      router.push('/dashboard')
    } else {
      error.value = result.message || 'Login failed. Please try again.'
    }
  } catch (err) {
    console.error('❌ Login error:', err)
    error.value = err.message || 'Login failed. Please check your credentials and try again.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>