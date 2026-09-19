<template>
  <div class="card">
    <div class="card-body">
      <div class="flex justify-between items-start mb-3">
        <div>
          <h3 class="font-semibold text-gray-900">{{ displayCustomerName }}</h3>
          <p class="text-sm text-gray-500">{{ displayCustomerPhone }}</p>
          <p class="text-xs text-gray-400">Order: {{ order.orderId || order._id || '' }}</p>
        </div>
        <StatusBadge :status="displayStatus" />
      </div>

      <div class="space-y-2 text-sm">
        <div class="flex items-start gap-2 text-gray-600">
          <MapPin :size="16" class="mt-0.5 flex-shrink-0" />
          <span>{{ displayAddress }}</span>
        </div>
        
        <div class="flex items-center gap-2 text-gray-600">
          <Package :size="16" class="flex-shrink-0" />
          <span>{{ displayItems }}</span>
        </div>

        <div class="flex justify-between text-gray-700 font-medium pt-1 border-t border-gray-100">
          <div class="flex flex-col gap-2">
            <span class="font-bold">Amount to Paid: ₱{{ remainingBalance.toLocaleString() }}</span>
            <span>Total Amount: ₱{{ displayTotal.toLocaleString() }}</span>
          </div>
          
            
        
          <span class="text-green-600" v-if="order.deliveryFee">Delivery: ₱{{ (order.deliveryFee || 0).toLocaleString() }}</span>
        </div>

        <div v-if="order.notes" class="text-sm text-gray-500 bg-gray-50 p-2 rounded-lg">
          <FileText :size="14" class="inline mr-1" />
          {{ order.notes }}
        </div>

        <!-- Proof of Delivery Section -->
        <div v-if="isAssigned" class="mt-3 border-t border-gray-100 pt-3">
          <div class="mb-3">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Proof of Delivery
              <span class="text-gray-400 text-xs font-normal">(Optional)</span>
            </label>
            
            <!-- Image Preview -->
            <div v-if="previewImage" class="relative mb-3">
              <img 
                :src="previewImage" 
                alt="Proof of Delivery" 
                class="w-full h-48 object-cover rounded-lg border-2 border-green-300"
              />
              <button 
                @click="clearPreview"
                class="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-lg"
                :disabled="isSubmitting"
              >
                <X :size="16" />
              </button>
              <p class="text-xs text-green-600 mt-1 flex items-center gap-1">
                <CheckCircle :size="14" />
                Photo ready for upload
              </p>
            </div>

            <!-- Upload Options -->
            <div class="grid grid-cols-2 gap-2" v-if="!previewImage">
              <!-- Camera Button -->
              <button 
                @click="openCamera"
                class="py-2.5 px-4 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                :disabled="isSubmitting"
              >
                <Camera :size="18" />
                Take Photo
              </button>
              
              <!-- Gallery Upload -->
              <label class="py-2.5 px-4 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                :class="{ 'opacity-50 cursor-not-allowed': isSubmitting }"
              >
                <Upload :size="18" />
                Choose Photo
                <input 
                  type="file" 
                  accept="image/*"
                  @change="handleFileUpload"
                  class="hidden"
                  :disabled="isSubmitting"
                />
              </label>
            </div>
          </div>

                    <!-- COD collection confirmation (only when payment is Partial) -->
          <div
            v-if="order.paymentStatus === 'Partial'"
            class="mb-3 bg-amber-50 border border-amber-200 rounded-lg p-3"
          >
            <label class="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                v-model="codCollected"
                :disabled="isSubmitting"
                class="mt-0.5 w-4 h-4 rounded border-amber-300 text-amber-600 focus:ring-amber-500"
              />
              <div class="text-sm">
                <p class="font-semibold text-amber-800">
                  Collect ₱{{ remainingBalance.toLocaleString() }} in cash
                </p>
                <p class="text-xs text-amber-600 mt-0.5 leading-snug">
                  Check this only if you've received the remaining balance from the customer.
                </p>
              </div>
            </label>
          </div>

          <!-- Complete Button -->
          <button 
            @click="handleComplete"
            :disabled="isSubmitting || (order.paymentStatus === 'Partial' && !codCollected)"
            class="w-full py-3 rounded-lg font-medium text-sm bg-green-600 text-white hover:bg-green-700 transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <!-- Loading spinner -->
            <div v-if="isSubmitting" class="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            <CheckCircle v-else :size="18" />
            {{ isSubmitting ? 'Submitting...' : 'Mark as Completed' }}
          </button>
        </div>

        <!-- Completed/Cancelled status -->
        <div v-if="displayStatus === 'completed' && order.completedAt" class="text-xs text-gray-400 mt-2 pt-1 border-t border-gray-100">
          <CheckCircle :size="12" class="inline mr-1 text-green-500" />
          Completed: {{ formatDate(order.completedAt) }}
        </div>
        <div v-if="displayStatus === 'cancelled' && order.cancelledAt" class="text-xs text-red-400 mt-2 pt-1 border-t border-gray-100">
          <XCircle :size="12" class="inline mr-1" />
          Cancelled: {{ formatDate(order.cancelledAt) }}
        </div>
        <div v-if="isAssigned && order.createdAt" class="text-xs text-blue-400 mt-2 pt-1 border-t border-gray-100">
          <Package :size="12" class="inline mr-1" />
          Assigned: {{ formatDate(order.createdAt) }}
        </div>
        <!-- Show proof image if exists -->
        <div v-if="order.proofOfDelivery" class="mt-2 pt-1 border-t border-gray-100">
          <p class="text-xs text-gray-500 flex items-center gap-1">
            <Image :size="12" />
            Proof of Delivery:
          </p>
          <img 
            :src="order.proofOfDelivery" 
            alt="Proof of Delivery" 
            class="mt-1 w-full h-32 object-cover rounded-lg border"
          />
        </div>
      </div>
    </div>
  </div>

  <!-- Camera Modal -->
  <CameraModal 
    v-if="showCamera"
    @capture="handlePhotoCapture"
    @close="closeCamera"
  />
