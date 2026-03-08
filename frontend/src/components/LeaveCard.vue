<template>
  <div class="bg-white rounded-lg shadow-sm p-5 border border-gray-200 hover:shadow-md transition-shadow">
    <div class="flex justify-between items-start mb-4">
      <div class="flex flex-wrap gap-2">
        <span 
          class="px-3 py-1 text-xs font-semibold rounded-full"
          :class="statusClass"
        >
          {{ statusLabel }}
        </span>
        <span class="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600 flex items-center space-x-1">
          <span>{{ leaveIcon }}</span>
          <span>{{ leaveTypeLabel }}</span>
        </span>
      </div>
      <span class="text-xs text-gray-400">{{ formatDate(leave.createdAt) }}</span>
    </div>

    <div class="mb-4">
      <p class="text-sm text-gray-500 mb-1">Duration</p>
      <p class="text-gray-800 font-medium flex items-center space-x-2">
        <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span>{{ formatDate(leave.startDate) }} - {{ formatDate(leave.endDate) }}</span>
        <span class="text-xs text-gray-400">({{ dayCount }} days)</span>
      </p>
    </div>

    <div class="mb-4">
      <p class="text-sm text-gray-500 mb-1">Reason</p>
      <p class="text-gray-700 text-sm">{{ leave.reason }}</p>
    </div>

    <div v-if="showActions && leave.status === 'pending'" class="flex space-x-3 mt-5 pt-4 border-t border-gray-100">
      <button 
        @click="$emit('approve', leave._id)"
        :disabled="loading"
        class="flex-1 flex items-center justify-center space-x-2 bg-green-600 text-white py-2.5 px-4 rounded-lg hover:bg-green-700 disabled:bg-green-300 transition-colors font-medium text-sm"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        <span>Approve</span>
      </button>
      <button 
        @click="$emit('reject', leave._id)"
        :disabled="loading"
        class="flex-1 flex items-center justify-center space-x-2 bg-red-600 text-white py-2.5 px-4 rounded-lg hover:bg-red-700 disabled:bg-red-300 transition-colors font-medium text-sm"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
        <span>Reject</span>
      </button>
    </div>

    <div v-if="showEmployee && leave.userId" class="mt-4 pt-3 border-t border-gray-100">
      <div class="flex items-center space-x-3">
        <div class="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
          <span class="text-white text-xs font-medium">{{ getInitials(leave.userId.name) }}</span>
        </div>
        <div>
          <p class="text-sm font-medium text-gray-800">{{ leave.userId.name }}</p>
          <p class="text-xs text-gray-500">{{ leave.userId.email }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  leave: { type: Object, required: true },
  showActions: { type: Boolean, default: false },
  showEmployee: { type: Boolean, default: false },
  loading: { type: Boolean, default: false }
})

defineEmits(['approve', 'reject'])

const statusClass = computed(() => {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700'
  }
  return classes[props.leave.status] || classes.pending
})

const statusLabel = computed(() => {
  const labels = { pending: 'Pending', approved: 'Approved', rejected: 'Rejected' }
  return labels[props.leave.status] || 'Pending'
})

const leaveTypeLabel = computed(() => {
  const labels = { sick: 'Sick', vacation: 'Vacation', personal: 'Personal', other: 'Other' }
  return labels[props.leave.leaveType] || props.leave.leaveType
})

const leaveIcon = computed(() => {
  const icons = { sick: '🤒', vacation: '🏖️', personal: '👤', other: '📋' }
  return icons[props.leave.leaveType] || '📋'
})

const dayCount = computed(() => {
  const start = new Date(props.leave.startDate)
  const end = new Date(props.leave.endDate)
  const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1
  return diff
})

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const getInitials = (name) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}
</script>
