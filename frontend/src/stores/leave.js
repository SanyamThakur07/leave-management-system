import { defineStore } from 'pinia'
import axios from 'axios'

const API_URL = '/api/leave'

const getAuthHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
})

export const useLeaveStore = defineStore('leave', {
  state: () => ({
    leaves: [],
    allLeaves: [],
    loading: false,
    error: null
  }),

  getters: {
    pendingLeaves: (state) => state.allLeaves.filter(l => l.status === 'pending'),
    approvedLeaves: (state) => state.leaves.filter(l => l.status === 'approved'),
    rejectedLeaves: (state) => state.leaves.filter(l => l.status === 'rejected')
  },

  actions: {
    async fetchMyLeaves() {
      this.loading = true
      this.error = null
      try {
        const { data } = await axios.get(API_URL, getAuthHeader())
        this.leaves = data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch leaves'
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchAllLeaves() {
      this.loading = true
      this.error = null
      try {
        const { data } = await axios.get(`${API_URL}/all`, getAuthHeader())
        this.allLeaves = data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch leaves'
        throw error
      } finally {
        this.loading = false
      }
    },

    async createLeave(leaveData) {
      this.loading = true
      this.error = null
      try {
        console.log('Creating leave with payload:', leaveData)
        const response = await axios.post(API_URL, leaveData, getAuthHeader())
        console.log('Response received:', response)
        console.log('Response data:', response.data)
        this.leaves.unshift(response.data)
        return response.data
      } catch (error) {
        console.error('Error creating leave:', error)
        console.error('Error response:', error.response)
        console.error('Error response data:', error.response?.data)
        this.error = error.response?.data?.message || 'Failed to create leave'
        throw error
      } finally {
        this.loading = false
      }
    },

    async approveLeave(leaveId) {
      this.loading = true
      try {
        const { data } = await axios.put(`${API_URL}/${leaveId}/approve`, {}, getAuthHeader())
        const index = this.allLeaves.findIndex(l => l._id === leaveId)
        if (index !== -1) {
          this.allLeaves[index] = data
        }
        return data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to approve leave'
        throw error
      } finally {
        this.loading = false
      }
    },

    async rejectLeave(leaveId) {
      this.loading = true
      try {
        const { data } = await axios.put(`${API_URL}/${leaveId}/reject`, {}, getAuthHeader())
        const index = this.allLeaves.findIndex(l => l._id === leaveId)
        if (index !== -1) {
          this.allLeaves[index] = data
        }
        return data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to reject leave'
        throw error
      } finally {
        this.loading = false
      }
    }
  }
})
