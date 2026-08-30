<template>
  <span 
    class="badge"
    :class="badgeClasses"
  >
    {{ label }}
  </span>
</template>

<script setup>
import { computed } from 'vue'
import { getStatusLabel, getStatusColor } from '../../data/mockData'

const props = defineProps({
  status: {
    type: String,
    required: true
  }
})

const label = computed(() => getStatusLabel(props.status))

const badgeClasses = computed(() => {
  const color = getStatusColor(props.status)
  const classes = {
    blue: 'badge-blue',
    orange: 'badge-orange',
    green: 'badge-green',
    red: 'badge-red',
    gray: 'badge-gray'
  }
  return classes[color] || classes.gray
})
</script>