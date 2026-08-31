// composables/useModal.js
import { ref } from 'vue'

const modalState = ref({
  visible: false,
  title: '',
  message: '',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  type: 'info', // info, warning, danger, success
  onConfirm: null,
  onCancel: null,
  loading: false
})

export function useModal() {
  const showModal = (options) => {
    modalState.value = {
      visible: true,
      title: options.title || 'Confirm',
      message: options.message || 'Are you sure?',
      confirmText: options.confirmText || 'Confirm',
      cancelText: options.cancelText || 'Cancel',
      type: options.type || 'info',
      onConfirm: options.onConfirm || null,
      onCancel: options.onCancel || null,
      loading: false
    }
  }

  const closeModal = () => {
    modalState.value.visible = false
    modalState.value.loading = false
  }

  const setLoading = (loading) => {
    modalState.value.loading = loading
  }

  const confirm = (options) => {
    return new Promise((resolve) => {
      showModal({
        ...options,
        onConfirm: () => {
          closeModal()
          resolve(true)
        },
        onCancel: () => {
          closeModal()
          resolve(false)
        }
      })
    })
  }

  return {
    modalState,
    showModal,
    closeModal,
    setLoading,
    confirm
  }
}