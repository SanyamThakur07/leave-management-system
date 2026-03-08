<template>
  <div class="max-w-6xl mx-auto">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Employer Dashboard</h1>
        <p class="text-gray-500 mt-1">Manage employee leave requests</p>
      </div>
      <button 
        @click="refreshLeaves"
        class="mt-4 md:mt-0 flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
      >
        <svg class="w-4 h-4" :class="{ 'animate-spin': loading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        <span>Refresh</span>
      </button>
    </div>

    <div class="grid md:grid-cols-3 gap-4 mb-8">
      <div class="bg-white rounded-xl p-5 shadow-md border border-gray-100">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
            <span class="text-xl">⏳</span>
          </div>
          <div>
            <p class="text-2xl font-bold text-gray-800">{{ leaveStore.pendingLeaves.length }}</p>
            <p class="text-sm text-gray-500">Pending</p>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-xl p-5 shadow-md border border-gray-100">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
            <span class="text-xl">✅</span>
          </div>
          <div>
            <p class="text-2xl font-bold text-gray-800">{{ approvedCount }}</p>
            <p class="text-sm text-gray-500">Approved</p>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-xl p-5 shadow-md border border-gray-100">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
            <span class="text-xl">❌</span>
          </div>
          <div>
            <p class="text-2xl font-bold text-gray-800">{{ rejectedCount }}</p>
            <p class="text-sm text-gray-500">Rejected</p>
          </div>
        </div>
      </div>
    </div>
    
    <div class="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-800">Leave Requests</h3>
        </div>
        <div class="flex space-x-1 bg-gray-100 rounded-lg p-1">
          <button 
            @click="filter = 'all'" 
            class="px-3 py-1 text-xs font-medium rounded-md transition-all"
            :class="filter === 'all' ? 'bg-white text-gray-800 shadow' : 'text-gray-500'"
          >
            All
          </button>
          <button 
            @click="filter = 'pending'" 
            class="px-3 py-1 text-xs font-medium rounded-md transition-all"
            :class="filter === 'pending' ? 'bg-white text-yellow-600 shadow' : 'text-gray-500'"
          >
            Pending
          </button>
          <button 
            @click="filter = 'approved'" 
            class="px-3 py-1 text-xs font-medium rounded-md transition-all"
            :class="filter === 'approved' ? 'bg-white text-green-600 shadow' : 'text-gray-500'"
          >
            Approved
          </button>
          <button 
            @click="filter = 'rejected'" 
            class="px-3 py-1 text-xs font-medium rounded-md transition-all"
            :class="filter === 'rejected' ? 'bg-white text-red-600 shadow' : 'text-gray-500'"
          >
            Rejected
          </button>
        </div>
      </div>
      
      <div v-if="loading" class="flex items-center justify-center py-16">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
      
      <div v-else-if="filteredLeaves.length === 0" class="text-center py-16">
        <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <p class="text-gray-500 text-lg">No leave requests found</p>
        <p class="text-gray-400 text-sm mt-1">Leave requests will appear here</p>
      </div>
      
      <div v-else class="space-y-4 max-h-[600px] overflow-y-auto pr-2">
        <LeaveCard 
          v-for="leave in filteredLeaves" 
          :key="leave._id" 
          :leave="leave"
          :show-actions="true"
          :show-employee="true"
          :loading="actionLoading"
          @approve="handleApprove"
          @reject="handleReject"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, inject } from 'vue'
import { useLeaveStore } from '../stores/leave'
import LeaveCard from '../components/LeaveCard.vue'

const leaveStore = useLeaveStore()
const toast = inject('toast')
const loading = ref(true)
const actionLoading = ref(false)
const filter = ref('all')

const filteredLeaves = computed(() => {
  if (filter.value === 'all') return leaveStore.allLeaves
  return leaveStore.allLeaves.filter(l => l.status === filter.value)
})

const approvedCount = computed(() => 
  leaveStore.allLeaves.filter(l => l.status === 'approved').length
)

const rejectedCount = computed(() => 
  leaveStore.allLeaves.filter(l => l.status === 'rejected').length
)

onMounted(async () => {
  try {
    await leaveStore.fetchAllLeaves()
  } finally {
    loading.value = false
  }
})

const refreshLeaves = async () => {
  loading.value = true
  try {
    await leaveStore.fetchAllLeaves()
    toast.addToast('Leave requests refreshed', 'success')
  } finally {
    loading.value = false
  }
}

const handleApprove = async (leaveId) => {
  actionLoading.value = true
  try {
    await leaveStore.approveLeave(leaveId)
    toast.addToast('Leave request approved', 'success')
  } catch (error) {
    toast.addToast('Failed to approve leave', 'error')
  } finally {
    actionLoading.value = false
  }
}

const handleReject = async (leaveId) => {
  actionLoading.value = true
  try {
    await leaveStore.rejectLeave(leaveId)
    toast.addToast('Leave request rejected', 'info')
  } catch (error) {
    toast.addToast('Failed to reject leave', 'error')
  } finally {
    actionLoading.value = false
  }
}
</script>
