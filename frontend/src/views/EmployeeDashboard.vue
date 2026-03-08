<template>
  <div class="max-w-6xl mx-auto">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-800">Employee Dashboard</h1>
      <p class="text-gray-500 mt-1">Manage your leave requests</p>
    </div>
    
    <div class="grid lg:grid-cols-2 gap-6">
      <div>
        <LeaveForm @submit="handleNewLeave" />
      </div>
      
      <div>
        <div class="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-gray-800">My Leave Requests</h3>
            </div>
            <div class="flex space-x-1 bg-gray-100 rounded-lg p-1">
              <button 
                @click="filter = 'all'" 
                class="px-3 py-1 text-xs font-medium rounded-md transition-all"
                :class="filter === 'all' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500'"
              >
                All
              </button>
              <button 
                @click="filter = 'pending'" 
                class="px-3 py-1 text-xs font-medium rounded-md transition-all"
                :class="filter === 'pending' ? 'bg-white text-yellow-600 shadow-sm' : 'text-gray-500'"
              >
                Pending
              </button>
              <button 
                @click="filter = 'approved'" 
                class="px-3 py-1 text-xs font-medium rounded-md transition-all"
                :class="filter === 'approved' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500'"
              >
                Approved
              </button>
              <button 
                @click="filter = 'rejected'" 
                class="px-3 py-1 text-xs font-medium rounded-md transition-all"
                :class="filter === 'rejected' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500'"
              >
                Rejected
              </button>
            </div>
          </div>
          
          <div v-if="loading" class="flex items-center justify-center py-12">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
          
          <div v-else-if="filteredLeaves.length === 0" class="text-center py-12">
            <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p class="text-gray-500">No leave requests found</p>
          </div>
          
          <div v-else class="space-y-4 max-h-[500px] overflow-y-auto pr-2">
            <LeaveCard 
              v-for="leave in filteredLeaves" 
              :key="leave._id" 
              :leave="leave"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, inject } from 'vue'
import { useLeaveStore } from '../stores/leave'
import LeaveForm from '../components/LeaveForm.vue'
import LeaveCard from '../components/LeaveCard.vue'

const leaveStore = useLeaveStore()
const toast = inject('toast')
const loading = ref(true)
const filter = ref('all')

const filteredLeaves = computed(() => {
  if (filter.value === 'all') return leaveStore.leaves
  return leaveStore.leaves.filter(l => l.status === filter.value)
})

onMounted(async () => {
  try {
    await leaveStore.fetchMyLeaves()
  } finally {
    loading.value = false
  }
})

const handleNewLeave = async () => {
  await leaveStore.fetchMyLeaves()
}
</script>
