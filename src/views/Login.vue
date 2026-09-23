<template>
  <div class="relative min-h-screen flex items-center justify-center p-4 overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800">

    <!-- ═══════════════════════════════════════════════════════════
         DECORATIVE BACKGROUND LAYER
         ═══════════════════════════════════════════════════════════ -->

    <!-- Dot grid overlay -->
    <div
      class="absolute inset-0 opacity-20 pointer-events-none"
      style="
        background-image: radial-gradient(circle, rgba(255,255,255,0.35) 1px, transparent 1px);
        background-size: 24px 24px;
      "
    ></div>

    <!-- Blobs -->
    <div class="blob blob-1 absolute -top-32 -left-32 w-[28rem] h-[28rem] rounded-full bg-blue-400 opacity-40 blur-3xl pointer-events-none"></div>
    <div class="blob blob-2 absolute -bottom-40 -right-40 w-[32rem] h-[32rem] rounded-full bg-indigo-400 opacity-40 blur-3xl pointer-events-none"></div>
    <div class="blob blob-3 absolute top-1/4 -right-24 w-96 h-96 rounded-full bg-cyan-300 opacity-30 blur-3xl pointer-events-none"></div>
    <div class="blob blob-4 absolute -bottom-24 left-1/4 w-80 h-80 rounded-full bg-sky-300 opacity-25 blur-3xl pointer-events-none"></div>

    <!-- Vignette -->
    <div
      class="absolute inset-0 pointer-events-none"
      style="background: radial-gradient(ellipse at center, rgba(255,255,255,0.08) 0%, rgba(0,0,0,0.18) 100%);"
    ></div>

    <!-- ═══════════════════════════════════════════════════════════
         MAIN CONTENT
         ═══════════════════════════════════════════════════════════ -->
    <div class="relative w-full max-w-md z-10">

      <!-- Logo Section -->
      <div class="text-center mb-8">
        <div class="inline-block bg-white/95 backdrop-blur rounded-2xl shadow-xl shadow-blue-950/30 p-4 mb-4 ring-1 ring-white/40">
          <img
            src="../assets/logo.png"
            alt="ACAPSHOP"
            class="h-14 w-14 object-contain"
            @error="(e) => e.target.style.display = 'none'"
          />
        </div>
        <h1 class="text-3xl font-black text-white tracking-tight drop-shadow-md">ACAPSHOP</h1>
        <p class="text-blue-100 text-sm mt-1 font-medium">Driver Portal</p>
      </div>

      <!-- ═══════════════════════════════════════════════════════════
           LOGIN CARD — refined
           ═══════════════════════════════════════════════════════════ -->
      <div class="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-blue-950/40 border border-white/50 p-7 sm:p-8">

        <!-- Card heading -->
        <div class="text-center mb-6">
          <h2 class="text-lg font-bold text-gray-900 leading-tight">Welcome back</h2>
          <p class="text-xs text-gray-500 mt-1">Sign in to continue to your dashboard</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-4">

          <!-- Email -->
          <div>
            <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div class="relative">
              <Mail class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                v-model="email"
                type="email"
                required
                autocomplete="email"
                placeholder="driver@gmail.com"
                class="w-full pl-10 pr-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/15 focus:border-blue-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          <!-- Password -->
          <div>
            <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
              Password
            </label>
            <div class="relative">
              <Lock class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                required
                autocomplete="current-password"
                placeholder="••••••••"
                class="w-full pl-10 pr-11 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/15 focus:border-blue-500 focus:bg-white transition-all"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                tabindex="-1"
                class="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                :title="showPassword ? 'Hide password' : 'Show password'"
              >
                <Eye v-if="!showPassword" class="w-4 h-4" />
                <EyeOff v-else class="w-4 h-4" />
              </button>
            </div>
          </div>

          <!-- Sign in button -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full py-3.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Loader2 v-if="loading" class="w-4 h-4 animate-spin" />
            <template v-else>
              <LogIn class="w-4 h-4" />
              Sign In
            </template>
          </button>

          <!-- Error message -->
          <Transition name="fade">
            <div
              v-if="error"
              class="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 leading-relaxed"
            >
              <AlertCircle class="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{{ error }}</span>
            </div>
          </Transition>
        </form>

        <!-- Support footer -->
        <div class="mt-6 pt-5 border-t border-gray-100">
          <p class="text-center text-[11px] text-gray-400 leading-relaxed">
            Having trouble signing in?<br>
            Contact your administrator.
          </p>
        </div>
      </div>

      <!-- External brand line -->
      <p class="text-center text-blue-200/80 text-[10px] mt-6 font-semibold tracking-[0.25em] uppercase">
        ACAPSHOP · Driver Portal
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  LogIn, Loader2, AlertCircle,
  Mail, Lock, Eye, EyeOff,
} from 'lucide-vue-next'
import { useAuth } from '../composables/useAuth'
import { useToast } from '../composables/useToast'

const router = useRouter()
const { login } = useAuth()
const { error: showError, success: showSuccess } = useToast()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const showPassword = ref(false)

const handleLogin = async () => {
  if (!email.value || !password.value) {
    error.value = 'Please enter both email and password'
    showError('Please enter both email and password')
    return
  }

  loading.value = true
  error.value = ''

  try {
    const result = await login(email.value, password.value)

    if (result.success) {
      showSuccess('Welcome back!')
      const redirectPath = sessionStorage.getItem('redirectAfterLogin')
      if (redirectPath) {
        sessionStorage.removeItem('redirectAfterLogin')
        router.push(redirectPath)
      } else {
        router.push('/rider/dashboard')
      }
    } else {
      error.value = result.message || 'Login failed'
      showError(error.value)
    }
  } catch (err) {
    error.value = err.message || 'Login failed. Please try again.'
    showError(error.value)
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
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

/* Error message fade-in */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* ── Blob drift animations ──────────────────────────────────── */
.blob { will-change: transform; }

.blob-1 { animation: drift-1 18s ease-in-out infinite; }
.blob-2 { animation: drift-2 22s ease-in-out infinite; }
.blob-3 { animation: drift-3 20s ease-in-out infinite; }
.blob-4 { animation: drift-4 24s ease-in-out infinite; }

@keyframes drift-1 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50%      { transform: translate(40px, 30px) scale(1.08); }
}
@keyframes drift-2 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50%      { transform: translate(-50px, -30px) scale(1.12); }
}
@keyframes drift-3 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50%      { transform: translate(-30px, 40px) scale(0.94); }
}
@keyframes drift-4 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50%      { transform: translate(30px, -40px) scale(1.06); }
}

@media (prefers-reduced-motion: reduce) {
  .blob { animation: none !important; }
  .animate-spin { animation: none !important; }
}
</style>