<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75" @click.self="$emit('close')">
    <div class="bg-white rounded-xl max-w-md w-full mx-4 overflow-hidden shadow-2xl">
      <div class="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
        <h3 class="font-semibold text-gray-900 flex items-center gap-2">
          <Camera :size="20" class="text-blue-600" />
          Take Photo
        </h3>
        <button 
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-200"
        >
          <X :size="20" />
        </button>
      </div>
      
      <div class="relative bg-black" style="min-height: 400px; max-height: 60vh;">
        <!-- Loading overlay -->
        <div v-if="!cameraReady" class="absolute inset-0 flex items-center justify-center bg-black z-10">
          <div class="text-white text-center">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent mb-3"></div>
            <p class="text-sm">Initializing camera...</p>
            <p class="text-xs text-gray-400 mt-1">Please allow camera access when prompted</p>
          </div>
        </div>
        
        <video 
          ref="videoRef"
          autoplay
          playsinline
          class="w-full h-full object-cover"
          style="min-height: 400px; max-height: 60vh;"
        ></video>
        
        <canvas ref="canvasRef" class="hidden"></canvas>
        
        <!-- Camera controls -->
        <div class="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/70 to-transparent">
          <div class="flex justify-center items-center gap-6">
            <button 
              @click="switchCamera"
              class="p-3 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors disabled:opacity-50"
              :disabled="!cameraReady"
              title="Switch Camera"
            >
              <RotateCcw :size="24" />
            </button>
            
            <button 
              @click="capturePhoto"
              class="p-2 rounded-full bg-white shadow-lg hover:shadow-xl transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50"
              :disabled="!cameraReady"
            >
              <div class="w-16 h-16 rounded-full border-4 border-blue-600 bg-white"></div>
            </button>
            
            <button 
              @click="$emit('close')"
              class="p-3 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
              title="Close Camera"
            >
              <X :size="24" />
            </button>
          </div>
        </div>
      </div>
      
      <div class="p-3 bg-gray-50 border-t border-gray-200 text-center">
        <p class="text-xs text-gray-500 flex items-center justify-center gap-1">
          <Camera :size="14" class="inline" />
          Capture a clear photo of the delivered items or customer receipt
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { X, RotateCcw, Camera } from 'lucide-vue-next'

const emit = defineEmits(['capture', 'close'])

const videoRef = ref(null)
const canvasRef = ref(null)
const stream = ref(null)
const cameraReady = ref(false)
let facingMode = 'environment'

onMounted(async () => {
  // Small delay to ensure DOM is ready
  await new Promise(resolve => setTimeout(resolve, 100))
  await startCamera()
})

onUnmounted(() => {
  stopCamera()
})

const startCamera = async () => {
  cameraReady.value = false
  try {
    stopCamera()
    
    console.log('📷 Starting camera with facingMode:', facingMode)
    
    stream.value = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: facingMode,
        width: { ideal: 1280 },
        height: { ideal: 720 }
      },
      audio: false
    })
    
    if (videoRef.value) {
      videoRef.value.srcObject = stream.value
      await videoRef.value.play()
      cameraReady.value = true
      console.log('✅ Camera ready')
    }
  } catch (error) {
    console.error('Error accessing camera:', error)
    
    let errorMessage = 'Unable to access camera.'
    if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
      errorMessage = 'Camera permission denied. Please allow camera access and try again.'
    } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
      errorMessage = 'No camera found on this device.'
    } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
      errorMessage = 'Camera is in use by another application. Please close other apps and try again.'
    }
    
    alert(errorMessage)
    emit('close')
  }
}

const stopCamera = () => {
  if (stream.value) {
    stream.value.getTracks().forEach(track => {
      track.stop()
      console.log('📷 Stopped camera track:', track.kind)
    })
    stream.value = null
  }
  if (videoRef.value) {
    videoRef.value.srcObject = null
  }
  cameraReady.value = false
}

const switchCamera = async () => {
  facingMode = facingMode === 'environment' ? 'user' : 'environment'
  console.log('🔄 Switching camera to:', facingMode)
  await startCamera()
}

const capturePhoto = () => {
  if (!videoRef.value || !canvasRef.value || !cameraReady.value) {
    alert('Camera not ready. Please wait.')
    return
  }
  
  try {
    const video = videoRef.value
    const canvas = canvasRef.value
    
    canvas.width = video.videoWidth || 1280
    canvas.height = video.videoHeight || 720
    
    const context = canvas.getContext('2d')
    context.drawImage(video, 0, 0, canvas.width, canvas.height)
    
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `proof_${Date.now()}.jpg`, { type: 'image/jpeg' })
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9)
        
        console.log('📸 Photo captured:', file.name, file.size, 'bytes')
        
        emit('capture', {
          file: file,
          dataUrl: dataUrl
        })
      } else {
        alert('Failed to capture photo. Please try again.')
      }
    }, 'image/jpeg', 0.9)
  } catch (error) {
    console.error('Error capturing photo:', error)
    alert('Failed to capture photo. Please try again.')
  }
}
</script>