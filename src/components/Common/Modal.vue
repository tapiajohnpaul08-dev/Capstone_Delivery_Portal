<template>
  <Teleport to="body">
    <div 
      v-if="modalState.visible"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      @click.self="handleCancel"
    >
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all duration-300 animate-scale-in">
        <!-- Icon -->
        <div class="flex justify-center mb-4">
          <div 
            class="w-16 h-16 rounded-full flex items-center justify-center"
            :class="iconContainerClass"
          >
            <component :is="modalIcon" :size="32" :class="iconColorClass" />
          </div>
        </div>

        <!-- Title -->
        <h3 class="text-lg font-bold text-center text-gray-900 mb-2">
          {{ modalState.title }}
        </h3>

        <!-- Message -->
        <p class="text-sm text-gray-600 text-center mb-6">
          {{ modalState.message }}
        </p>

        <!-- Buttons -->
        <div class="flex gap-3">
          <button
            v-if="modalState.cancelText"
            @click="handleCancel"
            class="flex-1 py-2.5 rounded-lg font-medium text-sm transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200"
            :disabled="modalState.loading"
          >
            {{ modalState.cancelText }}
          </button>
          <button
            @click="handleConfirm"
            class="flex-1 py-2.5 rounded-lg font-medium text-sm transition-colors text-white"
            :class="confirmButtonClass"
            :disabled="modalState.loading"
          >
            <span v-if="modalState.loading" class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            <span v-else>{{ modalState.confirmText }}</span>
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'
import { Info, AlertTriangle, AlertCircle, CheckCircle } from 'lucide-vue-next'
import { useModal } from '../../composables/useModal'

const { modalState, closeModal } = useModal()

const modalIcon = computed(() => {
  const icons = {
    info: Info,
    warning: AlertTriangle,
    danger: AlertCircle,
    success: CheckCircle
  }
  return icons[modalState.value.type] || Info
})

const iconColorClass = computed(() => {
  const classes = {
    info: 'text-blue-600',
    warning: 'text-yellow-600',
    danger: 'text-red-600',
    success: 'text-green-600'
  }
  return classes[modalState.value.type] || classes.info
})

const iconContainerClass = computed(() => {
  const classes = {
    info: 'bg-blue-100',
    warning: 'bg-yellow-100',
    danger: 'bg-red-100',
    success: 'bg-green-100'
  }
  return classes[modalState.value.type] || classes.info
})

const confirmButtonClass = computed(() => {
  const classes = {
    info: 'bg-blue-600 hover:bg-blue-700',
    warning: 'bg-yellow-600 hover:bg-yellow-700',
    danger: 'bg-red-600 hover:bg-red-700',
    success: 'bg-green-600 hover:bg-green-700'
  }
  return classes[modalState.value.type] || classes.info
})

const handleConfirm = () => {
  if (modalState.value.onConfirm) {
    modalState.value.loading = true
    modalState.value.onConfirm()
  } else {
    closeModal()
  }
}

const handleCancel = () => {
  if (modalState.value.onCancel) {
    modalState.value.onCancel()
  } else {
    closeModal()
  }
}
</script>

<style scoped>
@keyframes scaleIn {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.animate-scale-in {
  animation: scaleIn 0.2s ease-out forwards;
}
</style>