<template>
  <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
    <div class="container-custom">
      <div class="flex justify-around">
        <router-link 
          v-for="item in navItems" 
          :key="item.path"
          :to="item.path"
          class="flex flex-col items-center py-2.5 px-3 text-xs transition-colors relative"
          :class="$route.path.startsWith(item.path) ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'"
        >
          <component :is="item.icon" :size="22" />
          <span class="mt-1">{{ item.label }}</span>
          <div v-if="$route.path.startsWith(item.path)" class="absolute -top-[1px] left-1/2 -translate-x-1/2 w-8 h-0.5 bg-blue-600 rounded-full"></div>
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { 
  LayoutDashboard, 
  ClipboardList, 
  History, 
  User 
} from 'lucide-vue-next'

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/assigned-orders', label: 'Assigned', icon: ClipboardList },
  { path: '/order-history', label: 'History', icon: History },
  { path: '/profile', label: 'Profile', icon: User },
]
</script>