<template>
  <div class="min-h-screen bg-gray-50 pb-20">
    <!-- Header -->
    <Header />
    
    <!-- Main Content -->
    <main class="container-custom py-4">
      <router-view />
    </main>

    <!-- Bottom Navigation -->
    <BottomNav />
  </div>
</template>

<script setup>
import Header from '../Common/Header.vue'
import BottomNav from '../Common/BottomNav.vue'
</script>