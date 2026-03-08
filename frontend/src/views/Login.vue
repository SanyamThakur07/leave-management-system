<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <div class="w-full max-w-md max-h-[90vh] overflow-y-auto">
      <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <div class="text-center mb-4">
          <h1 class="text-xl font-bold text-gray-800">Welcome Back</h1>
          <p class="text-gray-500 text-sm mt-1">Sign in to your account</p>
        </div>
        
        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              v-model="formData.email" 
              type="email" 
              required
              placeholder="you@example.com"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              v-model="formData.password" 
              type="password" 
              required
              placeholder="••••••••"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm"
            />
          </div>

          <div v-if="error" class="flex items-center space-x-2 text-red-600 text-xs bg-red-50 p-2 rounded-lg">
            <span>{{ error }}</span>
          </div>

          <button 
            type="submit" 
            :disabled="loading"
            class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 transition-colors text-sm"
          >
            <span v-if="loading">Signing in...</span>
            <span v-else>Sign In</span>
          </button>
        </form>

        <p class="mt-4 text-center text-xs text-gray-600">
          Don't have an account? 
          <router-link to="/signup" class="text-blue-600 font-medium hover:text-blue-700">Create one</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const formData = reactive({ email: '', password: '' })
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  error.value = ''
  loading.value = true
  
  try {
    await authStore.login(formData)
    if (authStore.user.role === 'employer') {
      router.push('/employer')
    } else {
      router.push('/employee')
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'Login failed. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>
