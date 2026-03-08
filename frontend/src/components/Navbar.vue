<template>
  <nav class="bg-white shadow-sm sticky top-0 z-40 border-b border-gray-200">
    <div class="container mx-auto px-4">
      <div class="flex justify-between items-center h-16">
        <router-link to="/" class="flex items-center space-x-2">
          <div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <span class="text-white font-bold text-lg">H</span>
          </div>
          <span class="text-xl font-bold text-gray-800">HuskyVoice</span>
        </router-link>
        
        <div class="flex items-center space-x-4">
          <div class="hidden md:flex items-center space-x-3 px-4 py-2 bg-gray-100 rounded-lg">
            <div class="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
              <span class="text-white text-sm font-medium">{{ userInitials }}</span>
            </div>
            <span class="text-gray-700 font-medium">{{ authStore.user?.name }}</span>
          </div>
          
          <span 
            class="px-3 py-1 text-xs font-semibold rounded-full"
            :class="authStore.user?.role === 'employer' 
              ? 'bg-purple-100 text-purple-700' 
              : 'bg-green-100 text-green-700'"
          >
            {{ authStore.user?.role === 'employer' ? 'Employer' : 'Employee' }}
          </span>
          
          <button 
            @click="showLogoutDialog = true"
            class="flex items-center space-x-1 px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span class="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>
    </div>
  </nav>

  <ConfirmDialog
    :show="showLogoutDialog"
    title="Logout"
    message="Are you sure you want to logout?"
    confirmText="Logout"
    @confirm="handleLogout"
    @cancel="showLogoutDialog = false"
  />
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import ConfirmDialog from './ConfirmDialog.vue'

const router = useRouter()
const authStore = useAuthStore()

const showLogoutDialog = ref(false)

const userInitials = computed(() => {
  const name = authStore.user?.name || ''
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
})

const handleLogout = () => {
  showLogoutDialog.value = false
  authStore.logout()
  window.location.href = '/login'
}
</script>
