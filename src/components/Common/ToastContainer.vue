<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-[100] space-y-2 max-w-sm w-full">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="flex items-center gap-3 p-4 rounded-xl shadow-lg border transform transition-all duration-300 animate-slide-in"
        :class="toastClasses(toast.type)"
        role="alert"
      >
        <component :is="toastIcon(toast.type)" :size="20" class="flex-shrink-0" />
        <p class="text-sm font-medium flex-1">{{ toast.message }}</p>
        <button 
          @click="removeToast(toast.id)"
          class="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
        >
          <X :size="16" />
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-vue-next'
import { useToast } from '../../composables/useToast'

const { toasts, removeToast } = useToast()

const toastClasses = (type) => {
  const base = 'bg-white'
  const border = {
    success: 'border-green-500',
    error: 'border-red-500',
    warning: 'border-yellow-500',
    info: 'border-blue-500'
  }
  return `${base} ${border[type] || border.info}`
}

const toastIcon = (type) => {
  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info
  }
  return icons[type] || Info
}
</script>

<style scoped>
@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.animate-slide-in {
  animation: slideIn 0.3s ease-out forwards;
}
</style>