<template>
  <header class="bg-white border-b sticky top-0 z-10">
    <div class="container-custom">
      <div class="flex items-center justify-between py-3">
        <!-- Logo & Brand -->
        <div class="flex items-center gap-3">
          <img 
            src="" 
            alt="ACAPSHOP" 
            class="h-8 w-8 object-contain"
            @error="(e) => e.target.style.display = 'none'"
          />
          <div>
            <h1 class="text-lg font-bold text-gray-900 leading-tight">ACAPSHOP</h1>
            <p class="text-xs text-gray-500">Rider Portal</p>
          </div>
        </div>

      </div>
    </div>
  </header>
</template>

<script setup>
import { useAuth } from '../../composables/useAuth'

const { logout } = useAuth()
</script>