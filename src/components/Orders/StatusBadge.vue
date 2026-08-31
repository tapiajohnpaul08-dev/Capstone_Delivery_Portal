<template>
  <span class="px-2.5 py-1 rounded-full text-xs font-medium" :class="badgeClasses">
    {{ displayLabel }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: {
    type: String,
    required: true
  }
})

const statusMap = {
  'assigned': { label: 'Assigned', color: 'blue' },
  'out-for-delivery': { label: 'Out for Delivery', color: 'orange' },
  'completed': { label: 'Completed', color: 'green' },
  'cancelled': { label: 'Cancelled', color: 'red' }
}

const displayLabel = computed(() => {
  return statusMap[props.status]?.label || props.status || 'Unknown'
})

const badgeClasses = computed(() => {
  const color = statusMap[props.status]?.color || 'gray'
  const classes = {
    blue: 'bg-blue-100 text-blue-700',
    orange: 'bg-orange-100 text-orange-700',
    green: 'bg-green-100 text-green-700',
    red: 'bg-red-100 text-red-700',
    gray: 'bg-gray-100 text-gray-700'
  }
  return classes[color] || classes.gray
})
</script>