</template>

<script setup>
import { ref, computed } from 'vue'
import { 
  MapPin, 
  Package, 
  CheckCircle, 
  XCircle, 
  FileText, 
  Camera, 
  Upload, 
  X, 
  Image 
} from 'lucide-vue-next'
import StatusBadge from './StatusBadge.vue'
import CameraModal from './CameraModal.vue'
import { useModal } from '../../composables/useModal'

const props = defineProps({
  order: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['complete-order', 'upload-proof'])
const { confirm } = useModal()

// State
const orderId = computed(() => props.order.id || props.order._id)
const showCamera = ref(false)
const previewImage = ref(null)
const capturedFile = ref(null)
const isSubmitting = ref(false) // ← Local submitting state
const codCollected = ref(false) // ← COD confirmation checkbox



// Remaining balance = total minus sum of partial payments
const remainingBalance = computed(() => {
  const order = props.order
  const total = Number(order.total) || Number(order.totalAmount) || Number(order.amount) || 0
  const paid = Array.isArray(order.partialPayments)
    ? order.partialPayments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0)
    : 0
  return Math.max(0, total - paid)
})



// Computed properties
const isAssigned = computed(() => {
  const status = props.order.status || ''
  return status === 'out-for-delivery'
})

const displayCustomerName = computed(() => {
  const order = props.order
  return order.customerName || 
         order.customer?.name || 
         order.customer?.firstName + ' ' + order.customer?.lastName ||
         'Unknown Customer'
})

const displayCustomerPhone = computed(() => {
  const order = props.order
  return order.customerPhone || 
         order.customer?.phone || 
         order.phoneNumber ||
         'N/A'
})

const displayAddress = computed(() => {
  const order = props.order
  return order.address || 
         order.customer?.address || 
         order.deliveryAddress ||
         'No address provided'
})

const displayItems = computed(() => {
  const order = props.order
  if (Array.isArray(order.items)) {
    if (typeof order.items[0] === 'string') {
      return order.items.join(', ')
    } else if (typeof order.items[0] === 'object') {
      return order.items.map(item => `${item.name} (${item.quantity}pcs)`).join(', ')
    }
  }
  return order.productName || order.items || 'No items'
})

const displayTotal = computed(() => {
  return props.order.total || props.order.totalAmount || props.order.amount || 0
})

const displayStatus = computed(() => {
  const status = props.order.status || ''
  const statusMap = {
    'Pending': 'assigned',
    'Scheduled': 'assigned',
    'In Production': 'assigned',
    'Out for Delivery': 'out-for-delivery',
    'Completed': 'completed',
    'Cancelled': 'cancelled'
  }
  return statusMap[status] || 'assigned'
})

// Methods
const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleString('en-PH', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const openCamera = () => {
  if (isSubmitting.value) return
  showCamera.value = true
}

const closeCamera = () => {
  showCamera.value = false
}

const handlePhotoCapture = (data) => {
  capturedFile.value = data.file
  previewImage.value = data.dataUrl
  showCamera.value = false
}

const clearPreview = () => {
  if (isSubmitting.value) return
  previewImage.value = null
  capturedFile.value = null
}

const handleFileUpload = (event) => {
  if (isSubmitting.value) return
  const file = event.target.files[0]
  if (file) {
    capturedFile.value = file
    const reader = new FileReader()
    reader.onload = (e) => {
      previewImage.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
  event.target.value = ''
}

const handleComplete = async () => {
  if (isSubmitting.value) return

  // ✅ FIX #4a — Visible feedback instead of silent return
  if (props.order.paymentStatus === 'Partial' && !codCollected.value) {
    // Use alert for now — the button is also disabled, so this only
    // fires if someone calls handleComplete programmatically.
    alert(
      `Please check "Collect ₱${remainingBalance.value.toLocaleString()} in cash" before completing.`
    )
    return
  }

  const confirmed = await confirm({
    title: 'Complete Order',
    message: props.order.paymentStatus === 'Partial'
      ? `Confirm you've collected ₱${remainingBalance.value.toLocaleString()} in cash. This order will be marked as completed.`
      : 'Are you sure you want to mark this order as completed?',
    confirmText: 'Yes, Complete',
    cancelText: 'Cancel',
    type: 'success'
  })

  if (confirmed) {
    isSubmitting.value = true

    // ✅ FIX #4b — Always reset isSubmitting so the button never gets stuck
    try {
      if (capturedFile.value) {
        emit('upload-proof', {
          orderId: orderId.value,
          file: capturedFile.value,
          codCollected: codCollected.value,
        })
      } else {
        emit('complete-order', {
          orderId: orderId.value,
          codCollected: codCollected.value,
        })
      }
      codCollected.value = false
      clearPreview()
    } catch (e) {
      console.error('Complete order failed:', e)
    } finally {
      // Reset submitting after a short delay so the parent has time to
      // process the emit + refetch. If the API fails, the button becomes
      // usable again instead of being permanently stuck.
      setTimeout(() => {
        isSubmitting.value = false
      }, 3000)
    }
  }
}

// Reset submitting state when parent emits success
// This will be handled by the parent component
</script>