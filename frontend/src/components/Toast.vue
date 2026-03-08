<template>
  <div class="fixed top-4 right-4 z-50 space-y-2">
    <transition-group name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="px-4 py-3 rounded-lg shadow-lg flex items-center space-x-3 min-w-[280px]"
        :class="toastClasses[toast.type]"
      >
        <span v-if="toast.type === 'success'" class="text-green-500">✓</span>
        <span v-else-if="toast.type === 'error'" class="text-red-500">✕</span>
        <span v-else class="text-blue-500">ℹ</span>
        <span class="text-sm font-medium">{{ toast.message }}</span>
        <button @click="removeToast(toast.id)" class="ml-auto text-gray-400 hover:text-gray-600">✕</button>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { ref, provide } from 'vue'

const toasts = ref([])
const toastClasses = {
  success: 'bg-white border-l-4 border-green-500',
  error: 'bg-white border-l-4 border-red-500',
  info: 'bg-white border-l-4 border-blue-500'
}

const addToast = (message, type = 'info', duration = 3000) => {
  const id = Date.now()
  toasts.value.push({ id, message, type })
  setTimeout(() => removeToast(id), duration)
}

const removeToast = (id) => {
  const index = toasts.value.findIndex(t => t.id === id)
  if (index > -1) toasts.value.splice(index, 1)
}

provide('toast', { addToast, removeToast })
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(100px);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(100px);
}
</style>
