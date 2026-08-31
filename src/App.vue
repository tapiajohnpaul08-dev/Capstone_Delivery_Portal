<template>
  <router-view />
  <ToastContainer />
    <Modal />
</template>

<script setup>
import ToastContainer from './components/Common/ToastContainer.vue'
import Modal from './components/Common/Modal.vue'
</script>

<style>
/* Global styles */
* {
  box-sizing: border-box;
}
</style>